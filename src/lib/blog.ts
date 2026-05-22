import { BASE_URL } from "@/lib/tools";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  relatedTools?: {
    label: string;
    href: string;
  }[];
  relatedPosts?: {
    title: string;
    slug: string;
  }[];
  sections: {
    heading: string;
    body: string[];
  }[];
}

export function blogPostImagePath(post: Pick<BlogPost, "slug">) {
  return `/blog/${post.slug}/opengraph-image`;
}

const baseBlogPosts: BlogPost[] = [
  {
    slug: "compress-image-without-quality-loss",
    title: "How to Compress an Image Without Losing Quality",
    description:
      "Practical settings for reducing image file size while keeping photos, screenshots and graphics sharp.",
    publishedAt: "2026-05-09",
    updatedAt: "2026-05-22",
    readTime: "9 min read",
    relatedTools: [
      { label: "Compress Image", href: "/compress-image" },
      { label: "Resize Image", href: "/resize-image" },
      { label: "Convert Image", href: "/convert-image" },
    ],
    relatedPosts: [
      { title: "File Upload Size Limits: A Checklist", slug: "file-upload-size-limits-checklist" },
      { title: "JPEG vs PNG vs WebP vs AVIF", slug: "jpeg-png-webp-avif-differences" },
    ],
    sections: [
      {
        heading: "Start with the right format",
        body: [
          "Good compression starts before you touch the quality slider. Photos usually compress best as JPEG or WebP because those formats are designed for natural color transitions, faces, backgrounds and camera noise. Screenshots, logos, icons and images with transparent backgrounds usually behave better as PNG or WebP because sharp edges and flat colors can look damaged when saved as a low-quality JPEG.",
          "If the website or form accepts WebP, try it for web publishing because it often gives a smaller file than JPEG at the same visible quality. If the destination is a government form, university portal, job application or older CMS, check the accepted file types first. Many strict portals still ask for JPG or PNG only, so the technically smallest format is not always the correct choice.",
        ],
      },
      {
        heading: "Resize before heavy compression",
        body: [
          "A camera photo can be 3000 to 6000 pixels wide even when the final upload preview is tiny. Compressing that full-resolution image very aggressively can create visible blocks and soft details. A cleaner approach is to resize to the dimensions the destination actually needs, then compress the resized copy to the target file size.",
          "For example, if a form asks for a 200 x 230 pixel photo under 50 KB, resizing first removes unnecessary pixels while keeping the face framed correctly. After that, the compressor has a much easier job. This order is especially important for exam photos, profile photos, ID-style uploads and document scans where the subject must remain readable.",
        ],
      },
      {
        heading: "Use target KB carefully",
        body: [
          "Target KB compression is useful when the destination gives a strict limit such as 35 KB, 50 KB, 100 KB or 2 MB. It is better than guessing random quality values because the tool can attempt the export around the size you actually need. Still, a target size is not magic; some images cannot reach a very small size without visible quality loss.",
          "If the target is too low, reduce dimensions slightly before lowering quality further. Faces, signatures, QR codes, barcodes and small document text should be checked after each export. The best compressed file is not simply the smallest one; it is the smallest file that still passes visual review and the upload requirement.",
        ],
      },
      {
        heading: "Know what quality loss looks like",
        body: [
          "Compression damage often appears first around text, hair, high-contrast edges, gradients and smooth backgrounds. JPEG artifacts look like small square blocks or fuzzy edges. PNG-to-WebP compression can make small text softer if the quality is pushed too low. A quick preview at normal size and at 100 percent zoom catches most problems before you upload the result.",
          "For photographs, a moderate quality setting can look almost identical to the original while saving a large amount of space. For screenshots and graphics, the safe setting may be higher because thin lines and letters reveal damage quickly. Always judge the output based on the purpose of the file, not only the number shown in KB.",
        ],
      },
      {
        heading: "Avoid repeated exports",
        body: [
          "Every lossy export can remove detail. If you compress a file, download it, upload that result again and compress it a second time, the visible quality can degrade faster than expected. Keep the original image safe, create one resized working copy and export the final compressed version from that cleaner source.",
          "Use clear file names such as photo-resized.jpg or signature-under-50kb.jpg so you can identify the final copy during upload. Do not delete the original until the portal, email recipient or website accepts the compressed image. If the first attempt is rejected, returning to the original gives you a cleaner second attempt.",
        ],
      },
      {
        heading: "Checklist before upload",
        body: [
          "Before uploading, confirm the format, dimensions and file size. Open the downloaded image once, especially when the file is for an application, identity proof, certificate, product listing or client document. Look for cropped edges, stretched faces, blurry text, color shifts and missing transparent areas.",
          "If the upload still fails, read the error message carefully. A portal may reject the file because the extension is wrong, the dimensions are outside the allowed range or the file name contains unsupported characters. Compression solves file size, but it does not automatically solve every upload rule.",
        ],
      },
    ],
  },
  {
    slug: "resize-image-for-online-forms",
    title: "How to Resize an Image for Online Forms",
    description:
      "A practical checklist for resizing photos for exams, applications, IDs and government portals.",
    publishedAt: "2026-05-09",
    updatedAt: "2026-05-22",
    readTime: "8 min read",
    relatedTools: [
      { label: "Resize Image", href: "/resize-image" },
      { label: "Compress Image", href: "/compress-image" },
      { label: "Crop Image", href: "/crop-image" },
    ],
    relatedPosts: [
      { title: "Passport Photos for Indian Government Forms", slug: "how-to-prepare-passport-photos-for-indian-government-forms" },
      { title: "File Upload Size Limits: A Checklist", slug: "file-upload-size-limits-checklist" },
    ],
    sections: [
      {
        heading: "Read the form requirement first",
        body: [
          "Most upload forms mention at least one rule: pixel dimensions, file size, image format or physical size. Some mention all of them. A typical instruction may say JPG only, 200 x 230 pixels, under 50 KB, with a light background. Write those rules down before editing because changing settings in the wrong order can cause repeated exports.",
          "The safest sequence is crop, resize and then compress. Cropping frames the face or document. Resizing sets the required width and height. Compression reduces the final KB size only after the shape and dimensions are correct. This sequence avoids the common mistake of shrinking quality first and then discovering that the image still has the wrong dimensions.",
        ],
      },
      {
        heading: "Pixels, centimeters and DPI",
        body: [
          "Online forms usually validate pixel dimensions rather than physical centimeters. A centimeter value becomes meaningful only when paired with DPI. For example, a 3.5 x 4.5 cm photo at 300 DPI is different from the same centimeter size at 96 DPI. If the portal gives pixels, use pixels directly because that is usually what the upload checker reads.",
          "If the form gives centimeters only, check whether it also mentions DPI. If it does not, use the form's examples or help page when available. For printing, centimeters matter more. For online upload, exact pixel width, height and file size are usually the rules that decide whether the file is accepted.",
        ],
      },
      {
        heading: "Keep the aspect ratio unless the form says otherwise",
        body: [
          "Aspect ratio controls the relationship between width and height. If you force a portrait photo into a square without cropping, the face can look stretched. If you force a document photo into a narrow size, text can become distorted. Locking aspect ratio keeps the image natural while you adjust one dimension.",
          "When a form requires an exact width and height, crop to that shape first. After the subject fits the crop area, resize to the required pixels. This is better than stretching the whole image because it preserves the shape of the face, document, signature or logo.",
        ],
      },
      {
        heading: "Choose the right output format",
        body: [
          "JPG is the safest format for most passport photos, ID photos and general form images. It creates small files and is accepted by older portals. PNG is better for signatures, screenshots and images that need crisp edges or transparency, but PNG files can be larger. WebP is efficient but not always accepted by strict portals.",
          "If the instructions say JPG or JPEG, do not upload PNG even if it looks better. If the instructions say max 50 KB, do not only resize and ignore file size. The final download must match all rules together: format, dimensions and size.",
        ],
      },
      {
        heading: "Preview the important area",
        body: [
          "After resizing, inspect the image at the size where it will be used. For a photo, check that the face is centered, eyes are visible and the background still meets the rule. For a signature, check that the ink line is not too faint. For a document, check that edges and text remain readable.",
          "Many upload failures are caused by small details: the file is 52 KB instead of 50 KB, the photo is 199 pixels wide instead of 200, or the filename contains special characters. A short review before upload saves time, especially when the portal has slow or limited retry attempts.",
        ],
      },
      {
        heading: "Keep versions organized",
        body: [
          "Use short names like form-photo-200x230.jpg or signature-20kb.png. If you prepare several versions, include the size in the filename so you do not upload the wrong one. Keep the original camera photo or scan until the application is submitted and confirmed.",
          "If a form rejects the upload, return to the original or the clean resized copy rather than editing an already compressed file again. Repeated compression can make the result blurry even when the final file size looks correct.",
        ],
      },
    ],
  },
  {
    slug: "jpeg-png-webp-avif-differences",
    title: "JPEG vs PNG vs WebP vs AVIF: Which Image Format Should You Use?",
    description:
      "Understand common image formats and choose the best output for photos, screenshots and web uploads.",
    publishedAt: "2026-05-09",
    updatedAt: "2026-05-22",
    readTime: "10 min read",
    relatedTools: [
      { label: "Convert Image", href: "/convert-image" },
      { label: "Compress Image", href: "/compress-image" },
      { label: "Image Metadata", href: "/image-metadata" },
    ],
    relatedPosts: [
      { title: "WebP vs JPG: When to Use Each Format", slug: "webp-vs-jpg-when-to-use-each-format" },
      { title: "Compress Images Without Losing Quality", slug: "compress-image-without-quality-loss" },
    ],
    sections: [
      {
        heading: "JPEG",
        body: [
          "JPEG is the most common choice for photos because it compresses natural images well and works almost everywhere. It is accepted by old browsers, email clients, upload portals, printing shops and office applications. The tradeoff is that JPEG is lossy: lower quality settings remove detail, and repeated exports can create visible artifacts.",
          "JPEG does not support transparency. If you convert a transparent logo or cutout to JPEG, the transparent area must become a solid background. That is fine for many photos but wrong for icons, stickers and design assets that need to sit on different backgrounds.",
        ],
      },
      {
        heading: "PNG",
        body: [
          "PNG is lossless and supports transparency. It is a strong choice for screenshots, icons, logos, line art, diagrams and images where crisp edges matter. It can also preserve transparent backgrounds, which makes it useful for design work and overlays.",
          "The downside is file size. PNG is often much larger than JPEG for photos because it tries to preserve exact pixel information. If a photo is saved as PNG only to meet a portal requirement, check the file size carefully. If a transparent graphic is too large, WebP may be a better delivery format when supported.",
        ],
      },
      {
        heading: "WebP",
        body: [
          "WebP supports both lossy and lossless compression, and it can preserve transparency. For websites, it is often a practical default because it can produce smaller files than JPEG or PNG while keeping good visual quality. Product photos, blog images and UI graphics can all benefit from WebP when the platform accepts it.",
          "Compatibility is the main question. Modern browsers support WebP, but some older tools, form portals and document workflows may not. If the destination clearly asks for JPG or PNG, convert to that format even if WebP would be smaller.",
        ],
      },
      {
        heading: "AVIF",
        body: [
          "AVIF can produce very small files with strong visual quality, especially for modern web delivery. It supports transparency and high compression efficiency. It is useful when you control the website or app where the image will appear and can test browser support.",
          "AVIF is less suitable for strict upload portals or workflows where compatibility matters more than size. Some browsers and apps may not decode every AVIF file. For general submissions, JPG and PNG remain safer choices.",
        ],
      },
      {
        heading: "Choosing by task",
        body: [
          "Use JPEG for photos and broad compatibility. Use PNG for transparency, screenshots and crisp graphics. Use WebP for modern web pages where smaller size matters and support is confirmed. Use AVIF when you need advanced web compression and can test the audience's browser support.",
          "For Indian exam forms, job portals and government uploads, the safest default is usually JPG for photos and PNG for signatures only when the instructions allow it. For websites, WebP is often the best balance. For archives, keep the original source file and export task-specific copies.",
        ],
      },
      {
        heading: "Conversion does not create missing quality",
        body: [
          "Converting a low-quality JPEG to PNG does not restore lost detail. It only stores the current pixels in a lossless container. Converting PNG to JPEG can reduce size but may remove transparency and introduce artifacts. Converting to WebP or AVIF can reduce size, but the result still needs visual review.",
          "Think of conversion as choosing the best container for the next use. Start from the cleanest original available, choose the format the destination accepts, then resize or compress only as much as needed.",
        ],
      },
    ],
  },
  {
    slug: "merge-pdf-files-online",
    title: "How to Merge PDF Files Online in the Right Order",
    description:
      "A practical checklist for combining PDFs, arranging pages and keeping the final file easy to share.",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-22",
    readTime: "8 min read",
    relatedTools: [
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Reorder PDF Pages", href: "/reorder-pdf-pages" },
    ],
    relatedPosts: [
      { title: "Compress PDF to a Target KB Size", slug: "compress-pdf-to-target-kb" },
      { title: "Reduce PDF Size for Email Attachments", slug: "how-to-reduce-pdf-size-for-email-attachments" },
    ],
    sections: [
      {
        heading: "Prepare source files before merging",
        body: [
          "A clean merge starts with clean source files. Rename PDFs in the order you expect them to appear, remove duplicates and check whether any file contains extra blank pages. When documents are named application.pdf, certificates.pdf and address-proof.pdf, it is easier to arrange them correctly than when every file is called scan1.pdf.",
          "If one source PDF already has pages in the wrong order, fix that first with a reorder tool. Merging disorganized files can create a longer disorganized file, which is harder to review. The goal is to make the merged document easy for another person to read from the first page to the last page.",
        ],
      },
      {
        heading: "Use a logical document order",
        body: [
          "For application packets, place the main form first, then identity proof, address proof, certificates and supporting documents. For invoices, order by date or invoice number. For reports, keep cover page, contents, body and appendix in a familiar sequence. A predictable order helps reviewers find information quickly.",
          "If the receiving portal specifies an order, follow that order exactly. Some education, visa, tender and job workflows reject documents when attachments are missing or arranged incorrectly. The merge tool can combine files, but the content order is still your responsibility.",
        ],
      },
      {
        heading: "Check page orientation and readability",
        body: [
          "Before exporting the final PDF, check whether any scanned page is sideways or upside down. Mixed orientation is common when phone scans, office scanner files and downloaded PDFs are combined. Rotate those pages before or after merging, but check them before submission.",
          "Also zoom into scanned pages. If one source file is blurry, merging will not improve it. You may need to rescan or replace that page before creating the final packet. A merged PDF should be complete and readable, not just technically combined.",
        ],
      },
      {
        heading: "Compress only after the final merge",
        body: [
          "If the destination has a size limit, compress the merged PDF after the final order is correct. Compressing each source file first can reduce quality unnecessarily, and then the final merged file may still need another compression pass. One final compression step usually gives better control.",
          "Scanned documents and image-heavy PDFs shrink the most. Text-only PDFs may already be small. If compression makes stamps, signatures or small text unreadable, use a higher quality setting and consider removing unnecessary pages instead of forcing a very small target size.",
        ],
      },
      {
        heading: "Review the exported PDF",
        body: [
          "Open the downloaded PDF in a viewer and move through the pages quickly. Confirm the first page is correct, attachments are present, page order is logical and the file opens without errors. If the document is for a deadline, do this review before the last upload step, not after a portal rejection.",
          "Check the file name as well. A clear name such as loan-application-combined.pdf or certificates-merged.pdf is easier to recognize during upload and later retrieval. Avoid special characters if the destination portal is old or strict.",
        ],
      },
      {
        heading: "Keep the source PDFs",
        body: [
          "Do not delete the individual PDFs immediately. If the merged file is rejected for size, order or readability, the source files let you rebuild the packet without starting from paper documents again. Keep them at least until the submission is accepted.",
          "For sensitive documents, store the final merged PDF carefully and consider password protection when sharing outside trusted channels. Merging improves convenience, but it can also put more private information into one file.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-target-kb",
    title: "How to Compress a PDF to a Target KB Size",
    description:
      "Understand when PDF compression works well and how to choose a target size without making pages unreadable.",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-22",
    readTime: "9 min read",
    relatedTools: [
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Convert PDF to Image", href: "/convert-pdf-to-image" },
    ],
    relatedPosts: [
      { title: "Reduce PDF Size for Email Attachments", slug: "how-to-reduce-pdf-size-for-email-attachments" },
      { title: "File Upload Size Limits: A Checklist", slug: "file-upload-size-limits-checklist" },
    ],
    sections: [
      {
        heading: "Know what kind of PDF you have",
        body: [
          "PDF compression depends heavily on the document content. A scanned PDF is usually made of page images, so reducing image quality, DPI or dimensions can shrink it significantly. A text-based PDF made from Word, Google Docs or a digital invoice may already be efficient and may not shrink much without changing how pages are represented.",
          "Before setting a target KB, open the PDF and identify whether the pages are scans, photos, text or mixed content. Scanned certificates, IDs and receipts need more careful review because compression can make small text, seals and signatures difficult to read.",
        ],
      },
      {
        heading: "Pick a realistic target",
        body: [
          "A target such as 200 KB for a ten-page scanned document may be unrealistic if every page must remain readable. A target such as 2 MB for a few scanned pages is usually more reasonable. The target should come from the destination requirement, not from a desire to make every file as small as possible.",
          "If a portal says under 1 MB, aim slightly below the limit, not dramatically below it. Leaving a small buffer helps avoid rounding differences while preserving more quality. If the portal accepts 2 MB, there is no benefit in forcing a 300 KB file that looks poor.",
        ],
      },
      {
        heading: "Balance DPI and image quality",
        body: [
          "DPI affects how much detail is kept in scanned page images. Lower DPI reduces file size but can make small text softer. Image quality affects compression strength. A balanced setting often works better than choosing the lowest DPI and lowest quality together.",
          "For ordinary form uploads, 150 DPI may be enough for many scanned documents. For certificates, signatures, seals and pages with small print, use a higher quality setting and inspect the result. For purely text-based PDFs, changing image settings may have limited effect.",
        ],
      },
      {
        heading: "Compress after editing",
        body: [
          "Complete page edits before compression. Merge files, remove unwanted pages, rotate scans and reorder pages first. If you compress early and then edit, you may need to export again, which can reduce quality a second time.",
          "This order also gives you the real final page count and file size before choosing compression settings. A five-page final PDF and a fifteen-page draft need different targets. Compressing the final version is easier to control.",
        ],
      },
      {
        heading: "Review important details",
        body: [
          "After compression, zoom into names, dates, signatures, stamps, QR codes, barcodes and small table text. These details often decide whether a document is usable. A PDF that technically meets a size limit can still be rejected if the reviewer cannot read it.",
          "If readability is poor, increase the target size or quality. If the file is still too large, remove unnecessary pages or rescan very blurry pages more cleanly. Better source scans often compress more cleanly than dark, tilted or noisy photos.",
        ],
      },
      {
        heading: "Understand selectable text",
        body: [
          "Some compression methods rasterize pages, which can make text no longer selectable. This may be acceptable for scanned PDFs, but it can be a problem for searchable reports, invoices or forms. If searchable text matters, compare the output carefully.",
          "Keep the original PDF until the compressed copy has been accepted. If the compressed version loses important behavior or clarity, you can return to the source and export with a less aggressive setting.",
        ],
      },
    ],
  },
  {
    slug: "convert-pdf-to-jpg-or-png",
    title: "When to Convert PDF Pages to JPG or PNG",
    description:
      "Choose the right image format when exporting PDF pages for previews, thumbnails, forms or sharing.",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-22",
    readTime: "8 min read",
    relatedTools: [
      { label: "Convert PDF to Image", href: "/convert-pdf-to-image" },
      { label: "Convert Image to PDF", href: "/convert-image-to-pdf" },
      { label: "Compress Image", href: "/compress-image" },
    ],
    relatedPosts: [
      { title: "JPEG vs PNG vs WebP vs AVIF", slug: "jpeg-png-webp-avif-differences" },
      { title: "File Upload Size Limits: A Checklist", slug: "file-upload-size-limits-checklist" },
    ],
    sections: [
      {
        heading: "Use JPG for smaller previews",
        body: [
          "JPG is usually the right choice when a PDF page is mostly a scanned photo, a receipt image or a preview that needs to stay small. It is widely accepted and can reduce file size significantly. For sharing a quick page preview over email or chat, JPG is often enough.",
          "The tradeoff is quality. Low-quality JPG can make text fuzzy and create artifacts around signatures or stamps. If the page contains small print, use a higher quality setting or consider PNG instead. The correct choice depends on whether file size or clarity matters more.",
        ],
      },
      {
        heading: "Use PNG for crisp text and screenshots",
        body: [
          "PNG is better for pages with sharp text, diagrams, tables, screenshots and line art. It avoids lossy compression artifacts and keeps edges crisp. If you need to place a PDF page into a presentation, tutorial or design where text must stay clean, PNG is often safer.",
          "PNG files are usually larger than JPG files. If you export many pages, the ZIP can become large. Use PNG when clarity matters and JPG when smaller size is the priority. If the destination accepts WebP, it can sometimes provide a useful middle ground.",
        ],
      },
      {
        heading: "Choose only the pages you need",
        body: [
          "Many users convert an entire PDF when only one page is required. Exporting all pages wastes time and creates extra files. Before converting, identify the exact page or range needed. This is especially useful for certificates, invoices, admit cards, forms and receipts inside a longer PDF.",
          "For multiple pages, download as a ZIP and keep file names organized. If the images will be uploaded one by one, check each file size separately. One page with a photo or stamp may be larger than the others.",
        ],
      },
      {
        heading: "Pick DPI based on destination",
        body: [
          "DPI controls the rendered image size and detail. Low DPI creates smaller images but can make text hard to read. Higher DPI creates sharper images but larger files. For web previews, moderate DPI is usually enough. For printing or zoomable review, use a higher DPI.",
          "If the output is for an online form, check whether the form has dimensions or file-size rules. A high-DPI page can exceed upload limits quickly. In that case, export at a practical DPI and compress the resulting image only as much as needed.",
        ],
      },
      {
        heading: "Check privacy and context",
        body: [
          "Converting a PDF page to an image can make it easier to share, but it also removes some document context. Bookmarks, selectable text and metadata may not carry over. If the receiver needs the original PDF behavior, send the PDF instead of an image.",
          "For sensitive documents, inspect the exported image for private information in headers, footers or background areas. If you only need a small part of a page, crop or redact before sharing rather than sending a full-page image with unnecessary details.",
        ],
      },
      {
        heading: "Review the final image",
        body: [
          "Open the exported JPG or PNG and zoom into the important area. Check names, dates, signatures, QR codes and small text. Confirm the extension is accepted by the destination. If a form asks for JPG, do not upload PNG just because it looks clearer.",
          "Keep the source PDF until the image upload or share is complete. If the image is rejected, you can return to the PDF and export again with different format, DPI or quality settings.",
        ],
      },
    ],
  },
  {
    slug: "browser-based-file-tools-privacy",
    title: "Why Browser-Based File Tools Are Useful for Private Documents",
    description:
      "Understand when local browser processing is a better fit for images, PDFs, text and everyday files.",
    publishedAt: "2026-05-19",
    updatedAt: "2026-05-22",
    readTime: "8 min read",
    relatedTools: [
      { label: "Compress Image", href: "/compress-image" },
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "File Hash Checksum", href: "/file-hash-checksum" },
    ],
    relatedPosts: [
      { title: "Understanding PDF Encryption", slug: "understanding-pdf-encryption-passwords-permissions-and-security" },
      { title: "OCR Explained", slug: "how-ocr-works-extracting-text-from-images-explained" },
    ],
    sections: [
      {
        heading: "What browser-based processing means",
        body: [
          "A browser-based file tool performs the main task on your device using web APIs, Canvas, Web Workers or WebAssembly libraries. The selected file is read by the browser and the output is created locally instead of being uploaded to a remote converter first. This model is practical for many everyday file-preparation tasks.",
          "Local processing is useful for resizing photos, merging a few PDFs, extracting text, generating a QR code, calculating a checksum or converting a short media file. The work can still take time on large files because your device is doing the processing, but it avoids sending ordinary documents away just to make a small change.",
        ],
      },
      {
        heading: "When local tools are the right choice",
        body: [
          "Local tools are a good fit for documents that contain IDs, forms, invoices, certificates, signatures, private notes or internal screenshots. They are also helpful when the task is simple and repeatable, such as reducing an image under a portal file-size limit or converting a photo to a format an upload form accepts.",
          "They are not always the best fit for huge batches, complex professional editing or workflows that require cloud storage and team review. In those cases, a dedicated desktop app or trusted business system may be more reliable. The value of local tools is speed and privacy for focused tasks.",
        ],
      },
      {
        heading: "Privacy still requires user judgment",
        body: [
          "Keeping a file in the browser does not remove the need to review the output. You still need to check whether the final file contains private metadata, visible personal details, signatures, account numbers or pages that should not be shared. A tool can process locally, but the user decides what to download and send.",
          "Use separate channels for passwords, avoid sharing unlocked PDFs when protection is needed and keep source files in a safe place. For highly sensitive legal, medical or financial documents, follow the rules of your organization or advisor rather than relying only on a general-purpose web tool.",
        ],
      },
      {
        heading: "What to check before downloading",
        body: [
          "For images, check crop area, sharpness, transparency and final file size. For PDFs, open the downloaded copy and zoom into small text, signatures, stamps and page numbers. For text tools, review copied output for missing characters, broken formatting or accidental changes.",
          "Keep the original file until the new copy has been accepted by the form, email recipient or website where you plan to upload it. Local tools usually create a new download, so the original should remain unchanged unless you manually replace it.",
        ],
      },
      {
        heading: "Privacy is also about page design",
        body: [
          "A private tool should explain what it does, give direct navigation, avoid forcing an account for basic tasks and make the download step clear. A page that hides the real workflow behind pop-ups, redirects or unclear buttons makes it harder to trust the result.",
          "Useful tool pages should include instructions, practical notes, common mistakes and related workflows. That content helps users decide whether the tool is appropriate before selecting a file, which is part of a privacy-conscious design.",
        ],
      },
      {
        heading: "Practical examples",
        body: [
          "For an exam or job application photo, resize first, then compress to the requested KB limit. For a scanned PDF, merge or reorder pages first, then compress only if the final file is too large. For a file received from someone else, calculate a checksum when integrity matters.",
          "For a QR code, scan the result with another device before printing. For OCR, compare the extracted text with the source image before using it in a form. For redaction, open the exported PDF and confirm hidden details cannot be selected or read.",
        ],
      },
    ],
  },
  {
    slug: "file-upload-size-limits-checklist",
    title: "File Upload Size Limits: A Checklist for Images and PDFs",
    description:
      "A practical checklist for preparing photos, scans and PDFs when a website has strict size and format limits.",
    publishedAt: "2026-05-19",
    updatedAt: "2026-05-22",
    readTime: "9 min read",
    relatedTools: [
      { label: "Resize Image", href: "/resize-image" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Convert Image", href: "/convert-image" },
    ],
    relatedPosts: [
      { title: "Resize Images for Online Forms", slug: "resize-image-for-online-forms" },
      { title: "Compress PDF to Target KB", slug: "compress-pdf-to-target-kb" },
    ],
    sections: [
      {
        heading: "Read the requirement carefully",
        body: [
          "Upload portals usually mention a combination of format, dimensions and file size. A photo requirement might say JPG, 200 x 230 pixels and under 50 KB. A document requirement might say PDF only, under 2 MB and all pages in one file. Each part matters.",
          "Write down the required format first, then dimensions, then size. Changing those in the same order prevents repeated exports and keeps the final file easier to inspect. If the portal gives examples, compare your file against those examples before upload.",
        ],
      },
      {
        heading: "Prepare images in the right order",
        body: [
          "For photos, crop the image before resizing so the important subject stays centered. Resize to the requested pixels or centimeters next, then compress only as much as needed to meet the KB limit. This order protects quality better than compressing first.",
          "Use JPG for most photos. Use PNG when transparency or crisp screenshots matter. Use WebP only when the destination website clearly accepts it. If the requirement says JPG, a WebP file may be rejected even if it is smaller and visually clear.",
        ],
      },
      {
        heading: "Prepare PDFs before compressing",
        body: [
          "For PDFs, fix page order, rotation, page selection and merging before compression. Compressing too early can make later checks harder and may reduce clarity more than necessary. Create the final document structure first, then reduce file size.",
          "Scanned PDFs and image-heavy PDFs usually reduce more than text-only PDFs. If a text PDF does not shrink much, it may already be optimized. Do not force extreme compression if the document needs to remain readable or searchable.",
        ],
      },
      {
        heading: "Check quality after export",
        body: [
          "Open the final image or PDF once before uploading. Check faces, signatures, stamps, barcodes, QR codes and small text. A file that meets the size limit is still not useful if the important details are unreadable.",
          "If quality is too low, try reducing dimensions slightly before lowering quality further. Extreme compression often creates blurry text and visible blocks around edges. A slightly larger but readable file is better than a tiny file that fails review.",
        ],
      },
      {
        heading: "Avoid filename problems",
        body: [
          "Some portals are strict about filenames. Use short names with letters, numbers and hyphens. Avoid spaces, brackets, emojis and very long names when submitting to older systems. Names like application-photo.jpg, address-proof.pdf and certificates-merged.pdf are easier to review.",
          "Make sure the file extension matches the actual format. Renaming image.webp to image.jpg does not convert it to JPG. Use a converter when the format needs to change, then upload the real converted file.",
        ],
      },
      {
        heading: "Keep originals until acceptance",
        body: [
          "Keep the original scan or photo until the submission is complete. If the portal rejects the upload, you can return to the original and make a cleaner export instead of editing an already compressed file again.",
          "For important applications, store the final accepted copy as well. It gives you a record of exactly what was submitted and prevents confusion if you need to resubmit later.",
        ],
      },
    ],
  },
  {
    slug: "how-to-prepare-passport-photos-for-indian-government-forms",
    title: "How to Prepare Passport Photos for Indian Government Forms",
    description:
      "Resize, crop and compress passport-style photos for Indian exam, job, university and government upload portals.",
    publishedAt: "2026-05-22",
    readTime: "10 min read",
    relatedTools: [
      { label: "Resize Image", href: "/resize-image" },
      { label: "Crop Image", href: "/crop-image" },
      { label: "Compress JPG", href: "/compress-jpg" },
    ],
    relatedPosts: [
      { title: "Resize Images for Online Forms", slug: "resize-image-for-online-forms" },
      { title: "File Upload Size Limits: A Checklist", slug: "file-upload-size-limits-checklist" },
    ],
    sections: [
      {
        heading: "Start from the official instruction",
        body: [
          "Indian government, exam, recruitment and university portals often use strict photo rules. One portal may ask for 200 x 230 pixels under 50 KB, another may ask for 3.5 x 4.5 cm, and another may specify a white background with a file size between two limits. Do not rely on memory; read the current instruction on the exact portal.",
          "Take note of four items: format, dimensions, file size and background. If the portal gives both photo and signature requirements, prepare them separately because signatures often use different dimensions and smaller size limits. A photo that is correct for one form may be rejected by another.",
        ],
      },
      {
        heading: "Use a clean source photo",
        body: [
          "A good source photo makes every later step easier. Use even lighting, a plain background and a straight face position. Avoid heavy shadows, tilted camera angles and cropped heads. If the source is blurry or too dark, resizing and compression will not make it acceptable.",
          "Use the highest-quality original available, even if the final file needs to be small. Editing from a clean source gives the compressor more detail to preserve. If you start with a screenshot of a photo or an already compressed messaging-app copy, the final upload may look poor.",
        ],
      },
      {
        heading: "Crop before resizing",
        body: [
          "Crop the image to the required shape before setting exact pixels. For a passport-style portrait, keep the face centered with enough space around the head and shoulders. If the form expects a portrait rectangle, do not force the full camera image into that shape by stretching it.",
          "After cropping, resize to the required pixels or centimeter value. If the portal validates pixels, use pixels. If it gives centimeters with DPI, set both carefully. A common mistake is creating the right visual shape but the wrong actual pixel size.",
        ],
      },
      {
        heading: "Compress only as much as needed",
        body: [
          "Once the dimensions are correct, check the file size. If it is over the limit, use target KB compression. Start near the required limit rather than far below it. For example, if the limit is 50 KB, a result around 45 to 49 KB is usually better than forcing the file to 20 KB.",
          "Strong compression can make facial details soft and create blocky background artifacts. If quality drops too much, reduce dimensions only if allowed or retake the source photo with better lighting. Do not repeatedly recompress the same downloaded file.",
        ],
      },
      {
        heading: "Prepare signatures separately",
        body: [
          "Signature uploads often require a narrow rectangle, black or blue ink on white paper and a much smaller size limit than photos. Crop tightly around the signature but leave enough white space so the line does not touch the edges. Use PNG when crisp ink edges matter and the portal accepts it.",
          "If the portal asks for JPG, convert to JPG and check that the background remains clean. Very low-quality JPG can make signature lines look broken. The signature should be readable at the size shown in the final preview.",
        ],
      },
      {
        heading: "Final portal checks",
        body: [
          "Before uploading, confirm the file extension, pixel dimensions and KB size. Open the file and make sure the face is not stretched, the background is acceptable and the file name is simple. Avoid special characters in filenames for older portals.",
          "Keep the original photo, the cropped version and the final compressed upload copy until the application is complete. If the portal rejects the image, you can adjust from a clean intermediate file instead of starting over.",
        ],
      },
    ],
  },
  {
    slug: "understanding-pdf-encryption-passwords-permissions-and-security",
    title: "Understanding PDF Encryption: Passwords, Permissions and Security",
    description:
      "Learn what PDF passwords and permissions can do, what they cannot do, and when to protect or unlock a PDF.",
    publishedAt: "2026-05-22",
    readTime: "10 min read",
    relatedTools: [
      { label: "Protect PDF", href: "/protect-pdf" },
      { label: "Unlock PDF", href: "/unlock-pdf" },
      { label: "Redact PDF", href: "/redact-pdf" },
    ],
    relatedPosts: [
      { title: "Browser-Based File Tools and Privacy", slug: "browser-based-file-tools-privacy" },
      { title: "Reduce PDF Size for Email Attachments", slug: "how-to-reduce-pdf-size-for-email-attachments" },
    ],
    sections: [
      {
        heading: "Two different ideas: open passwords and permissions",
        body: [
          "A PDF open password controls whether someone can open the document. If the password is strong and the encryption is applied correctly, the file is much harder to read without that password. This is the main protection people usually mean when they say password-protect a PDF.",
          "PDF permissions are different. They can ask a viewer to restrict printing, copying or editing, but permission behavior depends on the PDF reader. Some readers respect those settings, while others may not enforce them strongly. For sensitive documents, rely on a strong open password rather than permissions alone.",
        ],
      },
      {
        heading: "Choose strong passwords",
        body: [
          "A PDF password should be long, unique and not reused from email, banking or social accounts. Avoid names, dates, phone numbers and short words. A password manager can create and store stronger passwords than most people can remember safely.",
          "Send the password through a separate channel from the PDF. If the PDF is attached to an email, send the password by phone, secure message or another approved method. Sending both together reduces the value of encryption if the email is forwarded or compromised.",
        ],
      },
      {
        heading: "When to protect a PDF",
        body: [
          "Protect a PDF when it contains identity documents, financial records, exam documents, salary information, contracts, internal reports or anything that should not be casually opened by others. Protection is especially useful when the file must travel through email or messaging apps.",
          "Password protection does not replace careful sharing. Confirm the recipient, use the correct email address and avoid uploading sensitive protected files to unknown services. Encryption protects the file, but the password and surrounding workflow still matter.",
        ],
      },
      {
        heading: "When to unlock a PDF",
        body: [
          "Unlocking is appropriate when you own the file, know the password and need a copy that opens faster for your own workflow. For example, you may remove protection from an old statement before merging it with other personal records stored locally.",
          "Do not use unlock tools to bypass unknown passwords or modify files you are not allowed to change. If a document is protected for legal, business or privacy reasons, ask the owner for the correct version or permission.",
        ],
      },
      {
        heading: "Encryption is not redaction",
        body: [
          "Password protection controls access to the whole document. Redaction removes or hides specific information before sharing. If a PDF contains an account number that should not be seen, protecting the file is not enough when the recipient is allowed to open it. You need redaction or a clean copy.",
          "Visual black boxes are not always safe if the underlying text remains selectable. Use a proper redaction workflow for sensitive details and then open the exported PDF to confirm the hidden content cannot be read or selected.",
        ],
      },
      {
        heading: "Keep backups and test outputs",
        body: [
          "Always keep an original copy before encrypting, unlocking or redacting. Test the protected file in a PDF viewer, confirm the password works and check permissions if you used them. For unlocked files, confirm the output opens correctly and decide whether it should be protected again before sharing.",
          "For high-risk legal, medical or financial workflows, follow your organization's policy or get professional advice. General PDF tools are useful, but they cannot decide the correct compliance process for every situation.",
        ],
      },
    ],
  },
  {
    slug: "webp-vs-jpg-when-to-use-each-format",
    title: "WebP vs JPG: When to Use Each Format",
    description:
      "Compare WebP and JPG for photos, websites, upload forms, transparency and everyday compatibility.",
    publishedAt: "2026-05-22",
    readTime: "8 min read",
    relatedTools: [
      { label: "WebP to JPG", href: "/webp-to-jpg" },
      { label: "PNG to WebP", href: "/png-to-webp" },
      { label: "Compress Image", href: "/compress-image" },
    ],
    relatedPosts: [
      { title: "JPEG vs PNG vs WebP vs AVIF", slug: "jpeg-png-webp-avif-differences" },
      { title: "Compress Images Without Losing Quality", slug: "compress-image-without-quality-loss" },
    ],
    sections: [
      {
        heading: "JPG is still the compatibility default",
        body: [
          "JPG works almost everywhere. It is supported by old browsers, desktop apps, printers, government portals, job sites, email clients and document editors. When a form says upload a photo, JPG is often the safest format unless the instructions say otherwise.",
          "The weakness is that JPG is lossy and does not support transparency. It is excellent for photos but weaker for logos, icons, screenshots and images that must sit on different backgrounds. Repeated JPG exports can also make quality worse over time.",
        ],
      },
      {
        heading: "WebP is stronger for modern web delivery",
        body: [
          "WebP can create smaller photo files than JPG at similar visible quality, and it can also support transparency. For websites, blogs, landing pages, product galleries and image-heavy interfaces, WebP can improve loading performance without a major quality sacrifice.",
          "The main concern is destination support. Modern browsers handle WebP well, but some old upload portals or native apps may reject it. If you control the website, WebP is often a good choice. If you are submitting to a strict third-party portal, JPG may be safer.",
        ],
      },
      {
        heading: "Transparency changes the decision",
        body: [
          "JPG cannot store transparent pixels. If you convert a transparent PNG or WebP to JPG, transparent areas become a solid background. That may be acceptable for a photo but wrong for a logo, product cutout, sticker or design overlay.",
          "WebP can preserve transparency while still reducing size. This makes it useful for web graphics where PNG is too large. However, keep a PNG source copy if the image will be edited again because PNG is often a cleaner source format.",
        ],
      },
      {
        heading: "Use case comparison",
        body: [
          "Use JPG for passport photos, general form uploads, email attachments, printing workflows and broad compatibility. Use WebP for websites, modern web apps, blog images and product photos where page speed matters. Use PNG when transparency and lossless edges are required.",
          "If the file is for an Indian exam portal, government upload or older institution site, follow the specified format exactly. If it says JPG under 50 KB, a smaller WebP may still be rejected. Format compliance is separate from visual quality.",
        ],
      },
      {
        heading: "Compression quality is not identical",
        body: [
          "A JPG quality value and a WebP quality value are not directly equal. A WebP file at one setting may look better or smaller than a JPG at the same number. Compare the actual output instead of assuming the slider values mean the same thing.",
          "Look at faces, small text, product edges and smooth backgrounds. WebP often handles web photos well, but every image is different. Testing one or two quality levels is usually enough to find the right balance.",
        ],
      },
      {
        heading: "Keep source and delivery copies",
        body: [
          "A practical workflow is to keep a high-quality source image and export task-specific delivery copies. For a website, export WebP. For a form, export JPG. For a transparent logo, keep PNG or WebP depending on support.",
          "Do not convert back and forth repeatedly. Each lossy export can remove information. Return to the clean source whenever you need a new version for a different destination.",
        ],
      },
    ],
  },
  {
    slug: "how-to-reduce-pdf-size-for-email-attachments",
    title: "How to Reduce PDF Size for Email Attachments",
    description:
      "Prepare PDFs for email by cleaning pages, compressing scans and preserving enough quality for review.",
    publishedAt: "2026-05-22",
    readTime: "9 min read",
    relatedTools: [
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Delete Pages from PDF", href: "/delete-pages-from-pdf" },
      { label: "Merge PDF", href: "/merge-pdf" },
    ],
    relatedPosts: [
      { title: "Compress PDF to a Target KB Size", slug: "compress-pdf-to-target-kb" },
      { title: "Merge PDF Files Online", slug: "merge-pdf-files-online" },
    ],
    sections: [
      {
        heading: "Understand the email limit",
        body: [
          "Email attachment limits vary by provider and organization. A service may allow 25 MB, but the recipient's system may reject smaller attachments. Business mail servers can be stricter, and some organizations block large PDFs for security or storage reasons.",
          "Aim for a practical size rather than the absolute maximum. If a PDF is 24 MB and the limit is 25 MB, it may still fail after encoding overhead. A cleaner target gives the message a better chance of being delivered.",
        ],
      },
      {
        heading: "Remove unnecessary pages first",
        body: [
          "Before compressing, remove blank pages, duplicate scans and documents the recipient does not need. A smaller page count reduces size without reducing quality. This is better than making every page blurry just to keep unwanted pages in the file.",
          "If the PDF combines several unrelated documents, consider splitting them into separate attachments or sending only the relevant section. The recipient will also find the file easier to review.",
        ],
      },
      {
        heading: "Compress scanned pages carefully",
        body: [
          "Scanned PDFs usually contain large images. Compression can reduce DPI and image quality, which lowers file size. Use a balanced setting first, then review important pages. Strong compression may make signatures, stamps, barcodes and small text hard to read.",
          "If a scan is dark, tilted or noisy, retaking the scan in better light can reduce size and improve readability. Clean source images often compress better than poor photos because the compressor has less noise to preserve.",
        ],
      },
      {
        heading: "Use links only when appropriate",
        body: [
          "If a PDF is still too large, a secure file-sharing link may be better than an email attachment. However, links are not always allowed for applications, tenders, legal submissions or formal workflows. Follow the recipient's instructions.",
          "When using a link, check access permissions. A private link that the recipient cannot open wastes time, while a public link may expose information. For sensitive PDFs, consider password protection and share the password separately.",
        ],
      },
      {
        heading: "Name the file clearly",
        body: [
          "A clear filename helps the recipient understand the attachment without opening it. Use names like invoice-march-2026.pdf, application-documents.pdf or certificates-compressed.pdf. Avoid special characters and very long names when sending to institutional systems.",
          "If you compress the file, do not leave it named final-final-small-new.pdf. A professional filename reduces confusion and makes future search easier in both your mailbox and the recipient's mailbox.",
        ],
      },
      {
        heading: "Open the attachment before sending",
        body: [
          "After compression, open the PDF from the downloaded file, not from the browser preview alone. Check the page count, readability and file size. If the document has signatures or stamps, zoom into those areas.",
          "Attach the reviewed file to a draft email and confirm the size shown by the email client. Keep the original PDF until the recipient confirms they received and can open the compressed attachment.",
        ],
      },
    ],
  },
  {
    slug: "a-complete-guide-to-qr-codes-types-uses-and-best-practices",
    title: "A Complete Guide to QR Codes: Types, Uses and Best Practices",
    description:
      "Learn how QR codes work, what content they can store, and how to create codes that scan reliably.",
    publishedAt: "2026-05-22",
    readTime: "10 min read",
    relatedTools: [
      { label: "QR Code Generator", href: "/qr-code-generator" },
      { label: "UPI QR Code Generator", href: "/upi-qr-code-generator" },
      { label: "URL Encoder Decoder", href: "/url-encoder-decoder" },
    ],
    relatedPosts: [
      { title: "Browser-Based File Tools and Privacy", slug: "browser-based-file-tools-privacy" },
      { title: "File Upload Size Limits: A Checklist", slug: "file-upload-size-limits-checklist" },
    ],
    sections: [
      {
        heading: "What a QR code stores",
        body: [
          "A QR code stores text in a machine-readable pattern. That text can be a website URL, plain message, email address, phone number, Wi-Fi details, contact information or payment URI such as UPI. The scanner reads the pattern and passes the text to the phone or app.",
          "The QR code does not magically verify the content. If the encoded URL is wrong, the QR code will still scan but send people to the wrong place. Always inspect the encoded value before printing or sharing the final image.",
        ],
      },
      {
        heading: "Static and dynamic QR codes",
        body: [
          "A static QR code stores the final content directly. If you create a code for https://example.com/menu, that exact URL is inside the image. Static codes are simple, private and reliable, but changing the destination later requires creating and replacing the QR image.",
          "A dynamic QR code usually points to a redirect service that can change the final destination later. That is useful for campaigns and tracking, but it depends on the service staying online and handling data responsibly. For simple personal or internal use, static codes are often enough.",
        ],
      },
      {
        heading: "Design for reliable scanning",
        body: [
          "QR codes need contrast, quiet space and enough size. Dark foreground on a light background is the safest combination. Keep a margin around the code so the scanner can find its edges. Avoid placing text, logos or decorative shapes too close to the pattern.",
          "If you use colors, test the code on multiple phones. Low contrast, glossy printing, tiny sizes and busy backgrounds can make scanning unreliable. A beautiful QR code that does not scan is worse than a plain one that works every time.",
        ],
      },
      {
        heading: "Use error correction thoughtfully",
        body: [
          "QR codes support error correction, which helps scanners recover data if part of the code is damaged or covered. Higher error correction can help when adding a small logo or printing in environments where scratches may happen.",
          "Higher error correction can also make the pattern denser. Dense codes need more space and better printing. If the content is long, consider using a short URL or simpler text so the code stays easy to scan.",
        ],
      },
      {
        heading: "UPI QR code checks",
        body: [
          "For UPI QR codes, check the UPI ID, payee name, amount and note before sharing. A QR generator creates the payment payload; the actual payment still happens inside the user's UPI app. If the UPI ID is wrong, the payment may go to the wrong account.",
          "Leave the amount blank when the payer should choose the amount. Use a fixed amount for invoices, event fees or product payments where the amount should not change. Always scan the code with another device before printing it for public use.",
        ],
      },
      {
        heading: "Privacy and maintenance",
        body: [
          "A locally generated QR code can be useful when the encoded content is simple and does not need analytics. For public marketing campaigns, you may need tracking, short links and update controls, but those features involve another service.",
          "Keep a copy of the content you encoded. If the QR points to a webpage, keep that page active. Broken links create a poor experience even when the QR image itself is technically correct.",
        ],
      },
    ],
  },
  {
    slug: "how-ocr-works-extracting-text-from-images-explained",
    title: "How OCR Works: Extracting Text from Images Explained",
    description:
      "Understand OCR accuracy, image preparation and common mistakes when copying text from photos and scanned pages.",
    publishedAt: "2026-05-22",
    readTime: "9 min read",
    relatedTools: [
      { label: "Image to Text", href: "/image-to-text" },
      { label: "PDF to Text", href: "/pdf-to-text" },
      { label: "Crop Image", href: "/crop-image" },
    ],
    relatedPosts: [
      { title: "Browser-Based File Tools and Privacy", slug: "browser-based-file-tools-privacy" },
      { title: "Convert PDF Pages to JPG or PNG", slug: "convert-pdf-to-jpg-or-png" },
    ],
    sections: [
      {
        heading: "OCR turns pixels into characters",
        body: [
          "OCR stands for optical character recognition. It analyzes an image, finds shapes that look like letters or numbers and converts them into editable text. Modern OCR can work well on clean printed text, but it is still an interpretation of pixels, not a guaranteed perfect copy.",
          "The quality of the source image matters more than most settings. Sharp text, good lighting, straight lines and strong contrast produce better results. Blurry photos, shadows, curved pages, handwriting and decorative fonts reduce accuracy.",
        ],
      },
      {
        heading: "Prepare the image first",
        body: [
          "Crop away unnecessary background before running OCR. A clean crop helps the engine focus on the text area and reduces confusion from nearby graphics. Rotate the image so text lines are horizontal, and use a clearer photo if the current one is tilted or dark.",
          "For receipts, labels and forms, make sure the camera is close enough for small numbers to be visible. For screenshots, use the original screenshot instead of a photo of a screen. Every extra layer of blur lowers recognition accuracy.",
        ],
      },
      {
        heading: "Language and layout matter",
        body: [
          "OCR engines use language data to decide which characters and word patterns are likely. Choosing the closest language improves results. Mixed-language images, unusual abbreviations and code snippets can still need manual correction because they do not always match normal word patterns.",
          "Layout also matters. Multi-column pages, tables and forms may extract text in an unexpected order. Plain text output usually cannot preserve complex formatting perfectly. Review line breaks and sequence before pasting the result into another document.",
        ],
      },
      {
        heading: "What OCR is good for",
        body: [
          "OCR is useful for copying notes from screenshots, extracting text from labels, digitizing short printed documents, pulling invoice numbers or searching scanned material. It saves time when the alternative is manually typing every line.",
          "It is less reliable as the only source for legal, financial or medical data. If the text includes names, dates, amounts, addresses or IDs, compare the OCR output with the original image carefully. Small recognition mistakes can change meaning.",
        ],
      },
      {
        heading: "OCR and PDFs",
        body: [
          "A PDF may already contain selectable text. In that case, PDF-to-text extraction is cleaner than OCR because the text is stored inside the file. If the PDF is only scanned page images, OCR is needed to recognize the visible text.",
          "You can convert selected PDF pages to images and run OCR when needed, but remember that OCR output is plain text. It will not recreate a perfect editable version of the original layout without additional document-processing tools.",
        ],
      },
      {
        heading: "Always review before using",
        body: [
          "After extraction, check spelling, punctuation, numbers and line breaks. OCR often confuses similar characters such as O and 0, I and 1, or small punctuation marks. It may also miss faded text or split words at line endings.",
          "Keep the original image or PDF with the extracted text when accuracy matters. That way, anyone reviewing the text can compare it with the source instead of trusting the OCR output alone.",
        ],
      },
    ],
  },
  {
    slug: "video-compression-basics-formats-bitrates-and-quality",
    title: "Video Compression Basics: Formats, Bitrates and Quality",
    description:
      "Learn how video size is affected by format, resolution, bitrate, duration and audio settings.",
    publishedAt: "2026-05-22",
    readTime: "10 min read",
    relatedTools: [
      { label: "Video Compressor", href: "/video-compressor" },
      { label: "MP4 to MP3", href: "/mp4-to-mp3" },
      { label: "MP4 to GIF", href: "/mp4-to-gif" },
    ],
    relatedPosts: [
      { title: "Browser-Based File Tools and Privacy", slug: "browser-based-file-tools-privacy" },
      { title: "File Upload Size Limits: A Checklist", slug: "file-upload-size-limits-checklist" },
    ],
    sections: [
      {
        heading: "Video size is mostly bitrate times duration",
        body: [
          "The biggest drivers of video size are bitrate and duration. Bitrate describes how much data is used per second. A five-minute video at a high bitrate can be much larger than a thirty-second video at the same resolution. Reducing bitrate reduces file size but can also reduce quality.",
          "Resolution matters because larger frames usually need more data. A 1080p video often needs more bitrate than a 720p version to look clean. If the video will be viewed on a small screen or sent through messaging apps, reducing resolution can be more effective than heavy compression at full resolution.",
        ],
      },
      {
        heading: "Format and codec are different",
        body: [
          "MP4 is a container format. It can hold video, audio and metadata. The codec, such as H.264, controls how video frames are compressed inside that container. People often say MP4 when they mean a broadly compatible H.264 video in an MP4 file.",
          "For everyday sharing, MP4 with H.264 video and AAC audio is still one of the safest choices. Newer codecs can be more efficient, but they may not play everywhere. Compatibility matters when sending files to clients, schools, employers or older devices.",
        ],
      },
      {
        heading: "Choose a quality target",
        body: [
          "A good compression target depends on the content. Screen recordings with text need enough detail to keep letters readable. Talking-head videos can tolerate more compression. Fast motion, sports, camera movement and detailed backgrounds need more bitrate to avoid blocky artifacts.",
          "Do not compress only by chasing the smallest number. Watch the output from beginning to end or at least check representative sections. Look for blurry text, blocky motion, audio sync problems and dark scenes that lose detail.",
        ],
      },
      {
        heading: "Trim before compressing",
        body: [
          "Removing unnecessary beginning and ending sections reduces size without quality loss. If a video includes long pauses, duplicate takes or unused screen time, trimming is better than lowering quality for the entire file.",
          "If trimming is not available in your current workflow, consider cutting the video in a dedicated editor before compression. A shorter clean source gives every compressor a better chance of producing a useful file.",
        ],
      },
      {
        heading: "Audio can matter too",
        body: [
          "Audio is usually smaller than video, but it still contributes to file size. For speech, moderate audio bitrate is often enough. For music, use a higher audio bitrate to avoid noticeable loss. If you only need the audio, convert MP4 to MP3 instead of sending the full video.",
          "Check audio sync after compression. Browser-based media tools use local processing, but every device has different performance limits. Very large videos can take time and may be better handled by a desktop editor.",
        ],
      },
      {
        heading: "Keep source and delivery versions",
        body: [
          "Keep the original video separately. Export smaller versions for email, messaging, upload portals or web pages. If one destination rejects the file, return to the original or a high-quality intermediate rather than repeatedly compressing an already compressed video.",
          "Use clear names such as demo-720p-compressed.mp4 or lecture-audio.mp3. This prevents accidentally sending the wrong version and helps you keep track of which file was prepared for which platform.",
        ],
      },
    ],
  },
];

const blogDepthNotes: Record<
  string,
  {
    scenario: string;
    before: string;
    mistake: string;
    review: string;
    example: string;
  }
> = {
  "compress-image-without-quality-loss": {
    scenario:
      "a user has a clear original image but needs a smaller upload copy for a form, website or email thread",
    before:
      "confirm the accepted image format, resize oversized camera photos and decide whether a target KB value is required",
    mistake:
      "compressing the same downloaded file repeatedly until the image looks soft or blocky",
    review:
      "compare the compressed result with the original at normal size and at 100 percent zoom",
    example:
      "a profile photo can be resized to the requested pixels, exported near the KB limit and checked for face clarity before upload",
  },
  "resize-image-for-online-forms": {
    scenario:
      "a portal rejects a photo because dimensions, aspect ratio or file size do not match its upload rules",
    before:
      "write down the exact width, height, format and size limit from the form instructions",
    mistake:
      "stretching the image to exact pixels instead of cropping to the correct shape first",
    review:
      "check the downloaded file dimensions, face position, background and final KB size",
    example:
      "an exam photo can be cropped as a portrait, resized to the required pixels and then compressed only if it remains too large",
  },
  "jpeg-png-webp-avif-differences": {
    scenario:
      "a user needs to choose a format for photos, screenshots, transparent graphics or web publishing",
    before:
      "identify whether compatibility, transparency, small file size or crisp text is the main requirement",
    mistake:
      "assuming one image format is best for every destination and every type of image",
    review:
      "open the exported copy and check transparency, color, edge sharpness and file size",
    example:
      "a product photo may work best as WebP on a website but still need a JPG copy for an older upload portal",
  },
  "merge-pdf-files-online": {
    scenario:
      "several forms, certificates or scans need to become a single ordered PDF packet",
    before:
      "rename source files, remove duplicate pages and decide the exact document order",
    mistake:
      "merging first and discovering later that one source PDF has pages in the wrong internal order",
    review:
      "open the merged PDF and scan the first page, final page, attachments and file size",
    example:
      "an application packet can place the main form first, then ID proof, address proof and certificates in the requested order",
  },
  "compress-pdf-to-target-kb": {
    scenario:
      "a PDF is over a portal or email size limit and must be reduced without losing readable details",
    before:
      "complete merging, rotation, deletion and page ordering before selecting compression settings",
    mistake:
      "forcing an unrealistic target size that makes signatures, stamps or small text unreadable",
    review:
      "zoom into names, dates, signatures, seals and QR codes in the compressed output",
    example:
      "a scanned two-page certificate may be compressed enough for a 1 MB limit while preserving the stamp and registration number",
  },
  "convert-pdf-to-jpg-or-png": {
    scenario:
      "one or more PDF pages need to be used as images for previews, thumbnails, forms or sharing",
    before:
      "choose only the pages needed and decide whether JPG size or PNG clarity matters more",
    mistake:
      "exporting every page at high DPI when only one readable preview is required",
    review:
      "check page margins, text clarity, output extension and file size for each exported image",
    example:
      "a single certificate page can be exported as PNG for clarity or as JPG when the upload limit is strict",
  },
  "browser-based-file-tools-privacy": {
    scenario:
      "a user wants to prepare private files without sending routine documents to a remote converter",
    before:
      "decide whether the task is simple enough for local browser processing or needs a professional workflow",
    mistake:
      "assuming local processing removes the need to review visible private details and metadata",
    review:
      "inspect the output for sensitive text, page content, file names and accidental extra information",
    example:
      "a scanned ID can be resized, compressed or redacted locally, then checked carefully before being sent to a verified recipient",
  },
  "file-upload-size-limits-checklist": {
    scenario:
      "a website accepts files only when format, dimensions, size and naming rules are all satisfied",
    before:
      "copy the portal requirements and prepare files in the order format, dimensions, size and filename",
    mistake:
      "renaming an extension instead of actually converting the file to the required format",
    review:
      "confirm the final file extension, pixel size, page count, KB or MB value and simple filename",
    example:
      "a portal photo can be saved as JPG at exact pixels under the KB limit while a supporting document is merged as one PDF",
  },
  "how-to-prepare-passport-photos-for-indian-government-forms": {
    scenario:
      "an Indian exam, recruitment, university or government portal asks for a passport-style upload photo",
    before:
      "read the current portal rule for background, dimensions, format, size range and signature requirements",
    mistake:
      "using a messaging-app copy or screenshot of a photo as the source image",
    review:
      "check the face crop, background, dimensions, final size and filename before submitting",
    example:
      "a 200 x 230 JPG photo can be prepared from a clear camera image, then compressed near the portal limit",
  },
  "understanding-pdf-encryption-passwords-permissions-and-security": {
    scenario:
      "a PDF contains private information and needs access control before storage or sharing",
    before:
      "decide whether the document needs an open password, permission settings, redaction or all three",
    mistake:
      "treating PDF permissions as a substitute for a strong open password",
    review:
      "test the protected output in a PDF viewer and confirm the recipient can open it with the shared password",
    example:
      "a salary document can be protected with a strong password and sent separately from the password itself",
  },
  "webp-vs-jpg-when-to-use-each-format": {
    scenario:
      "a user must choose between modern web performance and maximum compatibility",
    before:
      "check whether the destination is a website you control, a public portal, an email attachment or a print workflow",
    mistake:
      "using WebP for a strict upload form that clearly asks for JPG",
    review:
      "test the output in the target browser, app or upload page before deleting the source image",
    example:
      "a blog image can be delivered as WebP while the same source photo is exported as JPG for a job application",
  },
  "how-to-reduce-pdf-size-for-email-attachments": {
    scenario:
      "a PDF needs to fit an email limit while staying readable for the recipient",
    before:
      "remove unnecessary pages, check whether scans are readable and choose a realistic size target",
    mistake:
      "compressing a bloated PDF instead of first deleting pages the recipient does not need",
    review:
      "attach the reviewed PDF to a draft email and confirm the email client reports an acceptable size",
    example:
      "a large scanned invoice packet can be cleaned, compressed and named clearly before being sent to accounts",
  },
  "a-complete-guide-to-qr-codes-types-uses-and-best-practices": {
    scenario:
      "a QR code will be printed, shared or placed in a document where scanning reliability matters",
    before:
      "verify the encoded URL, text, contact data or UPI payload before styling the QR image",
    mistake:
      "making the code attractive but too small, low contrast or crowded by nearby design elements",
    review:
      "scan the final QR code on more than one device before printing or distributing it",
    example:
      "a UPI QR for an invoice can include a verified UPI ID, optional fixed amount and enough quiet space for scanning",
  },
  "how-ocr-works-extracting-text-from-images-explained": {
    scenario:
      "text must be copied from a screenshot, scan, receipt, label or document photo",
    before:
      "crop the image, straighten text lines and choose the closest language setting",
    mistake:
      "copying OCR output into an official form without checking names, numbers and punctuation",
    review:
      "compare extracted text against the source image line by line when accuracy matters",
    example:
      "a receipt number can be extracted quickly, but the final value should be checked against the original image",
  },
  "video-compression-basics-formats-bitrates-and-quality": {
    scenario:
      "a video is too large for upload, email, messaging or web publishing",
    before:
      "decide whether trimming, lower resolution, lower bitrate or audio extraction is the cleanest size reduction",
    mistake:
      "lowering bitrate so far that motion, screen text or dark scenes become unusable",
    review:
      "watch representative parts of the compressed video and check audio sync before sharing",
    example:
      "a screen recording can be exported at 720p with readable text instead of keeping 1080p and using extreme compression",
  },
};

function joinLabels(items: { label: string; href: string }[] | undefined) {
  const labels = items?.map((item) => item.label) ?? [];

  if (labels.length <= 1) {
    return labels[0] ?? "the related tool";
  }

  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function addEditorialDepth(post: BlogPost): BlogPost {
  const note = blogDepthNotes[post.slug];
  const tools = joinLabels(post.relatedTools);

  if (!note) {
    return post;
  }

  return {
    ...post,
    sections: [
      ...post.sections,
      {
        heading: "Practical workflow",
        body: [
          `For this topic, the practical scenario is ${note.scenario}. Start by using the guide to understand the requirement, then move to ${tools} only after you know the format, size, privacy and quality tradeoffs. This prevents repeated exports and makes the final result easier to review.`,
          `Before using a tool, ${note.before}. If the task involves a file, keep the original source available and create a separate output copy. If the task involves text, numbers, QR data or passwords, keep the input visible long enough to compare it with the generated result.`,
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          `The main mistake to avoid is ${note.mistake}. It usually happens when the user focuses only on finishing quickly instead of checking the destination requirement. A file can look correct in preview and still fail because the extension, dimensions, page count, password behavior or size limit is wrong.`,
          "Another common problem is treating conversion, compression or generation as a one-way final step. Use the cleanest source, export once with deliberate settings and review the output before sharing. When the first result is not good enough, return to the original or a clean intermediate instead of repeatedly editing a degraded copy.",
        ],
      },
      {
        heading: "Final review before sharing",
        body: [
          `Before using the result, ${note.review}. A short review is especially important for applications, invoices, certificates, public webpages, payment QR codes, official emails and any file that contains personal details. Small mistakes are easier to fix before upload than after a deadline or submission.`,
          `A realistic example is this: ${note.example}. The same principle applies across FreeConvert tools: understand the rule, choose the right tool, keep the source file safe, download a fresh copy and verify the final output in the place where it will actually be used.`,
        ],
      },
    ],
  };
}

export const blogPosts: BlogPost[] = baseBlogPosts.map(addEditorialDepth);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function blogCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog#guides`,
    name: "Image, PDF and Online Tool Guides",
    url: `${BASE_URL}/blog`,
    description:
      "Detailed guides for resizing, compressing and converting images and PDFs, plus practical online tool tips for everyday use.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `${BASE_URL}/blog/${post.slug}`,
      })),
    },
  };
}

export function blogPostJsonLd(post: BlogPost) {
  const articleBody = post.sections
    .flatMap((section) => [section.heading, ...section.body])
    .join("\n\n");

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    image: [`${BASE_URL}${blogPostImagePath(post)}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: "FreeConvert",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "FreeConvert",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
    articleSection: post.sections.map((section) => section.heading),
    articleBody,
    wordCount: articleBody.split(/\s+/).filter(Boolean).length,
  };
}

export function blogPostBreadcrumbJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${post.slug}`,
      },
    ],
  };
}
