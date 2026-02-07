import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest
) {
    const supabase = createClient(
        String(process.env.NEXT_PUBLIC_SUPABASE_URL),
        String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    );
    const body = await req.json();
    const inviteUserByEmail = await supabase.auth.admin.inviteUserByEmail(body.email);
    if (inviteUserByEmail.error !== null) {
        return NextResponse.json({ error: 'An error occured. Please contact the system administrator' }, { status: 500 });
    } else {
        return NextResponse.json(inviteUserByEmail.data.user);
    }
}