import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
    req: NextRequest
) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const limit = 6;
    let page: any = req.nextUrl.searchParams.get('page');
    if (page === null) {
        page = 1;
    }
    const range = [
        (parseInt(page) - 1) * limit,
        (parseInt(page) * limit) - 1
    ];

    let client = ',client(id,name)';
    if (req.nextUrl.searchParams.get('client') !== '' && req.nextUrl.searchParams.get('client') !== null) {
        client = ',client!inner(id,name)';
    }

    let clientType = ',profile_client_types(client_type(id,name))';
    if (req.nextUrl.searchParams.get('clientType') !== '' && req.nextUrl.searchParams.get('clientType') !== null) {
        clientType = ',profile_client_types!inner(client_type!inner(id,name))';
    }

    let credential = ',credential(id,abbreviation,logo)';
    if (req.nextUrl.searchParams.get('credential') !== '' && req.nextUrl.searchParams.get('credential') !== null) {
        credential = ',credential!inner(id,abbreviation,logo)';
    }

    let hour = ',hour(id,name)';
    if (req.nextUrl.searchParams.get('hour') !== '' && req.nextUrl.searchParams.get('hour') !== null) {
        hour = ',hour!inner(id,name)';
    }

    let method = ',profile_methods(method(id,name))';
    if (req.nextUrl.searchParams.get('method') !== '' && req.nextUrl.searchParams.get('method') !== null) {
        method = ',profile_methods!inner(method!inner(id,name))';
    }

    let price = ',profile_prices(price(id,name))';
    if (req.nextUrl.searchParams.get('price') !== '' && req.nextUrl.searchParams.get('price') !== null) {
        price = ',profile_prices!inner(price!inner(id,name))';
    }

    let specialities = ',profile_specialities(speciality(id,name))';
    if (req.nextUrl.searchParams.get('specialities') !== '' && req.nextUrl.searchParams.get('specialities') !== null) {
        specialities = ',profile_specialities!inner(speciality!inner(id,name))';
    }

    let year = ',year(id,name)';
    if (req.nextUrl.searchParams.get('year') !== '' && req.nextUrl.searchParams.get('year') !== null) {
        year = ',year!inner(id,name)';
    }

    let query: any = supabase.from('profiles').select('id,slug,name,photo,profile_other_credentials(credential(logo))' + client + clientType + credential + hour + method + price + specialities + year, { count: 'exact' });
    query = query.eq('status', 'active');
    if (req.nextUrl.searchParams.get('client') !== '' && req.nextUrl.searchParams.get('client') !== null) {
        query = query.in('client.id', req.nextUrl.searchParams.get('client')?.split(','));
    }
    if (req.nextUrl.searchParams.get('clientType') !== '' && req.nextUrl.searchParams.get('clientType') !== null) {
        query = query.in('profile_client_types.client_type.id', req.nextUrl.searchParams.get('clientType')?.split(','));
    }
    if (req.nextUrl.searchParams.get('credential') !== '' && req.nextUrl.searchParams.get('credential') !== null) {
        query = query.in('credential.id', req.nextUrl.searchParams.get('credential')?.split(','));
    }
    if (req.nextUrl.searchParams.get('hour') !== '' && req.nextUrl.searchParams.get('hour') !== null) {
        query = query.in('hour.id', req.nextUrl.searchParams.get('hour')?.split(','));
    }
    if (req.nextUrl.searchParams.get('method') !== '' && req.nextUrl.searchParams.get('method') !== null) {
        let method = req.nextUrl.searchParams.get('method');
        if(req.nextUrl.searchParams.get('method') === 'Online / Daring' || req.nextUrl.searchParams.get('method') === 'Offline / Luring') {
            method += ',Hybrid / Hibrida';
        }
        query = query.in('profile_methods.method.id', method?.split(','));
    }
    if (req.nextUrl.searchParams.get('price') !== '' && req.nextUrl.searchParams.get('price') !== null) {
        query = query.in('profile_prices.price.id', req.nextUrl.searchParams.get('price')?.split(','));
    }
    if (req.nextUrl.searchParams.get('specialities') !== '' && req.nextUrl.searchParams.get('specialities') !== null) {
        query = query.in('profile_specialities.speciality.id', req.nextUrl.searchParams.get('specialities')?.split(','));
    }
    if (req.nextUrl.searchParams.get('year') !== '' && req.nextUrl.searchParams.get('year') !== null) {
        query = query.in('year.id', req.nextUrl.searchParams.get('year')?.split(','));
    }
    if (req.nextUrl.searchParams.get('keyword') !== '' && req.nextUrl.searchParams.get('keyword') !== null) {
        query = query.ilike('name', '%' + req.nextUrl.searchParams.get('keyword') + '%');
    }

    query = query.order('created_at', { ascending: true });
    query = query.range(range[0], range[1]);

    let getData: any = await query;
    for(const value of getData.data) {
        const other_credential = await supabase.from('profile_other_credentials').select('credentials(abbreviation,logo)').eq('profile', value.id).order('created_at', { ascending: true });
        value.credentials = {
            other_credential: other_credential.data
        }
    }
    getData.pageTotal = Math.ceil(getData.count / limit);
    getData.limit = limit;

    return NextResponse.json(getData);
}