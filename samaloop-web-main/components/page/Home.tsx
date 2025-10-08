"use client";
import Hero from "@/components/Hero";
import FormSearch from "@/components/FormSearch";
import CardCoach from "@/components/CardCoach";
import AboutUs from "@/components/AboutUs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, A11y, Navigation } from "swiper/modules";
import useSWR from "swr";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);

  const coachs = useSWR("/api/coachs/list?page=1", fetcher);
  console.log(coachs.data);

  return (
    <div className="container-fluid p-0">
      {coachs.data === undefined ? (
        <div className="p-5 text-center">
          <div className="spinner-border">
            <span className="visually-hidden">Loading...</span>
          </div>
           </div>
      ) : (
        <>
          <section id="home">
            <Hero />
          </section>
          
          <section id="form-search" />
          <FormSearch />

          <div className="container container-swiper my-5">
            <div className="swiper-button-prev-custom"></div>
            <div className="swiper-button-next-custom"></div>
            <Swiper
              className="pb-5"
              modules={[Pagination, Scrollbar, A11y, Navigation]}
              spaceBetween={60}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 60,
                },
                640: {
                  slidesPerView: 1,
                  spaceBetween: 60,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 60,
                },
              }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
            >
              {coachs.data.data.map((value: any, index: number) => (
                <SwiperSlide key={uuidv4()}>
                  <CardCoach coach={value} />
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
          <section id="about-us" />
          <AboutUs />
        </>
      )}
    </div>
  );
}
