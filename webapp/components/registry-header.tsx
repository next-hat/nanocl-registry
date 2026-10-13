"use client"

import Link from "next/link"
import {
  PublicHeader,
  PublicHeaderBrand,
  PublicHeaderLink,
  PublicHeaderNavigation,
} from "@next-hat/ui/components/header/public-header"
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
    <PublicHeader
      position="fixed"
      brand={<PublicHeaderBrand section="Registry" />}
    >
      <PublicHeaderNavigation aria-label="Main navigation" className="md:flex">
        {links.map(({ title, href, current }) => (
          <PublicHeaderLink key={href} href={href} active={current}>
            {title}
          </PublicHeaderLink>
        ))}
      </PublicHeaderNavigation>
      <div className="flex items-center gap-2">
        <ThemeSwitcher variant="ghost" />
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
    </PublicHeader>
  )
}
