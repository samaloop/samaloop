import "styles/theme.scss";
import "./globals.css";
import { AuthProvider } from "app/context/AuthContext";
import { BreadcrumbProvider } from "app/context/BreadcrumbContext";

export const metadata = {
  title: process.env.NEXT_PUBLIC_TITLE,
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-light">
        <AuthProvider>
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
