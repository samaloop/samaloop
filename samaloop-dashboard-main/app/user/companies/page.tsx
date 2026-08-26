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

export default function CompanyList() {
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
          href: "/user/companies",
          title: "Companies",
        },
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/companies/list", fetcher);

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

        const { error }: any = await supabase
          .from("companies")
          .delete()
          .eq("id", id);

        if (error) {
          Swal.fire({
            icon: "error",
            text:
              error.code === "23503"
                ? "Perusahaan ini masih dipakai oleh coach. Lepas afiliasi coach-nya dulu sebelum menghapus."
                : error.message,
            confirmButtonText: "OK",
          });
          return;
        }

        const update = await axios.get("/api/companies/list");
        mutate("/api/companies/list", update.data);

        Swal.close();
      }
    });
  };

  return (
    <Row>
      <PageHeading heading="Companies" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <p className="text-muted">
              Daftar perusahaan yang bisa dipilih saat menandai coach
              berafiliasi (lihat menu Company Coaches).
            </p>
            <div className="d-md-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
              <div className="mb-3 mb-lg-0 text-center text-sm-start">
                <h5>Total: {data.data !== undefined && data.data.count}</h5>
              </div>
              <div className="text-center text-md-start">
                <Link
                  href="/user/companies/create"
                  className="btn btn-primary"
                >
                  Create
                </Link>
              </div>
            </div>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Logo</th>
                  <th>Slug</th>
                  <th>Name</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {data.data === undefined ? (
                  <tr>
                    <td colSpan={5}>
                      <Container className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </Container>
                    </td>
                  </tr>
                ) : data.data.error ? (
                  <tr>
                    <td colSpan={5} className="text-center text-danger">
                      Gagal memuat data: {data.data.error.message}. Pastikan
                      tabel &quot;company&quot; sudah dibuat di database.
                    </td>
                  </tr>
                ) : (
                  data.data.data.map((value: any, index: number) => (
                    <tr key={"data" + index}>
                      <td>{index + 1}</td>
                      <td>
                        {value.logo !== null ? (
                          <img src={value.logo} alt={value.name} width={50} />
                        ) : (
                          <span className="text-muted">Default</span>
                        )}
                      </td>
                      <td>{value.slug}</td>
                      <td>{value.name}</td>
                      <td>
                        <Link
                          href={
                            "/user/companies/update/" +
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
