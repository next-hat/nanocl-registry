import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdown from "react-markdown"
import SyntaxHighlighter from "react-syntax-highlighter"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { statefileToMarkdown } from "../../../lib/statefileToMarkdown"

type PageProps = {
  params: Promise<{ version: string; statefile: string }>
  searchParams: Promise<{ entry: string }>
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { version, statefile } = await params
  const sParams = await searchParams
  const entry = sParams?.entry ? JSON.parse(sParams.entry) : null
  if (!entry) return {}
  const title = `${entry.name} — Nanocl Statefile`
  const description =
    entry.description || `Statefile for ${entry.name} version ${entry.version}`
  const path = `/${version}/${statefile}`
  const url = `https://nr.next-hat.com${path}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: "/logo3.png", width: 512, height: 512, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/logo3.png", alt: title }],
    },
  }
}

export default async function StatefilePage({
  params,
  searchParams,
}: PageProps) {
  const { version, statefile } = await params
  const sParams = await searchParams
  const entry = JSON.parse(sParams.entry)
  if (!entry) return notFound()
  const markdown = statefileToMarkdown(
    entry,
    `nr.next-hat.com/${version}/${statefile}`
  )
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Structured data for the statefile */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: entry.name,
            version: entry.version,
            description: entry.description || entry.about || "Nanocl Statefile",
            programmingLanguage: "YAML",
            codeRepository: `https://nr.next-hat.com/${version}/${statefile}`,
            keywords: Array.isArray(entry.tags)
              ? entry.tags.join(", ")
              : undefined,
            author: { "@type": "Organization", name: "Next Hat" },
          }),
        }}
      />
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl text-red-800 text-center font-bold my-4"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-2xl text-red-800 font-semibold my-4"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-xl text-red-800 font-semibold my-4 wrap-break-word"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-lg text-red-800 font-semibold my-4"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="text-md text-red-800 font-semibold my-4"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="text-sm text-red-800 font-semibold my-4"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:underline break-all" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 pl-2 leading-7 wrap-break-word" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="ml-6 list-disc" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="my-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-2" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground"
              {...props}
            />
          ),
          code(props) {
            const { children, className, node, ref, ...rest } = props
            const match = /language-(\w+)/.exec(className || "")
            return match ? (
              <div className="px-2">
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  customStyle={{
                    overflowX: "auto",
                    maxWidth: "86vw",
                    width: "100%",
                    display: "inline-block",
                    margin: 0,
                  }}
                />
              </div>
            ) : (
              <code {...rest} className={`pl-2 ${className}`}>
                {children}
              </code>
            )
          },
        }}
      >
        {markdown}
      </Markdown>
    </div>
  )
}
