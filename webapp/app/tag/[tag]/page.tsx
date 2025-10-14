import { notFound } from "next/navigation";

import SearchableList from "@/components/SearchableList";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ data: string, version: string }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const sParams = await searchParams;
  if (!sParams?.data) return {};
  const title = `${tag} — ${sParams.version} — Nanocl Registry`;
  const description = `Explore ${tag} Statefiles for Nanocl ${sParams.version} on the official Next Hat registry.`;
  const url = `https://nr.next-hat.com/tag/${encodeURIComponent(tag)}`;
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
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag } = await params;
  const sParams = await searchParams;
  if (!sParams.data) return notFound();
  const list = JSON.parse(sParams.data);
  return (
    <div className="space-y-6">
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
    <h1 className="text-4xl text-center font-semibold">Nanocl Registry</h1>
      <h2 className="text-2xl text-center font-medium">{sParams.version}</h2>
      <h3 className="text-lg text-center font-medium text-muted-foreground">
        {tag}
      </h3>
      <SearchableList items={list as any} version={sParams.version} />
    </div>
  );
}
