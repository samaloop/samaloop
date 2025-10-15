import { createClient } from '@supabase/supabase-js'
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
    const attributes: any = {
        email: body.email,
        password: body.password,
        email_confirm: true
    };

    const createUser: any = await supabase.auth.admin.createUser(
        attributes
    );

    if (createUser.error !== null) {
        return NextResponse.json({ error: createUser.error }, { status:createUser.error.status });
    } else {

        await supabase.from('users').insert([
            {
                uid: createUser.data.user.id,
                name: body.name,
                email: body.email
            }
        ]);
        return NextResponse.json({ message: 'Create Admin is Success.' }, { status: 200 });
    }
}