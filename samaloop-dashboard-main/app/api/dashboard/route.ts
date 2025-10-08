import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = createClient(
        String(process.env.NEXT_PUBLIC_SUPABASE_URL),
        String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    );

    try {
        const profiles: any = await supabase.from('profiles').select('id', { count: 'exact', head: true });
        const users: any = await supabase.from('users').select('id', { count: 'exact', head: true });
        const genders: any = await supabase.from('genders').select('id', { count: 'exact', head: true });
        const ages: any = await supabase.from('ages').select('id', { count: 'exact', head: true });
        const credentials: any = await supabase.from('credentials').select('id', { count: 'exact', head: true });
        const specialities: any = await supabase.from('specialities').select('id', { count: 'exact', head: true });
        const methods: any = await supabase.from('methods').select('id', { count: 'exact', head: true });
        const hours: any = await supabase.from('hours').select('id', { count: 'exact', head: true });
        const years: any = await supabase.from('years').select('id', { count: 'exact', head: true });
        const clients: any = await supabase.from('clients').select('id', { count: 'exact', head: true });
        const client_types: any = await supabase.from('client_types').select('id', { count: 'exact', head: true });
        const prices: any = await supabase.from('prices').select('id', { count: 'exact', head: true });
        return NextResponse.json({
            profiles: profiles.count,
            users: users.count,
            genders: genders.count,
            ages: ages.count,
            credentials: credentials.count,
            specialities: specialities.count,
            methods: methods.count,
            hours: hours.count,
            years: years.count,
            clients: clients.count,
            client_types: client_types.count,
            prices: prices.count
        });
    } catch (err: any) {
        return NextResponse.json(err);
    }
}