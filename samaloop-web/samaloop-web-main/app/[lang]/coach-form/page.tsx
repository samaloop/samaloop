import type { Metadata } from 'next';
import CoachFormComponent from "@/components/page/CoachForm";

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.lang === 'en' ? 'Samaloop | Coach Form' : 'Samaloop | Formulir Coach',
    description: params.lang === 'en' ? 'Samaloop | Coach Form' : 'Samaloop | Formulir Coach',
    keywords: params.lang === 'en' ? 'samaloop, coach, form' : 'samaloop, coach, formulir',
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

export default async function CookieForm() {
  return (
    <CoachFormComponent />
  );
}
