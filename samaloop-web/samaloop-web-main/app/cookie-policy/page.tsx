import type { Metadata } from 'next';
import CookiePolicyComponent from "@/components/page/CookiePolicy";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Samaloop | Kebijakan Cookie',
    description: 'Samaloop | Kebijakan Cookie',
    keywords: 'Samaloop, Pelatih, Kebijakan, Cookie',
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
