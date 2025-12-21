import type { Metadata } from "next"
import { notFound } from "next/navigation"

import SearchableList from "../../components/searchable-list"

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
  const data = JSON.parse(sParams.data)
  if (!data) return <div className="text-red-600">Version not found</div>
  const list = Object.values(data.statefiles)
  return (
    <div className="space-y-6">
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
      <h1 className="text-4xl text-center font-semibold">Nanocl Registry</h1>
      <h2 className="text-2xl text-center font-medium">{version}</h2>
      <h3 className="text-lg text-center font-medium text-muted-foreground">
        Browse and deploy production-ready Statefiles for Nanocl
      </h3>
      <SearchableList items={list as any} version={version} />
    </div>
  )
}
