import React from "react";
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { IBM_Plex_Mono } from "next/font/google"

import {Header} from "../components/Header";
import {Footer} from "../components/Footer";

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "Next Hat — Nanocl registry",
    template: "%s — Next Hat",
  },
  description: "Collections of production-ready to use Statefiles for Nanocl to deploy in seconds.",
};

const font = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${font.variable} bg-secondary font-sans antialiased text-foreground min-h-screen flex flex-col`}>
        <Header />
        <main className="max-w-[1024px] min-h-screen mt-[60px] mx-auto px-4 py-6 flex-1 w-full">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-PE9F5EFX1D" />
    </html>
  );
}
