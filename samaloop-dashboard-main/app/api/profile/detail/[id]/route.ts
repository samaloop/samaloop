import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: any
) {
    const supabase = createServerComponentClient({ cookies });
    const getData = await supabase.from('profiles').select('id,slug,name,credential(id, name, abbreviation),photo,profession,description,method_info,awards,hour(id,name),year(id,name),client(id,name),profile_prices(price(id,name)),contact,gender(id,name),age(id,name),profile_client_types(client_type(id,name)),profile_methods(method(id,name)),profile_other_credentials(credential(id,name)),profile_specialities(speciality(id,name)),awards_en').eq('id', params.id).order('created_at', { ascending: false }).range(0, 1);

    return NextResponse.json(getData);
}