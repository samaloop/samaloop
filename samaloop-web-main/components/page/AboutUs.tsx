"use client";
import { GoHome } from "react-icons/go";
import AboutUs from "@/components/AboutUs";
import LocalizedLink from "@/components/LocalizedLink";
import { t } from "@/helper/helper";
import { useLocale } from "@/context/LocaleContext";

export default function AboutUsPage() {
  const { locale } = useLocale();

  return (
    <div className="page-about-us container-fluid mt-4">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <LocalizedLink href={"/"}>
                <GoHome size={20} />
              </LocalizedLink>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              <LocalizedLink className="active" href={"/about-us"}>
                {t("About Us", locale)}
              </LocalizedLink>
            </li>
          </ol>
        </nav>
      </div>
      <AboutUs />
    </div>
  );
}
