import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest,
    { params }: any
) {
    // 1. Ambil ID HANYA dari parameter URL. Ini sumber kebenaran kita.
    const userId = params.id;

    // Validasi dasar: pastikan ID ada
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // 2. Gunakan Service Role Key yang RAHASIA (bukan NEXT_PUBLIC_)
        const supabase = createClient(
            String(process.env.NEXT_PUBLIC_SUPABASE_URL),
            String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY), // <--- UBAH INI
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // --- LANGKAH 1: Hapus dari Auth ---
        // Kita butuh UID untuk menghapus dari auth, yang mana sama dengan ID di tabel 'users'
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        // Jika gagal hapus dari auth, jangan lanjut! Langsung stop dan kasih error.
        if (authError) {
            // Mungkin user sudah tidak ada di auth, tapi datanya masih ada di tabel.
            // Kita bisa anggap ini bukan error fatal dan tetap lanjut menghapus dari tabel.
            // Tapi untuk keamanan, lebih baik kita log dan kasih tau ada yg aneh.
            console.warn(`Auth user delete failed (maybe already deleted):`, authError.message);
        }

        // --- LANGKAH 2: Hapus dari Tabel 'users' ---
        const { error: dbError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        // Jika gagal hapus dari database, ini error serius. Stop.
        if (dbError) {
            throw new Error(`Database delete failed: ${dbError.message}`);
        }

        // 3. Jika semua langkah berhasil, kirim respons sukses
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

    } catch (error: any) {
        // Tangkap semua error lain yang mungkin terjadi
        console.error('Error deleting user:', error);
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