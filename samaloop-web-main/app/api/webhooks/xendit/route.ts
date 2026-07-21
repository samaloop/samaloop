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
    const { external_id, status, payment_method } = body;

    if (status === 'PAID' || status === 'SETTLED') {
      // 1. Ambil data registrasi menggunakan ID dari Xendit
      const { data: reg } = await supabaseAdmin
        .from('coaching_registrations')
        .select('*, profiles(name, contact)')
        .eq('id', external_id)
        .single();

      if (!reg) return NextResponse.json({ message: "Not found" }, { status: 404 });

      // 2. Buat Akun Auth & Profile User secara otomatis
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: reg.email,
        password: reg.phone_number,
        email_confirm: true,
        user_metadata: { name: reg.name }
      });

      if (authUser?.user) {
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

        // Ambil data coach (asumsi relasi relasi tabel profiles sudah benar)
        const coachEmail = reg.profiles?.contact?.email || 'loop.samaloop@gmail.com';
        const coachPhone = reg.profiles?.contact?.phone || 'Belum tersedia'; 
        const coachName = reg.profiles?.name || 'Coach SamaLoop';
        
        const adminWhatsApp = isProduction ? '6285770916736' : '6285770916736'; 

        try {
          await resend.batch.send([
            // ==========================================
            // 1. EMAIL UNTUK USER (KLIEN)
            // ==========================================
            {
              from: fromEmail,
              to: isProduction ? reg.email : 'loop.samaloop@gmail.com',
              subject: `[SamaLoop] Konfirmasi Pembayaran & Detail Sesi Coaching`,
              html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
                  
                  <div style="text-align: center; border-bottom: 2px solid #0055A5; padding-bottom: 20px; margin-bottom: 20px;">
                    <h2 style="color: #0055A5; margin: 0; font-size: 24px;">Konfirmasi Pembayaran</h2>
                    <p style="color: #666666; margin-top: 5px; font-size: 14px;">Inkuiri Coaching SamaLoop</p>
                  </div>
                  
                  <p>Yth. <strong>Bpk/Ibu ${reg.name}</strong>,</p>
                  
                  <p>Terima kasih telah mempercayakan perjalanan pengembangan diri Anda bersama SamaLoop. Kami ingin menginformasikan bahwa pembayaran administrasi untuk inkuiri sesi coaching Anda telah <strong>berhasil kami terima</strong>.</p>
                  
                  <div style="background-color: #f4f7f6; border-left: 4px solid #0055A5; padding: 20px; margin: 25px 0; border-radius: 0 4px 4px 0;">
                    <h3 style="margin-top: 0; color: #0055A5; font-size: 16px;">Detail Coach Anda</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 0; width: 120px; color: #555;">Nama Coach</td>
                        <td style="padding: 4px 0; font-weight: bold;">: ${coachName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #555;">Email Coach</td>
                        <td style="padding: 4px 0; font-weight: bold;">: ${coachEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #555;">No. Kontak</td>
                        <td style="padding: 4px 0; font-weight: bold;">: ${coachPhone}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin-top: 20px;"><strong>Langkah Selanjutnya:</strong></p>
                  <p style="margin-top: 5px;">Tim Administrasi SamaLoop akan segera menghubungi Anda melalui WhatsApp (ke nomor <strong>${reg.phone_number}</strong>) dalam waktu maksimal 2 hari kerja untuk mengatur jadwal sesi pertama Anda dengan Coach ${coachName}.</p>
                  
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="https://wa.me/${adminWhatsApp}" 
                       style="background-color: #0055A5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;">
                       Hubungi Admin SamaLoop
                    </a>
                  </div>
                  
                  <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
                  <p style="font-size: 12px; color: #999999; text-align: center; margin: 0;">
                    Email ini dibuat secara otomatis. Mohon tidak membalas langsung ke alamat email ini.
                  </p>
                </div>
              `
            },
            // ==========================================
            // 2. EMAIL UNTUK COACH
            // ==========================================
            {
              from: fromEmail,
              to: isProduction ? coachEmail : 'loop.samaloop@gmail.com',
              cc: isProduction ? 'loopindonesia@gmail.com' : 'loop.samaloop@gmail.com',
              subject: `[SamaLoop] Inkuiri Klien Baru (Terkonfirmasi): ${reg.name}`,
              html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 30px; border-radius: 8px; color: #333333; background-color: #ffffff;">
                  
                  <div style="border-bottom: 2px solid #0055A5; padding-bottom: 15px; margin-bottom: 25px;">
                    <h2 style="color: #0055A5; margin: 0; font-size: 22px;">Inkuiri Coaching Baru</h2>
                    <p style="color: #666666; margin-top: 5px; font-size: 14px;">Status Administrasi: <strong>LUNAS</strong></p>
                  </div>

                  <p>Halo <strong>Coach ${coachName}</strong>,</p>
                  <p>Anda telah menerima inkuiri sesi coaching baru. Klien berikut telah menyelesaikan pembayaran biaya administrasi. Berikut adalah detail lengkap dari form inkuiri klien untuk Anda pelajari sebelum sesi dimulai:</p>
                  
                  <div style="margin: 25px 0;">
                    <h3 style="background-color: #f4f7f6; padding: 10px 15px; margin: 0; color: #0055A5; border-radius: 4px 4px 0 0; font-size: 16px;">Informasi Pribadi</h3>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #eeeeee;">
                      <tr><td style="padding: 10px 15px; width: 35%; border-bottom: 1px solid #eee; background: #fafafa;">Nama Lengkap</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: 500;">${reg.name || '-'}</td></tr>
                      <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; background: #fafafa;">Email</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${reg.email || '-'}</td></tr>
                      <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; background: #fafafa;">WhatsApp</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;"><a href="https://wa.me/${(reg.phone_number || '').replace(/\D/g, '')}">${reg.phone_number || '-'}</a></td></tr>
                      <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; background: #fafafa;">Domisili</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${reg.domicile || '-'}</td></tr>
                      <tr><td style="padding: 10px 15px; border-bottom: 1px solid #eee; background: #fafafa;">Jabatan</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${reg.position || '-'}</td></tr>
                      <tr><td style="padding: 10px 15px; background: #fafafa;">Perusahaan/Organisasi</td><td style="padding: 10px 15px;">${reg.organization || '-'}</td></tr>
                    </table>
                  </div>

                  <div style="margin: 25px 0;">
                    <h3 style="background-color: #f4f7f6; padding: 10px 15px; margin: 0; color: #0055A5; border-radius: 4px 4px 0 0; font-size: 16px;">Tujuan & Kebutuhan Coaching</h3>
                    <div style="border: 1px solid #eeeeee; padding: 15px;">
                      <p style="margin: 0 0 5px 0; color: #555; font-size: 13px; font-weight: bold;">Apa yang mendorong mencari coaching saat ini?</p>
                      <p style="margin: 0 0 15px 0; background: #fafafa; padding: 10px; border-radius: 4px; border: 1px solid #f0f0f0;">${reg.coaching_goal || '-'}</p>
                      
                      <p style="margin: 0 0 5px 0; color: #555; font-size: 13px; font-weight: bold;">Area Fokus:</p>
                      <p style="margin: 0 0 15px 0;">${reg.focus_areas ? (Array.isArray(reg.focus_areas) ? reg.focus_areas.join(', ') : reg.focus_areas) : '-'}</p>
                      
                      <p style="margin: 0 0 5px 0; color: #555; font-size: 13px; font-weight: bold;">Hasil yang ingin dicapai:</p>
                      <p style="margin: 0; background: #fafafa; padding: 10px; border-radius: 4px; border: 1px solid #f0f0f0;">${reg.expected_result || '-'}</p>
                    </div>
                  </div>

                  <div style="margin: 25px 0;">
                    <h3 style="background-color: #f4f7f6; padding: 10px 15px; margin: 0; color: #0055A5; border-radius: 4px 4px 0 0; font-size: 16px;">Preferensi Coach & Logistik</h3>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #eeeeee;">
                      <tr><td style="padding: 10px 15px; width: 50%; border-bottom: 1px solid #eee; border-right: 1px solid #eee; background: #fafafa;"><strong>Bahasa Sesi:</strong><br/>${reg.language_preference || '-'}</td><td style="padding: 10px 15px; border-bottom: 1px solid #eee; background: #fafafa;"><strong>Format Sesi:</strong><br/>${reg.session_format || '-'}</td></tr>
                      <tr><td style="padding: 10px 15px; border-right: 1px solid #eee;"><strong>Frekuensi Sesi:</strong><br/>${reg.session_frequency || '-'}</td><td style="padding: 10px 15px;"><strong>Kesiapan Memulai:</strong><br/>${reg.readiness_to_start || '-'}</td></tr>
                    </table>
                  </div>

                  <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 0 4px 4px 0;">
                    <p style="margin: 0; font-size: 14px; color: #856404;"><strong>Langkah Anda Berikutnya:</strong><br/>Tim Admin SamaLoop akan bertindak sebagai narahubung untuk mencocokkan jadwal kosong Anda dengan klien. Silakan klik tombol di bawah untuk konfirmasi ketersediaan Anda.</p>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://wa.me/${adminWhatsApp}?text=Halo%20Admin%20SamaLoop,%20saya%20sudah%20membaca%20detail%20inkuiri%20dari%20Klien%20${encodeURIComponent(reg.name)}%20dan%20siap%20untuk%20dijadwalkan." 
                       style="background-color: #25D366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;">
                       Konfirmasi ke Admin via WhatsApp
                    </a>
                  </div>
                  
                  <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
                  <p style="font-size: 11px; color: #999999; text-align: center;">Email otomatis dari sistem SamaLoop. Admin telah menerima salinan (CC) dari email ini.</p>
                </div>
              `
            }
          ]);
          console.log("DEBUG - Email berhasil dikirim ke User & Coach");
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