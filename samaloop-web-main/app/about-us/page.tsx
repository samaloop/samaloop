import type { Metadata } from "next";
import AboutUsComponent from "@/components/page/AboutUs";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Samaloop | Tentang Kami",
    description: "Samaloop | Tentang Kami",
    keywords: "Samaloop, Pelatih, Tentang Kami",
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

export default async function AboutUs() {
  return (
    <Suspense>
      <AboutUsComponent />
    </Suspense>
  );
}
