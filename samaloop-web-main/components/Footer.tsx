"use client";
import Image from "next/image";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa6";
import useSWR from "swr";
import axios from "axios";
import { useLocale } from "@/context/LocaleContext";
import { t } from "@/helper/helper";
import LocalizedLink from "@/components/LocalizedLink";

const Footer = () => {
  const { locale } = useLocale();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const info = useSWR(
    "/api/info?id=Name&id=Address&id=Linkedin&id=Instagram&id=Tiktok&id=Facebook&id=Footer",
    fetcher
  );

  return (
    <>
      {info.data !== undefined && (
        <div className="footer">
          <div className="footer-top">
            <div className="footer-top-inner">
              <div className="container">
                <div className="footer-top-left text-center">
                  <div className="logo">
                    <LocalizedLink href="/">
                      <Image
                        priority
                        src="/images/logo-white.png"
                        alt="logo-white"
                        width={300}
                        height={92}
                      />
                    </LocalizedLink>
                  </div>
                  <div className="sosmed">
                    <a
                      href={
                        info.data.data[3].data !== null
                          ? info.data.data[3].data.en
                          : "https://www.instagram.com/"
                      }
                      target="_blank"
                    >
                      <FaInstagram size={24} />
                    </a>
                    <a
                      href={
                        info.data.data[5].data !== null
                          ? info.data.data[5].data.en
                          : "https://www.facebook.com/"
                      }
                      target="_blank"
                    >
                      <FaFacebookF size={24} />
                    </a>
                    <a
                      href={
                        info.data.data[2].data !== null
                          ? info.data.data[2].data.en
                          : "https://www.linkedin.com/"
                      }
                      target="_blank"
                    >
                      <FaLinkedinIn size={24} />
                    </a>
                    <a
                      href={
                        info.data.data[4].data !== null
                          ? info.data.data[4].data.en
                          : "https://www.youtube.com/"
                      }
                      target="_blank"
                    >
                      <FaYoutube size={24} />
                    </a>
                  </div>
                </div>
                <div className="footer-top-right text-center">
                  <div className="title">
                    {info.data.data[0].data !== null &&
                      info.data.data[0].data.en}
                  </div>
                  <div
                    className="address"
                    dangerouslySetInnerHTML={{
                      __html:
                        info.data.data[1].data !== null &&
                        info.data.data[1].data.en,
                    }}
                  />
                  <div className="other-link">
                    <LocalizedLink href="/cookie-policy">
                      {t("Cookie Policy", locale)}
                    </LocalizedLink>
                    <span className="mx-2">|</span>
                    <LocalizedLink href="/privacy-policy">
                      {t("Privacy Policy", locale)}
                    </LocalizedLink>
                    <span className="mx-2">|</span>
                    <LocalizedLink href="/terms-conditions">
                      {t("Terms and Conditions", locale)}
                    </LocalizedLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="footer-bottom text-center"
            dangerouslySetInnerHTML={{
              __html:
                locale === "en"
                  ? info.data.data[6].data.en
                  : info.data.data[6].data.id,
            }}
          ></div>
        </div>
      )}
    </>
  );
};
export default Footer;
