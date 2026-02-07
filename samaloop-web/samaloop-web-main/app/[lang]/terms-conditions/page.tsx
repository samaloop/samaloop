import type { Metadata } from 'next';
import TermsConditionsComponent from "@/components/page/TermsConditions";

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.lang === 'en' ? 'Samaloop | Terms and Conditions' : 'Samaloop | Syarat dan Ketentuan',
    description: params.lang === 'en' ? 'Samaloop | Terms and Conditions' : 'Samaloop | Syarat dan Ketentuan',
    keywords: params.lang === 'en' ? 'Samaloop, Coach, Terms, Conditions' : 'Samaloop, Pelatih, Syarat, Ketentuan',
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

export default async function TermsConditions() {
  return (
    <TermsConditionsComponent />
  );
}
