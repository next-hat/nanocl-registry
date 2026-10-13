"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@next-hat/ui/components/ui/button"
import { Textarea } from "@next-hat/ui/components/ui/textarea"

export function StatefileCodeBlock({
  code,
  language,
  children,
}: {
  code: string
  language?: string
  children: ReactNode
}) {
  const [result, setResult] = useState<"copied" | "manual" | null>(null)
  const [pending, setPending] = useState(false)
  const codeRef = useRef<HTMLTextAreaElement>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(false)
  const statusId = useId()

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (resetTimer.current !== null) clearTimeout(resetTimer.current)
    }
  }, [])

  useEffect(() => {
    if (result === "manual") {
      codeRef.current?.focus()
      codeRef.current?.select()
    }
  }, [result])

  async function copyCode() {
    if (resetTimer.current !== null) {
      clearTimeout(resetTimer.current)
      resetTimer.current = null
    }
    setResult(null)
    setPending(true)

    try {
      if (!navigator.clipboard?.writeText) {
        setResult("manual")
        return
      }

      await navigator.clipboard.writeText(code)
      if (!mounted.current) return
      setResult("copied")
      resetTimer.current = setTimeout(() => {
        setResult(null)
        resetTimer.current = null
      }, 2000)
    } catch {
      if (mounted.current) setResult("manual")
    } finally {
      if (mounted.current) setPending(false)
    }
  }

  const Icon = result === "copied" ? Check : Copy
  const languageLabel =
    language === "yml" ? "YAML" : (language ?? "code").toUpperCase()
  const message =
    result === "copied"
      ? "Code copied to clipboard."
      : result === "manual"
        ? "Could not copy automatically. Select and copy the code below."
        : ""

  return (
    <div className="registry-code-block min-w-0 overflow-hidden rounded-lg border border-border bg-muted">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-background/50 px-4 py-1">
        <span className="min-w-0 truncate font-mono text-xs font-medium text-muted-foreground">
          {languageLabel}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-h-11"
          onClick={copyCode}
          disabled={pending}
          aria-busy={pending}
          aria-label={result === "copied" ? "Code copied" : "Copy code"}
        >
          <Icon data-icon="inline-start" aria-hidden="true" />
          {result === "copied" ? "Copied" : "Copy"}
        </Button>
      </div>
      {children}
      <span
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </span>
      {result === "manual" && (
        <div className="flex min-w-0 flex-col gap-3 border-t border-border p-4">
          <div className="text-sm text-muted-foreground">{message}</div>
          <Textarea
            ref={codeRef}
            value={code}
            readOnly
            wrap="off"
            spellCheck={false}
            aria-label="Code to copy"
            aria-describedby={statusId}
            className="max-h-64 min-h-32 resize-y font-mono"
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </div>
  )
}
