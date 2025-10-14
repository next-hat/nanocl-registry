import React from "react"

type FooterLink = {
  title: string
  href: string
  target?: React.HTMLAttributeAnchorTarget
}

function FooterLink(props: FooterLink) {
  return (
    <li>
      <a className="text-[#606770]" href={props.href}>
        {props.title}
      </a>
    </li>
  )
}

type FooterElement = {
  title: string
  links: FooterLink[]
}

function FooterElement(props: FooterElement) {
  return (
    <div className="w-full mb-4">
      <h5 className="font-bold">{props.title}</h5>
      <ul>
        {props?.links?.map((link) => (
          <FooterLink
            key={link.href}
            title={link.title}
            href={link.href}
            target={link.target}
          />
        ))}
      </ul>
    </div>
  )
}

const footerElements: FooterElement[] = [
  {
    title: "Resources",
    links: [
        {
            title: "Cloud",
            href: "https://next-hat.com",
            target: "_blank",
        },
      { title: "Docs", href: "https://docs.next-hat.com", target: "_blank" },
      { title: "Blog", href: "https://blog.next-hat.com", target: "_blank" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        title: "X",
        href: "https://x.com/next_hat",
        target: "_blank",
      },
      {
        title: "Discord",
        href: "https://discord.gg/WV4Aac8uZg",
        target: "_blank",
      },
      {
        title: "Discussion",
        href: "https://github.com/orgs/next-hat/discussions",
        target: "_blank",
      },
    ],
  },
  {
    title: "More",
    links: [
      {
        title: "Status",
        href: "https://status.next-hat.com",
        target: "_blank",
      },
      {
        title: "Github",
        href: "https://github.com/next-hat",
        target: "_blank",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/legal/privacy-policy" },
      { title: "Terms of Service", href: "/legal/tos" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-background px-8 shadow">
      <div className="flex flex-col border-t sm:flex-row sm:justify-center sm:items-start pt-8 gap-8 mb-8">
        {footerElements.map((element) => (
          <FooterElement
            key={element.title}
            title={element.title}
            links={element.links}
          />
        ))}
      </div>
      <p className="text-sm border-t py-8 text-center text-[#606770]">
        &copy; {new Date().getFullYear()} Next Hat. All rights reserved.
      </p>
    </footer>
  )
}