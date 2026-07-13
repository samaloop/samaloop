import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Xendit } from 'xendit-node';



// Fungsi Helper untuk mendapatkan Access Token dari PayPal
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
  ).toString('base64');

  // PASTIKAN MENGGUNAKAN /v1/ JANGAN /v2/ UNTUK OAUTH2 TOKEN
  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error("PAYPAL AUTH RAW ERROR:", errorData);
    throw new Error(`Failed to generate PayPal access token: ${res.status} - ${errorData}`);
  }

  const data = await res.json();
  return data.access_token;
}



export async function POST(req: NextRequest) {
  try {
    // 0. Inisialisasi Xendit di dalam POST untuk menjamin variabel .env sudah termuat
    const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY! });
    const { Invoice } = xendit;

    const body = await req.json();
    const { 
      name, email, phone, domicile, position, organization, coach_id,
      coaching_goal, focus_areas, expected_result, language_preference,
      gender_preference, industry_preference, session_format, session_frequency,
      readiness_to_start, ethics_agreement, consistency_agreement 
    } = body;

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 1. Insert ke tabel coaching_registrations
    const { data: registration, error: regError } = await supabase
      .from('coaching_registrations')
      .insert({
        name, email, phone_number: phone, domicile, position, organization, coach_id,
        coaching_goal, focus_areas, expected_result, language_preference,
        gender_preference, industry_preference, session_format, session_frequency,
        readiness_to_start, ethics_agreement, consistency_agreement,
        payment_status: 'PENDING'
      })
      .select()
      .single();

    if (regError) throw regError;
    
    // 2. Buat Invoice Xendit
    const invoice = await Invoice.createInvoice({
      data: {
        externalId: registration.id, 
        amount: 150000,
        payerEmail: email,
        description: `Biaya Konsultasi Awal SamaLoop - ${name}`,
        customer: {
          givenNames: name,
          mobileNumber: phone,
        },
      }
    });

    // 3. Buat Order PayPal
   // 3. Buat Order PayPal
let paypalApproveUrl = "";
let paypalOrderId = "";

try {
  const paypalToken = await getPayPalAccessToken();
  console.log("DEBUG - Token PayPal Berhasil Didapat:", paypalToken ? "YA" : "TIDAK");

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const paypalOrderRes = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${paypalToken}`,
  },
  body: JSON.stringify({
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: registration.id,
        amount: {
          currency_code: 'USD',
          value: '10.00',
        },
        description: `Initial Consultation Fee SamaLoop - ${name}`,
      },
    ],
    application_context: {
      // Menggunakan variabel baseUrl yang sudah aman dari nilai undefined
      return_url: `${baseUrl}/`,
      cancel_url: `${baseUrl}/`,
    },
  }),
});

  if (paypalOrderRes.ok) {
    const orderData = await paypalOrderRes.json();
    paypalOrderId = orderData.id;
    const approveLink = orderData.links.find((link: any) => link.rel === 'approve');
    if (approveLink) {
      paypalApproveUrl = approveLink.href;
    }
  } else {
    // KITA TANGKAP ERROR RESPONS DARI PAYPAL DI SINI jika status response-nya gak OK (e.g. 400 Bad Request)
    const errorOrderData = await paypalOrderRes.text();
    console.error("PAYPAL ORDER RAW ERROR:", errorOrderData);
  }
} catch (paypalErr) {
  console.error("PayPal Order Creation Error (Catch Block):", paypalErr);
}

   // 4. Masukkan data pembayaran ke tabel payments menggunakan field yang sudah ada
    //Simpan Xendit ID & Link sebagai data utama, karena data ini digenerate bersamaan
    const { error: payError } = await supabase
      .from('payments')
      .insert({
        registration_id: registration.id,
        xendit_id: invoice.id,               // Menyimpan ID Xendit
        external_id: invoice.externalId,     // UUID Registrasi
        amount: 150000,
        payment_link: invoice.invoiceUrl,    // Link utama (Xendit)
        status: 'PENDING',
        payment_method: 'XENDIT'             // Default method awal saat generate invoice
      });

    if (payError) throw payError;

    // 5. Response dengan kedua URL Pembayaran ke Frontend
    const response = NextResponse.json({
      success: true,
      id: registration.id,
      paymentUrl: invoice.invoiceUrl, // Dikonsumsi jika user klik Xendit
      paypalUrl: paypalApproveUrl      // Dikonsumsi jika user klik PayPal
    });

    // Set cookie untuk tracking
    response.cookies.set('user_coaching_contact', email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;

  } catch (err: any) {
    console.error("Internal Error:", err);
    return NextResponse.json({ message: err.message || 'Internal Server Error' }, { status: 500 });
  }
}