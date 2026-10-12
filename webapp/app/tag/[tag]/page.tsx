import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@next-hat/ui/components/ui/badge"
import { Button } from "@next-hat/ui/components/ui/button"
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react"

import SearchableList, {
  type StatefileItem,
} from "@/components/searchable-list"

type PageProps = {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ data: string; version: string }>
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { tag } = await params
  const sParams = await searchParams
  if (!sParams?.data) return {}
  const title = `${tag} — ${sParams.version} — Nanocl Registry`
  const description = `Explore ${tag} Statefiles for Nanocl ${sParams.version} on the official Next Hat registry.`
  const url = `https://nr.next-hat.com/tag/${encodeURIComponent(tag)}`
  return {
    title,
    description,
    alternates: { canonical: `/tag/${tag}` },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: "/logo3.png", width: 512, height: 512, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/logo3.png", alt: title }],
    },
  }
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag } = await params
  const sParams = await searchParams
  if (!sParams.data) return notFound()
  const list: StatefileItem[] = JSON.parse(sParams.data)
  return (
    <div className="space-y-10">
      {/* Structured data for tag collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${tag} — ${sParams.version} — Nanocl Statefiles`,
            description: `Explore ${tag} Statefiles for Nanocl ${sParams.version} on the official Next Hat registry.`,
            about: tag,
            url: `https://nr.next-hat.com/tag/${encodeURIComponent(tag)}`,
          }),
        }}
      />
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-4">
          <Link
            href={`/${sParams.version}`}
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
              Nanocl {sParams.version}
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
      <SearchableList items={list} version={sParams.version} />
    </div>
  )
}
