import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Resend } from 'resend';
import { cookies } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Destructuring semua field baru dari Inquiry Form
    const {
      name,
      email,
      phone,
      domicile,
      position,
      organization,
      coach_id,
      // Field tambahan dari form baru
      coaching_goal,
      focus_areas, // Ini berupa array
      expected_result,
      language_preference,
      gender_preference,
      industry_preference,
      session_format,
      session_frequency,
      readiness_to_start,
      ethics_agreement,
      consistency_agreement
    } = body;

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Insert ke tabel coaching_registrations dengan kolom tambahan
    const { error } = await supabase
      .from('coaching_registrations')
      .insert({
        name,
        email,
        phone_number: phone,
        domicile,
        position,
        organization,
        coach_id, // UUID
        coaching_goal,
        focus_areas, // Disimpan sebagai TEXT[] atau JSONB di database
        expected_result,
        language_preference,
        gender_preference,
        industry_preference,
        session_format,
        session_frequency,
        readiness_to_start,
        ethics_agreement,
        consistency_agreement
      });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    const { data: coachData, error: coachError } = await supabase
      .from('profiles')
      .select('email_from_json:contact->>email, name')
      .eq('id', coach_id)
      .single();
    
      if (coachError) {
      console.error("Gagal mengambil data coach dari Supabase:", coachError.message);
    }

    // 2. CEK APAKAH DATA ADA ATAU KOSONG
    console.log("DEBUG - ID Coach yang dicari:", coach_id);
    console.log("DEBUG - Data Coach ditemukan:", coachData);


    const coachEmail = coachData?.email_from_json || 'loop.samaloop@gmail.com'; // Default email if coach email is null

    //SEND EMAIL NOTIFICATION TO COACH
    if (coachData && coachData?.email_from_json) {
      const { data, error: resendError } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Gunakan domain yang sudah terverifikasi di Resend
        to: 'loop.samaloop@gmail.com',
        // cc: 'admin@samaloop.com', // Salinan untuk admin
        subject: `[Samaloop] Inkuiri Coaching Baru - ${name}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Halo ${coachData.name},</h2>
            <p>Anda menerima inkuiri coaching baru melalui platform <strong>SamaLoop</strong>. Berikut detailnya:</p>
            <hr />
            <h3>Informasi Pribadi</h3>
            <ul>
              <li><strong>Nama:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>WhatsApp:</strong> ${phone}</li>
              <li><strong>Jabatan:</strong> ${position} di ${organization}</li>
            </ul>
            <h3>Tujuan & Kebutuhan</h3>
            <ul>
              <li><strong>Motivasi:</strong> ${coaching_goal}</li>
              <li><strong>Area Fokus:</strong> ${Array.isArray(focus_areas) ? focus_areas.join(', ') : focus_areas}</li>
              <li><strong>Hasil Diharapkan:</strong> ${expected_result}</li>
            </ul>
            <h3>Logistik</h3>
            <ul>
              <li><strong>Bahasa & Format:</strong> ${language_preference} (${session_format})</li>
              <li><strong>Frekuensi:</strong> ${session_frequency}</li>
              <li><strong>Kesiapan:</strong> ${readiness_to_start}</li>
            </ul>
            <hr />
            <p>Mohon segera hubungi pendaftar dalam 1-2 hari kerja.</p>
            <p>Salam,<br /><strong>Admin SamaLoop</strong></p>
          </div>
        `
      });
      console.log("Mencoba mengirim email ke:", coachData.email_from_json);
      if (resendError) {
        console.error("Resend Error Detail:", resendError);
      } else {
        console.log("Email sent successfully:", data);
      }
    }
    else {
      console.warn("Data coach tidak ditemukan atau email kosong. Email notifikasi tidak dikirim.");
    }

    const response = NextResponse.json({
      success: true,
      message: "Registration successfully saved"
    });

    // Set cookie untuk tracking
    response.cookies.set('user_coaching_contact', email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 Hari
      path: '/',
    });

    return response;

  } catch (err: any) {
    console.error("Internal Error:", err);
    return NextResponse.json({ message: err.message || 'Internal Server Error' }, { status: 500 });
  }
}