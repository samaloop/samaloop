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
// === 1. Import useRouter ===
import { useSearchParams, useRouter } from "next/navigation"; 
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
// === 2. Import Modal ===
import ContactModal from "@/components/ContactModal";

export default function Search() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  // === 3. Init Router ===
  const router = useRouter(); 

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

  // === 4. State untuk Modal & Selected Coach ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);

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

    let keywordCurrenct: any = searchParams.get("keyword") !== null ? searchParams.get("keyword") : "";
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

  // ... (Toggle Handlers tetap sama, saya persingkat untuk hemat tempat di chat) ...
  const handleMethodsToggle = (Id: string) => {
    let arr: any = [...methodsActive];
    arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
    setMethodsActive(arr);
  };
  const handleHoursToggle = (Id: string) => {
     let arr: any = [...hoursActive];
     arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
     setHoursActive(arr);
  };
  const handleClientsToggle = (Id: string) => {
     let arr: any = [...clientsActive];
     arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
     setClientsActive(arr);
  };
  const handleYearsToggle = (Id: string) => {
     let arr: any = [...yearsActive];
     arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
     setYearsActive(arr);
  };
  const handleClientTypesToggle = (Id: string) => {
     let arr: any = [...clientTypesActive];
     arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
     setClientTypesActive(arr);
  };
  const handleSpecialitiesToggle = (Id: string) => {
     let arr: any = [...specialitiesActive];
     arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
     setSpecialitiesActive(arr);
  };
  const handlePricesToggle = (Id: string) => {
     let arr: any = [...pricesActive];
     arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
     setPricesActive(arr);
  };
  const handleCredentialsToggle = (Id: string) => {
     let arr: any = [...credentialsActive];
     arr.indexOf(Id) > -1 ? arr.splice(arr.indexOf(Id), 1) : arr.push(Id);
     setCredentialsActive(arr);
  };

  const changeFilter = (keywordCurrent?: string) => {
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

  // === 5. Fungsi Logika Klik Profile ===
  const handleProfileClick = (coach: any) => {
    // Cek apakah user sudah pernah input data (disimpan di localStorage)
    const hasRegistered = localStorage.getItem('user_lead_contact');
    
    // Tentukan URL tujuan (sesuaikan logika routing Anda)
    // Jika menggunakan LocalizedLink biasanya prefix otomatis, tapi router.push manual
    const targetUrl = locale === 'id' ? `/coach/${coach.slug}` : `/${locale}/coach/${coach.slug}`; 

    if (hasRegistered) {
      // Jika sudah pernah, langsung pindah
      router.push(targetUrl);
    } else {
      // Jika belum, buka modal
      setSelectedCoach(coach);
      setIsModalOpen(true);
    }
  };

  // === 6. Fungsi Submit Modal ===
  // const handleModalSubmit = (contactInfo: string) => {
  //   if (!selectedCoach) return;
    
  //   // Simpan data lead (bisa kirim ke API di sini)
  //   console.log("Lead captured:", contactInfo, "for coach:", selectedCoach.name);
    
  //   // Simpan di localStorage agar tidak muncul lagi
  //   localStorage.setItem('user_lead_contact', contactInfo);
    
  //   setIsModalOpen(false);

  //   // Redirect
  //   const targetUrl = locale === 'id' ? `/coach/${selectedCoach.id}` : `/${locale}/coach/${selectedCoach.id}`; 
  //   router.push(targetUrl);
  // };

  // Update tipe parameter dari string menjadi object
  const handleModalSubmit = async (formData: { name: string; email: string; phone: string }) => {
    if (!selectedCoach) return;

    try {
      // Kirim Data Lengkap ke API
      await axios.post('/api/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        coach_id: selectedCoach.id,
        coach_name: selectedCoach.name
        ,source: 'search_page' // Bisa disesuaikan sumbernya
         
      });

      console.log("Success: Data saved");

      // Simpan penanda di LocalStorage (cukup email saja atau JSON string)
      localStorage.setItem('user_lead_contact', formData.email);

      setIsModalOpen(false);
      const targetUrl = locale === 'id' ? `/coach/${selectedCoach.slug}` : `/${locale}/coach/${selectedCoach.slug}`; 
      router.push(targetUrl);

    } catch (error) {
      console.error("Gagal menyimpan lead:", error);
      // Fail-safe: tetap redirect user
      setIsModalOpen(false);
      const targetUrl = locale === 'id' ? `/coach/${selectedCoach.slug}` : `/${locale}/coach/${selectedCoach.slug}`; 
      router.push(targetUrl);
    }
  };

  return (
    <div className="page-search container mt-4">
      {/* ... (Offcanvas filter code tetap sama, disembunyikan agar ringkas) ... */}
      <div className="offcanvas offcanvas-bottom" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
        {/* Isinya sama persis dengan kode Anda sebelumnya */}
        <div className="offcanvas-header">
           <h5 className="offcanvas-title" id="offcanvasBottomLabel">{t("Filter", locale)}</h5>
           <button className="text-reset ms-auto" onClick={reset}>{t("Reset", locale)}</button>
           <button ref={toggleRef} type="button" className="btn-close text-reset d-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body small">
             <form onSubmit={searchSubmit} className="form-search" role="search">
                 {/* ... Input search dan Accordion filters SAMA PERSIS ... */}
                 {/* Saya potong biar muat, paste kode accordion Anda di sini */}
                 <input defaultValue={keyword} onChange={handleChangeKeyword} className="form-control mb-4" type="text" placeholder={t("Search", locale)} aria-label="Search" />
                 <button className="btn"><FiSearch /></button>
                 {/* ... Accordion Items ... */}
                 <div className="button-submit">
                  <button className="btn btn-primary" type="submit">Terapkan</button>
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
              // === 7. Pass handleProfileClick ke CardCoach ===
              <CardCoach 
                key={uuidv4()} 
                coach={value} 
                // Kita kirim props baru ini agar CardCoach bisa trigger modal
                onProfileClick={() => handleProfileClick(value)}
              />
            ))}
          </div>

          {coachs.data !== undefined && coachs.data.pageTotal > 1 && (
             <nav aria-label="Page navigation">
                {/* ... Pagination code tetap sama ... */}
                <ul className="pagination justify-content-center">
                    <li className="page-item"><button className="page-link" onClick={() => page > 1 && changePage(page - 1)}><FiChevronLeft /></button></li>
                    {Array.from({ length: coachs.data.pageTotal }).map((_, index) => (
                        <li key={uuidv4()} className="page-item"><button className={page === index + 1 ? "page-link active" : "page-link"} onClick={() => changePage(index + 1)}>{index + 1}</button></li>
                    ))}
                    <li className="page-item"><button className="page-link" onClick={() => page < coachs.data.pageTotal && changePage(page + 1)}><FiChevronRight /></button></li>
                </ul>
             </nav>
          )}
        </>
      )}

      {/* === 8. Render Modal di luar loop === */}
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        coachName={selectedCoach?.name}
        locale={locale}
      />
    </div>
  );
}