import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    let query: any = supabase.from('company').select('id,slug,name,logo', { count: 'exact' });
    query = query.order('id', { ascending: true });
    const getData: any = await query;
    return NextResponse.json(getData);
}
