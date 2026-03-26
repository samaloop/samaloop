import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Xendit } from 'xendit-node';

const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY! });
const { Invoice } = xendit;

export async function POST(req: NextRequest) {
  try {
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
        payment_status: 'PENDING' // Beri status awal PENDING
      })
      .select()
      .single();

    if (regError) throw regError;

    // 2. Buat Invoice Xendit
    const invoice = await Invoice.createInvoice({
      data: {
        externalId: registration.id, // Gunakan ID registrasi sebagai referensi
        amount: 150000, // Misal Rp 150.000
        payerEmail: email,
        description: `Sesi Konsultasi Coaching SamaLoop - ${name}`,
        customer: {
          givenNames: name,
          mobileNumber: phone,
        },
        successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`,
      }
    });

    // 3. Masukkan data ke tabel payments
    const { error: payError } = await supabase
      .from('payments')
      .insert({
        registration_id: registration.id,
        xendit_id: invoice.id,
        external_id: invoice.externalId,
        amount: 150000,
        payment_link: invoice.invoiceUrl,
        status: 'PENDING'
      });

    if (payError) throw payError;

    // 4. Response dengan URL Pembayaran
    const response = NextResponse.json({
      success: true,
      paymentUrl: invoice.invoiceUrl // Frontend akan mengarahkan user ke sini
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