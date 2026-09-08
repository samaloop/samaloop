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
import { generateSlug } from "@/helper/helper";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CompanyUpdate({
  params,
}: Readonly<{ params: { id: string } }>) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/companies/detail/" + params.id, fetcher);

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
          href: "/user/companies",
          title: "Companies",
        },
        {
          href: "/user/companies/update/" + params.id,
          title: "Update",
        },
      ]);

      setMounted(true);
    }
  }, [mounted, data]);

  type input = {
    slug: any;
    name: any;
    logo: any;
    button_text: any;
    button_link: any;
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
        (input.button_text !== "" && input.button_link === "") ||
        (input.button_text === "" && input.button_link !== "")
      ) {
        Swal.fire({
          icon: "error",
          text: "Button Text dan Button Link harus diisi berdua, atau dikosongkan berdua.",
          confirmButtonText: "OK",
        });
        return;
      }

      const logoCurrent: any = data.data.data[0].logo;
      if (input.logo.length > 0) {
        const { data: uploaded, error: uploadError }: any =
          await supabase.storage
            .from("companies")
            .upload(Date.now() + ".jpeg", input.logo[0]);

        if (uploadError) {
          throw new Error(
            "Gagal upload logo: " +
              uploadError.message +
              ". Pastikan storage bucket \"companies\" (public) sudah dibuat di Supabase."
          );
        }

        const getPublicUrl: any = supabase.storage
          .from("companies")
          .getPublicUrl(uploaded.path);

        input.logo = getPublicUrl.data.publicUrl;

        if (logoCurrent !== null) {
          const path = logoCurrent.split("companies/");
          if (path[1] !== undefined) {
            await supabase.storage.from("companies").remove([path[1]]);
          }
        }
      } else {
        input.logo = logoCurrent;
      }

      input.slug = generateSlug(input.slug);

      await axios.post("/api/companies/update/" + params.id, input);

      const update = await axios.get("/api/companies/list");
      mutate("/api/companies/list", update.data);

      const update2 = await axios.get("/api/companies/detail/" + params.id);
      mutate("/api/companies/detail/" + params.id, update2.data);

      router.push("/user/companies");

      Swal.close();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        text: err.response?.data?.error || err.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };

  return (
    <Row>
      <PageHeading heading="Update Company" />
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
              } else if (data.data.error) {
                return (
                  <Container className="text-center text-danger">
                    Gagal memuat data: {data.data.error.message}
                  </Container>
                );
              } else if (data.data.data.length === 0) {
                return (
                  <Container className="text-center">
                    Company is not found.
                  </Container>
                );
              } else {
                return (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Slug <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="mis. pln"
                        required
                        {...register("slug", { required: true })}
                        defaultValue={data.data.data[0].slug}
                      />
                      <Form.Text className="text-muted">
                        Dipakai di URL /search/company/[slug]. Huruf kecil,
                        tanpa spasi.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        required
                        {...register("name", { required: true })}
                        defaultValue={data.data.data[0].name}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        placeholder="Logo"
                        {...register("logo")}
                      />
                      <Form.Text className="text-muted">
                        Opsional. Ditampilkan di header halaman
                        /search/company/[slug] menggantikan logo Samaloop.
                        Kalau kosong, otomatis pakai logo Samaloop default.
                      </Form.Text>
                      {data.data.data[0].logo !== null && (
                        <img
                          className="mt-2 d-block"
                          src={data.data.data[0].logo}
                          width={100}
                          alt="Logo"
                        />
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Button Text</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="mis. Hubungi Tim PLN"
                        {...register("button_text")}
                        defaultValue={data.data.data[0].button_text || ""}
                      />
                      <Form.Text className="text-muted">
                        Opsional. Kalau diisi (bersama Button Link di
                        bawah), tombol ini akan menggantikan tombol
                        &quot;Hubungi Admin&quot; di halaman coach untuk
                        company ini.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Button Link</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="mis. https://wa.me/6281234567890"
                        {...register("button_link")}
                        defaultValue={data.data.data[0].button_link || ""}
                      />
                      <Form.Text className="text-muted">
                        URL tujuan tombol di atas (link WhatsApp, form,
                        dsb).
                      </Form.Text>
                    </Form.Group>
                    <div className="text-end mt-4">
                      <Button variant="primary" type="submit">
                        Update
                      </Button>
                    </div>
                  </form>
                );
              }
            })()}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
