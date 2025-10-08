import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: any
) {
    const supabase = createClient(
        String(process.env.NEXT_PUBLIC_SUPABASE_URL),
        String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    );
    const updateUserById = await supabase.auth.admin.deleteUser(params.id);
    return NextResponse.json(updateUserById);
}