"use client";

import { PageHeading } from "widgets";
import { Col, Row, Card, Table, Container, Spinner } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { useAuth } from "app/context/AuthContext";
import { stripHTML } from "@/helper/helper";

export default function PlacementList() {
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
          href: "/user/info",
          title: "Info",
        },
      ]);
      setMounted(true);
    }
  }, [mounted, userValue]);

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const data = useSWR("/api/info/list", fetcher);

  return (
    <Row>
      <PageHeading heading="Info" />
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
                  <th>ID</th>
                  <th>Value</th>
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
                    <tr key={"data" + index}>
                      <td>{index + 1}</td>
                      <td>{value.id}</td>
                      <td>
                        {value.id === "Name" ||
                        value.id === "Address" ||
                        value.id === "Linkedin" ||
                        value.id === "Instagram" ||
                        value.id === "Tiktok" ||
                        value.id === "Facebook" ||
                        value.id === "Search" ||
                        value.id === "Cookie Policy" ||
                        value.id === "Privacy Policy" ||
                        value.id === "Terms and Conditions" ||
                        value.id === "Footer" ? (
                          <>
                            English :{" "}
                            {stripHTML(value.data.en).substring(0, 100)}
                            {value.data.en.length > 100 && "..."} <br />
                            Indonesia :{" "}
                            {stripHTML(value.data.id).substring(0, 100)}
                            {value.data.id.length > 100 && "..."}
                          </>
                        ) : value.id === "Banner Home" ? (
                          <>
                            <img src={value.image} width={200} alt={value.id} />
                          </>
                        ) : (
                          <>
                            <img
                              src={value.data.left.image}
                              width={100}
                              alt={value.id + "_left-image"}
                              className="mb-2"
                            />
                            <br />
                            English :{" "}
                            {value.data.left.info.en.substring(0, 100)}
                            {value.data.left.info.en.length > 100 && "..."}
                            <br />
                            Indonesia :{" "}
                            {value.data.left.info.id.substring(0, 100)}
                            {value.data.left.info.id.length > 100 && "..."}
                            <hr />
                            English :{" "}
                            {value.data.right.header.en.substring(0, 100)}
                            {value.data.right.header.en.length > 100 && "..."}
                            <br />
                            Indonesia :{" "}
                            {value.data.right.header.id.substring(0, 100)}
                            {value.data.right.header.id.length > 100 && "..."}
                            <hr />
                            <img
                              src={value.data.right.feature[0].image}
                              width={50}
                              alt={value.id + "_feature-image1"}
                              className="mb-2"
                            />
                            <br />
                            English :{" "}
                            {value.data.right.feature[0].info.en.substring(
                              0,
                              100
                            )}
                            {value.data.right.feature[0].info.en.length > 100 &&
                              "..."}
                            <br />
                            Indonesia :{" "}
                            {value.data.right.feature[0].info.id.substring(
                              0,
                              100
                            )}
                            {value.data.right.feature[0].info.id.length > 100 &&
                              "..."}
                            <hr />
                            <img
                              src={value.data.right.feature[1].image}
                              width={50}
                              alt={value.id + "_feature-image2"}
                              className="mb-2"
                            />
                            <br />
                            English :{" "}
                            {value.data.right.feature[1].info.en.substring(
                              0,
                              100
                            )}
                            {value.data.right.feature[1].info.en.length > 100 &&
                              "..."}
                            <br />
                            Indonesia :{" "}
                            {value.data.right.feature[1].info.id.substring(
                              0,
                              100
                            )}
                            {value.data.right.feature[1].info.id.length > 100 &&
                              "..."}
                            <hr />
                            <img
                              src={value.data.right.feature[2].image}
                              width={50}
                              alt={value.id + "_feature-image3"}
                              className="mb-2"
                            />
                            <br />
                            English :{" "}
                            {value.data.right.feature[2].info.en.substring(
                              0,
                              100
                            )}
                            {value.data.right.feature[2].info.en.length > 100 &&
                              "..."}
                            <br />
                            Indonesia :{" "}
                            {value.data.right.feature[2].info.id.substring(
                              0,
                              100
                            )}
                            {value.data.right.feature[2].info.id.length > 100 &&
                              "..."}
                            <hr />
                            English :{" "}
                            {value.data.right.footer.title.en.substring(0, 100)}
                            {value.data.right.footer.title.en.length > 100 &&
                              "..."}
                            <br />
                            Indonesia :{" "}
                            {value.data.right.footer.title.id.substring(0, 100)}
                            {value.data.right.footer.title.id.length > 100 &&
                              "..."}
                            <hr />
                            English :{" "}
                            {value.data.right.footer.body.en.substring(0, 100)}
                            {value.data.right.footer.body.en.length > 100 &&
                              "..."}
                            <br />
                            Indonesia :{" "}
                            {value.data.right.footer.body.id.substring(0, 100)}
                            {value.data.right.footer.body.en.length > 100 &&
                              "..."}
                          </>
                        )}
                      </td>
                      <td>
                        <Link
                          href={
                            "/user/info/update/" + encodeURIComponent(value.id)
                          }
                          className="text-dark"
                        >
                          <FiEdit2 size={16} className="me-3" />
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
