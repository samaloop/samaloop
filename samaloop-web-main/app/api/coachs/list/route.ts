import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore }); // ✅ ini kuncinya

    const limit = 6;
    let page: any = req.nextUrl.searchParams.get('page') ?? 1;

    const range = [
        (parseInt(page) - 1) * limit,
        parseInt(page) * limit - 1,
    ];

    // ===============================
    //  Dynamic Relation Handling
    // ===============================
    let client = ',client(id,name)';
    if (req.nextUrl.searchParams.get('client')) {
        client = ',client!inner(id,name)';
    }

    let clientType = ',profile_client_types(client_type(id,name))';
    if (req.nextUrl.searchParams.get('clientType')) {
        clientType = ',profile_client_types!inner(client_type!inner(id,name))';
    }

    let credential = ',credential(id,abbreviation,logo)';
    if (req.nextUrl.searchParams.get('credential')) {
        credential = ',credential!inner(id,abbreviation,logo)';
    }

    let hour = ',hour(id,name)';
    if (req.nextUrl.searchParams.get('hour')) {
        hour = ',hour!inner(id,name)';
    }

    let method = ',profile_methods(method(id,name))';
    if (req.nextUrl.searchParams.get('method')) {
        method = ',profile_methods!inner(method!inner(id,name))';
    }

    let price = ',profile_prices(price(id,name))';
    if (req.nextUrl.searchParams.get('price')) {
        price = ',profile_prices!inner(price!inner(id,name))';
    }

    let specialities = ',profile_specialities(speciality(id,name))';
    if (req.nextUrl.searchParams.get('specialities')) {
        specialities = ',profile_specialities!inner(speciality!inner(id,name))';
    }

    let year = ',year(id,name)';
    if (req.nextUrl.searchParams.get('year')) {
        year = ',year!inner(id,name)';
    }

    // ===============================
    //  Base Query
    // ===============================
    let query = supabase
        .from('profiles')
        .select(
            `
      id,
      slug,
      name,
      photo,
      credential(id, abbreviation, logo),
      profile_other_credentials(
        credential(id, name, abbreviation, logo)
      )
      ${client}
      ${clientType}
      ${hour}
      ${method}
      ${price}
      ${specialities}
      ${year}
    `,
            { count: 'exact' }
        )
        .eq('status', 'active');

    // ===============================
    //  Filter Credential (utama + others)
    // ===============================
    const credentialParam = req.nextUrl.searchParams.get('credential') ?? '';
    const credentialIds = credentialParam
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

    if (credentialIds.length > 0) {
        // 1️ Ambil profile dengan credential utama
        const mainCred = await supabase
            .from('profiles')
            .select('id')
            .in('credential', credentialIds);

        // 2️ Ambil profile dengan credential others
        const subCred = await supabase
            .from('profile_other_credentials')
            .select('profile')
            .in('credential', credentialIds);

        // 3️ Gabungkan hasil jadi list ID unik
        const profileIds = [
            ...new Set([
                ...(mainCred.data?.map((p) => p.id) ?? []),
                ...(subCred.data?.map((p) => p.profile) ?? []),
            ]),
        ];

        // 4️ Filter base query pakai ID hasil gabungan
        if (profileIds.length > 0) {
            query = query.in('id', profileIds);
        } else {
            return NextResponse.json({ data: [], count: 0, pageTotal: 0, limit });
        }
    }
    //================================
    //Filter Price
    //================================
    const priceParam = req.nextUrl.searchParams.get('price') ?? '';
    const priceIds = priceParam
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);

    if (priceIds.length > 0) {
        // Ambil semua profile_id dari tabel profile_prices yang punya price yang cocok
        const { data: priceProfiles, error: priceError } = await supabase
            .from('profile_prices')
            .select('profile')
            .in('price', priceIds);

        if (priceError) {
            console.error('Error fetching profile prices:', priceError);
        }

        const priceProfileIds = priceProfiles?.map(p => p.profile) ?? [];

        if (priceProfileIds.length > 0) {
            query = query.in('id', priceProfileIds);
        } else {
            // Jika tidak ada hasil, return kosong
            return NextResponse.json({ data: [], count: 0, pageTotal: 0, limit });
        }
    }


    // ===============================
    // Filter lainnya
    // ===============================

    // METHOD
    if (req.nextUrl.searchParams.get('method')) {
        let methodParam = req.nextUrl.searchParams.get('method') ?? '';
        if (methodParam === 'Online / Daring' || methodParam === 'Offline / Luring') {
            methodParam += ',Hybrid / Hibrida';
        }
        query = query.in('profile_methods.method.id', methodParam.split(','));
    }

    // KEYWORD SEARCH
    if (req.nextUrl.searchParams.get('keyword')) {
        query = query.ilike('name', `%${req.nextUrl.searchParams.get('keyword')}%`);
    }

    // HOUR
    const hourParam = req.nextUrl.searchParams.get('hour') ?? '';
    if (hourParam) {
        const hourIds = hourParam.split(',').map((id) => id.trim());
        query = query.in('hour.id', hourIds);
    }

    // CLIENT
    const clientParam = req.nextUrl.searchParams.get('client') ?? '';
    if (clientParam) {
        const clientIds = clientParam.split(',').map((id) => id.trim());
        query = query.in('client.id', clientIds);
    }

    // CLIENT TYPE
    const clientTypeParam = req.nextUrl.searchParams.get('clientType') ?? '';
    if (clientTypeParam) {
        const clientTypeIds = clientTypeParam.split(',').map((id) => id.trim());
        query = query.in('profile_client_types.client_type.id', clientTypeIds);
    }

    // YEAR
    const yearParam = req.nextUrl.searchParams.get('year') ?? '';
    if (yearParam) {
        const yearIds = yearParam.split(',').map((id) => id.trim());
        query = query.in('year.id', yearIds);
    }

    // SPECIALTIES
    const specialitiesParam = req.nextUrl.searchParams.get('specialities') ?? '';
    if (specialitiesParam) {
        const specIds = specialitiesParam.split(',').map((id) => id.trim());
        query = query.in('profile_specialities.speciality.id', specIds);
    }



    // ===============================
    //  Eksekusi query utama
    // ===============================
    query = query.order('created_at', { ascending: true }).range(range[0], range[1]);
    const { data, count, error } = await query;

    if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const pageTotal = Math.ceil((count ?? 0) / limit);
    return NextResponse.json({ data, count, pageTotal, limit });
}




























