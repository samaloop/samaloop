"use client";

import { Container, Row, Spinner, Stack } from "react-bootstrap";
import { useEffect } from "react";
import NavbarVertical from "layouts/navbars/NavbarVertical";
import NavbarTop from "layouts/navbars/NavbarTop";
import useSWR from "swr";
import { useAuth } from "app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import SimpleBar from "simplebar-react";
import Swal from "sweetalert2";

export default function DashboardLayout({ children }: any) {
  Swal.close();

  const router = useRouter();
  const pathname = usePathname();
  const { userValue, userStore } = useAuth();

  const fetcher = async (url: any) =>
    await axios.get(url).then((res) => res.data);
  const user = useSWR("/api/auth/get-user", fetcher);

  useEffect(() => {
    if (userValue === null) {
      if (user.data !== undefined) {
        if (user.data.data.user !== null) {
          userStore(user.data.data);
        } else {
          router.push("/");
        }
      }
    }
  }, [userValue, user, pathname]);

  return (
    <>
      {userValue === null ? (
        <Container className="d-flex flex-column">
          <Row className="align-items-center justify-content-center g-0 min-vh-100 text-center">
            <Spinner animation="border" variant="primary" />
          </Row>
        </Container>
      ) : (
        <Stack direction="horizontal">
          <NavbarVertical />
          <div id="page-content">
            <div className="header">
              <NavbarTop data={{}} />
            </div>
            <SimpleBar className="simplebar-main">
              <Container fluid className="p-6 container-fluid">
                {children}
              </Container>
            </SimpleBar>
          </div>
        </Stack>
      )}
    </>
  );
}
