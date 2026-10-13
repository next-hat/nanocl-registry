"use client"

import Image from "next/image"
import Link from "next/link"
import { ThemeSwitcher } from "@next-hat/ui/components/theme-switcher"
import { Button } from "@next-hat/ui/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@next-hat/ui/components/ui/sheet"
import { HiOutlineBars3 } from "react-icons/hi2"

const links = [
  { title: "Registry", href: "/", current: true },
  { title: "Documentation", href: "https://docs.next-hat.com" },
  { title: "Next Hat", href: "https://next-hat.com" },
]

export function RegistryHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Nanocl Registry home"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Image
            src="/logo3.png"
            alt=""
            width={32}
            height={32}
            priority
            className="rounded-full"
          />
          <span className="text-sm font-semibold">Next Hat</span>
          <span
            aria-hidden="true"
            className="hidden px-2 text-sm text-muted-foreground/45 sm:inline"
          >
            /
          </span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Registry
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="ml-auto hidden items-center gap-6 md:flex"
        >
          {links.map(({ title, href, current }) => (
            <Link
              key={href}
              href={href}
              aria-current={current ? "page" : undefined}
              className="py-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:underline-offset-8"
            >
              {title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher variant="ghost" className="size-11" />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 md:hidden"
                aria-label="Open navigation"
              >
                <HiOutlineBars3 aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              aria-describedby={undefined}
              className="flex h-dvh max-w-sm flex-col gap-8 overflow-y-auto data-[side=right]:w-full [&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center"
            >
              <SheetHeader>
                <SheetTitle>Explore Next Hat</SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-2 px-4"
              >
                {links.map(({ title, href, current }) => (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      aria-current={current ? "page" : undefined}
                      className="flex min-h-12 items-center rounded-md px-3 text-lg hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:font-semibold"
                    >
                      {title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
