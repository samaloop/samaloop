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

export default function DepartmentUpdate({
  params,
}: Readonly<{ params: { id: string } }>) {
  const router = useRouter();
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/departments/detail/" + params.id, fetcher);

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
          href: "/user/departments",
          title: "Departments",
        },
        {
          href: "/user/departments/update/" + params.id,
          title: "Update",
        },
      ]);

      setMounted(true);
    }
  }, [mounted, data]);

  type input = {
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
      await axios.post("/api/departments/update/" + params.id, input);

      const update = await axios.get("/api/departments/list");
      mutate("/api/departments/list", update.data);

      const update2 = await axios.get("/api/departments/detail/" + params.id);
      mutate("/api/departments/detail/" + params.id, update2.data);

      router.push("/user/departments");

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
      <PageHeading heading="Update Department" />
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
                    Department is not found.
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
                        placeholder="mis. Loop Senior Coach"
                        required
                        {...register("name", { required: true })}
                        defaultValue={data.data.data[0].name}
                      />
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
