"use client";
import { Col, Row, Card, Spinner } from "react-bootstrap";
import { PageHeading } from "widgets";
import { abbreviateNumber } from "js-abbreviation-number";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import {
  FaUsers,
  FaTransgender,
  FaHistory,
  FaAsterisk,
  FaUserTie,
  FaCodeBranch,
  FaClock,
  FaUserClock,
  FaUser,
  FaUserTag,
  FaMoneyBill,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { useAuth } from "app/context/AuthContext";

export default function User() {
  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/dashboard", fetcher);

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
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  return (
    <div>
      <PageHeading heading="Dashboard" />
      {data.data === undefined ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/admin">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Admin</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FiUsers />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.users, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/profile">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Coachs</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaUsers />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.profiles, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} className="mb-5">
            <hr />
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/gender">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Genders</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaTransgender />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.genders, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/age">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Ages</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaHistory />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.ages, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/credential">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Credentials</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaAsterisk />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.credentials, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/speciality">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Specialities</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaUserTie />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.specialities, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/method">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Methods</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaCodeBranch />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.methods, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/hour">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Hours</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaClock />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.hours, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/year">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Years</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaUserClock />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.years, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/clients">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Clients</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaUser />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.clients, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/client-type">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Client Types</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaUserTag />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.client_types, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/price">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Prices</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaMoneyBill />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.prices, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
           <Col lg={4} md={6} xs={12} className="mb-5">
            <Card>
              <Card.Body>
                <Link href="/user/leads">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Leads</h4>
                    </div>
                    <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
                      <FaUser />
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold">
                      {abbreviateNumber(data.data.leads, 0)}
                    </h1>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
