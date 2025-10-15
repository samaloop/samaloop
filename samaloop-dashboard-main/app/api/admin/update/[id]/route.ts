// File: /api/admins/update/[id]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    const body = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const supabase = createClient(
            String(process.env.NEXT_PUBLIC_SUPABASE_URL),
            String(process.env.NETX_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) // <-- Kunci RAHASIA
        );

        // Ambil data user lama untuk rollback jika perlu
        const { data: oldUser } = await supabase.auth.admin.getUserById(userId);
        if (!oldUser || !oldUser.user) throw new Error("User not found in auth.");

        // --- Langkah 1: Update Auth ---
        const authAttributes: any = {};
        if (body.email) authAttributes.email = body.email;
        if (body.password) authAttributes.password = body.password;

        const { error: authError } = await supabase.auth.admin.updateUserById(userId, authAttributes);
        if (authError) throw new Error(`Auth update failed: ${authError.message}`);

        // --- Langkah 2: Update tabel 'users' ---
        const { data: profileData, error: dbError } = await supabase
            .from('users')
            .update({ name: body.name, email: body.email })
            .eq('id', userId)
            .select()
            .single();

        // --- Langkah 3: Rollback jika Langkah 2 Gagal ---
        if (dbError) {
            // Kembalikan data auth ke state semula
            await supabase.auth.admin.updateUserById(userId, {
                email: oldUser.user.email
                // Password tidak bisa di-rollback, jadi ini batasan
            });
            throw new Error(`Database update failed: ${dbError.message}`);
        }

        return NextResponse.json({ data: profileData, message: 'Admin updated successfully.' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}





// import { createClient } from '@supabase/supabase-js'
// import { NextRequest, NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

// export async function POST(
//     req: NextRequest,
//     { params }: any
// ) {
//     const supabase = createClient(
//         String(process.env.NEXT_PUBLIC_SUPABASE_URL),
//         String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
//     );
//     const body = await req.json();
//     const attributes: any = {
//         email: body.email
//     };
//     if (body.password !== undefined && body.password !== '') {
//         attributes['password'] = body.password;
//     }

//     await supabase.auth.admin.updateUserById(
//         body.uid,
//         attributes
//     );

//     const updateUser = await supabase.from('users').update({
//         name: body.name,
//         email: body.email,
//     }).eq('id', params.id);

//     return NextResponse.json(updateUser.data);
// }