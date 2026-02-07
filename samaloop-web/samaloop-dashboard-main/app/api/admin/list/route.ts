import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    req: NextRequest
) {
    const supabase = createClient(
        String(process.env.NEXT_PUBLIC_SUPABASE_URL),
        String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    );

    const limit = 10;
    let page: any = req.nextUrl.searchParams.get('page');
    if (page === null) {
        page = 1;
    }
    const range = [
        (parseInt(page) - 1) * limit,
        (parseInt(page) * limit) - 1
    ];

    let query: any = supabase.from('users').select('id,uid,name,email', { count: 'exact' });
    query = query.order('created_at', { ascending: false });
    query = query.range(range[0], range[1]);

    const getData: any = await query;
    getData.pageTotal = Math.ceil(getData.count / limit);
    getData.limit = limit;

    return NextResponse.json(getData);
}