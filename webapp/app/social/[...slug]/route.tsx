import React from "react"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { getSeoPage, SITE_URL, socialImagePath } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const artwork = readFile(join(process.cwd(), "public/seo/next-hat-social-v1.png"))
const logo = readFile(join(process.cwd(), "public/logo3.png"))
const regular = readFile(join(process.cwd(), "public/fonts/ibm-plex-mono-latin-400-normal.woff"))
const semibold = readFile(join(process.cwd(), "public/fonts/ibm-plex-mono-latin-600-normal.woff"))
const truncate = (value: string, limit: number) => value.length > limit
  ? `${value.slice(0, limit - 1).trimEnd()}…`
  : value

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  let imagePath: string
  try {
    imagePath = `/social/${slug.map(encodeURIComponent).join("/")}`
  } catch {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } })
  }
  const route = imagePath === "/social/index.png" ? "/" : imagePath.slice("/social".length, -4)
  const page = imagePath.endsWith(".png") ? getSeoPage(route) : null
  if (!page || socialImagePath(page.path) !== imagePath) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } })
  }
  const [background, mark, normalFont, boldFont] = await Promise.all([artwork, logo, regular, semibold])
  const title = truncate(page.title, 94)
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#fff", color: "#0b1534", fontFamily: "IBM Plex Mono" }}>
      <img src={`data:image/png;base64,${background.toString("base64")}`} width={1200} height={630} alt="" style={{ position: "absolute", left: 0, top: 0 }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 710, height: 630, background: "linear-gradient(90deg, #ffffff 99%, rgba(255,255,255,0))", display: "flex" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1200, height: 125, background: "#ffffff", display: "flex" }} />
      <div style={{ position: "absolute", left: 64, top: 62, display: "flex", alignItems: "center", fontSize: 27, gap: 16 }}>
        <img src={`data:image/png;base64,${mark.toString("base64")}`} width={42} height={42} alt="" />
        <span style={{ fontWeight: 600 }}>Next Hat</span><span style={{ color: "#69768c" }}>/ Registry</span>
      </div>
      <div style={{ position: "absolute", left: 64, top: 157, width: 626, display: "flex", color: "#c2410c", fontSize: 19, textTransform: "uppercase" }}>{truncate(page.section, 68)}</div>
      <div style={{ position: "absolute", left: 64, top: 204, width: 626, display: "flex", fontSize: title.length > 75 ? 34 : title.length > 45 ? 42 : 50, fontWeight: 600, lineHeight: 1.16 }}>{title}</div>
      <div style={{ position: "absolute", left: 64, top: 376, width: 626, display: "flex", color: "#596a86", fontSize: 21, lineHeight: 1.45 }}>{truncate(page.description, 160)}</div>
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 58, borderTop: "1px solid #d6dce7", paddingTop: 24, display: "flex", justifyContent: "space-between", fontSize: 18 }}>
        <span>Open tools. Your infrastructure.</span><span>{new URL(SITE_URL).host}</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
      fonts: [
        { name: "IBM Plex Mono", data: normalFont, weight: 400, style: "normal" },
        { name: "IBM Plex Mono", data: boldFont, weight: 600, style: "normal" },
      ],
    }
  )
}
