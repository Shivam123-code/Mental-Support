import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import SOSButton from "@/components/SOSButton";
import QuickExit from "@/components/layout/QuickExit";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { AuthProvider } from "@/contexts/AuthContext";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500"],   // 600 was preloaded but unused → removed
  preload: false,           // prevents "preloaded but not used" warning
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["500", "600", "700"], // 400 weight unused in practice → removed
  preload: false,                // prevents "preloaded but not used" warning
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
    <html lang="en" className={`${newsreader.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="font-body min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
          <SOSButton />
          <QuickExit />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
