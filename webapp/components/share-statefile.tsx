"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Check, Share2 } from "lucide-react"
import { Button } from "@next-hat/ui/components/ui/button"
import { Input } from "@next-hat/ui/components/ui/input"

export function ShareStatefile({
  url,
  title,
  text,
}: {
  url: string
  title: string
  text?: string
}) {
  const [result, setResult] = useState<"shared" | "copied" | "manual" | null>(null)
  const [pending, setPending] = useState(false)
  const linkRef = useRef<HTMLInputElement>(null)
  const statusId = useId()

  useEffect(() => {
    if (result === "manual") {
      linkRef.current?.focus()
      linkRef.current?.select()
    }
  }, [result])

  async function share() {
    setResult(null)
    setPending(true)

    try {
      const data = { title, text, url }

      try {
        if (
          typeof navigator.share === "function" &&
          (typeof navigator.canShare !== "function" || navigator.canShare(data))
        ) {
          await navigator.share(data)
          setResult("shared")
          return
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url)
          setResult("copied")
          return
        }
      } catch {
        // A selectable link remains available when clipboard access is denied.
      }

      setResult("manual")
    } finally {
      setPending(false)
    }
  }

  const Icon = result === "copied" || result === "shared" ? Check : Share2
  const message =
    result === "copied"
      ? "Statefile link copied to clipboard."
      : result === "shared"
        ? "Statefile shared."
        : result === "manual"
          ? "Could not copy automatically. Select and copy this link."
          : ""

  return (
    <div className="w-full min-w-0">
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full"
        onClick={share}
        disabled={pending}
        aria-busy={pending}
      >
        <Icon data-icon="inline-start" aria-hidden="true" />
        Share
      </Button>
      <div id={statusId} role="status" aria-live="polite" aria-atomic="true">
        {message && (
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
      {result === "manual" && (
        <Input
          ref={linkRef}
          type="text"
          inputMode="url"
          value={url}
          readOnly
          aria-label="Statefile link"
          aria-describedby={statusId}
          className="mt-2 min-h-11"
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  )
}
