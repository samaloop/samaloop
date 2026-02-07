import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest,
    { params }: any
) {
    const supabase = createClient(
        String(process.env.NEXT_PUBLIC_SUPABASE_URL),
        String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    );
    const body = await req.json();

    console.log("body", body);
    console.log("params", params);
    
    const paramId = decodeURIComponent(params.id);
    if(paramId === "Address" || paramId === "Cookie Policy" || paramId === "Facebook" || paramId === "Instagram" || paramId === "Linkedin" || paramId === "Name" || paramId === "Privacy Policy" || paramId === "Footer" || paramId === "Search" || paramId === "Terms and Conditions" || paramId === "Tiktok" ) {
        const { error }: any = await supabase.from('info').update({
            data: {
                en: body.data_en,
                id: body.data_id
            }
        }).eq('id', paramId);

        if (error !== null) {
            return NextResponse.json({ error: error.details }, { status: 400 });
        } else {
            return NextResponse.json({ message: 'Update Info is Success.' }, { status: 200 });
        }
    } else if(paramId === "Banner Home") {
        const { error }: any = await supabase.from('info').update({
            image: body.image
        }).eq('id', paramId);

        if (error !== null) {
            return NextResponse.json({ error: error.details }, { status: 400 });
        } else {
            return NextResponse.json({ message: 'Update Info is Success.' }, { status: 200 });
        }
    } else if(paramId === "About Us") {
        console.log("body.data", body.data);
        
        const { error }: any = await supabase.from('info').update({
            data: body.data
        }).eq('id', paramId);

        if (error !== null) {
            return NextResponse.json({ error: error.details }, { status: 400 });
        } else {
            return NextResponse.json({ message: 'Update Info is Success.' }, { status: 200 });
        }
    } else {
        return NextResponse.json({ message: 'Update Info is Success.' }, { status: 200 });
    }
}