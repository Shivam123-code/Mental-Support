import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SOSButton from "@/components/SOSButton";
import QuickExit from "@/components/QuickExit";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <SOSButton />
        <QuickExit />
      </body>
    </html>
  );
}
