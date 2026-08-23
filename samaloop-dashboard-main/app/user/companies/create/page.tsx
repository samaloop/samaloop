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
import { generateSlug } from "@/helper/helper";

export default function CompanyCreate() {
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
          href: "/user/companies",
          title: "Companies",
        },
        {
          href: "/user/companies/create",
          title: "Create",
        },
      ]);

      setMounted(true);
    }
  }, [mounted]);

  type input = {
    id: any;
    name: any;
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
      await axios.post("/api/companies/create", {
        id: generateSlug(input.id),
        name: input.name,
      });

      const update = await axios.get("/api/companies/list");
      mutate("/api/companies/list", update.data);

      router.push("/user/companies");

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
      <PageHeading heading="Create Company" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Slug <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="mis. pln"
                  required
                  {...register("id", { required: true })}
                />
                <Form.Text className="text-muted">
                  Dipakai di URL /search/company/[slug]. Huruf kecil, tanpa
                  spasi, tidak bisa diubah setelah dibuat.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="mis. PLN"
                  required
                  {...register("name", { required: true })}
                />
                <Form.Text className="text-muted">
                  Dipakai sebagai judul di halaman /search/company/[slug].
                </Form.Text>
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
