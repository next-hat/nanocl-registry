import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@next-hat/ui/components/ui/badge"
import { Button } from "@next-hat/ui/components/ui/button"
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react"

import SearchableList, {
  type StatefileItem,
} from "@/components/searchable-list"
import {
  pageMetadata,
  pageSchema,
  serializeJsonLd,
  tagSeo,
} from "@/lib/seo"

type PageProps = {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ data?: string; version?: string }>
}

function parseTagItems(serialized: string | undefined): StatefileItem[] {
  let items: unknown
  try {
    items = JSON.parse(serialized ?? "")
  } catch {
    notFound()
  }
  if (!Array.isArray(items) || items.length === 0) notFound()
  for (const item of items) {
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
  return items as StatefileItem[]
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { tag } = await params
  const sParams = await searchParams
  const items = parseTagItems(sParams.data)
  const version = sParams.version
  if (typeof version !== "string" || !version) notFound()
  return pageMetadata(tagSeo(tag, version, items))
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag } = await params
  const sParams = await searchParams
  const list = parseTagItems(sParams.data)
  const version = sParams.version
  if (typeof version !== "string" || !version) notFound()
  const page = tagSeo(tag, version, list)
  return (
    <div className="registry-container flex flex-col gap-10 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(pageSchema(page)),
        }}
      />
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-4">
          <Link
            href={`/${version}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All Statefiles
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="min-w-0 max-w-full break-words text-3xl font-semibold tracking-tight sm:text-4xl">
              #{tag}
            </h1>
            <Badge variant="outline" className="h-6 font-mono">
              Nanocl {version}
            </Badge>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            Explore Statefiles tagged {tag} in the Nanocl Registry.
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
