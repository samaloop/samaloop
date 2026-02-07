import type { Metadata } from "next";
import CoachFormComponent from "@/components/page/CoachForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Samaloop | Formulir Coach",
    description: "Samaloop | Formulir Coach",
    keywords: "samaloop, coach, formulir",
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
      },
    },
  };
}

export default async function CookieForm() {
  return <CoachFormComponent />;
}
