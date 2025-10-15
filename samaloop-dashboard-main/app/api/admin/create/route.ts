import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest
) {
    const body = await req.json();

    // Validasi input dasar
    if (!body.email || !body.password || !body.name) {
        return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    try {
        // 1. Ganti ke Service Key yang AMAN (tanpa NEXT_PUBLIC_)
        const supabase = createClient(
            String(process.env.NEXT_PUBLIC_SUPABASE_URL),
            String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) // <--- UBAH INI DI .env.local JUGA
        );

        // --- LANGKAH 1: Buat user di sistem Auth Supabase ---
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: true, // Otomatis konfirmasi email
        });

        // Jika gagal bikin user di Auth, langsung stop dan kasih error
        if (authError || !authData.user) {
            throw new Error(authError?.message || 'Failed to create auth user.');
        }

        // --- LANGKAH 2: Masukkan data profil ke tabel 'users' ---
        // Pake .select() biar Supabase ngembaliin data yang baru di-insert
        const { data: profileData, error: dbError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id, // Pastikan nama kolomnya 'id', bukan 'uid'
                name: body.name,
                email: body.email
            })
            .select() // <-- INI KUNCINYA biar dapet data balikan
            .single(); // Ambil sebagai satu objek, bukan array

        // Jika gagal insert ke tabel, ini error serius
        if (dbError) {
            // Sebaiknya kita juga hapus user auth yang udah terlanjur dibuat
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error(`Failed to insert user profile: ${dbError.message}`);
        }

        // 3. JIKA SEMUA BERHASIL, kirim balik data profil yang baru dibuat
        return NextResponse.json({ data: profileData, message: 'Create Admin is Success.' }, { status: 200 });

    } catch (error: any) {
        // Tangkap semua jenis error dan kirim respons yang jelas
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



// import { createClient } from '@supabase/supabase-js'
// import { NextRequest, NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

// export async function POST(
//     req: NextRequest
// ) {
//     const supabase = createClient(
//         String(process.env.NEXT_PUBLIC_SUPABASE_URL),
//         String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
//     );
//     const body = await req.json();
//     const attributes: any = {
//         email: body.email,
//         password: body.password,
//         email_confirm: true
//     };

//     const createUser: any = await supabase.auth.admin.createUser(
//         attributes
//     );

//     if (createUser.error !== null) {
//         return NextResponse.json({ error: createUser.error }, { status:createUser.error.status });
//     } else {

//         await supabase.from('users').insert([
//             {
//                 uid: createUser.data.user.id,
//                 name: body.name,
//                 email: body.email
//             }
//         ]);
//         return NextResponse.json({ message: 'Create Admin is Success.' }, { status: 200 });
//     }
// }