"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDE_FOOTER_ROUTES = ["/login", "/role-selection", "/login/admin"];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (HIDE_FOOTER_ROUTES.includes(pathname) || pathname.startsWith("/dashboard")) {
    return null;
  }

  return <Footer />;
}
