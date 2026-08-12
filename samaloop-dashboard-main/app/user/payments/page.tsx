"use client";

import { PageHeading } from "widgets";
import { Col, Row, Card, Table, Container, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import useSWR from "swr";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Pagination from "app/components/pagination";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { useAuth } from "app/context/AuthContext";

const statusVariant = (status: string) => {
  switch (status) {
    case "PAID":
    case "SUCCESS":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
    case "EXPIRED":
      return "danger";
    default:
      return "secondary";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

export default function PaymentList() {
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
          href: "/user/payments",
          title: "Payments",
        },
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/payments/list?page=" + page, fetcher);

  return (
    <Row>
      <PageHeading heading="Payments" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <div className="d-md-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
              <div className="mb-3 mb-lg-0 text-center text-sm-start">
                <h5>Total: {data.data !== undefined && data.data.count}</h5>
              </div>
            </div>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Booked By</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Coach</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {data.data === undefined ? (
                  <tr>
                    <td colSpan={10}>
                      <Container className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </Container>
                    </td>
                  </tr>
                ) : (
                  data.data.data.map((value: any, index: number) => (
                    <tr key={"payment" + index}>
                      <td>{(page - 1) * data.data.limit + index + 1}</td>
                      <td>{value.coaching_registrations?.name}</td>
                      <td>{value.coaching_registrations?.email}</td>
                      <td>{value.coaching_registrations?.phone_number}</td>
                      <td>{value.coaching_registrations?.profiles?.name}</td>
                      <td>{formatCurrency(value.amount)}</td>
                      <td>
                        <Badge bg={statusVariant(value.status)}>
                          {value.status}
                        </Badge>
                      </td>
                      <td>
                        {value.paid_at
                          ? dayjs(value.paid_at).format("YYYY-MM-DD HH:mm:ss")
                          : "-"}
                      </td>
                      <td>
                        {dayjs(value.created_at).format("YYYY-MM-DD HH:mm:ss")}
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
