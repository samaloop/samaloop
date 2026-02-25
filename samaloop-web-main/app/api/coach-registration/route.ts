import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Destructuring data dari payload axios CoachingModal
    const { 
      name, 
      email, 
      phone, // Ini dipetakan ke phone_number di DB
      domicile, 
      position, 
      organization, 
      coach_id 
    } = body;

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Insert ke tabel coaching_registrations sesuai struktur baru
    const { error } = await supabase
      .from('coaching_registrations')
      .insert({
        name,
        email,
        phone_number: phone, // Mapping dari phone ke phone_number
        domicile,
        position,
        organization,
        coach_id // UUID
      });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const response = NextResponse.json({ 
      success: true, 
      message: "Registration saved successfully" 
    });

    // Set cookie (opsional, mengikuti pola leads Anda)
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