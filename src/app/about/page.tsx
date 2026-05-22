import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "About FreeConvert, a free browser-based image, PDF, media and utility tools website built for private local processing.";

export const metadata: Metadata = buildPageMetadata({
  title: "About FreeConvert",
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalPage
      title="About"
      updated="May 22, 2026"
      path="/about"
      description={description}
      schemaType="AboutPage"
    >
      <LegalSection title="What FreeConvert Is">
        <p>
          FreeConvert is a collection of free browser-based tools for images,
          PDFs, media files, QR codes, text, calculators, colors, passwords,
          developer tasks and file utilities. The site is built for everyday
          jobs such as resizing a form photo, compressing a PDF, converting an
          iPhone image, generating a UPI QR code or checking a file hash.
        </p>
      </LegalSection>
      <LegalSection title="Mission">
        <p>
          The goal is to make practical file preparation available without a
          signup wall and without unnecessary server uploads for routine tasks.
          Many users only need to make a file smaller, change a format, fix page
          order or copy text from an image. FreeConvert focuses on those direct
          workflows.
        </p>
        <p>
          The site is especially mindful of common Indian upload workflows such
          as exam photos, job applications, university forms, certificates,
          Aadhaar-style document copies, PDF size limits and UPI sharing, while
          remaining useful for global English-speaking users.
        </p>
      </LegalSection>
      <LegalSection title="How It Works">
        <p>
          Supported tools use browser File APIs, Canvas, Web Workers,
          WebAssembly, PDF libraries, media libraries and OCR or image models
          that can run locally. This means many selected files are processed on
          your device and the output is created as a new download.
        </p>
        <p>
          Some tools need large browser assets to load before processing starts.
          That can take longer on slower networks or older devices, but it helps
          keep the core workflow local when the browser can complete the task
          reliably.
        </p>
        <p>
          A more detailed explanation is available on the{" "}
          <Link href="/how-it-works">How FreeConvert Works</Link> page,
          including limitations, third-party assets and output review steps.
        </p>
      </LegalSection>
      <LegalSection title="Privacy Philosophy">
        <p>
          FreeConvert does not require accounts for ordinary tool use. The
          design favors direct pages, clear controls and local processing where
          practical. Users should still review outputs, protect sensitive files
          and follow the requirements of the institution or recipient receiving
          the final document.
        </p>
      </LegalSection>
      <LegalSection title="Content Standards">
        <p>
          Tool pages include practical notes, common questions, related tools
          and educational guide links. The blog explains common workflows such
          as reducing image size, preparing passport photos, understanding PDF
          passwords, choosing image formats and checking upload limits.
        </p>
        <p>
          The content is written to help users understand the task before they
          select a file. That matters because choosing the wrong format,
          dimensions, compression level or PDF operation can cause rejected
          uploads and repeated work.
        </p>
        <p>
          Guides are written and reviewed under the{" "}
          <Link href="/editorial-policy">FreeConvert Editorial Policy</Link>.
          The policy explains how topics are selected, how tool pages are
          reviewed and how corrections can be requested.
        </p>
      </LegalSection>
      <LegalSection title="Technology Stack">
        <p>
          The current site is built with Next.js, React, TypeScript and Tailwind
          CSS. File workflows use browser APIs and specialized client-side
          libraries for images, PDFs, QR codes, OCR, media processing and
          archive handling. Heavy libraries are loaded only for the tools that
          need them.
        </p>
      </LegalSection>
      <LegalSection title="What The Site Offers">
        <p>
          FreeConvert currently includes image tools, PDF tools, media tools,
          QR tools, text tools, calculators, color tools, password tools,
          developer utilities and file tools. Popular workflows include
          Compress Image, Resize Image, HEIC to JPG, Merge PDF, Compress PDF,
          Edit PDF, QR Code Generator, Word Counter and Video Compressor.
        </p>
      </LegalSection>
      <LegalSection title="Maintenance and Roadmap">
        <p>
          The site is maintained as browser capabilities improve. Future work
          may include deeper guides, more India-specific file-preparation
          examples, improved previews, additional PDF workflows, richer media
          controls and clearer accessibility improvements across tool pages.
        </p>
      </LegalSection>
      <LegalSection title="Open Source Acknowledgments">
        <p>
          FreeConvert relies on the broader web and open-source ecosystem,
          including libraries for PDF manipulation, browser image processing,
          QR generation, OCR, media conversion, UI primitives and icons. Those
          projects make it possible to build useful client-side tools on the
          modern web.
        </p>
      </LegalSection>
      <LegalSection title="Independent Website">
        <p>
          FreeConvert.in is an independent browser-based tools website. It does
          not claim affiliation with similarly named converter websites unless a
          relationship is stated clearly on this site. The content, policies and
          tool pages are maintained for FreeConvert.in users.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          For bug reports, feature requests, privacy questions, copyright
          notices or business questions, use the{" "}
          <Link href="/contact">contact page</Link>. For copyright notices, you
          can also email{" "}
          <a href="mailto:dmca@freeconvert.in">dmca@freeconvert.in</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
