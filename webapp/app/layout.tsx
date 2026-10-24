import React from "react"
import type { Metadata, Viewport } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import { cookies } from "next/headers"
import Script from "next/script"
import { ThemeProvider } from "@next-hat/ui/components/theme-provider"
import { parseTheme, THEME_COOKIE_NAME } from "@next-hat/ui/lib/theme"

import { RegistryFooter } from "@/components/registry-footer"
import { RegistryHeader } from "@/components/registry-header"
import { serializeJsonLd, siteMetadata, siteSchema } from "@/lib/seo"

import "@next-hat/ui/styles/globals.css"
import "./brand.css"

export const metadata: Metadata = siteMetadata

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteSchema()) }}
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
            className="mt-16 w-full flex-1"
          >
            {children}
          </main>
          <RegistryFooter />
        </ThemeProvider>
        <Script
          defer
          src="https://analytics.next-hat.com/script.js"
          data-website-id="1c71035a-c95a-4f0d-b796-b4d3caaee39b"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
