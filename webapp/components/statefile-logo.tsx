"use client"

import { useState } from "react"
import { FileCode2 } from "lucide-react"

type StatefileLogoProps = { src?: string; name: string }

function LogoContent({ src, name }: StatefileLogoProps) {
  const [failed, setFailed] = useState(false)

  return (
    <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card has-[img]:bg-white">
      {src && !failed ? (
        <img
          src={src}
          alt={`${name} logo`}
          width={64}
          height={64}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="size-full object-contain p-2"
        />
      ) : (
        <FileCode2 className="size-6 text-primary" aria-hidden="true" />
      )}
    </span>
  )
}

export function StatefileLogo({ src, name }: StatefileLogoProps) {
  return <LogoContent key={src ?? ""} src={src} name={name} />
}
