import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Ambil field baru: name, email, phone
    const { name, email, phone, coach_id, coach_name, source } = body;

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Insert data ke kolom yang sesuai
    const { error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone,
        coach_id,
        coach_name,
        source,
        // contact_info: email // Opsional: jika masih butuh kolom legacy ini diisi
      });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, message: "Lead saved" });

    // Set cookie penanda bahwa user sudah submit
    // Kita simpan emailnya saja atau flag sederhana di cookie
    response.cookies.set('user_lead_contact', email, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 Hari
      path: '/',
    });

    return response;

  } catch (err) {
    console.error("Internal Error:", err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}