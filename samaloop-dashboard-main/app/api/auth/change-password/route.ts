import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest
) {
    const supabaseRoute = createRouteHandlerClient({ cookies });
    const getUser: any = await supabaseRoute.auth.getUser();

    const supabase = createClient(
        String(process.env.NEXT_PUBLIC_SUPABASE_URL),
        String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    );
    const body = await req.json();
    const { error }: any = await supabase.auth.admin.updateUserById(
        getUser.data.user.id,
        { password: body.password }
    );
    if (error !== null) {
        return NextResponse.json({ error: error }, { status: error.status });
    } else {
        return NextResponse.json({ message: 'Change Password is Success.' }, { status: 200 });
    }
}