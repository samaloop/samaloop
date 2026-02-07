"use client";

import { PageHeading } from "widgets";
import { Col, Row, Card, Table, Container, Spinner } from "react-bootstrap";
import { FiEdit2, FiTrash } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import Pagination from "app/components/pagination";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { useAuth } from "app/context/AuthContext";
import Swal from "sweetalert2";

export default function PlacementList() {
  const { userValue } = useAuth();

  const { breadcrumbStore } = useBreadcrumb();
  const [mounted, setMounted] = useState(false);

  const [page, setPage] = useState(1);
  const pageChange = (e: any, { activePage }: any) => {
    setPage(activePage);
  };

  useEffect(() => {
    if (mounted === false && userValue !== null) {
      breadcrumbStore([
        {
          href: "/user",
          title: "Dashboard",
        },
        {
          href: "/user/admin",
          title: "Admins",
        },
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/admin/list?page=" + page, fetcher);

  const handleDeleteClick = async (value: any) => {
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

        await axios.post("/api/admin/delete/" + value.id, value);

        const update = await axios.get("/api/admin/list?page=1");
        mutate("/api/admin/list?page=1", update.data);

        const dashboard = await axios.get("/api/dashboard");
        mutate("/api/dashboard", dashboard.data);

        Swal.close();
      }
    });
  };

  return (
    <Row>
      <PageHeading heading="Admins" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <div className="d-md-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
              <div className="mb-3 mb-lg-0 text-center text-sm-start">
                <h5>Total: {data.data !== undefined && data.data.count}</h5>
              </div>
              <div className="text-center text-md-start">
                <Link href="/user/admin/create" className="btn btn-primary">
                  Create
                </Link>
              </div>
            </div>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {data.data === undefined ? (
                  <tr>
                    <td colSpan={4}>
                      <Container className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </Container>
                    </td>
                  </tr>
                ) : (
                  data.data.data.map((value: any, index: number) => (
                    <tr key={"email" + index}>
                      <td>{(page - 1) * data.data.limit + index + 1}</td>
                      <td>{value.name}</td>
                      <td>{value.email}</td>
                      <td>
                        <Link
                          href={"/user/admin/update/" + value.id}
                          className="text-dark"
                        >
                          <FiEdit2 size={16} className="me-3" />
                        </Link>
                        <Link href="#" className="text-dark">
                          <FiTrash
                            size={16}
                            onClick={() => handleDeleteClick(value)}
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
