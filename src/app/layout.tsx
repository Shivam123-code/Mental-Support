import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SOSButton from "@/components/SOSButton";
import QuickExit from "@/components/QuickExit";
import WhatsAppButton from "@/components/WhatsAppButton";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KleverKlues - You're Not Alone | Human Wellbeing & Emotional Support",
  description: "The World's Most Trusted Human Wellbeing & Emotional Support Ecosystem. Private, guided, emotionally intelligent support for stress, anxiety, burnout, relationships, and personal growth.",
  keywords: "mental health, wellness, emotional support, counselling, therapy, anxiety, stress, burnout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${manrope.variable}`}>
      <body className="font-body min-h-screen">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <SOSButton />
        <QuickExit />
        <WhatsAppButton />
      </body>
    </html>
  );
}
