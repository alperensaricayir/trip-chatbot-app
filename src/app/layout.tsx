import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripli Partner Simülatörü",
  description:
    "Chat app tarzı bir arayüzde 20 saniyede cevap ver, sabrı tüketmeden olabildiğince uzun dayan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-zinc-950 text-zinc-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
