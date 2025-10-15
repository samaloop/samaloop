import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest,
    { params }: any
) {
    const supabase = createClient(
        String(process.env.NEXT_PUBLIC_SUPABASE_URL),
        String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    );
    const body = await req.json();
    const attributes: any = {
        email: body.email
    };
    if (body.password !== undefined && body.password !== '') {
        attributes['password'] = body.password;
    }

    await supabase.auth.admin.updateUserById(
        body.uid,
        attributes
    );

    const updateUser = await supabase.from('users').update({
        name: body.name,
        email: body.email,
    }).eq('id', params.id);

    return NextResponse.json(updateUser.data);
}