'use client'
import useSWR from 'swr';
import axios from 'axios';
import { useLocale } from '@/context/LocaleContext';

export default function CookiePolicy() {
    const { locale } = useLocale();
    const fetcher = async (url: any) => await axios.get(url).then((res) => res.data);
    const info = useSWR('/api/info?id=Privacy Policy', fetcher);

    return (
        <div className="container mt-4">
            {
                info.data === undefined ?
                    <div className="p-5 text-center">
                        <div className="spinner-border">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    : <div dangerouslySetInnerHTML={{ __html: locale === 'en' ? info.data.data[0].data.en : info.data.data[0].data.id }} />
            }
        </div>
    );
}
