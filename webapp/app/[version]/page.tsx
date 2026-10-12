import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@next-hat/ui/components/ui/badge"
import { Button } from "@next-hat/ui/components/ui/button"
import { ArrowUpRight, BookOpen } from "lucide-react"

import SearchableList, {
  type StatefileItem,
} from "../../components/searchable-list"

type PageProps = {
  params: Promise<{ version: string }>
  searchParams: Promise<{ data: string }>
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { version } = await params
  const sParams = await searchParams
  if (!sParams?.data) return {}
  const title = `${version} — Nanocl Registry`
  const description = `Browse production-ready Nanocl Statefiles for ${version} on the official Next Hat Nanocl Registry.`
  const url = `https://nr.next-hat.com/${version}`
  return {
    title,
    description,
    alternates: { canonical: `/${version}` },
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

export default async function VersionPage({ params, searchParams }: PageProps) {
  const { version } = await params
  const sParams = await searchParams
  if (!sParams.data) return notFound()
  const data = JSON.parse(sParams.data) as {
    statefiles: Record<string, StatefileItem>
  }
  if (!data) return <div className="text-destructive">Version not found</div>
  const list = Object.values(data.statefiles)
  return (
    <div className="space-y-10">
      {/* Structured data for version collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${version} — Nanocl Statefiles`,
            description: `Browse production-ready Nanocl Statefiles for ${version} on the official Next Hat Nanocl Registry.`,
            url: `https://nr.next-hat.com/${version}`,
          }),
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
