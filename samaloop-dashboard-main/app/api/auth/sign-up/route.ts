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
    // const inviteUserByEmail: any = await supabase.auth.admin.inviteUserByEmail(body.email);
    // if (inviteUserByEmail.error !== null) {
    //     return NextResponse.json({ error: inviteUserByEmail.error.message }, { status: 500 });
    // } else {
    //     return NextResponse.json(inviteUserByEmail.data.user);
    // }

    const checkEmail: any = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('email', body.email);
    if (checkEmail.count > 0) {
        return NextResponse.json({ error: 'Email is already found.' }, { status: 409 });
    } else {
        const inviteUserByEmail = await supabase.auth.admin.inviteUserByEmail(body.email);
        if (inviteUserByEmail.error !== null) {
            return NextResponse.json({ error: 'An error occured. Please contact the system administrator' }, { status: 500 });
        } else {
            const customer: any = await supabase.from('customers').insert({
                name: body.name,
                email: body.email,
                phone: body.phone
            }).select('id');

            const admin: any = await supabase.from('users').insert({
                auth: inviteUserByEmail.data.user.id,
                name: body.name,
                role: 'Admin',
                email: body.email
            }).select('id');

            await supabase.from('customer_users').insert({
                customer: customer.data[0].id,
                user: admin.data[0].id
            }).select('id');

            return NextResponse.json({ message: 'Sign Up is Success.' }, { status: 200 });
        }
    }
}