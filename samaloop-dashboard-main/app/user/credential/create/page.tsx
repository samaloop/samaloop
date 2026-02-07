"use client";

import { PageHeading } from "widgets";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import { mutate } from "swr";
import { useState, useEffect } from "react";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function BusinessTypesCreate() {
  const supabase = createClientComponentClient();
  const router = useRouter();

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
          href: "/user/credential",
          title: "Credentials",
        },
        {
          href: "/user/credential/create",
          title: "Create",
        },
      ]);

      setMounted(true);
    }
  }, [mounted]);

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
      if (input.logo.length > 0) {
        const { data }: any = await supabase.storage
          .from("credentials")
          .upload(Date.now() + ".jpeg", input.logo[0]);

        const getPublicUrl: any = supabase.storage
          .from("credentials")
          .getPublicUrl(data.path);

        input.logo = getPublicUrl.data.publicUrl;
      } else {
        input.logo = null;
      }

      await axios.post("/api/credentials/create", input);

      const update = await axios.get("/api/credentials/list");
      mutate("/api/credentials/list", update.data);

      const dashboard = await axios.get("/api/dashboard");
      mutate("/api/dashboard", dashboard.data);

      router.push("/user/credential");

      Swal.close();
    } catch (err: any) {
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
      <PageHeading heading="Create Credentials" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
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
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Logo</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Logo"
                  {...register("logo")}
                />
              </Form.Group>
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
