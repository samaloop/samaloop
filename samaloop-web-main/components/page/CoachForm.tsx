"use client";
import { t, generateSlug } from "@/helper/helper";
import { useLocale } from "@/context/LocaleContext";
import useSWR from "swr";
import axios from "axios";
import Cropper, { Area } from "react-easy-crop";
import React, { useState, useEffect, useCallback, useRef } from "react";
import getCroppedImg from "@/helper/cropImage";
import dynamic from "next/dynamic";
const MyCKEditor = dynamic(() => import("@/components/CKEditor"), {
  ssr: false,
});
import Select from "react-select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Swal from "sweetalert2";

export default function CoachForm() {
  const { locale } = useLocale();
  const supabase = createClientComponentClient();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999, // Custom z-index for the dropdown menu
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999, // Custom z-index for the menu portal if used
    }),
  };

  const [name, setName]: any = useState("");
  const [phone, setPhone]: any = useState("");
  const [email, setEmail]: any = useState("");
  const [profession, setProfession]: any = useState("");
  const [linkedin, setLinkedin]: any = useState("");
  const [instagram, setInstagram]: any = useState("");
  const [tiktok, setTiktok]: any = useState("");
  const [facebook, setFacebook]: any = useState("");

  const textChange = (name: string, e: any) => {
    if (name === "name") {
      setName(e.target.value);
    } else if (name === "phone") {
      setPhone(e.target.value);
    } else if (name === "email") {
      setEmail(e.target.value);
    } else if (name === "profession") {
      setProfession(e.target.value);
    } else if (name === "linkedin") {
      setLinkedin(e.target.value);
    } else if (name === "instagram") {
      setInstagram(e.target.value);
    } else if (name === "tiktok") {
      setTiktok(e.target.value);
    } else if (name === "facebook") {
      setFacebook(e.target.value);
    }
  };

  const genders = useSWR("/api/genders", fetcher);
  const [gendersOption, setGendersOption]: any = useState(null);
  useEffect(() => {
    if (genders.data !== undefined && gendersOption === null) {
      let gendersOptionCurrent: any = [];
      for (const [index, value] of genders.data.data.entries()) {
        gendersOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === genders.data.data.length - 1) {
          setGendersOption(gendersOptionCurrent);
        }
      }
    }
  }, [genders, gendersOption, locale]);
  const [gendersSelected, setGendersSelected]: any = useState("");
  const gendersChange = (selected: any) => {
    setGendersSelected(selected);
  };

  const ages = useSWR("/api/ages", fetcher);
  const [agesOption, setAgesOption]: any = useState(null);
  useEffect(() => {
    if (ages.data !== undefined && agesOption === null) {
      let agesOptionCurrent: any = [];
      for (const [index, value] of ages.data.data.entries()) {
        agesOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === ages.data.data.length - 1) {
          setAgesOption(agesOptionCurrent);
        }
      }
    }
  }, [ages, agesOption, locale]);
  const [agesSelected, setAgesSelected]: any = useState("");
  const agesChange = (selected: any) => {
    setAgesSelected(selected);
  };

  const credentials = useSWR("/api/credentials", fetcher);
  const [credentialsOption, setCredentialsOption]: any = useState(null);
  useEffect(() => {
    if (credentials.data !== undefined && credentialsOption === null) {
      let credentialsOptionCurrent: any = [];
      for (const [index, value] of credentials.data.data.entries()) {
        credentialsOptionCurrent.push({
          value: value.id,
          label: value.name,
        });

        if (index === credentials.data.data.length - 1) {
          setCredentialsOption(credentialsOptionCurrent);
        }
      }
    }
  }, [credentials, credentialsOption, locale]);
  const [credentialsSelected, setCredentialsSelected]: any = useState("");
  const credentialsChange = (selected: any) => {
    setCredentialsSelected(selected);
  };
  const [otherCredentialsSelected, setOtherCredentialsSelected]: any =
    useState("");
  const otherCredentialsChange = (selected: any) => {
    setOtherCredentialsSelected(selected);
  };

  const specialities = useSWR("/api/specialities", fetcher);
  const [specialitiesOption, setSpecialitiesOption]: any = useState(null);
  useEffect(() => {
    if (specialities.data !== undefined && specialitiesOption === null) {
      let specialitiesOptionCurrent: any = [];
      for (const [index, value] of specialities.data.data.entries()) {
        specialitiesOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === specialities.data.data.length - 1) {
          setSpecialitiesOption(specialitiesOptionCurrent);
        }
      }
    }
  }, [specialities, specialitiesOption, locale]);
  const [specialitiesSelected, setSpecialitiesSelected]: any = useState("");
  const specialitiesChange = (selected: any) => {
    setSpecialitiesSelected(selected);
  };

  const methods = useSWR("/api/methods", fetcher);
  const [methodsOption, setMethodsOption]: any = useState(null);
  useEffect(() => {
    if (methods.data !== undefined && methodsOption === null) {
      let methodsOptionCurrent: any = [];
      for (const [index, value] of methods.data.data.entries()) {
        methodsOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === methods.data.data.length - 1) {
          setMethodsOption(methodsOptionCurrent);
        }
      }
    }
  }, [methods, methodsOption, locale]);
  const [methodsSelected, setMethodsSelected]: any = useState("");
  const methodsChange = (selected: any) => {
    setMethodsSelected(selected);
  };

  const hours = useSWR("/api/hours", fetcher);
  const [hoursOption, setHoursOption]: any = useState(null);
  useEffect(() => {
    if (hours.data !== undefined && hoursOption === null) {
      let hoursOptionCurrent: any = [];
      for (const [index, value] of hours.data.data.entries()) {
        hoursOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === hours.data.data.length - 1) {
          setHoursOption(hoursOptionCurrent);
        }
      }
    }
  }, [hours, hoursOption, locale]);
  const [hoursSelected, setHoursSelected]: any = useState("");
  const hoursChange = (selected: any) => {
    setHoursSelected(selected);
  };

  const years = useSWR("/api/years", fetcher);
  const [yearsOption, setYearsOption]: any = useState(null);
  useEffect(() => {
    if (years.data !== undefined && yearsOption === null) {
      let yearsOptionCurrent: any = [];
      for (const [index, value] of years.data.data.entries()) {
        yearsOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === years.data.data.length - 1) {
          setYearsOption(yearsOptionCurrent);
        }
      }
    }
  }, [years, yearsOption, locale]);
  const [yearsSelected, setYearsSelected]: any = useState("");
  const yearsChange = (selected: any) => {
    setYearsSelected(selected);
  };

  const clients = useSWR("/api/clients", fetcher);
  const [clientsOption, setClientsOption]: any = useState(null);
  useEffect(() => {
    if (clients.data !== undefined && clientsOption === null) {
      let clientsOptionCurrent: any = [];
      for (const [index, value] of clients.data.data.entries()) {
        clientsOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === clients.data.data.length - 1) {
          setClientsOption(clientsOptionCurrent);
        }
      }
    }
  }, [clients, clientsOption, locale]);
  const [clientsSelected, setClientsSelected]: any = useState("");
  const clientsChange = (selected: any) => {
    setClientsSelected(selected);
  };

  const clientTypes = useSWR("/api/client-types", fetcher);
  const [clientTypesOption, setClientTypesOption]: any = useState(null);
  useEffect(() => {
    if (clientTypes.data !== undefined && clientTypesOption === null) {
      let clientTypesOptionCurrent: any = [];
      for (const [index, value] of clientTypes.data.data.entries()) {
        clientTypesOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === clientTypes.data.data.length - 1) {
          setClientTypesOption(clientTypesOptionCurrent);
        }
      }
    }
  }, [clientTypes, clientTypesOption, locale]);
  const [clientTypesSelected, setClientTypesSelected]: any = useState("");
  const clientTypesChange = (selected: any) => {
    setClientTypesSelected(selected);
  };

  const prices = useSWR("/api/prices", fetcher);
  const [pricesOption, setPricesOption]: any = useState(null);
  useEffect(() => {
    if (prices.data !== undefined && pricesOption === null) {
      let pricesOptionCurrent: any = [];
      for (const [index, value] of prices.data.data.entries()) {
        pricesOptionCurrent.push({
          value: value.id,
          label: locale === "en" ? value.name.en : value.name.id,
        });

        if (index === prices.data.data.length - 1) {
          setPricesOption(pricesOptionCurrent);
        }
      }
    }
  }, [prices, pricesOption, locale]);
  const [pricesSelected, setPricesSelected]: any = useState("");
  const pricesChange = (selected: any) => {
    setPricesSelected(selected);
  };

  const cropModalTriggerRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc]: any = useState<string | undefined>(undefined);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage]: any = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const saveCroppedImage = useCallback(async () => {
    if (imageSrc && croppedArea) {
      try {
        const croppedImg = await getCroppedImg(imageSrc, croppedArea);
        setCroppedImage(croppedImg);
        if (cropModalTriggerRef.current) {
          cropModalTriggerRef.current.click();
        }
      } catch (e) {
        console.error("Failed to crop image", e);
      }
    }
  }, [imageSrc, croppedArea]);

  const handlePhotoChange = (e: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      if (cropModalTriggerRef.current) {
        cropModalTriggerRef.current.click();
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const [awards, setAwards]: any = useState("");
  const awardsChange = (data: string) => {
    setAwards(data);
  };

  const [awardsEn, setAwardsEn]: any = useState("");
  const awardsEnChange = (data: string) => {
    setAwardsEn(data);
  };

  const [descriptionId, setDescriptionId] = useState<string>("");
  const descriptionIdChange = (data: string) => {
    setDescriptionId(data);
  };

  const [descriptionEn, setDescriptionEn] = useState<string>("");
  const descriptionEnChange = (data: string) => {
    setDescriptionEn(data);
  };

  const formSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      Swal.fire({
        title: "Please Wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let slug: any = generateSlug(name);

      const slugLatest: any = await supabase
        .from("profiles")
        .select("slug")
        .ilike("slug", "%" + slug + "%")
        .order("created_at", { ascending: false })
        .range(0, 1);
      if (slugLatest.data.length > 0) {
        slug = slugLatest.data[0].slug.split("-");
        const index = parseInt(slug[slug.length - 1]);
        if (isNaN(index)) {
          slug = slugLatest.data[0].slug + "-2";
        } else {
          slug[slug.length - 1] = index + 1;
          slug = slug.join("-");
        }
      }

      const { data }: any = await supabase.storage
        .from("coachs")
        .upload(Date.now() + ".jpeg", croppedImage.blob);
      let photo = supabase.storage.from("coachs").getPublicUrl(data.path);

      const profiles: any = await supabase
        .from("profiles")
        .insert([
          {
            slug: slug,
            name: name,
            credential: credentialsSelected.value,
            photo: photo.data.publicUrl,
            profession: profession,
            description: {
              id: descriptionId,
              en: descriptionEn,
            },
            awards: awards,
            hour: hoursSelected.value,
            year: yearsSelected.value,
            client: clientsSelected.value,
            // price: pricesSelected.value,
            contact: {
              phone: phone,
              email: email,
              linkedin: linkedin,
              instagram: instagram,
              tiktok: tiktok,
              facebook: facebook,
            },
            gender: gendersSelected.value,
            age: agesSelected.value,
            awards_en: awardsEn,
          },
        ])
        .select("id");

      if (otherCredentialsSelected.length > 0) {
        for (const value of otherCredentialsSelected) {
          await supabase.from("profile_other_credentials").insert([
            {
              profile: profiles.data[0].id,
              credential: value.value,
            },
          ]);
        }
      }

      for (const value of clientTypesSelected) {
        await supabase.from("profile_client_types").insert([
          {
            profile: profiles.data[0].id,
            client_type: value.value,
          },
        ]);
      }

      for (const value of pricesSelected) {
        await supabase.from("profile_prices").insert([
          {
            profile: profiles.data[0].id,
            price: value.value,
          },
        ]);
      }

      if (methodsSelected !== "") {
        await supabase.from("profile_methods").insert([
          {
            profile: profiles.data[0].id,
            method: methodsSelected.value,
          },
        ]);
      }

      for (const value of specialitiesSelected) {
        await supabase.from("profile_specialities").insert([
          {
            profile: profiles.data[0].id,
            speciality: value.value,
          },
        ]);
      }

      setName("");
      setGendersSelected("");
      setAgesSelected("");
      setPhone("");
      setEmail("");
      setProfession("");
      setCredentialsSelected("");
      setSpecialitiesSelected("");
      setMethodsSelected("");
      setHoursSelected("");
      setYearsSelected("");
      setClientsSelected("");
      setClientTypesSelected("");
      setPricesSelected("");
      setAwards("");
      setAwardsEn("");
      setDescriptionId("");
      setDescriptionEn("");

      window.scrollTo({ top: 0, behavior: "smooth" });

      Swal.fire({
        icon: "success",
        text: t("Thank you for filling out your Coach Information.", locale),
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } catch (e) {
      console.log(e);
      Swal.close();
    }
  };

  return (
    <div className="container mt-4">
      <div
        style={{ visibility: "hidden" }}
        ref={cropModalTriggerRef}
        data-bs-toggle="modal"
        data-bs-target="#cropModal"
      />
      <div
        className="modal fade"
        id="cropModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="cropContainer">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="text-center mt-4">
                <button onClick={saveCroppedImage} className="btn btn-profile">
                  {t("Save", locale)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={formSubmit}>
        <h2>{t("Coach Profile Information", locale)}</h2>
        <hr />
        <h5 className="mb-3">{t("Personal Information", locale)}</h5>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            {t(
              "What is your full name as you’d like it to appear on your profile?",
              locale
            )}{" "}
            <small className="text-danger">*</small>
          </label>
          <input
            onChange={(e) => textChange("name", e)}
            required
            type="text"
            className="form-control"
            id="name"
            placeholder={t("Full Name", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="genders" className="form-label">
            {t(
              "What is your gender, as you’d like it to be displayed on your profile?",
              locale
            )}
          </label>
          <Select
            id="genders"
            className="react-select"
            value={gendersSelected}
            onChange={gendersChange}
            options={gendersOption}
            isDisabled={gendersOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ages" className="form-label">
            {t("Could you please provide your age for your profile?", locale)}
          </label>
          <Select
            id="ages"
            className="react-select"
            value={agesSelected}
            onChange={agesChange}
            options={agesOption}
            isDisabled={agesOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            {t("Please provide your phone number", locale)}{" "}
            <small className="text-danger">*</small>
          </label>
          <input
            onChange={(e) => textChange("phone", e)}
            required
            type="number"
            className="form-control"
            id="phone"
            placeholder={t("Phone Number", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            {t("Please provide your email address", locale)}{" "}
            <small className="text-danger">*</small>
          </label>
          <input
            onChange={(e) => textChange("email", e)}
            required
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="profession" className="form-label">
            {t(
              "Please provide your current profession or job title for your profile",
              locale
            )}
          </label>
          <input
            onChange={(e) => textChange("profession", e)}
            type="text"
            className="form-control"
            id="profession"
            placeholder={t("Profession or Job Title", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">
            {t(
              "Please provide a profile picture you’d like to feature on your coaching profile",
              locale
            )}{" "}
            <small className="text-danger">*</small>
          </label>
          <input
            onChange={(e) => handlePhotoChange(e)}
            type="file"
            className="form-control"
            id="photo"
            accept="image/*"
          />
          {croppedImage && (
            <div className="croppedImageContainer mt-2">
              <img src={croppedImage.url} alt="Cropped Avatar" />
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="linkedin" className="form-label">
            {t(
              "Please provide your Linkedin account link for your profile",
              locale
            )}
          </label>
          <input
            onChange={(e) => textChange("linkedin", e)}
            type="text"
            className="form-control"
            id="linkedin"
            placeholder={t("Linkedin account link", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="instagram" className="form-label">
            {t(
              "Please provide your Instagram account link for your profile",
              locale
            )}
          </label>
          <input
            onChange={(e) => textChange("instagram", e)}
            type="text"
            className="form-control"
            id="instagram"
            placeholder={t("Instagram account link", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tiktok" className="form-label">
            {t(
              "Please provide your Tiktok account link for your profile",
              locale
            )}
          </label>
          <input
            onChange={(e) => textChange("tiktok", e)}
            type="text"
            className="form-control"
            id="tiktok"
            placeholder={t("Tiktok account link", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="facebook" className="form-label">
            {t(
              "Please provide your Facebook account link for your profile",
              locale
            )}
          </label>
          <input
            onChange={(e) => textChange("facebook", e)}
            type="text"
            className="form-control"
            id="facebook"
            placeholder={t("Facebook account link", locale)}
          />
        </div>
        <hr />
        <h5 className="mb-3">{t("Coaching Information", locale)}</h5>
        <div className="mb-3">
          <label htmlFor="credentials" className="form-label">
            {t(
              "What certifications or credentials do you hold as a coach?",
              locale
            )}
          </label>
          <Select
            id="credentials"
            className="react-select"
            value={credentialsSelected}
            onChange={credentialsChange}
            options={credentialsOption}
            isDisabled={credentialsOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="specialities" className="form-label">
            {t(
              "What are your coaching specialties or areas of expertise?",
              locale
            )}
          </label>
          <Select
            id="specialities"
            className="react-select"
            isMulti
            value={specialitiesSelected}
            onChange={specialitiesChange}
            options={specialitiesOption}
            isDisabled={specialitiesOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="methods" className="form-label">
            {t(
              "Do you offer coaching sessions online, offline, or a combination of both (hybrid)?",
              locale
            )}
          </label>
          <Select
            id="methods"
            className="react-select"
            value={methodsSelected}
            onChange={methodsChange}
            options={methodsOption}
            isDisabled={methodsOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="hours" className="form-label">
            {t(
              "How many total hours of coaching experience do you have?",
              locale
            )}
          </label>
          <Select
            id="hours"
            className="react-select"
            value={hoursSelected}
            onChange={hoursChange}
            options={hoursOption}
            isDisabled={hoursOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="years" className="form-label">
            {t(
              "How long have you been working as a professional coach?",
              locale
            )}
          </label>
          <Select
            id="years"
            className="react-select"
            value={yearsSelected}
            onChange={yearsChange}
            options={yearsOption}
            isDisabled={yearsOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clients" className="form-label">
            {t("How many clients have you coached in total?", locale)}
          </label>
          <Select
            id="clients"
            className="react-select"
            value={clientsSelected}
            onChange={clientsChange}
            options={clientsOption}
            isDisabled={clientsOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clientTypes" className="form-label">
            {t("What types of clients do you typically work with?", locale)}
          </label>
          <Select
            isMulti
            id="clientTypes"
            className="react-select"
            value={clientTypesSelected}
            onChange={clientTypesChange}
            options={clientTypesOption}
            isDisabled={clientTypesOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="prices" className="form-label">
            {t(
              "What is your typical price range for coaching sessions or packages?",
              locale
            )}
          </label>
          <Select
            isMulti
            id="prices"
            className="react-select"
            value={pricesSelected}
            onChange={pricesChange}
            options={pricesOption}
            isDisabled={pricesOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="awards" className="form-label">
            {t(
              "Have you received any awards or recognition for your coaching work?",
              locale
            )}
          </label>
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className="nav-link active"
                id="indonesian-tab"
                data-bs-toggle="tab"
                data-bs-target="#indonesian1"
                type="button"
                role="tab"
              >
                {t("Indonesian", locale)}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="english-tab"
                data-bs-toggle="tab"
                data-bs-target="#english1"
                type="button"
                role="tab"
              >
                {t("English", locale)}
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="indonesian1">
              <MyCKEditor
                editorData={awards}
                onChange={(e: any) => awardsChange(e)}
              />
            </div>
            <div className="tab-pane fade" id="english1">
              <MyCKEditor
                editorData={awardsEn}
                onChange={(e: any) => awardsEnChange(e)}
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="other_credentials" className="form-label">
            {t(
              "What other certifications or credentials do you have to be featured on your profile?",
              locale
            )}
          </label>
          <Select
            id="other_credentials"
            isMulti
            className="react-select"
            value={otherCredentialsSelected}
            onChange={otherCredentialsChange}
            options={credentialsOption}
            isDisabled={credentialsOption === null}
            styles={customStyles}
            placeholder={t("Select...", locale)}
          />
        </div>
        <hr />
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            {t(
              "Provide a brief bio highlighting your background, coaching style, specialties, and how you help clients achieve their goals",
              locale
            )}
          </label>
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className="nav-link active"
                id="indonesian-tab"
                data-bs-toggle="tab"
                data-bs-target="#indonesian"
                type="button"
                role="tab"
              >
                {t("Indonesian", locale)}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                id="english-tab"
                data-bs-toggle="tab"
                data-bs-target="#english"
                type="button"
                role="tab"
              >
                {t("English", locale)}
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="indonesian">
              <MyCKEditor
                editorData={descriptionId}
                onChange={(e: any) => descriptionIdChange(e)}
              />
            </div>
            <div className="tab-pane fade" id="english">
              <MyCKEditor
                editorData={descriptionEn}
                onChange={(e: any) => descriptionEnChange(e)}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-submit btn-profile mb-5">
          {t("Submit", locale)}
        </button>
      </form>
    </div>
  );
}
