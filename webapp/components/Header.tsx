"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Feedback state
  const [feedbackOpen, setFeedbackOpen] = React.useState(false)
  const [feedbackText, setFeedbackText] = React.useState("")
  const [sending, setSending] = React.useState(false)

  const toggleMenu = React.useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [setIsMenuOpen])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <div className="relative flex z-20">
        <nav className="fixed z-50 w-full top-0 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="px-6">
            <div className="flex h-15 items-center justify-between">
              <div className="flex flex-row items-center">
                <Link href="/" className="flex items-center min-w-[120px]">
                  <div className="mr-2 w-[32px]">
                    <Image
                      src="/logo3.png"
                      className="rounded-full shadow"
                      priority
                      alt="Next Hat Logo"
                      width={32}
                      height={32}
                    />
                  </div>
                  <b className="flex-auto text-[14px]">Next Hat</b>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}