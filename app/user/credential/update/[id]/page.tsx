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

export default function BusinessTypesCreate({
  params,
}: Readonly<{ params: { id: string } }>) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/credentials/detail/" + params.id, fetcher);

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
          href: "/user/credential",
          title: "Credentials",
        },
        {
          href: "/user/credential/update/" + params.id,
          title: "Update",
        },
      ]);

      setMounted(true);
    }
  }, [mounted, data]);

  type input = {
    name: any;
    abbreviation: any;
    type: any;
    logo: any;
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
      const logoCurrent: any = data.data.data[0].logo;
      if (input.logo.length > 0) {
        const { data }: any = await supabase.storage
          .from("credentials")
          .upload(Date.now() + ".jpeg", input.logo[0]);

        const getPublicUrl: any = supabase.storage
          .from("credentials")
          .getPublicUrl(data.path);

        input.logo = getPublicUrl.data.publicUrl;

        if (logoCurrent !== null) {
          const path = logoCurrent.split("credentials/");

          if (path[1] !== undefined) {
            await supabase.storage.from("credentials").remove([path[1]]);
          }
        }
      } else {
        input.logo = logoCurrent;
      }

      await axios.post("/api/credentials/update/" + params.id, input);

      const update = await axios.get("/api/credentials/list");
      mutate("/api/credentials/list", update.data);

      const update2 = await axios.get("/api/credentials/detail/" + params.id);
      mutate("/api/credentials/detail/" + params.id, update2.data);

      router.push("/user/credential");

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
      <PageHeading heading="Update Credentials" />
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
                    Credential is not found.
                  </Container>
                );
              } else {
                return (
                  <form onSubmit={handleSubmit(onSubmit)}>
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
                      <Form.Label>
                        Abbreviation <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Abbreviation"
                        required
                        {...register("abbreviation", { required: true })}
                        defaultValue={data.data.data[0].abbreviation}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Type"
                        required
                        {...register("type", { required: true })}
                        defaultValue={data.data.data[0].type}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Logo</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Logo"
                        {...register("logo")}
                      />
                      {data.data.data[0].logo !== null && (
                        <img
                          className="mt-2"
                          src={data.data.data[0].logo}
                          width={100}
                        />
                      )}
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
