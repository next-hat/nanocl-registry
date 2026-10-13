"use client"

import { useState } from "react"
import { FileCode2 } from "lucide-react"

type StatefileLogoProps = {
  src?: string
  name: string
  size?: "sm" | "lg"
}

function LogoContent({ src, name, size = "lg" }: StatefileLogoProps) {
  const [failed, setFailed] = useState(false)

  return (
    <span
      data-size={size}
      className="group/logo flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card has-[img]:bg-white data-[size=sm]:size-10 data-[size=sm]:rounded-lg"
    >
      {src && !failed ? (
        <img
          src={src}
          alt={`${name} logo`}
          width={size === "sm" ? 40 : 64}
          height={size === "sm" ? 40 : 64}
          decoding="async"
          referrerPolicy="no-referrer"
          ref={(image) => {
            // A failed image may finish loading before hydration attaches onError.
            if (image?.complete && image.naturalWidth === 0) setFailed(true)
          }}
          onError={() => setFailed(true)}
          className="size-full object-contain p-2 group-data-[size=sm]/logo:p-1"
        />
      ) : (
        <FileCode2
          className="size-6 text-primary group-data-[size=sm]/logo:size-5"
          aria-hidden="true"
        />
      )}
    </span>
  )
}

export function StatefileLogo({ src, name, size }: StatefileLogoProps) {
  return <LogoContent key={src ?? ""} src={src} name={name} size={size} />
}
