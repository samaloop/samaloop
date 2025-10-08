import type { Metadata } from 'next';
import HomeComponent from "@/components/page/Home";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Samaloop',
    description: 'Samaloop',
    keywords: 'Samaloop, Beranda',
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
