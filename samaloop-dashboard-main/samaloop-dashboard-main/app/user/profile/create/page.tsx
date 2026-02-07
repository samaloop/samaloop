"use client";

import { PageHeading } from "widgets";
import { Col, Row, Card, Button, Modal, Tab, Tabs } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import useSWR, { mutate } from "swr";
import { generateSlug } from "@/helper/helper";
import Cropper, { Area } from "react-easy-crop";
import React, { useState, useEffect, useCallback } from "react";
import getCroppedImg from "@/helper/cropImage";
import dynamic from "next/dynamic";
const MyCKEditor = dynamic(() => import("@/components/CKEditor"), {
  ssr: false,
});
import Select from "react-select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function BusinessTypesCreate({
  params,
}: Readonly<{ params: { id: string } }>) {
  const supabase = createClientComponentClient();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const router = useRouter();

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

  const { breadcrumbStore } = useBreadcrumb();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (mounted === false) {
      breadcrumbStore([
        {
          href: "/user",
          title: "Dashboard",
        },
        {
          href: "/user/profile",
          title: "Coach",
        },
        {
          href: "/user/profile/create",
          title: "Create",
        },
      ]);

      setMounted(true);
    }
  }, [mounted]);

  const [modalShow, setModalShow] = useState(false);
  const handleClose = () => setModalShow(false);

  const [name, setName]: any = useState("");
  const [slug, setSlug]: any = useState("");
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
    } else if (name === "slug") {
      setSlug(e.target.value);
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

  const genders = useSWR("/api/genders/list", fetcher);
  const [gendersOption, setGendersOption]: any = useState(null);
  useEffect(() => {
    if (genders.data !== undefined && gendersOption === null) {
      let gendersOptionCurrent: any = [];
      for (const [index, value] of genders.data.data.entries()) {
        gendersOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === genders.data.data.length - 1) {
          setGendersOption(gendersOptionCurrent);
        }
      }
    }
  }, [genders]);
  const [gendersSelected, setGendersSelected]: any = useState("");
  const gendersChange = (selected: any) => {
    setGendersSelected(selected);
  };

  const ages = useSWR("/api/ages/list", fetcher);
  const [agesOption, setAgesOption]: any = useState(null);
  useEffect(() => {
    if (ages.data !== undefined && agesOption === null) {
      let agesOptionCurrent: any = [];
      for (const [index, value] of ages.data.data.entries()) {
        agesOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === ages.data.data.length - 1) {
          setAgesOption(agesOptionCurrent);
        }
      }
    }
  }, [ages]);
  const [agesSelected, setAgesSelected]: any = useState("");
  const agesChange = (selected: any) => {
    setAgesSelected(selected);
  };

  const credentials = useSWR("/api/credentials/list", fetcher);
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
  }, [credentials]);
  const [credentialsSelected, setCredentialsSelected]: any = useState("");
  const credentialsChange = (selected: any) => {
    setCredentialsSelected(selected);
  };
  const [otherCredentialsSelected, setOtherCredentialsSelected]: any =
    useState("");
  const otherCredentialsChange = (selected: any) => {
    setOtherCredentialsSelected(selected);
  };

  const specialities = useSWR("/api/specialities/list", fetcher);
  const [specialitiesOption, setSpecialitiesOption]: any = useState(null);
  useEffect(() => {
    if (specialities.data !== undefined && specialitiesOption === null) {
      let specialitiesOptionCurrent: any = [];
      for (const [index, value] of specialities.data.data.entries()) {
        specialitiesOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === specialities.data.data.length - 1) {
          setSpecialitiesOption(specialitiesOptionCurrent);
        }
      }
    }
  }, [specialities]);
  const [specialitiesSelected, setSpecialitiesSelected]: any = useState("");
  const specialitiesChange = (selected: any) => {
    setSpecialitiesSelected(selected);
  };

  const methods = useSWR("/api/methods/list", fetcher);
  const [methodsOption, setMethodsOption]: any = useState(null);
  useEffect(() => {
    if (methods.data !== undefined && methodsOption === null) {
      let methodsOptionCurrent: any = [];
      for (const [index, value] of methods.data.data.entries()) {
        methodsOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === methods.data.data.length - 1) {
          setMethodsOption(methodsOptionCurrent);
        }
      }
    }
  }, [methods]);
  const [methodsSelected, setMethodsSelected]: any = useState("");
  const methodsChange = (selected: any) => {
    setMethodsSelected(selected);
  };

  const hours = useSWR("/api/hours/list", fetcher);
  const [hoursOption, setHoursOption]: any = useState(null);
  useEffect(() => {
    if (hours.data !== undefined && hoursOption === null) {
      let hoursOptionCurrent: any = [];
      for (const [index, value] of hours.data.data.entries()) {
        hoursOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === hours.data.data.length - 1) {
          setHoursOption(hoursOptionCurrent);
        }
      }
    }
  }, [hours]);
  const [hoursSelected, setHoursSelected]: any = useState("");
  const hoursChange = (selected: any) => {
    setHoursSelected(selected);
  };

  const years = useSWR("/api/years/list", fetcher);
  const [yearsOption, setYearsOption]: any = useState(null);
  useEffect(() => {
    if (years.data !== undefined && yearsOption === null) {
      let yearsOptionCurrent: any = [];
      for (const [index, value] of years.data.data.entries()) {
        yearsOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === years.data.data.length - 1) {
          setYearsOption(yearsOptionCurrent);
        }
      }
    }
  }, [years]);
  const [yearsSelected, setYearsSelected]: any = useState("");
  const yearsChange = (selected: any) => {
    setYearsSelected(selected);
  };

  const clients = useSWR("/api/clients/list", fetcher);
  const [clientsOption, setClientsOption]: any = useState(null);
  useEffect(() => {
    if (clients.data !== undefined && clientsOption === null) {
      let clientsOptionCurrent: any = [];
      for (const [index, value] of clients.data.data.entries()) {
        clientsOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === clients.data.data.length - 1) {
          setClientsOption(clientsOptionCurrent);
        }
      }
    }
  }, [clients]);
  const [clientsSelected, setClientsSelected]: any = useState("");
  const clientsChange = (selected: any) => {
    setClientsSelected(selected);
  };

  const clientTypes = useSWR("/api/client-types/list", fetcher);
  const [clientTypesOption, setClientTypesOption]: any = useState(null);
  useEffect(() => {
    if (clientTypes.data !== undefined && clientTypesOption === null) {
      let clientTypesOptionCurrent: any = [];
      for (const [index, value] of clientTypes.data.data.entries()) {
        clientTypesOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === clientTypes.data.data.length - 1) {
          setClientTypesOption(clientTypesOptionCurrent);
        }
      }
    }
  }, [clientTypes]);
  const [clientTypesSelected, setClientTypesSelected]: any = useState("");
  const clientTypesChange = (selected: any) => {
    setClientTypesSelected(selected);
  };

  const prices = useSWR("/api/prices/list", fetcher);
  const [pricesOption, setPricesOption]: any = useState(null);
  useEffect(() => {
    if (prices.data !== undefined && pricesOption === null) {
      let pricesOptionCurrent: any = [];
      for (const [index, value] of prices.data.data.entries()) {
        pricesOptionCurrent.push({
          value: value.id,
          label: value.name.en,
        });

        if (index === prices.data.data.length - 1) {
          setPricesOption(pricesOptionCurrent);
        }
      }
    }
  }, [prices]);
  const [pricesSelected, setPricesSelected]: any = useState("");
  const pricesChange = (selected: any) => {
    setPricesSelected(selected);
  };

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
        setModalShow(false);
      } catch (e) {
        console.error("Failed to crop image", e);
      }
    }
  }, [imageSrc, croppedArea]);

  const handlePhotoChange = (e: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setModalShow(true);
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
    Swal.fire({
      title: "Please Wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
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

      if (slug === "") {
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

        setSlug(slug);
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

      const update = await axios.get("/api/profile/list?page=1");
      mutate("/api/profile/list?page=1", update.data);

      const dashboard = await axios.get("/api/dashboard");
      mutate("/api/dashboard", dashboard.data);

      router.push("/user/profile");

      Swal.close();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        text: err.response.data.error.code,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };

  return (
    <Row>
      <PageHeading heading="Create Coach" />
      <Modal show={modalShow} onHide={handleClose}>
        <Modal.Body>
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
            <button onClick={saveCroppedImage} className="btn btn-primary">
              Save
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <form onSubmit={formSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name <small className="text-danger">*</small>
                </label>
                <input
                  onChange={(e) => textChange("name", e)}
                  required
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Full Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Slug
                </label>
                <input
                  onChange={(e) => textChange("slug", e)}
                  type="text"
                  className="form-control"
                  id="slug"
                  placeholder="Slug"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="genders" className="form-label">
                  Gender
                </label>
                <Select
                  id="genders"
                  className="react-select"
                  value={gendersSelected}
                  onChange={gendersChange}
                  options={gendersOption}
                  isDisabled={gendersOption === null}
                  styles={customStyles}
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ages" className="form-label">
                  Age
                </label>
                <Select
                  id="ages"
                  className="react-select"
                  value={agesSelected}
                  onChange={agesChange}
                  options={agesOption}
                  isDisabled={agesOption === null}
                  styles={customStyles}
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone <small className="text-danger">*</small>
                </label>
                <input
                  onChange={(e) => textChange("phone", e)}
                  required
                  type="number"
                  className="form-control"
                  id="phone"
                  placeholder="Phone"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <small className="text-danger">*</small>
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
                  Profession
                </label>
                <input
                  onChange={(e) => textChange("profession", e)}
                  type="text"
                  className="form-control"
                  id="profession"
                  placeholder="Profession"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="photo" className="form-label">
                  Photo <small className="text-danger">*</small>
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
                  Linkedin
                </label>
                <input
                  onChange={(e) => textChange("linkedin", e)}
                  type="text"
                  className="form-control"
                  id="linkedin"
                  placeholder="Linkedin"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="instagram" className="form-label">
                  Instagram
                </label>
                <input
                  onChange={(e) => textChange("instagram", e)}
                  type="text"
                  className="form-control"
                  id="instagram"
                  placeholder="Instagram"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tiktok" className="form-label">
                  Tiktok
                </label>
                <input
                  onChange={(e) => textChange("tiktok", e)}
                  type="text"
                  className="form-control"
                  id="tiktok"
                  placeholder="Tiktok"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="facebook" className="form-label">
                  Facebook
                </label>
                <input
                  onChange={(e) => textChange("facebook", e)}
                  type="text"
                  className="form-control"
                  id="facebook"
                  placeholder="Facebook"
                />
              </div>
              <hr />
              <div className="mb-3">
                <label htmlFor="credentials" className="form-label">
                  Credentials
                </label>
                <Select
                  id="credentials"
                  className="react-select"
                  value={credentialsSelected}
                  onChange={credentialsChange}
                  options={credentialsOption}
                  isDisabled={credentialsOption === null}
                  styles={customStyles}
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="specialities" className="form-label">
                  Specialities
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
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="methods" className="form-label">
                  Methods
                </label>
                <Select
                  id="methods"
                  className="react-select"
                  value={methodsSelected}
                  onChange={methodsChange}
                  options={methodsOption}
                  isDisabled={methodsOption === null}
                  styles={customStyles}
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="hours" className="form-label">
                  Hours
                </label>
                <Select
                  id="hours"
                  className="react-select"
                  value={hoursSelected}
                  onChange={hoursChange}
                  options={hoursOption}
                  isDisabled={hoursOption === null}
                  styles={customStyles}
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="years" className="form-label">
                  Years
                </label>
                <Select
                  id="years"
                  className="react-select"
                  value={yearsSelected}
                  onChange={yearsChange}
                  options={yearsOption}
                  isDisabled={yearsOption === null}
                  styles={customStyles}
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="clients" className="form-label">
                  Clients
                </label>
                <Select
                  id="clients"
                  className="react-select"
                  value={clientsSelected}
                  onChange={clientsChange}
                  options={clientsOption}
                  isDisabled={clientsOption === null}
                  styles={customStyles}
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="clientTypes" className="form-label">
                  Client Types
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
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="prices" className="form-label">
                  Prices
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
                  placeholder="Select..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="awards" className="form-label">
                  Awards
                </label>
                <Tabs defaultActiveKey="indonesian" className="mb-3">
                  <Tab eventKey="indonesian1" title="Indonesian">
                    <MyCKEditor
                      editorData={awards}
                      onChange={(e: any) => awardsChange(e)}
                    />
                  </Tab>
                  <Tab eventKey="english1" title="English">
                    <MyCKEditor
                      editorData={awardsEn}
                      onChange={(e: any) => awardsEnChange(e)}
                    />
                  </Tab>
                </Tabs>
              </div>
              <div className="mb-3">
                <label htmlFor="other_credentials" className="form-label">
                  Other Credentials
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
                  placeholder="Select..."
                />
              </div>
              <hr />
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <Tabs defaultActiveKey="indonesian" className="mb-3">
                  <Tab eventKey="indonesian" title="Indonesian">
                    <MyCKEditor
                      editorData={descriptionId}
                      onChange={(e: any) => descriptionIdChange(e)}
                    />
                  </Tab>
                  <Tab eventKey="english" title="English">
                    <MyCKEditor
                      editorData={descriptionEn}
                      onChange={(e: any) => descriptionEnChange(e)}
                    />
                  </Tab>
                </Tabs>
              </div>
              <div className="text-end mt-4">
                <Button variant="primary" type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
