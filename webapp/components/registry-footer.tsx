import Image from "next/image"
import Link from "next/link"
import { Separator } from "@next-hat/ui/components/ui/separator"

const groups = [
  {
    title: "Build",
    links: [
      ["Managed servers", "https://next-hat.com/products/servers"],
      ["Open source", "https://next-hat.com/oss"],
      ["Documentation", "https://docs.next-hat.com"],
      ["Nanocl Registry", "/"],
    ],
  },
  {
    title: "Connect",
    links: [
      ["Contact", "https://next-hat.com/contact"],
      ["Sponsorship", "https://next-hat.com/sponsorship"],
      ["GitHub", "https://github.com/next-hat"],
      ["Discord", "https://discord.gg/WV4Aac8uZg"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Blog", "https://docs.next-hat.com/blog"],
      ["Service status", "https://status.next-hat.com"],
      ["Privacy policy", "https://next-hat.com/legal/privacy-policy"],
      ["Terms of service", "https://next-hat.com/legal/tos"],
    ],
  },
]

export function RegistryFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 py-14 lg:grid-cols-[1.1fr_2fr] lg:py-20">
          <div className="flex flex-col items-start gap-5">
            <Link
              href="https://next-hat.com"
              className="flex items-center gap-3 text-xl font-semibold tracking-tight"
            >
              <Image
                src="/logo3.png"
                alt=""
                width={36}
                height={36}
                className="rounded-full"
              />
              Next Hat
            </Link>
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Open tools. Your infrastructure.
              <br />
              Built together, one contribution at a time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map(({ title, links }) => (
              <nav
                key={title}
                aria-label={title}
                className="flex flex-col items-start gap-3"
              >
                <h2 className="mb-2 text-sm font-semibold">{title}</h2>
                {links.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="py-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3 py-7 text-xs leading-6 text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Next Hat. All rights reserved.</p>
          <p>Promote a brighter future through open source.</p>
        </div>
      </div>
    </footer>
  )
}
