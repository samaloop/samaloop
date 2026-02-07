import type { Metadata } from 'next';
import PrivacyPolicyComponent from "@/components/page/PrivacyPolicy";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Samaloop | Kebijakan Privasi',
    description: 'Samaloop | Kebijakan Privasi',
    keywords: 'Samaloop, Pelatih, Kebijakan, Privasi',
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
