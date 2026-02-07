import { createClient } from '@supabase/supabase-js'
import { log } from 'console';
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

    const { error }: any = await supabase.from('credentials').insert({
        name: body.name,
        abbreviation: body.abbreviation,
        type: body.type,
        logo: body.logo
    });

    if (error !== null) {
        return NextResponse.json({ error: error.details }, { status: 400 });
    } else {
        return NextResponse.json({ message: 'Create Credential is Success.' }, { status: 200 });
    }
}