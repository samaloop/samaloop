import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
    req: NextRequest,
    { params }: any
) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    let query: any = supabase.from('profiles').select('name,photo,profession,description,method_info,awards,contact,credential(abbreviation,logo),profile_other_credentials(credential(name,abbreviation,logo)),year(name),hour(name),client(name),profile_methods(method(name)),profile_client_types(client_type(name)),profile_specialities(speciality(name)),profile_prices(price(id,name)),price(name),awards_en', { count: 'exact' });
    query = query.eq('status', 'active');
    query = query.eq('slug', params.slug);

    const getData: any = await query;

    return NextResponse.json(getData);
}