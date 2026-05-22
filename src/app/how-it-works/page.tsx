import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "How FreeConvert.in handles browser-based image, PDF, media and utility tools, including local processing, WebAssembly, limitations and output review.";

export const metadata: Metadata = buildPageMetadata({
  title: "How FreeConvert Works",
  description,
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <LegalPage
      title="How FreeConvert Works"
      updated="May 22, 2026"
      path="/how-it-works"
      description={description}
    >
      <LegalSection title="Browser-first processing">
        <p>
          FreeConvert.in is built around browser-first processing. For supported
          tools, your browser reads the selected file, applies the requested
          change and creates a new download on your device. This is different
          from a traditional upload converter where every file is sent to a
          remote server before work can begin.
        </p>
        <p>
          Browser-first processing is useful for routine jobs such as resizing a
          form photo, compressing a PDF, converting an image format, extracting
          text, generating a QR code or checking a file hash. The original file
          remains on your device unless you choose to share it elsewhere.
        </p>
      </LegalSection>
      <LegalSection title="What happens when you open a tool">
        <p>
          A tool page first loads the interface, instructions and crawlable
          guide content. When you select a file or enter values, the browser
          handles the input through web APIs such as FileReader, Canvas, Web
          Workers and WebAssembly-powered libraries where needed.
        </p>
        <p>
          The site creates a separate output file for download. It does not
          replace your source file. You should keep the source file until the
          new copy has been reviewed and accepted by the form, recipient or
          workflow where you plan to use it.
        </p>
      </LegalSection>
      <LegalSection title="Technology used by different tool types">
        <p>
          Image tools may use Canvas, browser encoders, image compression
          workers, EXIF readers, OCR workers or local AI models depending on the
          task. PDF tools may use PDF libraries, PDF rendering workers and
          WebAssembly for operations such as encryption or decryption. Media
          tools may use FFmpeg WebAssembly for browser-side conversion and
          compression.
        </p>
        <p>
          Utility tools such as QR generators, calculators, encoders, text
          formatters, password tools and checksum tools generally run directly
          from entered values or selected local files. These tools are designed
          for quick checks and everyday preparation work without requiring an
          account.
        </p>
      </LegalSection>
      <LegalSection title="What may load from third parties">
        <p>
          Some browser tools need large worker files, language data, models or
          public assets to perform OCR, background removal, PDF rendering or
          media conversion. Those assets may be loaded from FreeConvert.in or
          trusted public asset locations. The purpose is to give your browser
          the code or data needed to complete the task locally.
        </p>
        <p>
          Analytics, advertising, CAPTCHA and contact-form services may also
          load third-party scripts where enabled and where consent rules allow.
          These services are described in the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/cookie-policy">Cookie Policy</Link>.
        </p>
      </LegalSection>
      <LegalSection title="Limitations">
        <p>
          Local processing depends on your device, memory, browser support and
          file size. A very large PDF, high-resolution video or complex image
          may take longer or fail on an older phone. Browser support for formats
          such as AVIF, WebP, HEIC or specific video codecs can also vary.
        </p>
        <p>
          Some operations are best-effort. A target KB compressor may not hit an
          exact size without damaging quality. OCR may misread blurry text. PDF
          permission settings may behave differently across viewers. Always
          review the downloaded result before relying on it.
        </p>
      </LegalSection>
      <LegalSection title="How to review outputs">
        <p>
          For images, check dimensions, format, file size, transparency, sharp
          edges and important details such as faces, signatures or text. For
          PDFs, check page order, page count, readability, passwords,
          redactions, metadata and final file size. For QR codes, scan the code
          with another device before printing or sharing it.
        </p>
        <p>
          If a destination has strict upload rules, compare the output against
          those rules before submitting. If the output is rejected, return to
          the original file or a clean intermediate copy rather than repeatedly
          editing a degraded download.
        </p>
      </LegalSection>
      <LegalSection title="Independent website note">
        <p>
          FreeConvert.in is an independent browser-based tools website. It is
          not affiliated with similarly named converter websites unless a
          relationship is stated clearly on this site. The site uses its own
          pages, tool descriptions, policies and guides.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
