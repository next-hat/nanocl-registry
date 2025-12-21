import React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import { Footer, type FooterElementProps } from "@next-hat/ui/components/footer"
import { Header } from "@next-hat/ui/components/header"
import { GoogleAnalytics } from "@next/third-parties/google"

import "@next-hat/ui/styles/globals.css"

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
}

const font = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

const footerElements: FooterElementProps[] = [
  {
    title: "Resources",
    links: [
      { title: "Cloud", href: "https://next-hat.com", target: "_blank" },
      { title: "Docs", href: "https://docs.next-hat.com", target: "_blank" },
      {
        title: "Blog",
        href: "https://docs.next-hat.com/blog",
        target: "_blank",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        title: "X",
        href: "https://x.com/next_hat",
        target: "_blank",
      },
      {
        title: "Discord",
        href: "https://discord.gg/WV4Aac8uZg",
        target: "_blank",
      },
      {
        title: "Discussion",
        href: "https://github.com/orgs/next-hat/discussions",
        target: "_blank",
      },
    ],
  },
  {
    title: "More",
    links: [
      {
        title: "Status",
        href: "https://status.next-hat.com",
        target: "_blank",
      },
      {
        title: "Github",
        href: "https://github.com/next-hat",
        target: "_blank",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/legal/privacy-policy" },
      { title: "Terms of Service", href: "/legal/tos" },
    ],
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
        className={`${font.variable} bg-secondary font-sans antialiased text-foreground min-h-screen flex flex-col`}
      >
        <Header items={[]} />
        <main className="max-w-5xl mt-15 mx-auto px-4 py-6 flex-1 w-full">
          {children}
        </main>
        <Footer footerElements={footerElements} />
      </body>
      <GoogleAnalytics gaId="G-PE9F5EFX1D" />
    </html>
  )
}
