import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    let query: any = supabase.from('years').select('id,name', { count: 'exact' });
    query = query.order('created_at', { ascending: true });
    const getData: any = await query;
    return NextResponse.json(getData);
}