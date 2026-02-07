import type { Metadata } from 'next';
import SearchComponent from "@/components/page/Search";
import { Suspense } from 'react';

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.lang === 'en' ? 'Samaloop, Search' : 'Samaloop | Cari',
    description: params.lang === 'en' ? 'Samaloop, Search' : 'Samaloop | Cari',
    keywords: params.lang === 'en' ? 'Samaloop, Coach, Search' : 'Samaloop, Pelatih, Cari',
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
