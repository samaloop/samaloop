// File: /api/admins/create/route.ts
// File: /api/admins/create/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.email || !body.password || !body.name) {
        return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    try {
        const supabase = createClient(
            String(process.env.NEXT_PUBLIC_SUPABASE_URL),
            String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) // <-- Menggunakan Kunci Rahasia
        );

        // Langkah 1: Buat user di Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: true,
        });

        if (authError || !authData.user) {
            throw new Error(authError?.message || 'Failed to create auth user.');
        }

        // Langkah 2: Masukkan profil ke tabel 'users' dengan 'uid' sebagai Primary Key
        const { data: profileData, error: dbError } = await supabase
            .from('users')
            .insert({
                uid: authData.user.id, // <-- Menyimpan auth id ke kolom 'uid'
                name: body.name,
                email: body.email,
            })
            .select()
            .single();

        // Langkah 3: Rollback jika Langkah 2 Gagal
        if (dbError) {
            await supabase.auth.admin.deleteUser(authData.user.id); // Hapus user Auth
            throw new Error(`Database insert failed: ${dbError.message}`);
        }

        return NextResponse.json({ data: profileData, message: 'Admin created successfully.' }, { status: 200 });

    } catch (error: any) {
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