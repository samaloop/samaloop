import type { Metadata } from 'next';
import SearchComponent from "@/components/page/Search";
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Samaloop | Cari',
    description: 'Samaloop | Cari',
    keywords: 'Samaloop, Pelatih, Cari',
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

export default async function Search() {
  return (
    <Suspense>
      <SearchComponent />
    </Suspense>
  );
}
