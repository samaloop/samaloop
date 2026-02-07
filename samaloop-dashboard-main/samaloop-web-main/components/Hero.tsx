"use client";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";

const Hero = () => {
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const info = useSWR("/api/info?id=Banner Home", fetcher);

  return (
    <>
      {info.data === undefined ? (
        <div className="p-5 text-center">
          <div className="spinner-border">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="ratio ratio-hero">
          <Image
            priority
            src={info.data.data[0].image}
            alt="Hero"
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      )}
    </>
  );
};
export default Hero;
