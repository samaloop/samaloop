import type { Metadata } from 'next';
import HomeComponent from "@/components/page/Home";

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Samaloop',
    description: 'Samaloop',
    keywords: params.lang === 'en' ? 'Samaloop, Home' : 'Samaloop, Beranda',
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

export default async function Home() {
  return (
    <HomeComponent />
  );
}
