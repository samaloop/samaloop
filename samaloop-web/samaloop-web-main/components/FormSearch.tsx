"use client";
import { BiSearchAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { t } from "@/helper/helper";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";

const FormSearch = () => {
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const info = useSWR("/api/info?id=Search", fetcher);

  const { locale } = useLocale();
  const router = useRouter();

  const [keyword, setKeyword]: any = useState("");
  const handleChangeKeyword = (e: any) => {
    setKeyword(e.target.value);
  };

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

  return (
    <div className="container">
      <div className="card card-search">
        <div className="card-body">
          <div className="card-search-inner">
            <div className="title text-center mt-2 mb-2">
              {t("Find a Coach", locale)}
            </div>
            <div className="subtitle text-center mb-4">
              {info.data !== undefined ? (
                <>
                  {locale === "en"
                    ? info.data.data[0].data.en
                    : info.data.data[0].data.id}
                </>
              ) : (
                "-"
              )}
            </div>
            <form
              onSubmit={searchSubmit}
              className="d-flex form-search mb-4"
              role="search"
            >
              <input
                defaultValue={keyword}
                onChange={handleChangeKeyword}
                className="form-control"
                placeholder={t("Find Your Preferred Coach", locale)}
                aria-label="Search"
              />
              <button className="btn" type="submit">
                <BiSearchAlt />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormSearch;
