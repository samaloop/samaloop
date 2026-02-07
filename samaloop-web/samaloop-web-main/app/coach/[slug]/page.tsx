import type { Metadata } from "next";
import CoachComponent from "@/components/page/Coach";
import { notFound } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Props = Readonly<{
  params: { slug: string };
}>;

async function getCoach(slug: string) {
  const supabase = createClientComponentClient();
  const coach: any = await supabase
    .from("profiles")
    .select("name,credential(abbreviation)", { count: "exact" })
    .eq("slug", slug);

  if (coach.data.length === 0) {
    return notFound();
  } else {
    return coach.data[0];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const coach = await getCoach(params.slug);

  return {
    title: "Samaloop | " + coach.name + " " + coach.credential.abbreviation,
    description:
      "Samaloop | " + coach.name + " " + coach.credential.abbreviation,
    keywords:
      "Samaloop, Coach, " + coach.name + ",  " + coach.credential.abbreviation,
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

export default async function Coach({ params }: Props) {
  return <CoachComponent slug={params.slug} />;
}
