import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@next-hat/ui/components/ui/badge"
import { Button } from "@next-hat/ui/components/ui/button"
import { ArrowLeft, ArrowUpRight, BookOpen, FileCode2 } from "lucide-react"
import Markdown from "react-markdown"
import SyntaxHighlighter from "react-syntax-highlighter"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { statefileToMarkdown } from "../../../lib/statefileToMarkdown"
import { ShareStatefile } from "@/components/share-statefile"
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
    <div className="flex min-w-0 flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(pageSchema(page)),
        }}
      />
      <Link
        href={`/${version}`}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All Statefiles
      </Link>
      <header className="flex flex-col gap-4 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-card text-primary">
            <FileCode2 className="size-5" aria-hidden="true" />
          </span>
          <Badge variant="outline">Nanocl {version}</Badge>
          <span className="font-mono text-xs text-muted-foreground">
            Statefile {statefileVersion}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {entry.name}
            </h1>
            {entry.about && (
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                {entry.about}
              </p>
            )}
          </div>
          <div className="w-full shrink-0 sm:w-40">
            <ShareStatefile
              url={absoluteUrl(page.path)}
              title={page.title}
              text={page.description}
            />
          </div>
        </div>
      </header>
      <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
        <article
          aria-label={`${entry.name} manual`}
          className="registry-prose min-w-0"
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeRaw]}
            components={{
              code(props) {
                const { children, className, node, ref, ...rest } = props
                const match = /language-(\w+)/.exec(className || "")
                return match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    useInlineStyles={false}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
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
