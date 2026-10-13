import path from "node:path"
import type { Metadata } from "next"
import registry from "./registry"

export const SITE_URL = "https://nr.next-hat.com"
export const SITE_NAME = "Next Hat Nanocl Registry"
export const SITE_DESCRIPTION =
  "Browse ready-to-use Nanocl Statefiles for containers, virtual machines, and infrastructure. Read deployment guides and find the YAML for your Nanocl version."

export type StatefileEntry = {
  slug?: string
  name: string
  about?: string
  longAbout?: string
  tags?: string[]
  version?: string
  latestVersion?: string
  logoUrl?: string
  versions?: Record<string, StatefileEntry>
}

export type VersionData = { statefiles: Record<string, StatefileEntry> }
export type SeoPage = {
  kind: "home" | "version" | "tag" | "statefile"
  path: string
  title: string
  description: string
  section: string
  version: string
  statefileVersion?: string
  items?: StatefileEntry[]
  entry?: StatefileEntry
}

const segment = (value: string) => encodeURIComponent(value)
const cleanSlug = (value: string) => value.replace(/\.ya?ml$/, "")
const catalogPath = (version: string) => `/${segment(version)}`
const statefilePath = (version: string, slug: string) =>
  `${catalogPath(version)}/${segment(cleanSlug(slug))}`

export function absoluteUrl(route: string): string {
  return new URL(route, SITE_URL).toString()
}

export function socialImagePath(route: string): string {
  return `/social${route === "/" ? "/index" : route}.png`
}

export function versionSeo(
  version: string,
  data: VersionData,
  home = false
): SeoPage {
  return {
    kind: home ? "home" : "version",
    path: home ? "/" : catalogPath(version),
    title: home ? "Nanocl Statefile Registry" : `Nanocl ${version} Statefiles`,
    description: home
      ? SITE_DESCRIPTION
      : `Browse ${Object.keys(data.statefiles).length} ready-to-use Statefiles for Nanocl ${version}. Find deployment guides and YAML templates for your infrastructure.`,
    section: `Nanocl ${version} · Statefiles`,
    version,
    items: Object.entries(data.statefiles).map(([slug, entry]) => ({
      ...entry,
      slug,
    })),
  }
}

export function tagSeo(
  tag: string,
  version: string,
  items: StatefileEntry[]
): SeoPage {
  return {
    kind: "tag",
    path: `/tag/${segment(tag)}`,
    title: `${tag} Statefiles for Nanocl`,
    description: `Explore ${items.length} ${tag} Statefiles for Nanocl ${version}. Read deployment guides and use the YAML templates to deploy your infrastructure.`,
    section: `${tag} · Nanocl ${version}`,
    version,
    items,
  }
}

export function statefileSeo(
  version: string,
  slug: string,
  entry: StatefileEntry
): SeoPage {
  const statefileVersion = entry.version || entry.latestVersion
  const description = (
    entry.about || `Deploy ${entry.name} with this Statefile for Nanocl ${version}.`
  ).replace(/\s+/g, " ").trim()
  return {
    kind: "statefile",
    path: `${statefilePath(version, slug)}${entry.version ? `/${segment(cleanSlug(entry.version))}` : ""}`,
    title: `${entry.name}${entry.version ? ` ${entry.version}` : ""} Statefile for Nanocl ${version}`,
    description,
    section: `Nanocl ${version}${statefileVersion ? ` · Statefile ${statefileVersion}` : ""}`,
    version,
    statefileVersion,
    entry,
  }
}

// Next's route bundles have their own module instance. Respect the custom
// server's arguments when initializing that instance, including for social cards.
export function getSeoRegistry(): {
  latestVersion: string
  versions: string[]
  data: Record<string, VersionData & { tags: Record<string, string[]> }>
} {
  let snapshot
  try {
    snapshot = registry.getRegistry()
  } catch {
    const customServer = process.argv[1]?.endsWith("server.js")
    registry.initRegistry(
      (customServer && process.argv[2]) ||
        process.env.NANOCL_REGISTRY_PATH ||
        (customServer ? "/folder" : path.resolve(process.cwd(), "../statefiles")),
      (customServer && process.argv[3]) ||
        process.env.NANOCL_LATEST_VERSION || "v0.18"
    )
    snapshot = registry.getRegistry()
  }
  if (!snapshot) throw new Error("[registry] Not initialized")
  return snapshot
}

