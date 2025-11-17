"use client";
import { GoHome } from "react-icons/go";
import { FiClock, FiUsers } from "react-icons/fi";
import {
  FaLinkedin,
  FaSquareInstagram,
  FaTiktok,
  FaFacebook,
  FaShareFromSquare,
  FaWhatsapp,
} from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { t } from "@/helper/helper";
import LocalizedLink from "@/components/LocalizedLink";
import useSWR from "swr";
import axios from "axios";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Coach({ slug }: any) {
  const { locale } = useLocale();
  const [fullUrl, setFullUrl] = useState("");

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
      ) : (

        <>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <LocalizedLink href={"/"}>
                  <GoHome size={20} />
                </LocalizedLink>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                <LocalizedLink className="active" href={"/coach/slug/" + slug}>
                  {coach.data.data[0].name}
                </LocalizedLink>
              </li>
            </ol>
          </nav>
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
                <div className="certificate">
                  {coach.data.data[0].credential.logo !== undefined && (
                    <Image
                      className="mb-2 me-2"
                      priority
                      src={coach.data.data[0].credential.logo}
                      alt="photo"
                      width={50}
                      height={15}
                      style={{
                        maxWidth: "100%",
                        width: "auto",
                        height: "auto",
                      }}
                    />

                  )}


                  {coach.data.data[0].profile_other_credentials.map(
                    (value: any, index: number) => (

                      <>
                        {value.credential.logo !== null && (
                          <Image
                            className="mb-2 me-2"
                            key={uuidv4()}
                            priority
                            src={value.credential.logo}
                            alt="photo"
                            width={50}
                            height={15}
                            style={{
                              maxWidth: "100%",
                              width: "auto",
                              height: "auto",
                            }}
                          />
                        )}
                      </>

                    )
                  )}

                  <div className="d-flex align-items-center justify-content-center justify-content-md-start mt-2 gap-2">
                    <button
                      onClick={handleShowToast}
                      className="btn p-1"
                      title={t("Copy link", locale) as string}
                      style={{
                        backgroundColor: "#f59e42",
                        color: "#ffffff",
                      }}>
                      <FaShareFromSquare size={20} />
                    </button>
                     <div className="me-2 ">{t("Share", locale)}</div>
                  </div>

                </div>
                <div className="other-info">
                  <div className="info-item mb-2">
                    <FiClock size={18} />{" "}
                    {locale === "en"
                      ? coach.data.data[0].hour.name.en
                      : coach.data.data[0].hour.name.id}{" "}
                  </div>
                  <div className="info-item mb-2">
                    <FiUsers size={18} />{" "}
                    {locale === "en"
                      ? coach.data.data[0].client.name.en
                      : coach.data.data[0].client.name.id}
                  </div>
                  <div className="info-item mb-2">
                    <FaChalkboardTeacher size={18} />{" "}
                    {coach.data.data[0].profile_methods.map(
                      (value: any, index: number) => (
                        <span key={uuidv4()}>
                          {index > 0 && ", "}
                          {locale === "en"
                            ? value.method.name.en
                            : value.method.name.id}
                        </span>
                      )
                    )}
                  </div>

                  <div className="info-item my-4 client-type">
                    <div className="font-weight-bold mb-1">
                      {t("Client Type", locale)}
                    </div>
                    <ul>
                      {coach.data.data[0].profile_client_types.map(
                        (value: any, index: number) => (
                          <li key={uuidv4()}>
                            {locale === "en"
                              ? value.client_type.name.en
                              : value.client_type.name.id}
                          </li>
                        )
                      )}


                    </ul>
                  </div>
                  <div className="info-item specialist">
                    <div className="font-weight-bold mb-1">
                      {t("Specialities", locale)}
                    </div>
                    {coach.data.data[0].profile_specialities.map(
                      (value: any, index: number) => (
                        <button key={uuidv4()} className="badge rounded-pill">
                          {locale === "en"
                            ? value.speciality.name.en
                            : value.speciality.name.id}
                        </button>
                      )
                    )}
                  </div>

                  <div className="info-item fee">
                    <div className="font-weight-bold mb-1">
                      {t("Fee / Hour", locale)}
                    </div>
                    {coach.data.data[0].profile_prices.map(
                      (value: any, index: number) => (
                        <div key={uuidv4()}>
                          {locale === "en"
                            ? value.price.name.en
                            : value.price.name.id}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {coach.data.data[0].contact.linkedin !== undefined ||
                coach.data.data[0].contact.instagram !== undefined ||
                coach.data.data[0].contact.tiktok !== undefined ||
                coach.data.data[0].contact.facebook !== undefined ||
                coach.data.data[0].contact.phone !== undefined ||
                coach.data.data[0].contact.email !== undefined ? (
                  <div className="contact mb-4">
                    <div className="font-weight-bold mb-2">
                      {t("Social Media", locale)}
                    </div>
                    <div>
                      {coach.data.data[0].contact.linkedin !== undefined &&
                      coach.data.data[0].contact.linkedin !== "" ? (
                        <a
                          href={coach.data.data[0].contact.linkedin}
                          target="_blank"
                        >
                          <FaLinkedin size={24} />
                        </a>
                      ) : (
                        ""
                      )}
                      {coach.data.data[0].contact.instagram !== undefined &&
                      coach.data.data[0].contact.instagram !== "" ? (
                        <a
                          href={coach.data.data[0].contact.instagram}
                          target="_blank"
                        >
                          <FaSquareInstagram size={24} />
                        </a>
                      ) : (
                        ""
                      )}
                      {coach.data.data[0].contact.tiktok !== undefined &&
                      coach.data.data[0].contact.tiktok !== "" ? (
                        <a
                          href={coach.data.data[0].contact.tiktok}
                          target="_blank"
                        >
                          <FaTiktok size={24} />
                        </a>
                      ) : (
                        ""
                      )}
                      {coach.data.data[0].contact.facebook !== undefined &&
                      coach.data.data[0].contact.facebook !== "" ? (
                        <a
                          href={coach.data.data[0].contact.facebook}
                          target="_blank"
                        >
                          <FaFacebook size={24} />
                        </a>
                      ) : (
                        ""
                      )}
                      {/* {coach.data.data[0].contact.phone &&
                        (() => {
                          let phoneNumber =
                            coach.data.data[0].contact.phone.replace(
                              /[^0-9]/g,
                              ""
                            );
                          if (phoneNumber.startsWith("0")) {
                            phoneNumber = "62" + phoneNumber.substring(1);
                          }
                          return (
                            <a
                              href={`https://wa.me/${phoneNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaWhatsapp size={24} />
                            </a>
                          );
                        })()} */}
                      {coach.data.data[0].contact.email !== undefined &&
                      coach.data.data[0].contact.email !== "" ? (
                        <a href={"mailto:" + coach.data.data[0].contact.email}>
                          <MdEmail size={24} />{" "}
                        </a>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}

              </div>
              <div className="">
                  <a href={"https://wa.me/6285770916736?text=Halo%20Admin%20Samaloop,%0ASaya%20mau%20bertanya%20tentang%20layanan%20coaching."} target="_blank" rel="noopener noreferrer" 
                  className="w-100 btn"
                    style={{
                      backgroundColor: "#f59e42",
                      //borderColor: "#000000",
                      color: "#ffffff",
                    }}
                  >
                    {t("Contact Us", locale)}
                  </a>
                </div>
            </div>
            
            <div className="col-12 col-md-9 ps-4">
              {/* <div className="subtitle">{coach.data.data[0].profession}</div> */}
              <div className="d-flex flex-wrap column-gap-2 row-gap-0 justify-content-center justify-content-md-start" >
                 {coach.data.data[0].profile_specialities.map(
                      (value: any, index: number) => (
                        <div key={uuidv4()} className="subtitle">
                          {locale === "en"
                            ? value.speciality.name.en
                            : value.speciality.name.id}{" Coach, "}
                        </div>
                      )
                    )}
              </div>
              <div className="text mb-5">{coach.data.data[0].profession}</div>
                  

              <div
                className="text mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    locale === "en"
                      ? coach.data.data[0].description.en
                      : coach.data.data[0].description.id,
                }}
              />
              <div className="subtitle mb-4">
                {t("Other Credentials", locale)}
              </div>
              <div className="text mb-4">
                <ul>
                  {coach.data.data[0].profile_other_credentials.map(
                    (value: any, index: number) => (
                      <li key={uuidv4()}>
                        {value.credential.name} ({value.credential.abbreviation}
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