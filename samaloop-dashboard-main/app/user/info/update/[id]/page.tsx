"use client";

import { PageHeading } from "widgets";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Container,
  Spinner,
} from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";
const MyCKEditor = dynamic(() => import("@/components/CKEditor"), {
  ssr: false,
});

export default function BusinessTypesCreate({
  params,
}: Readonly<{ params: { id: string } }>) {
  const paramId = decodeURIComponent(params.id);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/info/detail/" + paramId, fetcher);

  const [dataEn, setDataEn]: any = useState("");
  const dataEnChange = (data: string) => {
    setDataEn(data);
  };

  const [dataId, setDataId]: any = useState("");
  const dataIdChange = (data: string) => {
    setDataId(data);
  };

  const { breadcrumbStore } = useBreadcrumb();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (mounted === false && data.data !== undefined) {
      breadcrumbStore([
        {
          href: "/user",
          title: "Dashboard",
        },
        {
          href: "/user/info",
          title: "Info",
        },
        {
          href: "/user/info/update/" + paramId,
          title: "Update",
        },
      ]);

      if (
        data.data.data[0].data !== null &&
        data.data.data[0].data.en !== undefined
      ) {
        setDataEn(data.data.data[0].data.en);
      }
      if (
        data.data.data[0].data !== null &&
        data.data.data[0].data.id !== undefined
      ) {
        setDataId(data.data.data[0].data.id);
      }

      setMounted(true);
    }
  }, [mounted, data]);

  type input = {
    data_en: any;
    data_id: any;
    image: any;
    data: any;
    left_image: any;
    left_info_en: any;
    left_info_id: any;
    right_header_en: any;
    right_header_id: any;
    right_feature_image1: any;
    right_feature_info_en1: any;
    right_feature_info_id1: any;
    right_feature_image2: any;
    right_feature_info_en2: any;
    right_feature_info_id2: any;
    right_feature_image3: any;
    right_feature_info_en3: any;
    right_feature_info_id3: any;
    right_footer_title_en: any;
    right_footer_title_id: any;
    right_footer_body_en: any;
    right_footer_body_id: any;
  };

  const { register, handleSubmit } = useForm<input>();
  const onSubmit: SubmitHandler<input> = async (input) => {
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
      if (
        paramId === "Name" ||
        paramId === "Linkedin" ||
        paramId === "Instagram" ||
        paramId === "Tiktok" ||
        paramId === "Facebook" ||
        paramId === "Search"
      ) {
        await axios.post("/api/info/update/" + paramId, input);
      } else if (
        paramId === "Address" ||
        paramId === "Cookie Policy" ||
        paramId === "Privacy Policy" ||
        paramId === "Terms and Conditions" ||
        paramId === "Footer"
      ) {
        input.data_en = dataEn;
        input.data_id = dataId;
        await axios.post("/api/info/update/" + paramId, input);
      } else if (paramId === "Banner Home") {
        const logoCurrent: any = data.data.data[0].image;
        if (input.image.length > 0) {
          const { data }: any = await supabase.storage
            .from("banners")
            .upload(Date.now() + ".jpeg", input.image[0]);

          const getPublicUrl: any = supabase.storage
            .from("banners")
            .getPublicUrl(data.path);

          input.image = getPublicUrl.data.publicUrl;

          if (logoCurrent !== null) {
            const path = logoCurrent.split("banners/");

            if (path[1] !== undefined) {
              await supabase.storage.from("banners").remove([path[1]]);
            }
          }
          await axios.post("/api/info/update/" + paramId, input);
        } else {
          input.image = logoCurrent;
        }
      } else if (paramId === "About Us") {
        input.data = {
          left: {
            image: data.data.data[0].data.left.image,
            info: {
              en: input.left_info_en,
              id: input.left_info_id,
            },
          },
          right: {
            header: {
              en: input.right_header_en,
              id: input.right_header_id,
            },
            feature: [
              {
                image: data.data.data[0].data.right.feature[0].image,
                info: {
                  en: input.right_feature_info_en1,
                  id: input.right_feature_info_id1,
                },
              },
              {
                image: data.data.data[0].data.right.feature[1].image,
                info: {
                  en: input.right_feature_info_en2,
                  id: input.right_feature_info_id2,
                },
              },
              {
                image: data.data.data[0].data.right.feature[2].image,
                info: {
                  en: input.right_feature_info_en3,
                  id: input.right_feature_info_id3,
                },
              },
            ],
            footer: {
              title: {
                en: input.right_footer_title_en,
                id: input.right_footer_title_id,
              },
              body: {
                en: input.right_footer_body_en,
                id: input.right_footer_body_id,
              },
            },
          },
        };

        const leftImage: any = data.data.data[0].data.left.image;
        if (input.left_image.length > 0) {
          const { data }: any = await supabase.storage
            .from("banners")
            .upload(Date.now() + ".jpeg", input.left_image[0]);

          const getPublicUrl: any = supabase.storage
            .from("banners")
            .getPublicUrl(data.path);

          input.data.left.image = getPublicUrl.data.publicUrl;

          if (leftImage !== null) {
            const path = leftImage.split("banners/");

            if (path[1] !== undefined) {
              await supabase.storage.from("banners").remove([path[1]]);
            }
          }
        }

        const rightFeatureImage1: any =
          data.data.data[0].data.right.feature[0].image;
        if (input.right_feature_image1.length > 0) {
          const { data }: any = await supabase.storage
            .from("banners")
            .upload(Date.now() + ".jpeg", input.right_feature_image1[0]);

          const getPublicUrl: any = supabase.storage
            .from("banners")
            .getPublicUrl(data.path);

          input.data.right.feature[0].image = getPublicUrl.data.publicUrl;

          if (rightFeatureImage1 !== null) {
            const path = rightFeatureImage1.split("banners/");

            if (path[1] !== undefined) {
              await supabase.storage.from("banners").remove([path[1]]);
            }
          }
        }

        const rightFeatureImage2: any =
          data.data.data[0].data.right.feature[1].image;
        if (input.right_feature_image2.length > 0) {
          const { data }: any = await supabase.storage
            .from("banners")
            .upload(Date.now() + ".jpeg", input.right_feature_image2[0]);

          const getPublicUrl: any = supabase.storage
            .from("banners")
            .getPublicUrl(data.path);

          input.data.right.feature[1].image = getPublicUrl.data.publicUrl;

          if (rightFeatureImage2 !== null) {
            const path = rightFeatureImage2.split("banners/");

            if (path[1] !== undefined) {
              await supabase.storage.from("banners").remove([path[1]]);
            }
          }
        }

        const rightFeatureImage3: any =
          data.data.data[0].data.right.feature[2].image;
        if (input.right_feature_image1.length > 0) {
          const { data }: any = await supabase.storage
            .from("banners")
            .upload(Date.now() + ".jpeg", input.right_feature_image3[0]);

          const getPublicUrl: any = supabase.storage
            .from("banners")
            .getPublicUrl(data.path);

          input.data.right.feature[2].image = getPublicUrl.data.publicUrl;

          if (rightFeatureImage3 !== null) {
            const path = rightFeatureImage3.split("banners/");

            if (path[1] !== undefined) {
              await supabase.storage.from("banners").remove([path[1]]);
            }
          }
        }

        await axios.post("/api/info/update/" + paramId, input);
      }

      const update = await axios.get("/api/info/list");
      mutate("/api/info/list", update.data);

      const update2 = await axios.get("/api/info/detail/" + paramId);
      mutate("/api/info/detail/" + paramId, update2.data);

      router.push("/user/info");

      Swal.close();
    } catch (err: any) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: err.response.data.error,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };

  return (
    <Row>
      <PageHeading heading="Update Info" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            {(() => {
              if (data.data === undefined) {
                return (
                  <Container className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </Container>
                );
              } else if (data.data.data.length === 0) {
                return (
                  <Container className="text-center">
                    Info is not found.
                  </Container>
                );
              } else {
                return (
                  <>
                    {paramId === "Name" ||
                    paramId === "Linkedin" ||
                    paramId === "Instagram" ||
                    paramId === "Tiktok" ||
                    paramId === "Facebook" ||
                    paramId === "Search" ? (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            English <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="English"
                            required
                            {...register("data_en", { required: true })}
                            defaultValue={data.data.data[0].data.en}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Indonesia <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Indonesia"
                            required
                            {...register("data_id", { required: true })}
                            defaultValue={data.data.data[0].data.id}
                          />
                        </Form.Group>
                        <div className="text-end mt-4">
                          <Button variant="primary" type="submit">
                            Update
                          </Button>
                        </div>
                      </form>
                    ) : paramId === "Address" ||
                      paramId === "Cookie Policy" ||
                      paramId === "Privacy Policy" ||
                      paramId === "Terms and Conditions" ||
                      paramId === "Footer" ? (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            English <span className="text-danger">*</span>
                          </Form.Label>
                          <MyCKEditor
                            editorData={dataEn}
                            onChange={(e: any) => dataEnChange(e)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Indonesia <span className="text-danger">*</span>
                          </Form.Label>
                          <MyCKEditor
                            editorData={dataId}
                            onChange={(e: any) => dataIdChange(e)}
                          />
                        </Form.Group>
                        <div className="text-end mt-4">
                          <Button variant="primary" type="submit">
                            Update
                          </Button>
                        </div>
                      </form>
                    ) : paramId === "Banner Home" ? (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Image <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="file"
                            placeholder="Image"
                            required
                            {...register("image", { required: true })}
                          />
                          {data.data.data[0].image !== null && (
                            <img
                              className="mt-2"
                              src={data.data.data[0].image}
                              width={200}
                            />
                          )}
                        </Form.Group>
                        <div className="text-end mt-4">
                          <Button variant="primary" type="submit">
                            Update
                          </Button>
                        </div>
                      </form>
                    ) : paramId === "About Us" ? (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                          <Form.Label>Left Image</Form.Label>
                          <Form.Control
                            type="file"
                            placeholder="Left Image"
                            {...register("left_image")}
                          />
                          {data.data.data[0].data.left.image !== null && (
                            <img
                              className="mt-2"
                              src={data.data.data[0].data.left.image}
                              width={100}
                            />
                          )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Left Info English
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Left Info English"
                            required
                            {...register("left_info_en", { required: true })}
                            defaultValue={data.data.data[0].data.left.info.en}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Left Info Indonesia
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Left Info Indonesia"
                            required
                            {...register("left_info_id", { required: true })}
                            defaultValue={data.data.data[0].data.left.info.id}
                          />
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Header English
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Header English"
                            required
                            {...register("right_header_en", { required: true })}
                            defaultValue={data.data.data[0].data.left.info.en}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Header Indonesia
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Header Indonesia"
                            required
                            {...register("right_header_id", { required: true })}
                            defaultValue={data.data.data[0].data.left.info.id}
                          />
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                          <Form.Label>Right Feature Image 1</Form.Label>
                          <Form.Control
                            type="file"
                            placeholder="Right Feature Image 1"
                            {...register("right_feature_image1")}
                          />
                          {data.data.data[0].data.right.feature[0].image !==
                            null && (
                            <img
                              className="mt-2"
                              src={
                                data.data.data[0].data.right.feature[0].image
                              }
                              width={50}
                            />
                          )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Feature Info English 1
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Feature Info English 1"
                            required
                            {...register("right_feature_info_en1", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.feature[0].info.en
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Feature Info Indonesia 1
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Feature Info Indonesia 1"
                            required
                            {...register("right_feature_info_id1", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.feature[0].info.en
                            }
                          />
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                          <Form.Label>Right Feature Image 2</Form.Label>
                          <Form.Control
                            type="file"
                            placeholder="Right Feature Image 2"
                            {...register("right_feature_image2")}
                          />
                          {data.data.data[0].data.right.feature[1].image !==
                            null && (
                            <img
                              className="mt-2"
                              src={
                                data.data.data[0].data.right.feature[1].image
                              }
                              width={50}
                            />
                          )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Feature Info English 2
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Feature Info English 2"
                            required
                            {...register("right_feature_info_en2", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.feature[1].info.en
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Feature Info Indonesia 2
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Feature Info Indonesia 2"
                            required
                            {...register("right_feature_info_id2", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.feature[1].info.en
                            }
                          />
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                          <Form.Label>Right Feature Image 3</Form.Label>
                          <Form.Control
                            type="file"
                            placeholder="Right Feature Image 3"
                            {...register("right_feature_image3")}
                          />
                          {data.data.data[0].data.right.feature[2].image !==
                            null && (
                            <img
                              className="mt-2"
                              src={
                                data.data.data[0].data.right.feature[2].image
                              }
                              width={50}
                            />
                          )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Feature Info English 3
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Feature Info English 3"
                            required
                            {...register("right_feature_info_en3", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.feature[2].info.en
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Feature Info Indonesia 3
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Feature Info Indonesia 3"
                            required
                            {...register("right_feature_info_id3", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.feature[2].info.en
                            }
                          />
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Footer Title English
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Footer Title English"
                            required
                            {...register("right_footer_title_en", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.footer.title.en
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Footer Title Indonesia
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Footer Title Indonesia"
                            required
                            {...register("right_footer_title_id", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.footer.title.id
                            }
                          />
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Footer Body English
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Footer Body English"
                            required
                            {...register("right_footer_body_en", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.footer.body.en
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Right Footer Body Indonesia
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Right Footer Body Indonesia"
                            required
                            {...register("right_footer_body_id", {
                              required: true,
                            })}
                            defaultValue={
                              data.data.data[0].data.right.footer.body.id
                            }
                          />
                        </Form.Group>
                        <div className="text-end mt-4">
                          <Button variant="primary" type="submit">
                            Update
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <></>
                    )}
                  </>
                );
              }
            })()}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
