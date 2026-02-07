import type { Metadata } from 'next';
import PrivacyPolicyComponent from "@/components/page/PrivacyPolicy";

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.lang === 'en' ? 'Samaloop | Privacy Privacy' : 'Samaloop | Kebijakan Privasi',
    description: params.lang === 'en' ? 'Samaloop | Privacy Privacy' : 'Samaloop | Kebijakan Privasi',
    keywords: params.lang === 'en' ? 'Samaloop, Coach, Privacy, Cookie' : 'Samaloop, Pelatih, Kebijakan, Privasi',
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

export default async function PrivacyPolicy() {
  return (
    <PrivacyPolicyComponent />
  );
}
