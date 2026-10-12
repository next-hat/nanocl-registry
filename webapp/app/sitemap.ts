import type { MetadataRoute } from "next"
import { absoluteUrl, getSeoRegistry, statefileSeo } from "@/lib/seo"

export const dynamic = "force-dynamic"

export default function sitemap(): MetadataRoute.Sitemap {
  const registry = getSeoRegistry()
  const paths = new Set(["/"])
  for (const version of registry.versions) {
    paths.add(`/${encodeURIComponent(version)}`)
    for (const [slug, entry] of Object.entries(registry.data[version].statefiles)) {
      paths.add(statefileSeo(version, slug, entry).path)
      for (const specific of Object.values(entry.versions || {})) {
        paths.add(statefileSeo(version, slug, specific).path)
      }
    }
  }
  // Tag routes always show the default served Nanocl version.
  for (const tag of Object.keys(registry.data[registry.latestVersion]?.tags || {})) {
    paths.add(`/tag/${encodeURIComponent(tag)}`)
  }
  return Array.from(paths, (route) => ({ url: absoluteUrl(route) }))
}
