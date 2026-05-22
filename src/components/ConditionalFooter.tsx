"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDE_FOOTER_ROUTES = ["/login", "/role-selection"];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (HIDE_FOOTER_ROUTES.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
