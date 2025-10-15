// File: /api/admins/delete/[id]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const supabase = createClient(
            String(process.env.NEXT_PUBLIC_SUPABASE_URL),
            String(process.env.NETX_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) // <-- Kunci RAHASIA
        );

        // --- Langkah 1: Hapus dari tabel 'users' dulu ---
        const { error: dbError } = await supabase.from('users').delete().eq('id', userId);

        if (dbError) {
            throw new Error(`Database delete failed: ${dbError.message}`);
        }

        // --- Langkah 2: Hapus dari Auth ---
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        if (authError) {
            // Ini bukan error fatal, bisa jadi user di auth sudah tidak ada.
            // Cukup catat sebagai warning.
            console.warn(`Auth user delete warning: ${authError.message}`);
        }

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}





// import { createClient } from '@supabase/supabase-js';
// import { NextRequest, NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

// export async function POST(
//     req: NextRequest,
//     { params }: any
// ) {
//     const userId = params.id;
//     if (!userId) {
//         return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//     }
//     const supabase = createClient(
//         String(process.env.NEXT_PUBLIC_SUPABASE_URL),
//         String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
//     );

//     const body = await req.json();

//     await supabase.auth.admin.deleteUser(body.uid);
//     const getData = await supabase.from('users').delete().eq('id', params.id);

//     return NextResponse.json(getData);
// }