"use client";
import { useState } from "react"; // Tambah useState
import { useRouter } from "next/navigation"; // Tambah useRouter
import { useLocale } from "@/context/LocaleContext"; // Tambah useLocale
import Hero from "@/components/Hero";
import FormSearch from "@/components/FormSearch";
import CardCoach from "@/components/CardCoach";
import AboutUs from "@/components/AboutUs";
import ContactModal from "@/components/ContactModal"; // Import Modal
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, A11y, Navigation } from "swiper/modules";
import useSWR from "swr";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  // === 1. Setup Hooks & State ===
  const router = useRouter();
  const { locale } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);

  const coachs = useSWR("/api/coachs/list?page=1", fetcher);
  
  // === 2. Logic Klik Profile (Sama seperti di Search) ===
  const handleProfileClick = (coach: any) => {
    // Cek LocalStorage
    const hasRegistered = localStorage.getItem('user_lead_contact');
    
    // Tentukan URL tujuan
    const targetUrl = locale === 'id' ? `/coach/${coach.slug}` : `/${locale}/coach/${coach.slug}`; 

    if (hasRegistered) {
      // Jika sudah pernah isi, langsung redirect
      router.push(targetUrl);
    } else {
      // Jika belum, buka modal
      setSelectedCoach(coach);
      setIsModalOpen(true);
    }
  };

  // === 3. Logic Submit Modal (API Route Style) ===
  const handleModalSubmit = async (formData: { name: string; email: string; phone: string }) => {
    if (!selectedCoach) return;

    try {
      // Kirim ke API Leads
      await axios.post('/api/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        coach_id: selectedCoach.id,
        coach_name: selectedCoach.name
      });

      // Simpan penanda di LocalStorage
      localStorage.setItem('user_lead_contact', formData.email);

      // Tutup & Redirect
      setIsModalOpen(false);
      const targetUrl = locale === 'id' ? `/coach/${selectedCoach.slug}` : `/${locale}/coach/${selectedCoach.slug}`; 
      router.push(targetUrl);

    } catch (error) {
      console.error("Gagal menyimpan lead:", error);
      // Fail-safe redirect
      setIsModalOpen(false);
      const targetUrl = locale === 'id' ? `/coach/${selectedCoach.slug}` : `/${locale}/coach/${selectedCoach.slug}`; 
      router.push(targetUrl);
    }
  };

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
                320: { slidesPerView: 1, spaceBetween: 60 },
                640: { slidesPerView: 1, spaceBetween: 60 },
                768: { slidesPerView: 3, spaceBetween: 60 },
              }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
            >
              {coachs.data.data.map((value: any, index: number) => (
                <SwiperSlide key={uuidv4()}>
                  {/* === 4. Pasang Prop onProfileClick === */}
                  <CardCoach 
                    coach={value} 
                    onProfileClick={() => handleProfileClick(value)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          <section id="about-us" />
          <AboutUs />

          {/* === 5. Render Modal di luar layout === */}
          <ContactModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            coachName={selectedCoach?.name}
            locale={locale}
          />
        </>
      )}
    </div>
  );
}