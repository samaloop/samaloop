"use client";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { t } from "@/helper/helper";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";

const AboutUs = () => {
  const { locale } = useLocale();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const info = useSWR("/api/info?id=About Us", fetcher);

  return (
    <>
      {info.data !== undefined && (
        <div className="about-us p-lg-4 p-1">
          <div className="container mt-5 mb-4">
            <div className="row">
              <div className="col-lg-5 col-12 about-left mb-3 mb-lg-0">
                <Image
                  src={info.data.data[0].data.left.image}
                  alt="About Us"
                  layout="responsive"
                  width={926}
                  height={571}
                />
                <div className="info mt-2 text-center">
                  {locale === "en"
                    ? '"' + info.data.data[0].data.left.info.en + '"'
                    : '"' + info.data.data[0].data.left.info.id + '"'}
                </div>
              </div>
              <div className="col-lg-7 col-12 about-right">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={300}
                  height={92}
                  className="d-block mx-auto logo"
                />
                <div className="header text-center mt-3">
                  {locale === "en"
                    ? info.data.data[0].data.right.header.en
                    : info.data.data[0].data.right.header.id}
                </div>
                <div className="feature mt-3">
                  {info.data.data[0].data.right.feature.map(
                    (value: any, index: number) => (
                      <div
                        className="feature-item mb-3"
                        key={"feature" + index}
                      >
                        <div className="row">
                          <div className="col-2 col-md-1">
                            <Image
                              src={value.image}
                              alt="Icon"
                              width={40}
                              height={40}
                              className="d-block mx-auto"
                            />
                          </div>
                          <div className="col-10 col-md-11">
                            {locale === "en" ? value.info.en : value.info.id}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="footer text-center mt-5">
                <div className="title mb-3">
                  {locale === "en"
                    ? info.data.data[0].data.right.footer.title.en
                    : info.data.data[0].data.right.footer.title.id}
                </div>
                <div className="body mb-3">
                  {locale === "en"
                    ? info.data.data[0].data.right.footer.body.en
                    : info.data.data[0].data.right.footer.body.id}
                </div>
                <Link href="/search">
                  <div className="btn-white">{t("Find a Coach", locale)}</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AboutUs;
