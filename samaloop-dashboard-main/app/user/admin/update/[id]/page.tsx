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

export default function BusinessTypesCreate({
  params,
}: Readonly<{ params: { id: string } }>) {
  const router = useRouter();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/admin/detail/" + params.id, fetcher);

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
          href: "/user/admin",
          title: "Admins",
        },
        {
          href: "/user/admin/update/" + params.id,
          title: "Update",
        },
      ]);

      setMounted(true);
    }
  }, [mounted, data]);

  type input = {
    uid: any;
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
      input.uid = data.data.data[0].uid;
      await axios.post("/api/admin/update/" + params.id, input);

      const update = await axios.get("/api/admin/list?page=1");
      mutate("/api/admin/list?page=1", update.data);

      const update2 = await axios.get("/api/admin/detail/" + params.id);
      mutate("/api/admin/detail/" + params.id, update2.data);

      router.push("/user/admin");

      Swal.close();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        text: "",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };

  return (
    <Row>
      <PageHeading heading="Update Admin" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            {data.data === undefined ? (
              <Container className="text-center">
                <Spinner animation="border" variant="primary" />
              </Container>
            ) : (
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
                    defaultValue={
                      data.data.data[0].name !== undefined
                        ? data.data.data[0].name
                        : ""
                    }
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
                    defaultValue={data.data.data[0].email}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                </Form.Group>
                <div className="text-end mt-4">
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
