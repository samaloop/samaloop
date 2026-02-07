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

export default function BusinessTypesCreate({
  params,
}: Readonly<{ params: { id: string } }>) {
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
          href: "/user/admin",
          title: "Admins",
        },
        {
          href: "/user/admin/create",
          title: "Create",
        },
      ]);

      setMounted(true);
    }
  }, [mounted]);

  type input = {
    name: any;
    email: any;
    password: any;
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
      await axios.post("/api/admin/create", input);

      const update = await axios.get("/api/admin/list?page=1");
      mutate("/api/admin/list?page=1", update.data);

      const dashboard = await axios.get("/api/dashboard");
      mutate("/api/dashboard", dashboard.data);

      router.push("/user/admin");

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
      <PageHeading heading="Create Admin" />
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
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  required
                  {...register("email", { required: true })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required
                  {...register("password")}
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
