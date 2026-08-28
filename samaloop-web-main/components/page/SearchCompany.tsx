"use client";
import CardCoachCompany from "@/components/CardCoachCompany";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SearchCompany = ({ slug }: { slug: string }) => {
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);

  const [page, setPage] = useState(1);
  const changePage = (page: any) => {
    setPage(page);
  };

  const coachs = useSWR(
    `/api/coachs/list?company=${encodeURIComponent(slug)}&page=${page}`,
    fetcher
  );

  return (
    <div className="page-search container mt-4">
      {coachs.data === undefined ? (
        <div className="p-5 text-center">
          <div className="spinner-border">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : coachs.data.data.length === 0 ? (
        <div className="p-5 text-center">
          <p className="mb-0">Tidak ada coach yang ditemukan untuk perusahaan ini.</p>
        </div>
      ) : (
        <>
          <div className="company-coach-header mb-4">
            <div className="title">
              Daftar Coach{" "}
              <span>{coachs.data.data[0].company?.name ?? slug}</span>
            </div>
            <div className="accent-bar" />
            <div className="subtitle">
              {coachs.data.count} coach siap mendampingi perjalanan coaching
              Anda
            </div>
          </div>
          <div className="search-result mb-4">
            {coachs.data.data.map((value: any) => (
              <CardCoachCompany key={uuidv4()} coach={value} />
            ))}
          </div>
          {coachs.data.pageTotal > 1 && (
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
};

export default SearchCompany;
