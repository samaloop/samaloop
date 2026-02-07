"use client";

import { PageHeading } from "widgets";
import {
  Col,
  Row,
  Card,
  Table,
  Container,
  Spinner,
  Button,
  Stack,
  Form,
} from "react-bootstrap";
import { FiEdit2, FiTrash } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import Pagination from "app/components/pagination";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { useAuth } from "app/context/AuthContext";
import Swal from "sweetalert2";
import Image from "next/image";
import dayjs from "dayjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm, SubmitHandler } from "react-hook-form";

export default function PlacementList() {
  const supabase = createClientComponentClient();
  const { userValue } = useAuth();

  const { breadcrumbStore } = useBreadcrumb();
  const [mounted, setMounted] = useState(false);

  const [page, setPage] = useState(1);
  const pageChange = (e: any, { activePage }: any) => {
    setPage(activePage);
  };

  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (mounted === false && userValue !== null) {
      breadcrumbStore([
        {
          href: "/user",
          title: "Dashboard",
        },
        {
          href: "/user/profile",
          title: "Coachs",
        },
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/profile/list?page=" + page + filter, fetcher);

  const handleDeleteClick = async (id: any) => {
    Swal.fire({
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Please Wait",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await supabase.from("profiles").delete().eq("id", id);

        const update = await axios.get("/api/profile/list?page=" + page);
        mutate("/api/profile/list?page=" + page, update.data);

        Swal.close();
      }
    });
  };

  const handleStatusClick = async (id: any, status: any) => {
    Swal.fire({
      title: "Please Wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await supabase
      .from("profiles")
      .update([
        {
          status: status,
        },
      ])
      .eq("id", id);

    const update = await axios.get("/api/profile/list?page=1");
    mutate("/api/profile/list?page=1", update.data);

    const dashboard = await axios.get("/api/dashboard");
    mutate("/api/dashboard", dashboard.data);

    Swal.close();
  };

  type input = {
    name: any;
  };
  const { register, handleSubmit } = useForm<input>();
  const onSubmit: SubmitHandler<input> = async (input) => {
    let filter = "";
    if (input.name !== "") {
      filter += "&name=" + input.name;
    }
    setFilter(filter);
  };

  return (
    <Row>
      <PageHeading heading="Coachs" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <div className="d-md-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
              <div className="mb-3 mb-lg-0 text-center text-sm-start">
                <h5>Total: {data.data !== undefined && data.data.count}</h5>
              </div>
              <div className="text-center text-md-start">
                <Link href="/user/profile/create" className="btn btn-primary">
                  Create
                </Link>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="horizontal" gap={2} className="mb-4">
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    {...register("name")}
                  />
                </Form.Group>
                <Button
                  style={{
                    height: "38px",
                    marginTop: "30px",
                    marginLeft: "5px",
                  }}
                  variant="primary"
                  type="submit"
                >
                  Filter
                </Button>
              </Stack>
            </form>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {data.data === undefined ? (
                  <tr>
                    <td colSpan={6}>
                      <Container className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </Container>
                    </td>
                  </tr>
                ) : (
                  data.data.data.map((value: any, index: number) => (
                    <tr key={"data" + index}>
                      <td>{(page - 1) * data.data.limit + index + 1}</td>
                      <td>
                        {dayjs(value.created_at).format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                      <td>
                        <Image
                          className="rounded-circle"
                          priority
                          src={value.photo}
                          alt={value.name}
                          width={80}
                          height={80}
                        />
                      </td>
                      <td>{value.name}</td>
                      <td>
                        {value.status === "active" ? (
                          <>
                            active
                            <Button
                              className="ms-1 badge bg-secondary"
                              onClick={() =>
                                handleStatusClick(value.id, "inactive")
                              }
                            >
                              Disable
                            </Button>
                          </>
                        ) : (
                          <>
                            inactive
                            <Button
                              className="ms-1 badge bg-primary"
                              onClick={() =>
                                handleStatusClick(value.id, "active")
                              }
                            >
                              Enable
                            </Button>
                          </>
                        )}
                      </td>
                      <td>
                        <Link
                          href={
                            "/user/profile/update/" +
                            encodeURIComponent(value.id)
                          }
                          className="text-dark"
                        >
                          <FiEdit2 size={16} className="me-3" />
                        </Link>
                        <Link href="#" className="text-dark">
                          <FiTrash
                            size={16}
                            onClick={() => handleDeleteClick(value.id)}
                          />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            {data.data !== undefined && data.data.pageTotal > 1 && (
              <Pagination
                page={page}
                pageChange={pageChange}
                pageTotal={data.data.pageTotal}
              />
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
