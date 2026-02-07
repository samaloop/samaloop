"use client";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "app/context/AuthContext";
import axios from "axios";

const SignIn = () => {
  const { userStore } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const [errMsg, setErrMsg] = useState("");

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const setSession = async (access_token: any, type: string) => {
      const setSession = await supabase.auth.setSession({
        access_token: access_token,
        refresh_token: access_token,
      });

      if (setSession.data.user === null) {
        setErrMsg("URL is not valid or URL is expired.");
      } else {
        const getUser = await axios.get("/api/auth/get-user");
        userStore(getUser.data.data);
        if (type === "invite" || type === "recovery") {
          router.push("/user/change-password");
        } else {
          router.push("/user");
        }
      }
      setIsMounted(true);
    };

    const codeForSession = async (code: any) => {
      await axios.get("/api/auth/exchange-code?code=" + code);
      const getUser = await axios.get("/api/auth/get-user");
      userStore(getUser.data.data);
      router.push("/user/change-password");
      setIsMounted(true);
    };

    const checkUser = async () => {
      const getUser: any = await supabase.auth.getUser();
      if (getUser.data.user !== null) {
        router.push("/user");
      } else {
        setIsMounted(true);
      }
    };

    if (isMounted === false) {
      const hash: any = window.location.hash.split("#");
      if (hash.length < 2) {
        const code = searchParams.get("code");
        if (code !== null) {
          codeForSession(code);
        } else {
          checkUser();
        }
      } else {
        const params = hash[1].split("&");
        if (params.length !== 6) {
          setIsMounted(true);
        } else {
          const access_token = params[0].split("=");
          const type = params[5].split("=");
          setSession(access_token[1], type[1]);
        }
      }
    }

    Swal.close();
  }, [isMounted]);

  type inputFormLogin = {
    email: any;
    password: any;
  };
  const { register, handleSubmit } = useForm<inputFormLogin>();
  const onSubmit: SubmitHandler<inputFormLogin> = async (input) => {
    Swal.fire({
      title: "Please Wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setErrMsg("");

    const login: any = await supabase.auth.signInWithPassword(input);
    if (login.data.user !== null) {
      const getUser = await axios.get("/api/auth/get-user");
      userStore(getUser.data.data);

      router.push("/user");
    } else {
      Swal.fire({
        icon: "error",
        text: login.error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };
  return (
    <Container className="d-flex flex-column">
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
          {isMounted === false ? (
            <Container className="text-center">
              <Spinner animation="border" variant="primary" />
            </Container>
          ) : (
            <Card className="smooth-shadow-md">
              <Card.Body className="p-6">
                {errMsg !== "" && <Alert variant="danger">{errMsg}</Alert>}
                <div className="mb-4">
                  {process.env.NEXT_PUBLIC_LOGO_ASSET !== "" && (
                    <Link href="/">
                      <Image
                        priority
                        src={process.env.NEXT_PUBLIC_LOGO_ASSET as string}
                        alt="Logo"
                        width={parseInt(
                          process.env.NEXT_PUBLIC_LOGO_WIDTH as string
                        )}
                        height={parseInt(
                          process.env.NEXT_PUBLIC_LOGO_HEIGHT as string
                        )}
                      />
                    </Link>
                  )}
                  {process.env.NEXT_PUBLIC_LOGO_URL !== "" && (
                    <Link href="/">
                      <Image
                        priority
                        src={process.env.NEXT_PUBLIC_LOGO_URL as string}
                        alt="Logo"
                        width={parseInt(
                          process.env.NEXT_PUBLIC_LOGO_WIDTH as string
                        )}
                        height={parseInt(
                          process.env.NEXT_PUBLIC_LOGO_HEIGHT as string
                        )}
                      />
                    </Link>
                  )}
                  {process.env.NEXT_PUBLIC_LOGO_ASSET === "" &&
                    process.env.NEXT_PUBLIC_LOGO_URL === "" && (
                      <h3>{process.env.NEXT_PUBLIC_TITLE}</h3>
                    )}
                  <p className="mt-2 mb-6">
                    Please enter your user information.
                  </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Your Email"
                      required
                      {...register("email", {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="**************"
                      required
                      {...register("password", { required: true })}
                    />
                  </Form.Group>
                  <div>
                    <div className="d-grid mb-4">
                      <Button variant="primary" type="submit">
                        Sign In
                      </Button>
                    </div>
                  </div>
                </form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
