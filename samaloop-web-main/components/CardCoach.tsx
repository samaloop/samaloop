"use client";
import Image from "next/image";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { FiClock, FiUsers } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import LocalizedLink from "@/components/LocalizedLink";
import { useLocale } from "@/context/LocaleContext";
import { v4 as uuidv4 } from "uuid";
import { t } from "@/helper/helper";

const CardCoach = ({ coach }: any) => {
  const { locale } = useLocale();

  return (
    <div className="card card-coach h-100">
      <div className="card-body">
        <div className="experience">
          <HiOutlineBriefcase size={20} />{" "}
          {locale === "en" ? coach.year.name.en : coach.year.name.id}
        </div>
        <div className="text-center main-info">
          <div className="row align-items-center">
            <div className="col-4 pe-0">
              <div className="avatar">
                <div className="ratio ratio-1x1">
                  <Image
                    className="rounded-circle"
                    priority
                    src={coach.photo}
                    alt="photo"
                    fill
                    sizes="163"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-8 ps-0">
              <div className="name">{coach.name}</div>
            </div>
          </div>
        </div>
        <div className="info">
          <div className="row align-items-center">
            <div className="col-6">
              <div className="info-item mb-3">
                <FiClock size={18} />{" "}
                {locale === "en" ? coach.hour.name.en : coach.hour.name.id}{" "}
              </div>
              <div className="info-item mb-3">
                <FiUsers size={18} />{" "}
                {locale === "en" ? coach.client.name.en : coach.client.name.id}
              </div>
              <div className="info-item">
                <FaChalkboardTeacher size={18} />{" "}
                {coach.profile_methods.map((value: any, index: number) => (
                  <span key={uuidv4()}>
                    {index > 0 && ", "}
                    {locale === "en"
                      ? value.method.name.en
                      : value.method.name.id}
                  </span>
                ))}
              </div>
            </div>
              
              <div className="col-6">
              <div className="font-weight-bold mb-1">{t("Client Type", locale)}</div>
              <ul className="list-client-type">
                {coach.profile_client_types.map((value: any, index: number) => (
                  <li key={uuidv4()}>
                    {locale === "en"
                      ? value.client_type.name.en
                      : value.client_type.name.id}
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
        <div className="specialist text-center">
          {locale === "en" ? (
            <>
              {coach.profile_specialities.map(
                (value: any, index: number) =>
                  index < 3 && (
                    <span key={uuidv4()} className="badge rounded-pill">
                      {value.speciality.name.en}
                    </span>
                  )
              )}
              {coach.profile_specialities.length > 3 ? (
                <div>+ {coach.profile_specialities.length - 3} {t("Others", locale)}</div>
              ) : (
                <div>&nbsp;</div>
              )}
            </>
          ) : (
            <>
              {coach.profile_specialities.map(
                (value: any, index: number) =>
                  index < 3 && (
                    <span key={uuidv4()} className="badge rounded-pill">
                      {value.speciality.name.id}
                    </span>
                  )
              )}
              {coach.profile_specialities.length > 3 ? (
                <div>
                  + {coach.profile_specialities.length - 3}{" "}
                  {t("Others", locale)}
                </div>
              ) : (
                ""
              )}
            </>
          )}
        </div>

        <div className="text-center btn-profile-container">
          <LocalizedLink href={"/coach/" + coach.slug}>
            <div className="btn btn-profile">{t("View Profile", locale)}</div>
          </LocalizedLink>
        </div>

      </div>
    </div>
  );
};
export default CardCoach;
