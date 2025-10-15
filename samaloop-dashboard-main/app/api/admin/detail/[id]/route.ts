// File: /api/admins/detail/[uid]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { uid: string } } // Menggunakan parameter 'uid'
) {
    const userUid = params.uid;
    if (!userUid) {
        return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    try {
        const supabase = createClient(
            String(process.env.NEXT_PUBLIC_SUPABASE_URL),
            String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) // <-- Menggunakan Kunci Rahasia
        );

        const { data, error } = await supabase
            .from('users')
            .select('uid, name, email')
            .eq('uid', userUid) // <-- Mencari berdasarkan kolom 'uid'
            .single(); // <-- Mengambil HANYA satu data, bukan array

        // Jika error (termasuk jika data tidak ditemukan)
        if (error) {
            // Supabase akan error jika .single() tidak menemukan data
            return NextResponse.json({ error: `User with UID ${userUid} not found.` }, { status: 404 });
        }

        // Jika berhasil, kirim datanya
        return NextResponse.json({ data });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// import { createClient } from '@supabase/supabase-js';
// import { NextRequest, NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

// export async function GET(
//     req: NextRequest,
//     { params }: any
// ) {
//     const supabase = createClient(
//         String(process.env.NEXT_PUBLIC_SUPABASE_URL),
//         String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
//     );
//     const getData = await supabase.from('users').select('uid,name,email').eq('id', params.id);

//     return NextResponse.json(getData);
// }