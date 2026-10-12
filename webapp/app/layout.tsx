import React from "react"
import type { Metadata, Viewport } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { ThemeProvider } from "@next-hat/ui/components/theme-provider"
import { parseTheme, THEME_COOKIE_NAME } from "@next-hat/ui/lib/theme"
import { GoogleAnalytics } from "@next/third-parties/google"

import { RegistryFooter } from "@/components/registry-footer"
import { RegistryHeader } from "@/components/registry-header"

import "@next-hat/ui/styles/globals.css"
import "./brand.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://nr.next-hat.com"),
  title: {
    default: "Next Hat — Nanocl registry",
    template: "%s — Next Hat",
  },
  description:
    "Collections of production-ready to use Statefiles for Nanocl to deploy in seconds.",
  keywords: [
    "Nanocl",
    "Next Hat",
    "Statefile",
    "Registry",
    "DevOps",
    "Containers",
    "Docker",
    "Kubernetes",
    "Compose",
    "IaC",
    "Infrastructure",
    "Templates",
    "Presets",
  ],
  authors: [{ name: "Next Hat", url: "https://next-hat.com" }],
  creator: "Next Hat",
  publisher: "Next Hat",
  applicationName: "Next Hat Nanocl Registry",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://nr.next-hat.com/",
    siteName: "Next Hat Nanocl Registry",
    title: "Next Hat — Nanocl registry",
    description:
      "Collections of production-ready Statefiles for Nanocl to deploy in seconds.",
    images: [
      {
        url: "/logo3.png",
        width: 512,
        height: 512,
        alt: "Next Hat — Nanocl registry",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@next_hat",
    creator: "@next_hat",
    title: "Next Hat — Nanocl registry",
    description:
      "Collections of production-ready Statefiles for Nanocl to deploy in seconds.",
    images: [
      {
        url: "/logo3.png",
        alt: "Next Hat — Nanocl registry",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
}

const font = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE_NAME)?.value)

  return (
    <html
      lang="en"
      className={theme === "system" ? undefined : theme}
      style={{ colorScheme: theme === "system" ? "light dark" : theme }}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.png" />
        {/* Organization & WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Next Hat",
              url: "https://next-hat.com",
              sameAs: [
                "https://x.com/next_hat",
                "https://github.com/next-hat",
                "https://discord.gg/WV4Aac8uZg",
              ],
              logo: "https://nr.next-hat.com/logo3.png",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Next Hat Nanocl Registry",
              url: "https://nr.next-hat.com/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://nr.next-hat.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${font.variable} bg-background font-sans antialiased text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider defaultTheme={theme}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <RegistryHeader />
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto mt-16 w-full max-w-7xl flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-12"
          >
            {children}
          </main>
          <RegistryFooter />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-PE9F5EFX1D" />
    </html>
  )
}
