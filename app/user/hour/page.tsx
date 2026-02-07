"use client";

import { PageHeading } from "widgets";
import { Col, Row, Card, Table, Container, Spinner } from "react-bootstrap";
import { FiEdit2, FiTrash } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { useAuth } from "app/context/AuthContext";
import Swal from "sweetalert2";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function PlacementList() {
  const supabase = createClientComponentClient();
  const { userValue } = useAuth();

  const { breadcrumbStore } = useBreadcrumb();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted === false && userValue !== null) {
      breadcrumbStore([
        {
          href: "/user",
          title: "Dashboard",
        },
        {
          href: "/user/hour",
          title: "Hours",
        },
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/hours/list", fetcher);

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

        await supabase.from("hours").delete().eq("id", id);

        const update = await axios.get("/api/hours/list");
        mutate("/api/hours/list", update.data);

        const dashboard = await axios.get("/api/dashboard");
        mutate("/api/dashboard", dashboard.data);

        Swal.close();
      }
    });
  };

  return (
    <Row>
      <PageHeading heading="Hours" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <div className="d-md-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
              <div className="mb-3 mb-lg-0 text-center text-sm-start">
                <h5>Total: {data.data !== undefined && data.data.count}</h5>
              </div>
              <div className="text-center text-md-start">
                <Link href="/user/hour/create" className="btn btn-primary">
                  Create
                </Link>
              </div>
            </div>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Name (English)</th>
                  <th>Name (Indonesia)</th>
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
                      <td>{index + 1}</td>
                      <td>{value.id}</td>
                      <td>{value.name.en}</td>
                      <td>{value.name.id}</td>
                      <td>
                        <Link
                          href={
                            "/user/hour/update/" + encodeURIComponent(value.id)
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
