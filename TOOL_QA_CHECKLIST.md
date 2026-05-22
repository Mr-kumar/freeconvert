# Tool QA Checklist - FreeConvert.in

> **Purpose:** Keep evidence that priority tools work before AdSense re-application and before enabling visible ad units.  
> **Owner:** FreeConvert Editorial / Product QA  
> **Last updated:** May 22, 2026

---

## Test Rules

- Test in the current production build, not only local dev.
- Use safe sample files, never personal IDs or private documents.
- Keep visible ads disabled while testing for AdSense approval.
- Record browser, device, input type, expected output and result.
- If a tool fails, remove it from prominent navigation/sitemap until fixed or document the limitation on the page.

---

## Priority Manual QA Matrix

| Priority | Tool | URL | Sample Input | Expected Output | Review Checks | Status |
|---:|---|---|---|---|---|---|
| 1 | Resize Image | `/resize-image` | JPG photo | New image at chosen dimensions | Pixel size, face/object not stretched, file downloads | Pending production QA |
| 1 | Compress Image | `/compress-image` | JPG and PNG image | Smaller image download | File size, readable text/details, original unchanged | Pending production QA |
| 1 | HEIC to JPG | `/heic-to-jpg` | Safe HEIC sample | JPG download | Orientation, color, compatibility in browser viewer | Pending production QA |
| 1 | Image to Text | `/image-to-text` | Screenshot with printed text | Copyable text / TXT | OCR accuracy, language selection, no crash | Pending production QA |
| 1 | Merge PDF | `/merge-pdf` | 2 small PDFs | One combined PDF | Page order, page count, file opens | Pending production QA |
| 1 | Compress PDF | `/compress-pdf` | Scanned sample PDF | Smaller PDF | Readability, signatures/stamps, file size | Pending production QA |
| 1 | Split PDF | `/split-pdf` | 3-page PDF | Separate or ranged PDFs | Range accuracy, ZIP output when multiple | Pending production QA |
| 1 | Edit PDF | `/edit-pdf` | Simple PDF | PDF with text/shape/signature mark | Placement, output opens, original unchanged | Pending production QA |
| 1 | QR Code Generator | `/qr-code-generator` | URL and plain text | PNG QR code | Scans with phone, quiet margin, content correct | Pending production QA |
| 1 | Video Compressor | `/video-compressor` | Short MP4 sample | Smaller MP4 | Plays, audio sync, visible quality | Pending production QA |
| 2 | WebP to JPG | `/webp-to-jpg` | WebP image | JPG download | Background fill, quality, compatibility | Pending production QA |
| 2 | JPG to PDF | `/jpg-to-pdf` | 2 JPG scans | One PDF | Page order, page fit, file opens | Pending production QA |
| 2 | PDF to Image | `/convert-pdf-to-image` | 2-page PDF | JPG/PNG images | DPI, text clarity, ZIP when multiple | Pending production QA |
| 2 | Redact PDF | `/redact-pdf` | Non-sensitive sample PDF | Redacted PDF | Hidden area not visible/selectable | Pending production QA |
| 2 | UPI QR Code Generator | `/upi-qr-code-generator` | Test UPI payload | PNG QR code | UPI URI correct, scans in payment app preview | Pending production QA |

---

## Production QA Record Template

Use this block for each completed test.

```text
Date:
Tester:
Browser and version:
Device/OS:
Tool URL:
Sample file/input:
Settings used:
Expected result:
Actual result:
Downloaded output reviewed: Yes/No
Pass/Fail:
Notes:
```

---

## AdSense Readiness Gate

Do not re-apply to AdSense until:

- [ ] Tier 1 tools have passed production QA.
- [ ] No placeholder ad slots are deployed.
- [ ] Search Console shows updated pages indexed.
- [ ] `ads.txt` returns the real publisher ID.
- [ ] Privacy, Terms, About, Contact, How It Works and Editorial Policy are reachable from the footer.
- [ ] No incomplete or failing tool is linked from homepage popular cards.
