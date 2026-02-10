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
          href: "/user/leads",
          title: "Leads",
        },
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/leads/list", fetcher);


  return (
    <Row>
      <PageHeading heading="Leads" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <div className="d-md-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
              <div className="mb-3 mb-lg-0 text-center text-sm-start">
                <h5>Total: {data.data !== undefined && data.data.count}</h5>
              </div>
              <div className="text-center text-md-start">
                {/* <Link href="/user/leads/create" className="btn btn-primary">
                  Create
                </Link> */}
              </div>
            </div>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>#</th>
                  {/* <th>ID</th> */}
                  <th>Name</th>
                  <th>email</th>
                  <th>phone</th>
                  <th>Clicked Coach</th>

                  {/* <th>Manage</th> */}
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
                      {/* <td>{value.id}</td> */}
                      <td>{value.name}</td>
                      <td>{value.email}</td>
                      <td>{value.phone}</td>
                      <td>{value.coach_name}</td>
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
