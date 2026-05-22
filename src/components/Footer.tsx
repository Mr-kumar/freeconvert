import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { pdfTools, tools } from "@/lib/tools";
import { utilityTools } from "@/lib/utilityTools";

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "DMCA", href: "/dmca" },
];

const company = [
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Search", href: "/search" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#dadce0] bg-[#f8f9fa]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link className="inline-flex" href="/" aria-label="FreeConvert home">
              <BrandLogo textClassName="text-xl" />
            </Link>
            <p className="mt-3 max-w-60 text-sm leading-6 text-[#5f6368]">
              Free online image, PDF and utility tools. 100% client-side. Your
              files and inputs stay on your device.
            </p>
            <p className="mt-4 text-xs font-medium leading-5 text-[#5f6368]">
              No required account. No file upload for supported browser tools.
            </p>
            <p className="mt-3 text-xs leading-5 text-[#5f6368]">
              FreeConvert.in is an independent browser-based tools website.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#3c4043]">
              Image Tools
            </p>
            <ul className="space-y-2.5">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    className="inline-block py-1 text-sm text-[#5f6368] transition-colors hover:text-[#202124] hover:underline"
                    href={tool.href}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="inline-block py-1 text-sm font-semibold text-[#1a73e8] hover:underline"
                  href="/#image-tools"
                >
                  View all image tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#3c4043]">
              PDF Tools
            </p>
            <ul className="space-y-2.5">
              {pdfTools.slice(0, 10).map((tool) => (
                <li key={tool.href}>
                  <Link
                    className="inline-block py-1 text-sm text-[#5f6368] transition-colors hover:text-[#202124] hover:underline"
                    href={tool.href}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="inline-block py-1 text-sm font-semibold text-[#1a73e8] hover:underline"
                  href="/pdf-tools"
                >
                  View all PDF tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#3c4043]">
              Company
            </p>
            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-block py-1 text-sm text-[#5f6368] transition-colors hover:text-[#202124] hover:underline"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#3c4043]">
              Utility Tools
            </p>
            <ul className="space-y-2.5">
              {utilityTools.slice(0, 10).map((tool) => (
                <li key={tool.href}>
                  <Link
                    className="inline-block py-1 text-sm text-[#5f6368] transition-colors hover:text-[#202124] hover:underline"
                    href={tool.href}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="inline-block py-1 text-sm font-semibold text-[#1a73e8] hover:underline"
                  href="/#qr-tools"
                >
                  View all utility tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#dadce0] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#3c4043]">
            Legal
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex md:flex-wrap md:gap-x-5 md:gap-y-2">
            {legal.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-12 items-center text-sm text-[#5f6368] transition-colors hover:text-[#202124] hover:underline md:min-h-9"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#dadce0] pt-6 text-xs text-[#5f6368] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FreeConvert.in. All rights reserved.</p>
          <p>Made in India.</p>
          <p className="max-w-sm md:text-right">
            Ads may be served by Google AdSense after consent.{" "}
            <Link className="font-semibold text-[#1a73e8] hover:underline" href="/privacy-policy">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
