"use client";

import { PageHeading } from "widgets";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { useBreadcrumb } from "app/context/BreadcrumbContext";
import { useState, useEffect } from "react";

export default function Countries() {
  const { breadcrumbStore } = useBreadcrumb();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (isMounted === false) {
      breadcrumbStore([
        {
          href: "/user",
          title: "Dashboard",
        },
        {
          href: "/user/change-password",
          title: "Change Password",
        },
      ]);
      setIsMounted(true);
    }
  }, [isMounted]);

  type input = {
    password: any;
    password2: any;
  };
  const { register, handleSubmit } = useForm<input>();
  const onSubmit: SubmitHandler<input> = async (input) => {
    if (input.password !== input.password2) {
      Swal.fire({
        icon: "error",
        text: "Password & Confirmation Password is Not Same",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } else {
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
        await axios.post("/api/auth/change-password", input);

        Swal.fire({
          icon: "success",
          text: "Change Password is Success.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          text: err.response.data.error.message,
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    }
  };

  return (
    <Row>
      <PageHeading heading="Change Password" />
      <Col xs={12} className="mb-6">
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required
                  {...register("password", { required: true })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password2">
                <Form.Label>Confirmation Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirmation Password"
                  required
                  {...register("password2", { required: true })}
                />
              </Form.Group>
              <div className="text-end mt-4">
                <Button variant="primary" type="submit">
                  Change Password
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
