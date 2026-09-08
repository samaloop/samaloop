"use client";
import { FiArrowLeft } from "react-icons/fi";
import { FaShareFromSquare } from "react-icons/fa6";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { t } from "@/helper/helper";
import LocalizedLink from "@/components/LocalizedLink";
import useSWR from "swr";
import axios from "axios";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CoachingModal from "@/components/CoachingModal";

// Halaman detail coach untuk coach yang terafiliasi company (unlisted).
// Sengaja dipisah dari components/page/Coach.tsx karena rencananya desain
// halaman ini akan dibuat berbeda dari halaman coach publik biasa.
export default function CoachCompany({ slug, companySlug }: any) {
  const { locale } = useLocale();
  const [fullUrl, setFullUrl] = useState("");
  const [isBookButtonHovered, setIsBookButtonHovered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { protocol, host, pathname, search } = window.location;
      setFullUrl(`${protocol}//${host}${pathname}${search}`);
    }
  }, []);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);

  const coach: any = useSWR("/api/coachs/detail/" + slug, fetcher);

  const [toastShow, setToastShow] = useState(false);
  const handleShowToast = () => {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setToastShow(true);
        setTimeout(() => setToastShow(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="page-coach container mt-4">
      {toastShow && (
        <div
          className="position-fixed top-5 start-50 translate-middle-x p-3 toast-container"
          style={{ zIndex: 9999999999 }}
        >
          <div
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-body">
              {t("Link has been copied!", locale)}
            </div>
          </div>
        </div>
      )}
      {coach.data === undefined ? (
        <div className="p-5 text-center">
          <div className="spinner-border">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : coach.data.data.length === 0 ? (
        <div className="p-5 text-center">
          <p className="mb-0">
            {locale === "en" ? "Coach not found." : "Coach tidak ditemukan."}
          </p>
        </div>
      ) : (

        <>
          <div className="mb-3">
            <LocalizedLink href={"/search/company/" + companySlug}>
              <button className="btn btn-outline-secondary btn-sm">
                <FiArrowLeft size={16} className="me-1" />
                {locale === "en"
                  ? "Back to " +
                    (coach.data.data[0].company?.name ?? companySlug) +
                    " coach list"
                  : "Kembali ke daftar coach " +
                    (coach.data.data[0].company?.name ?? companySlug)}
              </button>
            </LocalizedLink>
          </div>
          <div className="row">
            <div className="col-12 col-md-3">
              <div className="text-start">
                <div className="photo">
                  <div className="ratio ratio-1x1">
                    <Image
                      className="rounded-circle"
                      priority
                      src={coach.data.data[0].photo}
                      alt="photo"
                      fill
                      sizes="100vw"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
                <div className="name px-2">
                  {t("Hello, I am", locale)}
                  <br />
                  {coach.data.data[0].name}
                </div>

                {(coach.data.data[0].profile_specialities ?? []).length > 0 && (
                  <div className="coach-type-tagline px-2">
                    {(coach.data.data[0].profile_specialities ?? []).map(
                      (value: any, index: number, array: any[]) => (
                        <span key={uuidv4()}>
                          {locale === "en"
                            ? value.speciality?.name?.en
                            : value.speciality?.name?.id}
                          {" Coach"}
                          {index < array.length - 1 && ", "}
                        </span>
                      )
                    )}
                  </div>
                )}

                <div className="d-flex justify-content-center justify-content-md-start mt-2">
                  <button
                    onClick={handleShowToast}
                    className="btn share-button"
                    title={t("Copy link", locale) as string}
                  >
                    <FaShareFromSquare size={16} className="me-2" />
                    {t("Share", locale)}
                  </button>
                </div>

                {/* <div className="mt-4 mb-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-100 btn"
                    onMouseEnter={() => setIsBookButtonHovered(true)}
                    onMouseLeave={() => setIsBookButtonHovered(false)}
                    style={{
                      backgroundColor: isBookButtonHovered ? "#e08b0b" : "#f59e42",
                      color: "#ffffff",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {t("Book a Discovery Call", locale)}
                  </button>
                </div> */}

                {coach.data && (
                  <CoachingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    coach={coach.data.data[0]}
                    locale={locale}
                  />
                )}
              </div>
              <div className="mt-3">
                <a
                  href={
                    coach.data.data[0].company?.button_link ??
                    "https://wa.me/6285770916736?text=Halo%20Admin%20Samaloop,%0ASaya%20mau%20bertanya%20tentang%20layanan%20coaching."
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-100 btn"
                  style={{
                    border: "2px solid #f59e42",
                    color: "#f59e42",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: 700,
                  }}
                >
                  {coach.data.data[0].company?.button_text ??
                    t("Contact Admin", locale)}
                </a>
              </div>
            </div>

            <div className="col-12 col-md-9 ps-4">
              {coach.data.data[0].profession && (
                <div className="profession-highlight mb-5">
                  {coach.data.data[0].profession}
                </div>
              )}


              {(coach.data.data[0].description?.en ||
                coach.data.data[0].description?.id) && (
                <div className="subtitle mb-4">
                  {locale === "en" ? "About Me" : "Tentang Saya"}
                </div>
              )}
              <div
                className="text mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    (locale === "en"
                      ? coach.data.data[0].description?.en
                      : coach.data.data[0].description?.id) ?? "",
                }}
              />
              {(coach.data.data[0].profile_other_credentials ?? []).length > 0 && (
                <div className="subtitle mb-4">
                  {t("Other Credentials", locale)}
                </div>
              )}
              <div className="text mb-4">
                <ul>
                  {(coach.data.data[0].profile_other_credentials ?? []).map(
                    (value: any, index: number) => (
                      <li key={uuidv4()}>
                        {value.credential?.name} ({value.credential?.abbreviation}
                        )
                      </li>
                    )
                  )}
                </ul>
              </div>
              {((locale === "en" && coach.data.data[0].awards_en) ||
                (locale === "id" && coach.data.data[0].awards)) && (
                  <>
                    <div className="subtitle mb-4">{t("Awards", locale)}</div>
                    <div
                      className="text mb-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          locale === "en"
                            ? coach.data.data[0].awards_en
                            : coach.data.data[0].awards,
                      }}
                    />
                  </>
                )}
            </div>
          </div>
          <div className="text-center">
            <div className="description">
              {coach.data.data[0].method_info !== null && (
                <>
                  <div className="title mb-4">
                    {t("Coaching Methods", locale)}
                  </div>
                  <div
                    className="text mb-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        locale === "en"
                          ? coach.data.data[0].method_info.en
                          : coach.data.data[0].method_info.id,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
