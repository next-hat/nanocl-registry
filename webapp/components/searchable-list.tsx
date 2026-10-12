"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@next-hat/ui/components/ui/badge"
import { Button } from "@next-hat/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@next-hat/ui/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@next-hat/ui/components/ui/empty"
import { ArrowUpRight, Package, SearchX } from "lucide-react"

import SearchBar from "./search-bar"

export interface StatefileItem {
  slug: string
  name: string
  about: string
  latestVersion: string
  tags: string[]
}

export default function SearchableList({
  items,
  version,
  placeholder = "Search by name, tag, or description",
}: {
  items: StatefileItem[]
  version: string
  placeholder?: string
}) {
  const [q, setQ] = React.useState("")
  const query = q.trim().toLowerCase()
  const filtered = !query
    ? items
    : items.filter((s) => {
        const inName =
          s.name.toLowerCase().includes(query) ||
          s.slug.toLowerCase().includes(query)
        const inAbout = (s.about || "").toLowerCase().includes(query)
        const inTags = (s.tags || []).some((t) =>
          t.toLowerCase().includes(query)
        )
        return inName || inAbout || inTags
      })
  return (
    <section aria-label="Statefile catalog" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xl">
          <SearchBar
            id="global-search-input"
            placeholder={placeholder}
            onChange={setQ}
            value={q}
          />
        </div>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="shrink-0 text-sm text-muted-foreground tabular-nums"
        >
          <span className="font-medium text-foreground">{filtered.length}</span>
          {query ? ` of ${items.length}` : ""}{" "}
          {filtered.length === 1 ? "Statefile" : "Statefiles"}
        </p>
      </div>
      {filtered.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.slug} className="min-w-0">
              <Card className="h-full transition-colors hover:ring-primary/30 [--card-spacing:--spacing(6)]">
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Package className="size-5" aria-hidden="true" />
                    </div>
                    <Badge
                      variant="outline"
                      className="font-mono text-muted-foreground"
                    >
                      {s.latestVersion}
                    </Badge>
                  </div>
                  <CardTitle>
                    <h2>
                      <Link
                        href={`/${version}/${s.slug}`}
                        className="break-words rounded-sm outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {s.name}
                      </Link>
                    </h2>
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {s.about}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <Badge key={t} variant="secondary" asChild>
                        <Link href={`/tag/${encodeURIComponent(t)}`}>#{t}</Link>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-10 w-full justify-between"
                  >
                    <Link
                      href={`/${version}/${s.slug}`}
                      aria-label={`View manual for ${s.name}`}
                    >
                      View manual
                      <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="border border-border bg-card py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>
              <h2>
                {query ? "No matching Statefiles" : "No Statefiles available"}
              </h2>
            </EmptyTitle>
            <EmptyDescription>
              {query
                ? "Try another name, description, or tag to find a Statefile."
                : "There are no Statefiles in this collection yet."}
            </EmptyDescription>
          </EmptyHeader>
          {query && (
            <EmptyContent>
              <Button
                variant="outline"
                className="h-10"
                onClick={() => {
                  setQ("")
                  document.getElementById("global-search-input")?.focus()
                }}
              >
                Clear search
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}
    </section>
  )
}
