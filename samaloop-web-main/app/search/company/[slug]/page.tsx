import type { Metadata } from "next";
import SearchCompany from "@/components/page/SearchCompany";

type Props = Readonly<{
  params: { slug: string };
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Samaloop | " + params.slug,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function SearchCompanyPage({ params }: Props) {
  return <SearchCompany slug={params.slug} />;
}
