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

    // Ambil konfigurasi dari Environment Variables
    const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';
    const fromEmail = isProduction ? 'Samaloop <admin@samaloop.com>' : 'onboarding@resend.dev';
    const testEmail = 'loop.samaloop@gmail.com';

    // Tentukan penerima secara dinamis
    const coachReceiver = isProduction ? coachData?.email_from_json : testEmail;
    const userReceiver = isProduction ? email : testEmail;

    //SEND EMAIL NOTIFICATION TO COACH
    if (coachData && coachData?.email_from_json) {
      const { data, error: resendError } = await resend.batch.send([{
        from: fromEmail,
        to: coachReceiver,
        // cc: 'admin@samaloop.com', // Salinan untuk admin
        subject: `[Samaloop] Inkuiri Coaching Baru - ${name}`,
        html: `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0055A5; padding: 25px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">Inkuiri Coaching Baru</h2>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 16px;">Halo <strong>${coachData.name || 'Coach'}</strong>,</p>
        <p>Anda baru saja menerima inkuiri baru melalui platform <strong>SamaLoop</strong>. Silakan tinjau profil calon klien di bawah ini:</p>

        <div style="margin-top: 25px;">
          <h4 style="color: #0055A5; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Informasi Klien</h4>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #777; width: 120px;">Nama</td>
              <td style="padding: 6px 0; font-weight: 500;">: ${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #777;">Email</td>
              <td style="padding: 6px 0; font-weight: 500;">: <a href="mailto:${email}" style="color: #0055A5; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #777;">WhatsApp</td>
              <td style="padding: 6px 0; font-weight: 500;">: <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #777;">Jabatan</td>
              <td style="padding: 6px 0; font-weight: 500;">: ${position} di ${organization}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 25px; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h4 style="color: #0055A5; margin-top: 0; margin-bottom: 10px; font-size: 14px;">Tujuan & Fokus Coaching</h4>
          <p style="font-size: 14px; margin-bottom: 15px;"><em>"${coaching_goal}"</em></p>
          
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
            <strong style="font-size: 13px; color: #555;">Area Fokus:</strong><br/>
            <span style="display: inline-block; background-color: #e3f2fd; color: #0055A5; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 5px;">
              ${Array.isArray(focus_areas) ? focus_areas.join('</span> <span style="display: inline-block; background-color: #e3f2fd; color: #0055A5; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 5px;">') : focus_areas}
            </span>
          </div>
          
          <p style="font-size: 13px; margin: 0;"><strong>Hasil Diharapkan:</strong><br/>${expected_result}</p>
        </div>

        <div style="margin-top: 25px;">
          <h4 style="color: #0055A5; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Logistik & Preferensi</h4>
          <ul style="padding-left: 18px; font-size: 14px; margin: 0; color: #555;">
            <li style="margin-bottom: 5px;">Bahasa & Format: <strong>${language_preference} (${session_format})</strong></li>
            <li style="margin-bottom: 5px;">Frekuensi: <strong>${session_frequency}</strong></li>
            <li style="margin-bottom: 5px;">Kesiapan: <strong>${readiness_to_start}</strong></li>
          </ul>
        </div>

        <div style="margin-top: 35px; text-align: center;">
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Mohon konfirmasi availability Anda.</p>
          <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Hubungi via WhatsApp</a>
        </div>
      </div>

      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
        <p style="margin: 0;">Email ini dikirim secara otomatis oleh sistem administrasi SamaLoop.<br/>&copy; 2026 SamaLoop Indonesia. All rights reserved.</p>
      </div>
    </div>
  `,
      },
      // EMAIL KONFIRMASI UNTUK USER (PENDAFTAR)
      {
        from: fromEmail,
        to: userReceiver, // Sama seperti di atas, gunakan email registrasi Resend untuk testing
        subject: `[Samaloop] Langkah Selanjutnya untuk Sesi Coaching Anda bersama ${coachData.name}`,
        html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #0055A5;">Halo ${name},</h2>
      <p>Terima kasih telah mempercayakan perjalanan pengembangan diri Anda melalui <strong>SamaLoop</strong>.</p>
      
      <p>Kami telah menerima inkuiri Anda untuk sesi coaching bersama <strong>${coachData.name}</strong>. Saat ini, tim kami sedang melakukan koordinasi internal untuk memastikan ketersediaan jadwal sang Coach agar sesuai dengan preferensi yang Anda kirimkan.</p>
      
      <div style="background-color: #fff4e6; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e42; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Apa langkah selanjutnya?</p>
        <p style="margin: 5px 0 0 0;">Mohon kesediaan Anda untuk menunggu konfirmasi resmi dari kami dalam waktu <strong>maksimal 2 hari kerja</strong>. Kami akan segera menghubungi Anda kembali melalui WhatsApp atau Email untuk langkah penjadwalan sesi.</p>
      </div>

      <p>Sambil menunggu, Anda dapat meninjau kembali detail profil Coach Anda di direktori kami atau mempersiapkan poin-poin yang ingin Anda diskusikan lebih dalam.</p>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 0.9em; color: #777;">
        Jika Anda memiliki pertanyaan mendesak, silakan balas email ini atau hubungi tim support kami.<br /><br />
        Salam hangat,<br />
        <strong>Tim Administrasi SamaLoop</strong>
      </p>
    </div>
  `,
      }
      ]);
      console.log(`[Email Mode: ${isProduction ? 'LIVE' : 'TEST'}]`);
      console.log(`Mencoba mengirim email ke:  ${coachReceiver} & ${userReceiver}`);
      if (resendError) {
        console.error("Resend Error Detail:", resendError);
      } else {
        console.log(`Sent to: ${coachReceiver} & ${userReceiver}`);
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