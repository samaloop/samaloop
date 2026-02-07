import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
    req: NextRequest
) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    let query: any = supabase.from('specialities_mobile').select('speciality(id,name)', { count: 'exact' });
    query = query.order('created_at', { ascending: true });
    let getData: any = await query;
    return NextResponse.json(getData);
}