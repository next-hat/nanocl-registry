import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@next-hat/ui/components/ui/badge"
import { Button } from "@next-hat/ui/components/ui/button"
import { ArrowUpRight, BookOpen } from "lucide-react"

import SearchableList, {
  type StatefileItem,
} from "../../components/searchable-list"
import {
  pageMetadata,
  pageSchema,
  serializeJsonLd,
  versionSeo,
} from "@/lib/seo"

type PageProps = {
  params: Promise<{ version: string }>
  searchParams: Promise<{ data?: string; home?: string }>
}

function parseVersionData(serialized: string | undefined): {
  statefiles: Record<string, StatefileItem>
} {
  let data: unknown
  try {
    data = JSON.parse(serialized ?? "")
  } catch {
    notFound()
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) notFound()
  const statefiles = (data as Record<string, unknown>).statefiles
  if (!statefiles || typeof statefiles !== "object" || Array.isArray(statefiles)) {
    notFound()
  }
  for (const item of Object.values(statefiles)) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item) ||
      typeof item.slug !== "string" ||
      !item.slug ||
      typeof item.name !== "string" ||
      !item.name ||
      typeof item.about !== "string" ||
      typeof item.latestVersion !== "string" ||
      !item.latestVersion ||
      !Array.isArray(item.tags) ||
      !item.tags.every((tag: unknown) => typeof tag === "string")
    ) {
      notFound()
    }
  }
  return data as { statefiles: Record<string, StatefileItem> }
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { version } = await params
  const sParams = await searchParams
  const data = parseVersionData(sParams.data)
  return pageMetadata(versionSeo(version, data, sParams.home === "1"))
}

export default async function VersionPage({ params, searchParams }: PageProps) {
  const { version } = await params
  const sParams = await searchParams
  const data = parseVersionData(sParams.data)
  const page = versionSeo(version, data, sParams.home === "1")
  const list = Object.values(data.statefiles)
  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(pageSchema(page)),
        }}
      />
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
            Statefile catalog
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Nanocl Registry
            </h1>
            <Badge variant="outline" className="h-6 font-mono">
              Nanocl {version}
            </Badge>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            Browse production-ready Statefiles. Find a service, read the manual,
            and deploy it with Nanocl.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-10 self-start sm:self-auto"
        >
          <Link
            href="https://docs.next-hat.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BookOpen aria-hidden="true" />
            Documentation
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </Button>
      </header>
      <SearchableList items={list} version={version} />
    </div>
  )
}
