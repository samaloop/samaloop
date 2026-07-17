import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // Wajib pakai Service Role
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { external_id, status } = body;

    if (status === 'PAID' || status === 'SETTLED') {
      // 1. Ambil data registrasi lengkap
      const { data: reg } = await supabaseAdmin
        .from('coaching_registrations')
        .select('*, profiles(name, contact)')
        .eq('id', external_id)
        .single();

      if (!reg) return NextResponse.json({ message: "Not found" }, { status: 404 });

      // 2. Buat Akun Auth & Profile User secara otomatis
      const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
        email: reg.email,
        password: reg.phone_number,
        email_confirm: true,
        user_metadata: { name: reg.name }
      });

      if (authUser.user) {
        await supabaseAdmin.from('users').insert({
          uid: authUser.user.id,
          name: reg.name,
          email: reg.email,
          role: 'user'
        });
      }

      // 3. Update status pembayaran di database
      const { error: payError } = await supabaseAdmin.from('payments').update({ status: 'PAID' }).eq('registration_id', external_id);
      const { error: regError } = await supabaseAdmin.from('coaching_registrations').update({ payment_status: 'SUCCESS' }).eq('id', external_id);

      const updateSuccess = !payError && !regError;

      // 4. Kirim Batch Email
      if (updateSuccess) {
        const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';
        const fromEmail = isProduction ? 'SamaLoop <admin@samaloop.com>' : 'onboarding@resend.dev';

        // Ambil data coach dari hasil join profiles
        const coachEmail = reg.profiles?.contact?.email || 'loop.samaloop@gmail.com';
        const coachName = reg.profiles?.name || 'Coach';
        
        const adminWhatsAppNumber = "6285770916763"; 

        try {
          await resend.batch.send([
            // EMAIL UNTUK USER
            {
              from: fromEmail,
              to: isProduction ? reg.email : 'loop.samaloop@gmail.com',
              subject: `[SamaLoop] Pembayaran Berhasil - Sesi Konsultasi ${coachName}`,
              html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 25px; border-radius: 12px;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #0055A5; margin: 0;">Pembayaran Diterima</h2>
                  </div>
                  
                  <p>Halo <strong>${reg.name}</strong>,</p>
                  <p>Terima kasih. Kami telah menerima pembayaran administrasi awal Anda untuk sesi konsultasi bersama <strong>${coachName}</strong> melalui platform SamaLoop.</p>
                  
                  <div style="background-color: #f9f9f9; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold;">Apa langkah selanjutnya?</p>
                    <p style="margin: 5px 0 0 0;">Tim administrasi SamaLoop akan segera menghubungi Anda melalui <strong>WhatsApp</strong> atau <strong>Email</strong> dalam waktu maksimal 2 hari kerja untuk proses koordinasi jadwal sesi pertama.</p>
                  </div>

                  <p>Mohon pastikan nomor WhatsApp Anda <strong>(${reg.phone_number})</strong> tetap aktif agar kami dapat berkoordinasi dengan lancar.</p>
                  
                  <div style="text-align: center; margin: 25px 0;">
                    <a href="https://wa.me/${adminWhatsAppNumber}" 
                       style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                       Hubungi Admin via WhatsApp
                    </a>
                  </div>
                  
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                  <p style="font-size: 12px; color: #777; text-align: center;">Team SamaLoop Indonesia</p>
                </div>
              `
            },
            // EMAIL UNTUK COACH (SEKARANG DENGAN SELURUH DATA COACHEE DATA DARI DB)
            {
              from: fromEmail,
              to: isProduction ? coachEmail : 'loop.samaloop@gmail.com',
              cc: isProduction ? 'loopindonesia@gmail.com' : 'loop.samaloop@gmail.com',
              subject: `[SamaLoop] Inkuiri Coaching Baru (Lunas): ${reg.name}`,
              html: `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; color: #333;">
                  <h2 style="color: #0055A5; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px; margin-bottom: 20px;">Notifikasi Inkuiri Baru (Lunas)</h2>
                  
                  <p>Halo <strong>Coach ${coachName}</strong>,</p>
                  <p>Anda menerima inkuiri konsultasi baru yang telah lunas. Berikut adalah seluruh data profil dan preferensi klien yang telah diisi:</p>

                  <!-- SEKSI 1: DATA PRIBADI & INSTANSI -->
                  <h4 style="color: #0055A5; margin-top: 25px; border-left: 4px solid #0055A5; padding-left: 10px; margin-bottom: 10px;">Informasi Pribadi & Profesional</h4>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px; background-color: #f9f9f9; border-radius: 8px;">
                    <tr><td style="padding: 10px; color: #666; width: 180px; border-bottom: 1px solid #eee;">Nama Klien</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${reg.name}</strong></td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.email}</td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">WhatsApp</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="https://wa.me/${reg.phone_number.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none; font-weight: bold;">${reg.phone_number}</a></td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">Domisili</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.domicile || '-'}</td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">Jabatan/Posisi</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.position || '-'}</td></tr>
                    <tr><td style="padding: 10px; color: #666;">Organisasi / Perusahaan</td><td style="padding: 10px;">${reg.organization || '-'}</td></tr>
                  </table>

                  <!-- SEKSI 2: KEBUTUHAN UTAMA & INDIKATOR -->
                  <h4 style="color: #0055A5; margin-top: 25px; border-left: 4px solid #0055A5; padding-left: 10px; margin-bottom: 10px;">Esensi & Kebutuhan Coaching</h4>
                  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px; border: 1px solid #eee;">
                    <p style="margin: 0 0 12px 0;"><strong>Alasan Utama Mengikuti Coaching:</strong><br/><span style="color: #444; display:block; margin-top:4px; padding-left:4px;">${reg.coaching_goal || '-'}</span></p>
                    <p style="margin: 0 0 12px 0;"><strong>Area Fokus Utama (Focus Areas):</strong><br/><span style="color: #444; display:block; margin-top:4px; padding-left:4px; font-weight: 500;">${Array.isArray(reg.focus_areas) ? reg.focus_areas.join(', ') : (reg.focus_areas || '-')}</span></p>
                    <p style="margin: 0;"><strong>Hasil Akhir yang Diharapkan (Expected Result):</strong><br/><span style="color: #444; display:block; margin-top:4px; padding-left:4px;">${reg.expected_result || '-'}</span></p>
                  </div>

                  <!-- SEKSI 3: LOGISTIK & PREFERENSI DETIL -->
                  <h4 style="color: #0055A5; margin-top: 25px; border-left: 4px solid #0055A5; padding-left: 10px; margin-bottom: 10px;">Preferensi Sesi & Logistik</h4>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px; background-color: #f9f9f9; border-radius: 8px;">
                    <tr><td style="padding: 10px; color: #666; width: 180px; border-bottom: 1px solid #eee;">Preferensi Bahasa</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.language_preference || '-'}</td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">Preferensi Gender Coach</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.gender_preference || '-'}</td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">Preferensi Industri Coach</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.industry_preference || '-'}</td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">Format Sesi</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.session_format || '-'}</td></tr>
                    <tr><td style="padding: 10px; color: #666; border-bottom: 1px solid #eee;">Frekuensi Sesi</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.session_frequency || '-'}</td></tr>
                    <tr><td style="padding: 10px; color: #666;">Kesiapan Waktu Mulai</td><td style="padding: 10px;">${reg.readiness_to_start || '-'}</td></tr>
                  </table>

                  <!-- SEKSI 4: HUKUM & ETIKA -->
                  <h4 style="color: #0055A5; margin-top: 25px; border-left: 4px solid #0055A5; padding-left: 10px; margin-bottom: 10px;">Persetujuan & Etika Mandiri</h4>
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #f9f9f9; border-radius: 8px;">
                    <tr><td style="padding: 10px; color: #666; width: 180px; border-bottom: 1px solid #eee;">Etika Pemahaman Sesi</td><td style="padding: 10px; border-bottom: 1px solid #eee; color: ${reg.ethics_agreement ? '#28a745' : '#dc3545'}; font-weight: bold;">${reg.ethics_agreement ? 'MENYETUJUI (Bukan Terapi/Konseling)' : 'TIDAK'}</td></tr>
                    <tr><td style="padding: 10px; color: #666;">Komitmen Konsistensi</td><td style="padding: 10px; color: ${reg.consistency_agreement ? '#28a745' : '#dc3545'}; font-weight: bold;">${reg.consistency_agreement ? 'MENYETUJUI (Bersedia Mengikuti Rutin)' : 'TIDAK'}</td></tr>
                  </table>

                  <div style="background-color: #fff4e6; border-left: 4px solid #f59e42; padding: 15px; margin: 30px 0; border-radius: 6px;">
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                      <strong>Info Manajemen:</strong> Admin SamaLoop akan segera membantu sinkronisasi jadwal antara Coach dan Klien agar sesi pertama bisa lekas berjalan.
                    </p>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 14px; margin-bottom: 15px;">Silakan klik tombol di bawah ini untuk konfirmasi ketersediaan ke admin:</p>
                    <a href="https://wa.me/${adminWhatsAppNumber}?text=Halo%20Admin%20SamaLoop,%20saya%20ingin%20konfirmasi%20ketersediaan%20jadwal%20untuk%20inkuiri%20dari%20${encodeURIComponent(reg.name)}" 
                       style="background-color: #25D366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                       Hubungi Admin via WhatsApp
                    </a>
                  </div>
                  
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
                  <p style="font-size: 11px; color: #999; text-align: center;">Email otomatis sistem SamaLoop. Admin telah menerima tembusan (CC) email ini.</p>
                </div>
              `
            }
          ]);
          console.log("DEBUG - Email berhasil dikirim ke User & Coach dengan profil lengkap");
        } catch (emailErr) {
          console.error("ERROR - Gagal mengirim email via Resend:", emailErr);
        }
      } else {
        console.error("ERROR - Gagal update database, email tidak dikirim.", { payError, regError });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}