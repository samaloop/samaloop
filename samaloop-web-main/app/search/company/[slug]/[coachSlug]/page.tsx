import type { Metadata } from "next";
import CoachCompanyComponent from "@/components/page/CoachCompany";

type Props = Readonly<{
  params: { slug: string; coachSlug: string };
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Samaloop | " + params.coachSlug,
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

export default async function CoachCompanyPage({ params }: Props) {
  return (
    <CoachCompanyComponent slug={params.coachSlug} companySlug={params.slug} />
  );
}
