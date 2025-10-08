import type { Metadata } from 'next';
import TermsConditionsComponent from "@/components/page/TermsConditions";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Samaloop | Syarat dan Ketentuan',
    description: 'Samaloop | Syarat dan Ketentuan',
    keywords: 'Samaloop, Pelatih, Syarat, Ketentuan',
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