// import { NextRequest, NextResponse } from 'next/server';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';

// export async function GET(
//     req: NextRequest
// ) {
//     const cookieStore = cookies();
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
//     const limit = 6;
//     let page: any = req.nextUrl.searchParams.get('page');
//     if (page === null) {
//         page = 1;
//     }
//     const range = [
//         (parseInt(page) - 1) * limit,
//         (parseInt(page) * limit) - 1
//     ];

//     let client = ',client(id,name)';
//     if (req.nextUrl.searchParams.get('client') !== '' && req.nextUrl.searchParams.get('client') !== null) {
//         client = ',client!inner(id,name)';
//     }

//     let clientType = ',profile_client_types(client_type(id,name))';
//     if (req.nextUrl.searchParams.get('clientType') !== '' && req.nextUrl.searchParams.get('clientType') !== null) {
//         clientType = ',profile_client_types!inner(client_type!inner(id,name))';
//     }

//     let credential = ',credential(id,abbreviation,logo)';
//     if (req.nextUrl.searchParams.get('credential') !== '' && req.nextUrl.searchParams.get('credential') !== null) {
//         credential = ',credential!inner(id,abbreviation,logo)';
//     }

//     let hour = ',hour(id,name)';
//     if (req.nextUrl.searchParams.get('hour') !== '' && req.nextUrl.searchParams.get('hour') !== null) {
//         hour = ',hour!inner(id,name)';
//     }

