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
      // 1. Ambil data registrasi
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
      // 4. Kirim Batch Email (Gunakan template visual yang kita buat tadi)
      if (updateSuccess) {
        const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';
        const fromEmail = isProduction ? 'SamaLoop <admin@samaloop.com>' : 'onboarding@resend.dev';

        // Ambil data coach dari hasil join profiles
        const coachEmail = reg.profiles?.contact?.email || 'loop.samaloop@gmail.com';
        const coachName = reg.profiles?.name || 'Coach';
        const adminWhatsApp = isProduction ? 'https://wa.me/6285770916736' : 'https://wa.me/6285770916736';//masih perlu ganti jadi nomor admin sebenarnya saat produksi
        try {
          await resend.batch.send([
            {
              from: fromEmail,
              to: isProduction ? reg.email : 'loop.samaloop@gmail.com', // Email pengetesan Anda
              subject: `[SamaLoop] Pembayaran Berhasil - Sesi Coaching ${coachName}`,
              html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 25px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0055A5; margin: 0;">Pembayaran Diterima</h2>
      </div>
      
      <p>Halo <strong>${reg.name}</strong>,</p>
      
      <p>Terima kasih. Kami telah menerima pembayaran Anda untuk sesi coaching bersama <strong>${coachName}</strong> melalui platform SamaLoop.</p>
      
      <div style="background-color: #f9f9f9; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Apa langkah selanjutnya?</p>
        <p style="margin: 5px 0 0 0;">Tim administrasi SamaLoop akan segera menghubungi Anda melalui <strong>WhatsApp</strong> atau <strong>Email</strong> dalam waktu maksimal 2 hari kerja untuk proses penjadwalan sesi pertama Anda.</p>
      </div>

      <p>Mohon pastikan nomor WhatsApp Anda <strong>(${reg.phone_number})</strong> tetap aktif agar kami dapat berkoordinasi dengan lancar.</p>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      
      <p style="font-size: 13px; color: #777; text-align: center;">
        Jika Anda memiliki pertanyaan, silakan hubungi kami dengan membalas email ini.<br />
        <strong>Team SamaLoop Indonesia</strong>
      </p>
    </div>
  `
            },
            {
              from: fromEmail,
              to: isProduction ? coachEmail : 'loop.samaloop@gmail.com',
              cc: isProduction ? 'admin@samaloop.com' : 'loop.samaloop@gmail.com', // CC ke Admin
              subject: `[SamaLoop] Inkuiri Coaching Baru (Lunas): ${reg.name}`,
              html: `<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 25px; border-radius: 12px; color: #333;">
                <h2 style="color: #0055A5; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px;">Notifikasi Inkuiri Baru</h2>
                <p>Halo <strong>Coach ${coachName}</strong>,</p>
                <p>Anda menerima inkuiri coaching baru yang telah lunas biaya administrasi:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 5px 0;">Nama Klien: <strong>${reg.name}</strong></p>
                  <p style="margin: 5px 0;">Tujuan: ${reg.coaching_goal}</p>
                  <p style="margin: 5px 0;">WhatsApp: <a href="https://wa.me/${reg.phone_number.replace(/\D/g, '')}">${reg.phone_number}</a></p>
                </div>
                <div style="background-color: #fff4e6; border-left: 4px solid #f59e42; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #856404;"><strong>Info:</strong> Tim Admin SamaLoop akan segera membantu koordinasi penjadwalan antara Anda dan klien.</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <p style="font-size: 14px; margin-bottom: 15px;">Konfirmasikan availability Anda ke Admin via WhatsApp:</p>
                  <a href="https://wa.me/${adminWhatsApp.replace(/\D/g, '')}?text=Halo%20Admin%20SamaLoop,%20saya%20ingin%20konfirmasi%20inkuiri%20dari%20${encodeURIComponent(reg.name)}" 
                     style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                     Hubungi Admin via WhatsApp
                  </a>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
                <p style="font-size: 11px; color: #999; text-align: center;">Email otomatis. Admin telah menerima CC email ini.</p>
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