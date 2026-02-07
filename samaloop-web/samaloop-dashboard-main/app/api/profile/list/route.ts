import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest
) {
    const supabase = createServerComponentClient({ cookies });

    const limit = 10;
    let page: any = req.nextUrl.searchParams.get('page');
    if (page === null) {
        page = 1;
    }
    const range = [
        (parseInt(page) - 1) * limit,
        (parseInt(page) * limit) - 1
    ];

    let query: any = supabase.from('profiles').select('id,created_at,name,photo,status,credential(abbreviation)', { count: 'exact' });
    query = query.order('created_at', { ascending: false });
    query = query.range(range[0], range[1]);

    if (req.nextUrl.searchParams.get('name') !== null) {
        query = query.ilike('name', '%' + req.nextUrl.searchParams.get('name') + '%');
    }

    const getData: any = await query;
    getData.pageTotal = Math.ceil(getData.count / limit);
    getData.limit = limit;

    return NextResponse.json(getData);
}