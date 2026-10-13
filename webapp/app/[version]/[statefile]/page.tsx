import type { Metadata } from "next"
import { isValidElement, type ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@next-hat/ui/components/ui/badge"
import { Button } from "@next-hat/ui/components/ui/button"
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react"
import Markdown from "react-markdown"
import SyntaxHighlighter from "react-syntax-highlighter"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { statefileToMarkdown } from "../../../lib/statefileToMarkdown"
import { ShareStatefile } from "@/components/share-statefile"
import { StatefileCodeBlock } from "@/components/statefile-code-block"
import { StatefileLogo } from "@/components/statefile-logo"
import {
  absoluteUrl,
  pageMetadata,
  pageSchema,
  serializeJsonLd,
  statefileSeo,
  type StatefileEntry,
} from "@/lib/seo"

type PageProps = {
  params: Promise<{ version: string; statefile: string }>
  searchParams: Promise<{ entry?: string }>
}

type ManualEntry = StatefileEntry & {
  about: string
  tags: string[]
  yamlText: string
}

function parseEntry(serialized: string | undefined): ManualEntry {
  let entry: unknown
  try {
    entry = JSON.parse(serialized ?? "")
  } catch {
    notFound()
  }
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) notFound()
  const item = entry as Record<string, unknown>
  if (
    typeof item.name !== "string" ||
    !item.name ||
    typeof item.about !== "string" ||
    !Array.isArray(item.tags) ||
    !item.tags.every((tag: unknown) => typeof tag === "string") ||
    typeof item.yamlText !== "string" ||
    !item.yamlText ||
    (item.slug !== undefined && typeof item.slug !== "string") ||
    (item.longAbout !== undefined && typeof item.longAbout !== "string") ||
    (item.logoUrl !== undefined && typeof item.logoUrl !== "string") ||
    (item.version !== undefined && typeof item.version !== "string") ||
    (item.latestVersion !== undefined && typeof item.latestVersion !== "string") ||
    !(
      (typeof item.version === "string" && item.version) ||
      (typeof item.latestVersion === "string" && item.latestVersion)
    )
  ) {
    notFound()
  }
  return entry as ManualEntry
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { version, statefile } = await params
  const sParams = await searchParams
  const entry = parseEntry(sParams.entry)
  return pageMetadata(statefileSeo(version, statefile, entry))
}

export default async function StatefilePage({
  params,
  searchParams,
}: PageProps) {
  const { version, statefile } = await params
  const sParams = await searchParams
  const entry = parseEntry(sParams.entry)
  const page = statefileSeo(version, statefile, entry)
  const statefileVersion = entry.version ?? entry.latestVersion
  const markdown = statefileToMarkdown(
    entry,
    absoluteUrl(page.path).replace(/^https:\/\//, "")
  )
  return (
    <div className="flex min-w-0 w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(pageSchema(page)),
        }}
      />
      <header className="statefile-hero relative isolate w-full overflow-hidden border-b border-border py-8 sm:py-10">
        <div className="registry-container relative flex flex-col gap-8">
          <Link
            href={`/${version}`}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All Statefiles
          </Link>
          <div className="flex flex-col items-center gap-5 pb-8 text-center sm:pb-10">
            <StatefileLogo src={entry.logoUrl} name={entry.name} />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="outline">Nanocl {version}</Badge>
              <span className="font-mono text-xs text-muted-foreground">
                Statefile {statefileVersion}
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-balance md:text-6xl lg:text-7xl">
              {entry.name}
            </h1>
            {entry.about && (
              <p className="max-w-2xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
                {entry.about}
              </p>
            )}
            <div className="w-full max-w-40">
              <ShareStatefile
                url={absoluteUrl(page.path)}
                title={page.title}
                text={page.description}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="registry-container grid min-w-0 items-start gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
        <article
          aria-label={`${entry.name} manual`}
          className="registry-prose min-w-0"
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeRaw]}
            components={{
              pre({ children }) {
                if (!isValidElement<{ children?: ReactNode; className?: string }>(children)) {
                  return <pre>{children}</pre>
                }
                const code = String(children.props.children ?? "").replace(/\n$/, "")
                const language = /language-([\w-]+)/.exec(children.props.className || "")?.[1]
                return (
                  <StatefileCodeBlock key={code} code={code} language={language}>
                    <SyntaxHighlighter
                      language={language || "text"}
                      useInlineStyles={false}
                      PreTag="pre"
                    >
                      {code}
                    </SyntaxHighlighter>
                  </StatefileCodeBlock>
                )
              },
            }}
          >
            {markdown.replace(/^# Statefile Manual\n\n/, "")}
          </Markdown>
        </article>
        <aside
          aria-label="Statefile details"
          className="flex min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">About this Statefile</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Nanocl</dt>
                <dd className="font-mono">{version}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-mono">{statefileVersion}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Format</dt>
                <dd className="font-mono">YAML</dd>
              </div>
            </dl>
            {entry.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" asChild>
                    <Link href={`/tag/${encodeURIComponent(tag)}`}>{tag}</Link>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <p className="text-sm leading-6 text-muted-foreground">
              Review the manual before applying this Statefile to your
              infrastructure.
            </p>
            <Button variant="outline" asChild className="min-h-11">
              <a href="https://docs.next-hat.com/references/nanocl/statefile">
                <BookOpen data-icon="inline-start" aria-hidden="true" />
                Statefile reference
                <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
