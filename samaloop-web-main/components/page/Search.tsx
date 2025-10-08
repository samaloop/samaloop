"use client";
import { GoHome } from "react-icons/go";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CardCoach from "@/components/CardCoach";
import { t } from "@/helper/helper";
import LocalizedLink from "@/components/LocalizedLink";
import { useLocale } from "@/context/LocaleContext";
import useSWR from "swr";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Search() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const toggleRef: any = useRef<HTMLInputElement>();

  const info = useSWR("/api/info?id=Search", fetcher);

  const methods = useSWR("/api/methods", fetcher);
  const hours = useSWR("/api/hours", fetcher);
  const clients = useSWR("/api/clients", fetcher);
  const years = useSWR("/api/years", fetcher);
  const clientTypes = useSWR("/api/client-types", fetcher);
  const specialities = useSWR("/api/specialities", fetcher);
  const prices = useSWR("/api/prices", fetcher);
  const credentials = useSWR("/api/credentials", fetcher);

  const [keyword, setKeyword]: any = useState(
    searchParams.get("keyword") !== null ? searchParams.get("keyword") : ""
  );
  const [methodsActive, setMethodsActive]: any = useState([]);
  const [hoursActive, setHoursActive]: any = useState([]);
  const [clientsActive, setClientsActive]: any = useState([]);
  const [yearsActive, setYearsActive]: any = useState([]);
  const [clientTypesActive, setClientTypesActive]: any = useState([]);
  const [specialitiesActive, setSpecialitiesActive]: any = useState(
    searchParams.get("specialities") !== null
      ? searchParams.get("specialities")?.split(",")
      : []
  );
  const [pricesActive, setPricesActive]: any = useState([]);
  const [credentialsActive, setCredentialsActive]: any = useState([]);

  const [page, setPage] = useState(1);
  const changePage = (page: any) => {
    setPage(page);
  };

  const [queryParams, setQueryParams]: any = useState({
    page: page,
    keyword: keyword,
    specialities: specialitiesActive,
  });

  useEffect(() => {
    changeFilter();
  }, [page]);

  useEffect(() => {
    setPage(1);

    let keywordCurrenct:any = searchParams.get("keyword") !== null ? searchParams.get("keyword") : "";
    setKeyword(keywordCurrenct);
    setSpecialitiesActive(
      searchParams.get("specialities") !== null
        ? searchParams.get("specialities")?.split(",")
        : []
    );

    changeFilter(keywordCurrenct);
  }, [searchParams]);

  const coachs = useSWR(
    `/api/coachs/list?${new URLSearchParams(queryParams).toString()}`,
    fetcher
  );

  const handleChangeKeyword = (e: any) => {
    setKeyword(e.target.value);
  };

  const handleMethodsToggle = (Id: string) => {
    let methodsActiveCurrent: any = [...methodsActive];
    if (methodsActiveCurrent.indexOf(Id) > -1) {
      methodsActiveCurrent.splice(methodsActiveCurrent.indexOf(Id), 1);
    } else {
      methodsActiveCurrent.push(Id);
    }
    setMethodsActive(methodsActiveCurrent);
  };

  const handleHoursToggle = (Id: string) => {
    let hoursActiveCurrent: any = [...hoursActive];
    if (hoursActiveCurrent.indexOf(Id) > -1) {
      hoursActiveCurrent.splice(hoursActiveCurrent.indexOf(Id), 1);
    } else {
      hoursActiveCurrent.push(Id);
    }
    setHoursActive(hoursActiveCurrent);
  };

  const handleClientsToggle = (Id: string) => {
    let clientsActiveCurrent: any = [...clientsActive];
    if (clientsActiveCurrent.indexOf(Id) > -1) {
      clientsActiveCurrent.splice(clientsActiveCurrent.indexOf(Id), 1);
    } else {
      clientsActiveCurrent.push(Id);
    }
    setClientsActive(clientsActiveCurrent);
  };

  const handleYearsToggle = (Id: string) => {
    let yearsActiveCurrent: any = [...yearsActive];
    if (yearsActiveCurrent.indexOf(Id) > -1) {
      yearsActiveCurrent.splice(yearsActiveCurrent.indexOf(Id), 1);
    } else {
      yearsActiveCurrent.push(Id);
    }
    setYearsActive(yearsActiveCurrent);
  };

  const handleClientTypesToggle = (Id: string) => {
    let clientTypesActiveCurrent: any = [...clientTypesActive];
    if (clientTypesActiveCurrent.indexOf(Id) > -1) {
      clientTypesActiveCurrent.splice(clientTypesActiveCurrent.indexOf(Id), 1);
    } else {
      clientTypesActiveCurrent.push(Id);
    }
    setClientTypesActive(clientTypesActiveCurrent);
  };

  const handleSpecialitiesToggle = (Id: string) => {
    let specialitiesActiveCurrent: any = [...specialitiesActive];
    if (specialitiesActiveCurrent.indexOf(Id) > -1) {
      specialitiesActiveCurrent.splice(
        specialitiesActiveCurrent.indexOf(Id),
        1
      );
    } else {
      specialitiesActiveCurrent.push(Id);
    }
    setSpecialitiesActive(specialitiesActiveCurrent);
  };

  const handlePricesToggle = (Id: string) => {
    let pricesActiveCurrent: any = [...pricesActive];
    if (pricesActiveCurrent.indexOf(Id) > -1) {
      pricesActiveCurrent.splice(pricesActiveCurrent.indexOf(Id), 1);
    } else {
      pricesActiveCurrent.push(Id);
    }
    setPricesActive(pricesActiveCurrent);
  };

  const handleCredentialsToggle = (Id: string) => {
    let credentialsActiveCurrent: any = [...credentialsActive];
    if (credentialsActiveCurrent.indexOf(Id) > -1) {
      credentialsActiveCurrent.splice(credentialsActiveCurrent.indexOf(Id), 1);
    } else {
      credentialsActiveCurrent.push(Id);
    }
    setCredentialsActive(credentialsActiveCurrent);
  };

  const changeFilter = (keywordCurrent?:string) => {
    setQueryParams({
      page: page,
      keyword: keywordCurrent !== undefined ? keywordCurrent : keyword,
      method: methodsActive,
      hour: hoursActive,
      client: clientsActive,
      year: yearsActive,
      clientType: clientTypesActive,
      specialities: specialitiesActive,
      price: pricesActive,
      credential: credentialsActive,
    });
    console.log('queryParams', queryParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    changeFilter();

    if (toggleRef.current) {
      toggleRef.current.click();
    }
  };

  const reset = () => {
    setKeyword("");
    setMethodsActive([]);
    setHoursActive([]);
    setClientsActive([]);
    setYearsActive([]);
    setClientTypesActive([]);
    setSpecialitiesActive([]);
    setPricesActive([]);
    setCredentialsActive([]);
  };

  return (
    <div className="page-search container mt-4">
      <div
        className="offcanvas offcanvas-bottom"
        id="offcanvasBottom"
        aria-labelledby="offcanvasBottomLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasBottomLabel">
            {t("Filter", locale)}
          </h5>
          <button className="text-reset ms-auto" onClick={reset}>
            {t("Reset", locale)}
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="btn-close text-reset d-none"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body small">
          <form onSubmit={searchSubmit} className="form-search" role="search">
            <input
              defaultValue={keyword}
              onChange={handleChangeKeyword}
              className="form-control mb-4"
              type="text"
              placeholder={t("Search", locale)}
              aria-label="Search"
            />
            <button className="btn">
              <FiSearch />
            </button>
            <div className="accordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter1-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter1-collapse"
                    aria-expanded="true"
                    aria-controls="filter1-collapse"
                  >
                    {t("Method", locale)}
                  </button>
                </h2>
                <div
                  id="filter1-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter1-heading"
                >
                  <div className="accordion-body">
                    {methods.data !== undefined &&
                      methods.data.data.map((value: any, index: number) => (
                        <div key={uuidv4()} className="form-check">
                          <input
                            checked={methodsActive.includes(value.id)}
                            onChange={() => handleMethodsToggle(value.id)}
                            className="form-check-input"
                            type="checkbox"
                            id={"methods" + index}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"methods" + index}
                          >
                            {locale === "en" ? value.name.en : value.name.id}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter2-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter2-collapse"
                    aria-expanded="true"
                    aria-controls="filter2-collapse"
                  >
                    {t("Coaching Hours", locale)}
                  </button>
                </h2>
                <div
                  id="filter2-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter2-heading"
                >
                  <div className="accordion-body">
                    {hours.data !== undefined &&
                      hours.data.data.map((value: any, index: number) => (
                        <div key={uuidv4()} className="form-check">
                          <input
                            checked={hoursActive.includes(value.id)}
                            onChange={() => handleHoursToggle(value.id)}
                            className="form-check-input"
                            type="checkbox"
                            id={"hours" + index}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"hours" + index}
                          >
                            {locale === "en" ? value.name.en : value.name.id}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter3-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter3-collapse"
                    aria-expanded="true"
                    aria-controls="filter3-collapse"
                  >
                    {t("Number of Clients", locale)}
                  </button>
                </h2>
                <div
                  id="filter3-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter3-heading"
                >
                  <div className="accordion-body">
                    {clients.data !== undefined &&
                      clients.data.data.map((value: any, index: number) => (
                        <div key={uuidv4()} className="form-check">
                          <input
                            checked={clientsActive.includes(value.id)}
                            onChange={() => handleClientsToggle(value.id)}
                            className="form-check-input"
                            type="checkbox"
                            id={"clients" + index}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"clients" + index}
                          >
                            {locale === "en" ? value.name.en : value.name.id}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter4-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter4-collapse"
                    aria-expanded="true"
                    aria-controls="filter4-collapse"
                  >
                    {t("Coaching Experience", locale)}
                  </button>
                </h2>
                <div
                  id="filter4-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter4-heading"
                >
                  <div className="accordion-body">
                    {years.data !== undefined &&
                      years.data.data.map((value: any, index: number) => (
                        <div key={uuidv4()} className="form-check">
                          <input
                            checked={yearsActive.includes(value.id)}
                            onChange={() => handleYearsToggle(value.id)}
                            className="form-check-input"
                            type="checkbox"
                            id={"years" + index}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"years" + index}
                          >
                            {locale === "en" ? value.name.en : value.name.id}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter5-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter5-collapse"
                    aria-expanded="true"
                    aria-controls="filter5-collapse"
                  >
                    {t("Client Type", locale)}
                  </button>
                </h2>
                <div
                  id="filter5-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter5-heading"
                >
                  <div className="accordion-body">
                    {clientTypes.data !== undefined &&
                      clientTypes.data.data.map((value: any, index: number) => (
                        <div key={uuidv4()} className="form-check">
                          <input
                            checked={clientTypesActive.includes(value.id)}
                            onChange={() => handleClientTypesToggle(value.id)}
                            className="form-check-input"
                            type="checkbox"
                            id={"clientTypes" + index}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"clientTypes" + index}
                          >
                            {locale === "en" ? value.name.en : value.name.id}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter6-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter6-collapse"
                    aria-expanded="true"
                    aria-controls="filter6-collapse"
                  >
                    {t("Specialities", locale)}
                  </button>
                </h2>
                <div
                  id="filter6-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter6-heading"
                >
                  <div className="accordion-body">
                    {specialities.data !== undefined &&
                      specialities.data.data.map(
                        (value: any, index: number) => (
                          <div key={uuidv4()} className="form-check">
                            <input
                              checked={specialitiesActive.includes(value.id)}
                              onChange={() =>
                                handleSpecialitiesToggle(value.id)
                              }
                              className="form-check-input"
                              type="checkbox"
                              id={"specialities" + index}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={"specialities" + index}
                            >
                              {locale === "en" ? value.name.en : value.name.id}
                            </label>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter7-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter7-collapse"
                    aria-expanded="true"
                    aria-controls="filter7-collapse"
                  >
                    {t("Price", locale)}
                  </button>
                </h2>
                <div
                  id="filter7-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter7-heading"
                >
                  <div className="accordion-body">
                    {prices.data !== undefined &&
                      prices.data.data.map((value: any, index: number) => (
                        <div key={uuidv4()} className="form-check">
                          <input
                            checked={pricesActive.includes(value.id)}
                            onChange={() => handlePricesToggle(value.id)}
                            className="form-check-input"
                            type="checkbox"
                            id={"prices" + index}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"prices" + index}
                          >
                            {locale === "en" ? value.name.en : value.name.id}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="filter8-heading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filter8-collapse"
                    aria-expanded="true"
                    aria-controls="filter8-collapse"
                  >
                    {t("Credentials", locale)}
                  </button>
                </h2>
                <div
                  id="filter8-collapse"
                  className="accordion-collapse collapse"
                  aria-labelledby="filter8-heading"
                >
                  <div className="accordion-body">
                    {credentials.data !== undefined &&
                      credentials.data.data.map((value: any, index: number) => (
                        <div key={uuidv4()} className="form-check">
                          <input
                            checked={credentialsActive.includes(value.id)}
                            onChange={() => handleCredentialsToggle(value.id)}
                            className="form-check-input"
                            type="checkbox"
                            id={"credentials" + index}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"credentials" + index}
                          >
                            {value.name} ({value.abbreviation})
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="button-submit">
              <button className="btn btn-primary" type="submit">
                Terapkan
              </button>
            </div>
          </form>
        </div>
      </div>
      {info.data === undefined || coachs.data === undefined ? (
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
                <LocalizedLink className="active" href={"/search"}>
                  {t("Find a Coach", locale)}
                </LocalizedLink>
              </li>
            </ol>
          </nav>
          <div
            className="d-flex filter-search mb-4"
            role="search"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasBottom"
          >
            <div className="form-select">
              <option>{t("Select Coach Category", locale)}</option>
            </div>
            <button className="btn" type="submit">
              <BiFilterAlt size={24} />
            </button>
          </div>
          <div className="info mb-4">
            <div className="title">{t("Select Coach Category", locale)}</div>
            <div className="subtitle">
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
          </div>
          <div className="search-result mb-4">
            {coachs.data.data.map((value: any, index: number) => (
              <CardCoach key={uuidv4()} coach={value} />
            ))}
          </div>
          {coachs.data !== undefined && coachs.data.pageTotal > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <button
                    className="page-link"
                    aria-label="Previous"
                    onClick={() => page > 1 && changePage(page - 1)}
                  >
                    <FiChevronLeft />
                  </button>
                </li>
                {Array.from({ length: coachs.data.pageTotal }).map(
                  (_, index) => (
                    <li key={uuidv4()} className="page-item">
                      <button
                        className={
                          page === index + 1 ? "page-link active" : "page-link"
                        }
                        onClick={() => changePage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
                <li className="page-item">
                  <button
                    className="page-link"
                    aria-label="Next"
                    onClick={() =>
                      page < coachs.data.pageTotal && changePage(page + 1)
                    }
                  >
                    <FiChevronRight />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
