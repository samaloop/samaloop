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

    const { error }: any = await supabase.from('companies').insert({
        id: body.id,
        name: body.name
    });

    if (error !== null) {
        return NextResponse.json({ error: error.details || error.message }, { status: 400 });
    } else {
        return NextResponse.json({ message: 'Create Company is Success.' }, { status: 200 });
    }
}
