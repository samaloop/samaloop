import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1. VERIFIKASI KEAMANAN WEBHOOK (Allow request dari Xendit)
    const callbackToken = req.headers.get('x-callback-token');
    const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;

    // Jika token tidak cocok, tolak request demi keamanan
    if (expectedToken && callbackToken !== expectedToken) {
      console.error("WEBHOOK ERROR: Unauthorized callback token!");
      return NextResponse.json({ message: "Invalid callback token" }, { status: 401 });
    }

    const body = await req.json();

    // 2. PARSING PAYLOAD API XENDIT BARU (Handling variasi struktur SDK v2/v6)
    // API Baru kadang memasukkan data di dalam objek body.data
    const payload = body.data || body;
    const status = (payload.status || body.status || '').toUpperCase(); // Force UPPERCASE (PAID / SETTLED)
    const external_id = payload.external_id || body.external_id;
    const xendit_invoice_id = payload.id || body.id;

    console.log("=== WEBHOOK XENDIT DITERIMA ===");
    console.log("Status:", status);
    console.log("External ID:", external_id);
    console.log("Invoice ID:", xendit_invoice_id);

    // 3. PROSES PEMBAYARAN JIKA LUNAS
    if (status === 'PAID' || status === 'SETTLED' || body.event === 'invoice.paid') {
      
      // Cari data pembayaran di tabel payments
      const { data: paymentData, error: payFindError } = await supabaseAdmin
        .from('payments')
        .select('registration_id')
        .or(`external_id.eq.${external_id},xendit_id.eq.${xendit_invoice_id}`)
        .single();

      if (payFindError || !paymentData) {
        console.error("ERROR: Data pembayaran tidak ditemukan di DB:", payFindError);
        return NextResponse.json({ message: "Payment record not found" }, { status: 404 });
      }

      const targetRegistrationId = paymentData.registration_id;

      // Ambil data registrasi coachee
      const { data: reg, error: regFindError } = await supabaseAdmin
        .from('coaching_registrations')
        .select('*, profiles(name, contact)')
        .eq('id', targetRegistrationId)
        .single();

      if (regFindError || !reg) {
        console.error("ERROR: Data registrasi tidak ditemukan:", regFindError);
        return NextResponse.json({ message: "Registration not found" }, { status: 404 });
      }

      // Buat Akun Auth (jika belum ada)
      const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
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

      // Update status ke LUNAS
      await supabaseAdmin
        .from('payments')
        .update({ status: 'PAID', paid_at: new Date().toISOString() })
        .eq('registration_id', targetRegistrationId);

      await supabaseAdmin
        .from('coaching_registrations')
        .update({ payment_status: 'SUCCESS' })
        .eq('id', targetRegistrationId);

      // Kirim Notifikasi Email
      const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';
      const fromEmail = isProduction ? 'SamaLoop <admin@samaloop.com>' : 'onboarding@resend.dev';
      const coachEmail = reg.profiles?.contact?.email || 'loop.samaloop@gmail.com';
      const coachName = reg.profiles?.name || 'Coach';

      try {
        await resend.batch.send([
          {
            from: fromEmail,
            to: isProduction ? reg.email : 'loop.samaloop@gmail.com',
            subject: `[SamaLoop] Pembayaran Berhasil - Sesi Coaching ${coachName}`,
            html: `<p>Halo ${reg.name}, pembayaran Anda telah berhasil kami terima.</p>`
          },
          {
            from: fromEmail,
            to: isProduction ? coachEmail : 'loop.samaloop@gmail.com',
            subject: `[SamaLoop] Inkuiri Klien Baru (Lunas): ${reg.name}`,
            html: `<p>Halo Coach ${coachName}, Anda mendapatkan inkuiri baru dari ${reg.name}.</p>`
          }
        ]);
        console.log("SUCCESS: Webhook selesai diproses & Email terkirim!");
      } catch (emailErr) {
        console.error("ERROR: Gagal mengirim email Resend:", emailErr);
      }
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error("CRITICAL WEBHOOK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}