//     let method = ',profile_methods(method(id,name))';
//     if (req.nextUrl.searchParams.get('method') !== '' && req.nextUrl.searchParams.get('method') !== null) {
//         method = ',profile_methods!inner(method!inner(id,name))';
//     }

//     let price = ',profile_prices(price(id,name))';
//     if (req.nextUrl.searchParams.get('price') !== '' && req.nextUrl.searchParams.get('price') !== null) {
//         price = ',profile_prices!inner(price!inner(id,name))';
//     }

//     let specialities = ',profile_specialities(speciality(id,name))';
//     if (req.nextUrl.searchParams.get('specialities') !== '' && req.nextUrl.searchParams.get('specialities') !== null) {
//         specialities = ',profile_specialities!inner(speciality!inner(id,name))';
//     }

//     let year = ',year(id,name)';
//     if (req.nextUrl.searchParams.get('year') !== '' && req.nextUrl.searchParams.get('year') !== null) {
//         year = ',year!inner(id,name)';
//     }

//     let query: any = supabase.from('profiles').select('id,slug,name,photo,profile_other_credentials(credential(logo))' + client + clientType + credential + hour + method + price + specialities + year, { count: 'exact' });
//     query = query.eq('status', 'active');
//     if (req.nextUrl.searchParams.get('client') !== '' && req.nextUrl.searchParams.get('client') !== null) {
//         query = query.in('client.id', req.nextUrl.searchParams.get('client')?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('clientType') !== '' && req.nextUrl.searchParams.get('clientType') !== null) {
//         query = query.in('profile_client_types.client_type.id', req.nextUrl.searchParams.get('clientType')?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('credential') !== '' && req.nextUrl.searchParams.get('credential') !== null) {
//         query = query.in('credential.id', req.nextUrl.searchParams.get('credential')?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('hour') !== '' && req.nextUrl.searchParams.get('hour') !== null) {
//         query = query.in('hour.id', req.nextUrl.searchParams.get('hour')?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('method') !== '' && req.nextUrl.searchParams.get('method') !== null) {
//         let method = req.nextUrl.searchParams.get('method');
//         if(req.nextUrl.searchParams.get('method') === 'Online / Daring' || req.nextUrl.searchParams.get('method') === 'Offline / Luring') {
//             method += ',Hybrid / Hibrida';
//         }
//         query = query.in('profile_methods.method.id', method?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('price') !== '' && req.nextUrl.searchParams.get('price') !== null) {
//         query = query.in('profile_prices.price.id', req.nextUrl.searchParams.get('price')?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('specialities') !== '' && req.nextUrl.searchParams.get('specialities') !== null) {
//         query = query.in('profile_specialities.speciality.id', req.nextUrl.searchParams.get('specialities')?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('year') !== '' && req.nextUrl.searchParams.get('year') !== null) {
//         query = query.in('year.id', req.nextUrl.searchParams.get('year')?.split(','));
//     }
//     if (req.nextUrl.searchParams.get('keyword') !== '' && req.nextUrl.searchParams.get('keyword') !== null) {
//         query = query.ilike('name', '%' + req.nextUrl.searchParams.get('keyword') + '%');
//     }

//     query = query.order('created_at', { ascending: true });
//     query = query.range(range[0], range[1]);

//     let getData: any = await query;
//     for(const value of getData.data) {
//         const other_credential = await supabase.from('profile_other_credentials').select('credentials(abbreviation,logo)').eq('profile', value.id).order('created_at', { ascending: true });
//         value.credentials = {
//             other_credential: other_credential.data
//         }
//     }
//     getData.pageTotal = Math.ceil(getData.count / limit);
//     getData.limit = limit;

//     return NextResponse.json(getData);
//      }