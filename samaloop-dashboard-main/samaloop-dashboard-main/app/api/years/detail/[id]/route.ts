import { createClient } from '@supabase/supabase-js';
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
    const getData = await supabase.from('years').select('id,name').eq('id', params.id);

    return NextResponse.json(getData);
}