export function getSeoPage(route: string): SeoPage | null {
  const snapshot = getSeoRegistry()
  let parts: string[]
  try {
    parts = route.split("/").filter(Boolean).map(decodeURIComponent)
  } catch {
    return null
  }
  if (parts.some((part) => part.includes("/"))) return null
  const version = snapshot.latestVersion
  if (parts.length === 0) {
    const data = registry.getVersion(version)
    return data ? versionSeo(version, data, true) : null
  }
  if (parts.length === 2 && parts[0] === "tag") {
    const items = registry.getByTag(version, parts[1])
    return items.length ? tagSeo(parts[1], version, items) : null
  }
  const data = registry.getVersion(parts[0])
  if (!data) return null
  if (parts.length === 1) return versionSeo(parts[0], data)
  if (parts.length === 2 || parts.length === 3) {
    const entry = parts.length === 3
      ? registry.getStatefileVersion(parts[0], parts[1], parts[2])
      : registry.getStatefile(parts[0], parts[1])
    return entry ? statefileSeo(parts[0], parts[1], entry) : null
  }
  return null
}

export function pageMetadata(page: SeoPage): Metadata {
  const title = `${page.title} | Next Hat`
  const image = {
    url: absoluteUrl(socialImagePath(page.path)),
    width: 1200,
    height: 630,
    type: "image/png",
    alt: `${page.title} — ${SITE_NAME}`,
  }
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    openGraph: {
      type: "website",
      title,
      description: page.description,
      url: absoluteUrl(page.path),
      siteName: SITE_NAME,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      site: "@next_hat",
      creator: "@next_hat",
      title,
      description: page.description,
      images: [{ url: image.url, alt: image.alt }],
    },
  }
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Nanocl Statefile Registry | Next Hat", template: "%s | Next Hat" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Next Hat", url: "https://next-hat.com" }],
  creator: "Next Hat",
  publisher: "Next Hat",
  icons: {
    icon: [{ url: "/favicon.png", sizes: "720x720", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://next-hat.com/#organization",
        name: "Next Hat",
        url: "https://next-hat.com/",
        logo: absoluteUrl("/logo3.png"),
        sameAs: ["https://github.com/next-hat", "https://x.com/next_hat"],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: absoluteUrl("/"),
        inLanguage: "en",
        publisher: { "@id": "https://next-hat.com/#organization" },
      },
    ],
  }
}

export function pageSchema(page: SeoPage) {
  const url = absoluteUrl(page.path)
  const crumbs = [{ name: "Nanocl Registry", url: absoluteUrl("/") }]
  if (page.kind === "statefile") {
    crumbs.push({ name: `Nanocl ${page.version}`, url: absoluteUrl(catalogPath(page.version)) })
  }
  if (page.kind !== "home") crumbs.push({ name: page.title, url })
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumbs`,
    itemListElement: crumbs.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: item.url,
    })),
  }
  const entity = page.entry ? {
    "@type": "SoftwareSourceCode",
    "@id": `${url}#statefile`,
    name: page.entry.name,
    description: page.description,
    url,
    programmingLanguage: "YAML",
    runtimePlatform: `Nanocl ${page.version}`,
    version: page.statefileVersion,
    keywords: page.entry.tags?.join(", "),
    codeRepository: "https://github.com/next-hat/nanocl-registry",
    author: { "@id": "https://next-hat.com/#organization" },
  } : {
    "@type": "ItemList",
    numberOfItems: page.items?.length || 0,
    itemListElement: page.items?.map((entry, index) => ({
      "@type": "ListItem", position: index + 1, name: entry.name,
      url: absoluteUrl(statefilePath(page.version, entry.slug || entry.name)),
    })) || [],
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": page.kind === "statefile" ? "WebPage" : "CollectionPage",
        "@id": `${url}#webpage`,
        url, name: page.title, description: page.description, inLanguage: "en",
        isPartOf: { "@id": absoluteUrl("/#website") },
        publisher: { "@id": "https://next-hat.com/#organization" },
        breadcrumb: { "@id": `${url}#breadcrumbs` },
        primaryImageOfPage: {
          "@type": "ImageObject", url: absoluteUrl(socialImagePath(page.path)),
          width: 1200, height: 630,
        },
        mainEntity: entity,
      },
      breadcrumb,
    ],
  }
}
