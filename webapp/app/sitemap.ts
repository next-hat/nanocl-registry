import path from "node:path"
import type { MetadataRoute } from "next"

// Use the same in-memory registry to discover URLs if available
// The registry expects initialization. We try to init with env vars and fail gracefully.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const registry = require("../lib/registry")

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nr.next-hat.com"
  const urls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
  ]
  try {
    const basePath =
      process.env.NANOCL_REGISTRY_PATH ||
      path.resolve(process.cwd(), "../statefiles")
    const latest = process.env.NANOCL_LATEST_VERSION || "v0.17"
    try {
      registry.initRegistry(basePath, latest)
    } catch (e) {
      // already initialized or failed, ignore
    }
    const allVersions: string[] = registry.getRegistry()?.versions || []
    for (const ver of allVersions) {
      urls.push({
        url: `${baseUrl}/${ver}`,
        changeFrequency: "weekly",
        priority: 0.9,
      })
      const v = registry.getVersion(ver)
      if (v && v.statefiles) {
        for (const slug of Object.keys(v.statefiles)) {
          urls.push({
            url: `${baseUrl}/${ver}/${slug}`,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }
    // Tag pages only for latest version as per server routing
    const latestVersion: string = registry.getLatestVersion?.() || latest
    const latestData = registry.getVersion?.(latestVersion)
    if (latestData?.tags) {
      for (const tag of Object.keys(latestData.tags)) {
        urls.push({
          url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
          changeFrequency: "weekly",
          priority: 0.6,
        })
      }
    }
  } catch {
    // ignore and return minimal sitemap
  }
  return urls
}
