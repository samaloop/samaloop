"use client";
import Image from "next/image";
import { FiSearch, FiMenu } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { t } from "@/helper/helper";
import LocalizedLink from "@/components/LocalizedLink";
import { GB as Uk, ID as Id } from "country-flag-icons/react/3x2";

const Header = () => {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toggleRef: any = useRef<HTMLInputElement>();
  const navbarCollapseRef: any = useRef<HTMLInputElement>();
  const [activeSection, setActiveSection] = useState("");

  const handleScroll = () => {
    const sections = document.querySelectorAll("section");
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (
        sectionTop < window.innerHeight / 2 &&
        sectionTop > -section.offsetHeight / 2
      ) {
        currentSection = section.getAttribute("id") ?? "";
      }
    });

    setActiveSection(currentSection);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggle = () => {
    if (
      toggleRef.current &&
      navbarCollapseRef.current.classList.contains("show")
    ) {
      toggleRef.current.click();
    }
  };

  const [keyword, setKeyword]: any = useState(
    searchParams.get("keyword") !== null ? searchParams.get("keyword") : ""
  );
  const handleChangeKeyword = (e: any) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    setKeyword(
      searchParams.get("keyword") !== null ? searchParams.get("keyword") : ""
    );
  }, [searchParams]);

  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = {
      keyword: keyword,
    };

    const searchParams = new URLSearchParams(queryParams).toString();

    if (locale === "en") {
      router.push(`/en/search?${searchParams}`);
    } else {
      router.push(`/search?${searchParams}`);
    }
  };

  const languageSwitcher = async (value: string) => {
    if (value === "id" && pathname.includes("/en")) {
      router.push(
        pathname.replace("/en", "") === "" ? "/" : pathname.replace("/en", "")
      );
    } else if (value === "en" && !pathname.includes("/en")) {
      router.push("/en" + pathname);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top">
      <div className="container">
        <LocalizedLink href={"/"} className="navbar-brand">
          <Image
            priority
            src="/images/logo.png"
            alt="Logo"
            width={160}
            height={50}
          />
        </LocalizedLink>
        {pathname !== "/en/coach-form" && pathname !== "/coach-form" ? (
          <>
            <button
              ref={toggleRef}
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <FiMenu size={48} />
            </button>
            <div
              ref={navbarCollapseRef}
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-lg-5 me-auto mb-2 mb-lg-0">
                <li className="nav-item me-3">
                  <LocalizedLink
                    onClick={handleToggle}
                    href="/"
                    className={
                      (locale === "en" && pathname === "/en") ||
                      (locale === "id" && pathname === "/")
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    {t("Home", locale)}
                  </LocalizedLink>
                </li>
                <li className="nav-item me-3">
                  <LocalizedLink
                    onClick={handleToggle}
                    href="/search"
                    className={
                      (locale === "en" && pathname === "/en/search") ||
                      (locale === "id" && pathname === "/search")
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    {t("Find a Coach", locale)}
                  </LocalizedLink>
                </li>
                <li className="nav-item">
                  <LocalizedLink
                    onClick={handleToggle}
                    href="/about-us"
                    className={
                      (locale === "en" && pathname === "/en/about-us") ||
                      (locale === "id" && pathname === "/about-us")
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    {t("About Us", locale)}
                  </LocalizedLink>
                </li>
              </ul>
              <form
                onSubmit={searchSubmit}
                className="d-flex form-search"
                role="search"
              >
                <input
                  defaultValue={keyword}
                  onChange={handleChangeKeyword}
                  className="form-control"
                  type="search"
                  placeholder={t("Search", locale)}
                  aria-label="Search"
                />
                <button className="btn" type="submit">
                  <FiSearch />
                </button>
              </form>
              <div className="language">
                <Id
                  title="Bahasa Indonesia"
                  className={
                    locale === "id" ? "language-item active" : "language-item"
                  }
                  onClick={() => languageSwitcher("id")}
                  style={{ width: "39px", height: "26px" }}
                />
                <span className="language-sep mx-2" />
                <Uk
                  title="English"
                  className={
                    locale === "en" ? "language-item active" : "language-item"
                  }
                  onClick={() => languageSwitcher("en")}
                  style={{ width: "39px", height: "26px" }}
                />
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
};
export default Header;
