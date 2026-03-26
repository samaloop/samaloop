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
      await supabaseAdmin.from('payments').update({ status: 'PAID' }).eq('registration_id', external_id);
      await supabaseAdmin.from('coaching_registrations').update({ payment_status: 'SUCCESS' }).eq('id', external_id);

      // 4. Kirim Batch Email (Gunakan template visual yang kita buat tadi)
      // ... (Logika resend.batch.send di sini)
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}