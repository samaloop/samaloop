import type { Metadata } from 'next';
import CookiePolicyComponent from "@/components/page/CookiePolicy";

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.lang === 'en' ? 'Samaloop | Cookie Privacy' : 'Samaloop | Kebijakan Cookie',
    description: params.lang === 'en' ? 'Samaloop | Cookie Privacy' : 'Samaloop | Kebijakan Cookie',
    keywords: params.lang === 'en' ? 'Samaloop, Coach, Privacy, Cookie' : 'Samaloop, Pelatih, Kebijakan, Cookie',
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false
      },
    },
  }
}

export default async function CookiePolicy() {
  return (
    <CookiePolicyComponent />
  );
}
