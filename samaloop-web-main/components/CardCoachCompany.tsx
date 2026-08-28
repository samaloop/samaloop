"use client";
import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import { useLocale } from "@/context/LocaleContext";
import { v4 as uuidv4 } from "uuid";
import { t } from "@/helper/helper";

// Kartu coach untuk halaman company (/search/company/[slug]).
// Sengaja dipisah dari components/CardCoach.tsx karena tampilannya memang
// dibuat berbeda dari kartu coach publik biasa.
const CardCoachCompany = ({ coach }: any) => {
  const { locale } = useLocale();

  return (
    <div className="card card-coach-company h-100 text-center p-3 d-flex flex-column">
      <div className="ratio ratio-1x1 mb-3" style={{ width: 120, margin: "0 auto" }}>
        {coach.photo && (
          <Image
            className="rounded-circle"
            priority
            src={coach.photo}
            alt="photo"
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      <div className="mb-3">
        {coach.credential?.logo != null && (
          <Image
            className="mb-2 me-2"
            priority
            src={coach.credential.logo}
            alt="logo"
            width={70}
            height={40}
            style={{ width: "auto", height: "40px" }}
          />
        )}
        {(coach.profile_other_credentials ?? []).map(
          (value: any) =>
            value.credential?.logo != null && (
              <Image
                key={uuidv4()}
                className="mb-2 me-2"
                priority
                src={value.credential.logo}
                alt="logo"
                width={70}
                height={40}
                style={{ width: "auto", height: "40px" }}
              />
            )
        )}
      </div>

      <div
        className="fw-bold mb-2"
        style={{ textDecoration: "underline", fontSize: "18px" }}
      >
        {coach.name}
        {coach.credential?.abbreviation ? ", " + coach.credential.abbreviation : ""}
      </div>

      <div className="text-muted mb-3" style={{ fontSize: "14px" }}>
        {coach.credential?.name && <div>{coach.credential.name}</div>}
        {(coach.profile_other_credentials ?? []).map(
          (value: any) =>
            value.credential?.name && (
              <div key={uuidv4()}>{value.credential.name}</div>
            )
        )}
        {coach.profession && <div>{coach.profession}</div>}
        {coach.department?.name && <div>{coach.department.name}</div>}
      </div>

      <div className="mt-auto">
        <LocalizedLink
          href={"/search/company/" + coach.company?.slug + "/" + coach.slug}
        >
          <div className="btn btn-profile">{t("View Profile", locale)}</div>
        </LocalizedLink>
      </div>
    </div>
  );
};

export default CardCoachCompany;
