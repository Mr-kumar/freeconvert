import Link from "next/link";
import {
  pdfToolConfigs,
  pdfTools,
  toolConfigs,
  tools,
} from "@/lib/tools";
import { blogPosts } from "@/lib/blog";
import { getImageToolFaqs, getPdfToolFaqs } from "@/lib/toolFaqs";
import type { PDFToolSlug, ToolSlug } from "@/lib/types";

type ToolContentSlug = ToolSlug | PDFToolSlug;

interface ContentNotes {
  bestFor: string[];
  notes: string[];
}

interface GuideProfile {
  audience: string;
  requirement: string;
  workflow: string;
  checks: string;
  mistakes: string[];
  tips: string[];
  relatedGuideSlugs: string[];
}

interface ContentGuide {
  whenToUse: string[];
  commonMistakes: string[];
  tips: string[];
  relatedGuideSlugs: string[];
}

const guideProfiles: Partial<Record<ToolContentSlug, GuideProfile>> = {
  resize: {
    audience:
      "you need photos for exam forms, job portals, admission forms, profile pictures or ID-style uploads with exact width and height rules",
    requirement:
      "the required pixel size, centimeter size, aspect ratio and maximum KB limit before you start",
    workflow:
      "crop the subject first when framing matters, resize to the required dimensions, then use target KB compression only if the resized file is still too large",
    checks:
      "face position, document edges, final dimensions and final file size before uploading to the destination portal",
    mistakes: [
      "Compressing before resizing, which can waste quality before the final dimensions are set.",
      "Turning off aspect ratio without checking whether the face, logo or document is stretched.",
      "Using centimeters without confirming the DPI expected by the form.",
      "Uploading the first export without checking the final pixel size.",
    ],
    tips: [
      "Resize first and compress second for the cleanest result under a strict KB limit.",
      "Use a copy of the original when preparing multiple versions for different portals.",
      "Keep important edges inside the preview area before downloading.",
      "Open the downloaded file once and confirm the dimensions match the requirement.",
    ],
    relatedGuideSlugs: [
      "resize-image-for-online-forms",
      "file-upload-size-limits-checklist",
      "compress-image-without-quality-loss",
    ],
  },
  compress: {
    audience:
      "a photo, screenshot or graphic is too large for email, a website form, a CMS upload or a messaging workflow",
    requirement:
      "the accepted format, the maximum KB or MB value and whether transparency needs to be preserved",
    workflow:
      "choose the output format, set a sensible quality level, add a target KB only when the destination has a strict limit, and reduce dimensions if quality drops too far",
    checks:
      "small text, faces, logos, gradients and sharp edges because these areas show compression damage first",
    mistakes: [
      "Pushing quality too low when a small dimension reduction would preserve detail better.",
      "Using JPG for transparent graphics and losing the transparent background.",
      "Recompressing an already compressed download several times.",
      "Assuming every image can reach a very small target size without visible loss.",
    ],
    tips: [
      "Try WebP for web use when the receiving site accepts it.",
      "Use JPG for photos and PNG or WebP for transparent graphics.",
      "Keep the original image until the compressed version is accepted.",
      "Check the final size and preview at normal zoom before submitting.",
    ],
    relatedGuideSlugs: [
      "compress-image-without-quality-loss",
      "file-upload-size-limits-checklist",
      "jpeg-png-webp-avif-differences",
    ],
  },
  convert: {
    audience:
      "an upload form, design tool, browser, CMS or document workflow accepts one image format but not the format you currently have",
    requirement:
      "the destination format, transparency needs, expected quality and whether the output should be optimized for photos or graphics",
    workflow:
      "select the format first, choose quality for lossy formats, preserve PNG when transparency matters and download a new copy without replacing the original",
    checks:
      "transparency, background color, color shifts and file size because a format change can alter how the image behaves",
    mistakes: [
      "Converting transparent PNG artwork to JPG without adding an acceptable background.",
      "Using AVIF for a portal that only accepts JPG or PNG.",
      "Expecting JPG to become sharper after conversion to PNG.",
      "Ignoring file size after conversion when the destination also has a KB limit.",
    ],
    tips: [
      "Use JPG for broad photo compatibility.",
      "Use PNG when transparency or crisp screenshots matter.",
      "Use WebP for modern web pages after confirming support.",
      "Keep format conversion separate from final compression when rules are strict.",
    ],
    relatedGuideSlugs: [
      "jpeg-png-webp-avif-differences",
      "webp-vs-jpg-when-to-use-each-format",
      "file-upload-size-limits-checklist",
    ],
  },
  "webp-to-jpg": {
    audience:
      "a website, government form, older desktop app or messaging workflow does not accept WebP images",
    requirement:
      "whether the image contains transparency and what JPG quality or maximum file size is acceptable",
    workflow:
      "convert to JPG, choose a quality level that keeps the photo clear, then compress only if the converted file is still too large",
    checks:
      "background fill, skin tones, gradients and file size after the WebP image becomes JPEG",
    mistakes: [
      "Forgetting that JPG cannot keep transparent pixels.",
      "Choosing very low quality only to match a size limit.",
      "Uploading a WebP copy again instead of the new JPG download.",
      "Not checking whether the original WebP was already heavily compressed.",
    ],
    tips: [
      "Use a white background when converting transparent WebP files for most forms.",
      "Start with a higher JPG quality and reduce gradually.",
      "Rename the output clearly so it is easy to identify during upload.",
      "Keep the original WebP if you also need a web-optimized version later.",
    ],
    relatedGuideSlugs: [
      "webp-vs-jpg-when-to-use-each-format",
      "jpeg-png-webp-avif-differences",
    ],
  },
  "png-to-jpg": {
    audience:
      "a PNG photo or large screenshot needs to become a smaller, widely accepted JPG file",
    requirement:
      "whether transparency exists, which background color should replace it and how small the final JPG needs to be",
    workflow:
      "flatten transparent areas onto the chosen background, export as JPG, then compare readability and size before upload",
    checks:
      "transparent edges, text clarity, background fill and any color banding introduced by JPG compression",
    mistakes: [
      "Using JPG when the PNG relies on transparency.",
      "Leaving the background choice to chance for logos or cutouts.",
      "Reducing JPG quality so much that screenshot text becomes hard to read.",
      "Assuming PNG and JPG are interchangeable for all graphics.",
    ],
    tips: [
      "Use JPG for photographic PNGs and keep PNG for logos with transparency.",
      "Choose a plain background before converting transparent artwork.",
      "Preview screenshots at 100% zoom after conversion.",
      "Use PNG-to-WebP instead when transparency and smaller size are both needed.",
    ],
    relatedGuideSlugs: [
      "jpeg-png-webp-avif-differences",
      "webp-vs-jpg-when-to-use-each-format",
    ],
  },
  "jpg-to-png": {
    audience:
      "you need a PNG copy of a JPEG for editing, screenshots, document placement or a workflow that specifically asks for PNG",
    requirement:
      "whether PNG is required for compatibility or editing, because converting JPG to PNG will not restore lost detail",
    workflow:
      "create the PNG copy, inspect file size, then use the PNG where lossless editing or broad application support is the reason for conversion",
    checks:
      "file size, visible JPEG artifacts and whether the destination truly needs PNG instead of JPG",
    mistakes: [
      "Expecting a PNG conversion to recover detail removed by JPEG compression.",
      "Using PNG for large photos when a smaller JPG would be accepted.",
      "Assuming a JPG can gain transparency just by becoming PNG.",
      "Skipping the file-size check after export.",
    ],
    tips: [
      "Use PNG when the next step is editing, annotation or screen capture placement.",
      "Keep JPG for regular photo uploads when size matters.",
      "Convert only the final version to avoid creating very large intermediate files.",
      "Compare both versions if the destination has strict upload limits.",
    ],
    relatedGuideSlugs: ["jpeg-png-webp-avif-differences"],
  },
  "avif-to-jpg": {
    audience:
      "an AVIF image needs to open in an older viewer, upload form, document editor or sharing channel that does not support AVIF",
    requirement:
      "browser AVIF support, output quality and whether the destination requires JPG specifically",
    workflow:
      "decode the AVIF in the browser, export a compatible JPG copy, and verify the visual result before replacing the original in your workflow",
    checks:
      "color appearance, gradients, file size and whether the destination accepts the downloaded JPG",
    mistakes: [
      "Assuming every browser can decode every AVIF file.",
      "Using a low quality setting for artwork with gradients or text.",
      "Forgetting that JPG output removes transparency.",
      "Deleting the original AVIF before the JPG is accepted.",
    ],
    tips: [
      "Use the newest browser available when decoding AVIF files.",
      "Keep quality higher for detailed product photos.",
      "Use JPG for compatibility and WebP or AVIF for modern web delivery.",
      "Test the downloaded file in the app where it will be used.",
    ],
    relatedGuideSlugs: ["jpeg-png-webp-avif-differences"],
  },
  "png-to-webp": {
    audience:
      "a PNG image needs a smaller modern web format while keeping good detail and optional transparency",
    requirement:
      "whether the destination accepts WebP, whether transparency must remain and how much quality can be reduced",
    workflow:
      "export a WebP copy, keep transparency when needed, then compare the WebP against the source PNG before publishing",
    checks:
      "transparent edges, text, icons and color blocks because these can show artifacts when quality is too low",
    mistakes: [
      "Using WebP for a portal that only accepts JPG or PNG.",
      "Lowering quality too much on screenshots with small text.",
      "Forgetting to test transparency after conversion.",
      "Replacing the source PNG before checking browser or app support.",
    ],
    tips: [
      "Use WebP for websites when support is confirmed.",
      "Keep PNG for source artwork and export WebP for delivery.",
      "Use a higher quality setting for UI screenshots.",
      "Test the output in the target page or application.",
    ],
    relatedGuideSlugs: [
      "webp-vs-jpg-when-to-use-each-format",
      "jpeg-png-webp-avif-differences",
    ],
  },
  "compress-jpg": {
    audience:
      "a JPEG photo must fit a KB limit for forms, email, web publishing or document attachments",
    requirement:
      "the maximum file size, acceptable dimensions and whether small details like faces or text must remain sharp",
    workflow:
      "set a quality level, use target KB for strict limits, and reduce maximum dimensions before quality becomes visibly poor",
    checks:
      "faces, signatures, document text and smooth backgrounds where JPEG artifacts are easiest to notice",
    mistakes: [
      "Lowering quality below a readable level instead of reducing dimensions.",
      "Compressing the same JPG repeatedly.",
      "Using JPG for transparent graphics.",
      "Not checking the final KB value after download.",
    ],
    tips: [
      "Use target KB when an upload portal has a fixed limit.",
      "Start around balanced quality and adjust only as needed.",
      "Resize very large camera photos before heavy compression.",
      "Keep the original camera file separately.",
    ],
    relatedGuideSlugs: [
      "compress-image-without-quality-loss",
      "file-upload-size-limits-checklist",
    ],
  },
  "compress-png": {
    audience:
      "a PNG screenshot, logo or transparent graphic is too large for upload or sharing",
    requirement:
      "whether transparency must stay, whether the image is a screenshot or artwork, and whether WebP is allowed instead",
    workflow:
      "keep PNG when lossless output is required, reduce dimensions if necessary, and consider WebP only when the destination supports it",
    checks:
      "text edges, transparent areas, line art and the exact file size after export",
    mistakes: [
      "Expecting PNG photos to shrink as much as JPEG photos.",
      "Switching to JPG and losing transparency.",
      "Downscaling icons too far for their display size.",
      "Ignoring WebP as an option when the destination supports it.",
    ],
    tips: [
      "Use PNG for screenshots, icons and transparent graphics.",
      "Use WebP for smaller web delivery when compatibility is acceptable.",
      "Remove unnecessary dimensions before chasing a very small file size.",
      "Preview transparent edges on a contrasting background.",
    ],
    relatedGuideSlugs: [
      "compress-image-without-quality-loss",
      "jpeg-png-webp-avif-differences",
    ],
  },
  "heic-to-jpg": {
    audience:
      "iPhone HEIC photos need to work with portals, printers, desktops or apps that expect JPEG uploads",
    requirement:
      "the number of photos, output quality, maximum file size and whether the destination asks for JPG or PDF",
    workflow:
      "decode the HEIC photo, export a JPG copy, then compress or resize the JPG only when the destination has a size rule",
    checks:
      "orientation, color, file size and whether faces or document text remain clear after conversion",
    mistakes: [
      "Uploading HEIC directly to a form that accepts only JPG.",
      "Converting and compressing at the same time without reviewing quality.",
      "Deleting the original iPhone photo before the JPG is accepted.",
      "Ignoring orientation metadata after conversion.",
    ],
    tips: [
      "Convert HEIC to JPG first for maximum compatibility.",
      "Use HEIC to PDF when the destination wants a document, not a photo.",
      "Check orientation before submitting converted phone photos.",
      "Use target KB after conversion only when the portal requires it.",
    ],
    relatedGuideSlugs: [
      "file-upload-size-limits-checklist",
      "compress-image-without-quality-loss",
    ],
  },
  "heic-to-png": {
    audience:
      "an iPhone HEIC image needs a PNG copy for editing, design placement or a workflow that accepts PNG but not HEIC",
    requirement:
      "whether PNG is truly needed, because PNG copies of photos can be much larger than JPG copies",
    workflow:
      "decode the HEIC file, create the PNG copy and use it where compatibility or editing is more important than file size",
    checks:
      "orientation, dimensions and output size because PNG can create very large photo files",
    mistakes: [
      "Choosing PNG for a photo upload that would accept smaller JPG.",
      "Assuming PNG output will add transparency to a regular HEIC photo.",
      "Skipping size checks on high-resolution iPhone images.",
      "Using PNG when the final destination asks for PDF.",
    ],
    tips: [
      "Use JPG for most form photo uploads.",
      "Use PNG when you need a lossless editing copy.",
      "Resize large phone photos before sharing if the PNG is too large.",
      "Keep the original HEIC for your photo library.",
    ],
    relatedGuideSlugs: ["jpeg-png-webp-avif-differences"],
  },
  "image-to-text": {
    audience:
      "you need to copy text from screenshots, scanned notes, receipts, labels or document photos without retyping everything manually",
    requirement:
      "image clarity, text language, rotation and whether the source uses readable printed text rather than handwriting",
    workflow:
      "straighten or crop the image first, run OCR, then review and correct the extracted text before using it in a document",
    checks:
      "names, numbers, dates, addresses and punctuation because OCR mistakes often happen in important small details",
    mistakes: [
      "Using a blurry or angled photo and expecting perfect recognition.",
      "Skipping manual review before copying the OCR result.",
      "Cropping out part of a line before extraction.",
      "Using OCR output as a legal or financial record without checking it.",
    ],
    tips: [
      "Use a sharp image with good contrast between text and background.",
      "Crop to the text area before running OCR.",
      "Choose the closest language option when available.",
      "Compare the output with the original before sharing or submitting it.",
    ],
    relatedGuideSlugs: ["how-ocr-works-extracting-text-from-images-explained"],
  },
  "svg-to-png": {
    audience:
      "an SVG logo, icon or illustration needs a raster PNG, JPG or WebP copy for apps that cannot use vector files",
    requirement:
      "target dimensions, scale, background color and whether transparency should remain",
    workflow:
      "sanitize and render the SVG at the required scale, choose a background when exporting JPG, then inspect edges after download",
    checks:
      "icon sharpness, transparent edges, background color and whether text in the SVG rendered correctly",
    mistakes: [
      "Exporting too small and then enlarging the PNG later.",
      "Using JPG for an icon that needs transparency.",
      "Forgetting to set a background for designs that need one.",
      "Assuming every SVG font will render identically on every device.",
    ],
    tips: [
      "Export at the final display size or slightly larger.",
      "Use PNG for transparent icons.",
      "Use WebP for web delivery when support is acceptable.",
      "Check the output on both light and dark backgrounds if transparency matters.",
    ],
    relatedGuideSlugs: ["jpeg-png-webp-avif-differences"],
  },
  "favicon-generator": {
    audience:
      "a website, web app or side project needs favicon and app icon files from a single source image",
    requirement:
      "a square source image, enough padding around the logo and icon sizes required by the website theme or manifest",
    workflow:
      "start with a high-resolution square image, generate the icon pack, then test the favicon in a browser tab and on a mobile shortcut",
    checks:
      "small-size legibility, transparent padding, background color and whether the ZIP contains the expected icon files",
    mistakes: [
      "Using a wide logo that becomes unreadable at 16 pixels.",
      "Cropping the logo too close to the icon edge.",
      "Forgetting to test the favicon in a browser tab.",
      "Using a low-resolution source image for all icon sizes.",
    ],
    tips: [
      "Use a simple mark rather than a full wordmark for small favicons.",
      "Keep clear padding around the main symbol.",
      "Preview the 16 x 16 and 32 x 32 sizes before publishing.",
      "Update cached favicons by refreshing the browser after deployment.",
    ],
    relatedGuideSlugs: ["jpeg-png-webp-avif-differences"],
  },
  "blur-image": {
    audience:
      "a screenshot, ID image, chat capture or photo contains faces, numbers, addresses or private areas that should be hidden before sharing",
    requirement:
      "which areas must be concealed, whether blur or pixelation is safer and what output format the destination accepts",
    workflow:
      "mark every sensitive area, use a strong enough blur or pixelation setting, then inspect the downloaded image at full size",
    checks:
      "edges of blur boxes, repeated private details and whether zooming in reveals readable information",
    mistakes: [
      "Using a light blur that still leaves text readable.",
      "Missing private details in headers, filenames or background areas.",
      "Sharing the original image by accident.",
      "Assuming blur is reversible-proof for highly sensitive data.",
    ],
    tips: [
      "Use pixelation or stronger blur for numbers and text.",
      "Zoom into the output before sharing.",
      "Keep a separate unedited original for your own records.",
      "Use redaction for PDFs when hidden text must not remain selectable.",
    ],
    relatedGuideSlugs: [
      "browser-based-file-tools-privacy",
      "file-upload-size-limits-checklist",
    ],
  },
  "image-collage-maker": {
    audience:
      "you need a single shareable image from multiple photos, screenshots, product pictures or before-and-after comparisons",
    requirement:
      "layout ratio, output size, background color, gap spacing and where the final image will be posted or printed",
    workflow:
      "choose the layout first, arrange images in reading order, adjust spacing and export one combined file for review",
    checks:
      "image order, cropping, spacing consistency, readable screenshots and whether the final aspect ratio suits the destination",
    mistakes: [
      "Mixing portrait and landscape images without checking how they align.",
      "Using too many images in a small collage.",
      "Choosing a background that clashes with transparent graphics.",
      "Exporting before checking the final size and ratio.",
    ],
    tips: [
      "Use grid layouts for many images and horizontal layouts for comparisons.",
      "Keep gaps consistent for a cleaner result.",
      "Use a neutral background when source images have different sizes.",
      "Preview the collage at the size where it will be shared.",
    ],
    relatedGuideSlugs: ["jpeg-png-webp-avif-differences"],
  },
  crop: {
    audience:
      "a photo, document scan, product image or profile picture has extra background or needs a fixed aspect ratio",
    requirement:
      "the target ratio, final dimensions and which subject area must stay visible",
    workflow:
      "select the crop area, use a fixed ratio when required, then export after checking the important subject is centered",
    checks:
      "faces, document edges, signatures, product boundaries and the final image ratio",
    mistakes: [
      "Cropping before deciding the required aspect ratio.",
      "Cutting too close to the face or document edge.",
      "Using freeform crop when a portal expects a fixed ratio.",
      "Forgetting to resize after crop when exact pixels are required.",
    ],
    tips: [
      "Crop first, resize second and compress last.",
      "Leave enough margin around documents and IDs.",
      "Use square crop for many profile images.",
      "Preview the output before replacing an existing upload.",
    ],
    relatedGuideSlugs: [
      "resize-image-for-online-forms",
      "file-upload-size-limits-checklist",
    ],
  },
  "rotate-flip": {
    audience:
      "a phone photo, scanned page, receipt or screenshot appears sideways, upside down or mirrored",
    requirement:
      "the correct reading orientation and whether the image needs a simple 90 degree turn or a small straightening angle",
    workflow:
      "rotate in 90 degree steps for page orientation, use flip only when the image is mirrored, and export after the preview reads naturally",
    checks:
      "text direction, document borders, face orientation and blank corners after angled rotation",
    mistakes: [
      "Flipping an image when rotation is the real problem.",
      "Using a custom angle without checking corners.",
      "Saving a document that still reads sideways in the preview.",
      "Compressing heavily during a simple orientation fix.",
    ],
    tips: [
      "Use 90 degree actions for scanned documents.",
      "Use small custom angles for camera tilt.",
      "Choose a fill color that matches the background for angled rotation.",
      "Open the downloaded file before attaching it to an email or form.",
    ],
    relatedGuideSlugs: ["resize-image-for-online-forms"],
  },
  "background-removal": {
    audience:
      "a product photo, profile image, listing image or quick design asset needs the subject separated from the background",
    requirement:
      "subject clarity, edge contrast and whether the final image needs a transparent PNG or a filled background",
    workflow:
      "use a clear image, remove the background, inspect the subject edge and export PNG when transparency must remain",
    checks:
      "hair, fabric edges, shadows, product outlines and any leftover background fragments",
    mistakes: [
      "Using low-contrast images where the subject blends into the background.",
      "Exporting as JPG and losing transparency.",
      "Skipping edge review before using the cutout in a design.",
      "Expecting perfect results on very busy backgrounds.",
    ],
    tips: [
      "Choose photos with strong subject-background separation.",
      "Use PNG for transparent output.",
      "Review edges on a contrasting background.",
      "Keep the original image if manual cleanup is needed later.",
    ],
    relatedGuideSlugs: ["jpeg-png-webp-avif-differences"],
  },
  watermark: {
    audience:
      "photos, certificates, previews, proofs or drafts need an ownership mark before being shared outside your workflow",
    requirement:
      "watermark text or logo, position, opacity, rotation and whether a repeated tile is more appropriate than a single mark",
    workflow:
      "choose the mark type, place it where it discourages reuse without hiding important content, then export a new copy",
    checks:
      "readability, opacity, edge placement and whether the watermark covers essential document details",
    mistakes: [
      "Making the watermark so dark that the image is hard to inspect.",
      "Placing a single mark where it can be cropped away easily.",
      "Using low-resolution logo artwork.",
      "Overwriting the clean original with the watermarked copy.",
    ],
    tips: [
      "Use low opacity for review copies.",
      "Use tiled marks for drafts that may be forwarded.",
      "Keep a clean source file and a marked sharing copy.",
      "Check the watermark at phone-screen size before sharing.",
    ],
    relatedGuideSlugs: ["browser-based-file-tools-privacy"],
  },
  merge: {
    audience:
      "several screenshots, document photos, product images or comparison pictures need to become one image",
    requirement:
      "image order, layout direction, background color, spacing and the final size expected by the destination",
    workflow:
      "arrange images in reading order, choose horizontal, vertical or grid layout, set gaps and export one combined copy",
    checks:
      "order, alignment, readable details and whether the combined image is too wide or tall for the destination",
    mistakes: [
      "Combining too many detailed screenshots into one unreadable image.",
      "Using the wrong reading order for documents.",
      "Ignoring background color when source images have transparency.",
      "Exporting a layout that is too large for upload.",
    ],
    tips: [
      "Use vertical layout for document sequences.",
      "Use horizontal layout for before-and-after comparisons.",
      "Use grid layout for product or gallery sets.",
      "Compress the merged output only after confirming the layout.",
    ],
    relatedGuideSlugs: ["file-upload-size-limits-checklist"],
  },
  filters: {
    audience:
      "a photo needs quick brightness, contrast, saturation, tone or blur adjustments before sharing or uploading",
    requirement:
      "which visual issue you are correcting and whether the edited image should look natural or stylized",
    workflow:
      "make small adjustments, compare the preview with the original, and export only when important details remain visible",
    checks:
      "skin tones, document text, highlights, shadows and whether filters hide details that need to be readable",
    mistakes: [
      "Applying extreme contrast or saturation to document photos.",
      "Using blur on the whole image when only one area needs hiding.",
      "Not comparing the result with the original.",
      "Exporting low quality after heavy visual edits.",
    ],
    tips: [
      "Use subtle corrections for documents and IDs.",
      "Adjust brightness before contrast for dark photos.",
      "Use blur-image for privacy-specific hiding.",
      "Keep the original for future edits.",
    ],
    relatedGuideSlugs: ["compress-image-without-quality-loss"],
  },
  metadata: {
    audience:
      "you need to inspect dimensions, file size, camera details, color information or privacy-related EXIF data before sharing an image",
    requirement:
      "which metadata fields matter for your task and whether the image should be cleaned before publishing",
    workflow:
      "load the image, review visible file details and EXIF fields, then re-export a clean copy when metadata should be stripped",
    checks:
      "camera model, dates, software names, dimensions, color palette and whether private fields are present",
    mistakes: [
      "Sharing photos without checking metadata when privacy matters.",
      "Assuming every image contains complete EXIF information.",
      "Confusing visible pixels with hidden metadata.",
      "Forgetting to verify the cleaned copy.",
    ],
    tips: [
      "Review metadata before publishing sensitive photos.",
      "Re-export to remove many common metadata fields.",
      "Use dimensions and file size to diagnose upload problems.",
      "Keep the source file if metadata is needed for your records.",
    ],
    relatedGuideSlugs: ["browser-based-file-tools-privacy"],
  },
  "merge-pdf": {
    audience:
      "applications, certificates, invoices, scanned records or reports need to be combined into one ordered PDF",
    requirement:
      "the final document order, whether blank pages are needed and the maximum file size accepted by email or a portal",
    workflow:
      "rename and arrange source files first, merge them in reading order, then compress only if the finished document is too large",
    checks:
      "page order, duplicate pages, missing attachments, readable scans and final file size",
    mistakes: [
      "Merging files before removing outdated or duplicate documents.",
      "Ignoring page order inside a source PDF.",
      "Compressing before the final merge is complete.",
      "Submitting without opening the merged download once.",
    ],
    tips: [
      "Place the main form before supporting documents.",
      "Use reorder pages when a source PDF is already mixed up.",
      "Keep individual source files until submission is complete.",
      "Compress after merging when the destination has a size limit.",
    ],
    relatedGuideSlugs: [
      "merge-pdf-files-online",
      "how-to-reduce-pdf-size-for-email-attachments",
      "file-upload-size-limits-checklist",
    ],
  },
  "compress-pdf": {
    audience:
      "a PDF is too large for email, online forms, storage limits or document sharing",
    requirement:
      "the target KB or MB size, whether the PDF is scanned or text-based and how much clarity must be preserved",
    workflow:
      "start with balanced compression, use target size only when needed, and review the output before using stronger settings",
    checks:
      "small text, signatures, seals, QR codes, stamps and page images after compression",
    mistakes: [
      "Using maximum compression on documents that must remain readable.",
      "Expecting text-only PDFs to shrink as much as scanned PDFs.",
      "Compressing before fixing page order or merging.",
      "Not checking whether selectable text changed after strong compression.",
    ],
    tips: [
      "Use higher quality for certificates, IDs and signed pages.",
      "Compress scanned PDFs after all page edits are done.",
      "Use a realistic target size when readability matters.",
      "Open the downloaded PDF and zoom into important details.",
    ],
    relatedGuideSlugs: [
      "compress-pdf-to-target-kb",
      "how-to-reduce-pdf-size-for-email-attachments",
      "file-upload-size-limits-checklist",
    ],
  },
  "split-pdf": {
    audience:
      "a long PDF contains separate certificates, invoices, chapters, forms or pages that need individual files",
    requirement:
      "the exact page ranges, naming pattern and whether each output should be a separate PDF or a grouped document",
    workflow:
      "inspect page numbers, choose every-page, fixed-range or custom ranges, then download a ZIP when several outputs are created",
    checks:
      "page boundaries, range syntax, file names and whether each extracted file opens correctly",
    mistakes: [
      "Typing page ranges without checking the actual page numbers.",
      "Forgetting that cover pages change expected numbering.",
      "Creating many files without a clear naming pattern.",
      "Deleting the source PDF before checking all outputs.",
    ],
    tips: [
      "Use visual page review before entering ranges.",
      "Use custom ranges for documents that contain different sections.",
      "Download multiple outputs as ZIP to keep them together.",
      "Open a sample output before sending the full set.",
    ],
    relatedGuideSlugs: ["merge-pdf-files-online"],
  },
  "convert-pdf-to-image": {
    audience:
      "PDF pages need to become JPG, PNG or WebP images for previews, thumbnails, forms, presentations or quick sharing",
    requirement:
      "which pages are needed, output format, DPI and whether text clarity or smaller file size matters more",
    workflow:
      "select only required pages, choose DPI based on destination, then export images and verify clarity before sharing",
    checks:
      "small text, page margins, file size and whether the chosen image format matches the destination",
    mistakes: [
      "Exporting every page when only one page is needed.",
      "Using low DPI for pages with small text.",
      "Choosing JPG for pages where crisp text is more important than size.",
      "Forgetting that each page becomes a separate image.",
    ],
    tips: [
      "Use JPG for smaller scanned-page previews.",
      "Use PNG for crisp text and screenshots.",
      "Use higher DPI for print or zoomable previews.",
      "Create a ZIP when exporting many pages.",
    ],
    relatedGuideSlugs: [
      "convert-pdf-to-jpg-or-png",
      "jpeg-png-webp-avif-differences",
    ],
  },
  "convert-image-to-pdf": {
    audience:
      "photos, scans, screenshots or image sets need to become one PDF document for upload, email or archiving",
    requirement:
      "page size, image order, margins, fit mode and whether the PDF needs metadata or compression afterward",
    workflow:
      "arrange images, choose A4 or match-image page settings, export the PDF and compress only if the finished file is too large",
    checks:
      "image order, page margins, rotation, readability and final PDF size",
    mistakes: [
      "Adding images in the wrong order.",
      "Using a page size that crops important content.",
      "Forgetting margins for documents that may be printed.",
      "Compressing source images too much before creating the PDF.",
    ],
    tips: [
      "Use A4 for form-style documents.",
      "Use match-image when each photo should keep its natural shape.",
      "Rotate images before building the PDF.",
      "Check the PDF after export on a PDF viewer.",
    ],
    relatedGuideSlugs: [
      "file-upload-size-limits-checklist",
      "merge-pdf-files-online",
    ],
  },
  "jpg-to-pdf": {
    audience:
      "JPEG photos, scanned pages or camera captures need to be submitted as a PDF",
    requirement:
      "the final page order, page size, margins and maximum PDF size allowed by the destination",
    workflow:
      "add JPG files in order, choose page settings, create the PDF, then compress the PDF if the portal has a size limit",
    checks:
      "image rotation, page fit, readable text and whether every required photo appears in the PDF",
    mistakes: [
      "Uploading separate JPGs when the form expects one PDF.",
      "Leaving photos sideways before creating the PDF.",
      "Choosing margins that crop document edges.",
      "Skipping final PDF review.",
    ],
    tips: [
      "Use A4 for document scans.",
      "Use match-image for photo-only PDFs.",
      "Compress the PDF after creation, not each image repeatedly.",
      "Keep source JPGs until the submission is accepted.",
    ],
    relatedGuideSlugs: [
      "file-upload-size-limits-checklist",
      "how-to-reduce-pdf-size-for-email-attachments",
    ],
  },
  "png-to-pdf": {
    audience:
      "PNG screenshots, graphics or transparent images need to be collected into a PDF",
    requirement:
      "page size, background handling, image fit and whether transparent areas should appear white in the document",
    workflow:
      "order the PNG files, choose page settings and background behavior, then verify each page in the exported PDF",
    checks:
      "screenshot readability, transparent backgrounds, margins and final file size",
    mistakes: [
      "Using PNG screenshots so large that the PDF becomes difficult to upload.",
      "Ignoring transparent areas against a PDF page background.",
      "Mixing image sizes without reviewing page fit.",
      "Not compressing the final PDF when required.",
    ],
    tips: [
      "Use PNG for crisp screenshots and graphics.",
      "Use a clear background for transparent artwork.",
      "Choose consistent margins for multi-page PDFs.",
      "Compress after building the final PDF if needed.",
    ],
    relatedGuideSlugs: ["file-upload-size-limits-checklist"],
  },
  "heic-to-pdf": {
    audience:
      "iPhone HEIC photos need to become a PDF for forms, records, receipts or document sharing",
    requirement:
      "photo order, page size, orientation and whether the final PDF must fit a KB or MB limit",
    workflow:
      "decode HEIC photos, arrange them as pages, export a PDF and review orientation before submitting",
    checks:
      "orientation, page order, image clarity and final PDF size",
    mistakes: [
      "Uploading HEIC photos to a portal that expects PDF.",
      "Creating a PDF before rotating sideways photos.",
      "Forgetting that phone photos can make very large PDFs.",
      "Deleting source photos before the PDF is accepted.",
    ],
    tips: [
      "Use A4 for document-style HEIC scans.",
      "Use compression after PDF creation if size is too high.",
      "Check every page in a PDF viewer.",
      "Use HEIC to JPG when the destination wants image files instead.",
    ],
    relatedGuideSlugs: ["file-upload-size-limits-checklist"],
  },
  "rotate-pdf": {
    audience:
      "scanned PDF pages appear sideways, upside down or mixed between portrait and landscape",
    requirement:
      "which pages need rotation and whether all pages or only selected pages should change",
    workflow:
      "review thumbnails, select affected pages, rotate by 90 degree steps and save a new PDF copy",
    checks:
      "page orientation, reading order, mixed page sizes and whether all selected pages changed correctly",
    mistakes: [
      "Rotating every page when only scanned pages are sideways.",
      "Confusing page rotation with image cropping.",
      "Not checking landscape pages inside a portrait document.",
      "Submitting the old unrotated copy by accident.",
    ],
    tips: [
      "Use thumbnails to find rotated pages quickly.",
      "Rotate in 90 degree steps for scanned PDFs.",
      "Keep the original PDF until the corrected copy is accepted.",
      "Compress only after the orientation is fixed.",
    ],
    relatedGuideSlugs: ["merge-pdf-files-online"],
  },
  "add-watermark-to-pdf": {
    audience:
      "contracts, reports, certificates, invoices or sample documents need visible status or ownership marks",
    requirement:
      "watermark text or logo, page range, placement, opacity and whether the mark should sit above or below content",
    workflow:
      "choose the mark, apply it to the right pages, preview readability and export a new sharing copy",
    checks:
      "document readability, signature visibility, page coverage and whether the watermark appears on all intended pages",
    mistakes: [
      "Using a watermark that hides important text or signatures.",
      "Applying a draft mark to pages that should stay clean.",
      "Forgetting to set page ranges.",
      "Using an image watermark with poor resolution.",
    ],
    tips: [
      "Use low opacity for readable review copies.",
      "Use centered or repeated marks for draft documents.",
      "Apply only to selected pages when attachments should remain clean.",
      "Keep an unwatermarked source PDF separately.",
    ],
    relatedGuideSlugs: ["browser-based-file-tools-privacy"],
  },
  "protect-pdf": {
    audience:
      "a PDF with private, financial, educational or work information needs an open password before sharing or storage",
    requirement:
      "password strength, viewer compatibility and whether permissions such as printing or copying should be restricted",
    workflow:
      "choose a strong password, configure permissions, export the protected PDF and test opening it before sending",
    checks:
      "password accuracy, permission behavior in a PDF viewer and whether the recipient has the password through a separate channel",
    mistakes: [
      "Using a weak or reused password.",
      "Sending the PDF and password in the same message.",
      "Assuming permissions are stronger than an open password.",
      "Forgetting the password after export.",
    ],
    tips: [
      "Use a long unique password.",
      "Share the password through a separate channel.",
      "Keep an unprotected backup in a secure place.",
      "Test the protected PDF before deleting the original copy.",
    ],
    relatedGuideSlugs: [
      "understanding-pdf-encryption-passwords-permissions-and-security",
      "browser-based-file-tools-privacy",
    ],
  },
  "unlock-pdf": {
    audience:
      "you own a PDF, know the current open password and need a copy that opens without repeated password entry",
    requirement:
      "authorization to modify the file and the correct current password",
    workflow:
      "enter the known password, remove protection locally and save a new copy for your own authorized workflow",
    checks:
      "whether the output opens without a password and whether the file should still be protected before sharing",
    mistakes: [
      "Trying to use the tool to crack an unknown password.",
      "Removing protection from a file you are not allowed to modify.",
      "Sharing the unlocked copy when a protected copy is required.",
      "Deleting the protected original too early.",
    ],
    tips: [
      "Use this only for files you own or are allowed to modify.",
      "Keep a protected copy if the file contains sensitive information.",
      "Use Protect PDF again before sharing outside your device.",
      "Confirm the unlocked output opens in your target PDF viewer.",
    ],
    relatedGuideSlugs: ["understanding-pdf-encryption-passwords-permissions-and-security"],
  },
  "extract-pdf-pages": {
    audience:
      "only selected pages from a larger PDF need to be shared, uploaded or archived",
    requirement:
      "the exact pages needed and whether they should be combined into one PDF or exported separately",
    workflow:
      "select pages visually or by range, export the selected pages and open the result to confirm nothing is missing",
    checks:
      "page numbers, output grouping, document context and whether extracted pages remain readable",
    mistakes: [
      "Extracting the wrong pages because the PDF has a cover page.",
      "Sharing pages without needed context or attachments.",
      "Exporting separate files when one PDF is required.",
      "Deleting the source PDF before checking the extracted copy.",
    ],
    tips: [
      "Use visual selection for mixed documents.",
      "Use separate PDFs when each page is a different certificate.",
      "Use one PDF when pages belong to the same record.",
      "Name extracted files clearly before uploading.",
    ],
    relatedGuideSlugs: ["merge-pdf-files-online"],
  },
  "delete-pages-from-pdf": {
    audience:
      "a PDF contains blank, duplicate, outdated or unwanted pages that should be removed before sharing",
    requirement:
      "which pages must be deleted and whether the remaining document still has the required context",
    workflow:
      "review page thumbnails, remove unwanted pages, save a new PDF and compare the page count with the expected result",
    checks:
      "page numbering, missing attachments, document continuity and final file size",
    mistakes: [
      "Deleting pages before checking whether they are referenced later.",
      "Removing a cover page that a form requires.",
      "Forgetting that page numbers inside the document may no longer match.",
      "Overwriting the only complete source copy.",
    ],
    tips: [
      "Keep the full original until the trimmed copy is accepted.",
      "Use extract pages when you only need a few pages.",
      "Check the final page count after deletion.",
      "Compress the cleaned PDF if the file is still too large.",
    ],
    relatedGuideSlugs: ["merge-pdf-files-online"],
  },
  "reorder-pdf-pages": {
    audience:
      "pages were scanned, merged or received in the wrong sequence and need to be organized before submission",
    requirement:
      "the correct reading order and whether any pages should be reversed, moved or left unchanged",
    workflow:
      "use thumbnails to move pages into order, reverse when needed and export after checking the final sequence",
    checks:
      "page order, cover pages, attachments and whether page numbers printed on the document still make sense",
    mistakes: [
      "Moving pages without checking adjacent context.",
      "Using reverse when only a few pages are out of order.",
      "Forgetting to verify the final exported PDF.",
      "Submitting a document with attachments before the main form.",
    ],
    tips: [
      "Use reset if the order becomes confusing.",
      "Keep supporting documents after the main form unless the destination says otherwise.",
      "Review thumbnails from first to last before export.",
      "Merge related PDFs only after their internal pages are correct.",
    ],
    relatedGuideSlugs: ["merge-pdf-files-online"],
  },
  "edit-pdf": {
    audience:
      "a PDF needs quick text, highlights, boxes, drawings or signature images added without a full desktop editor",
    requirement:
      "which pages need annotations and whether the additions are for review, form completion or visual markup",
    workflow:
      "add the required elements, place them carefully on selected pages and export a new copy for review",
    checks:
      "text placement, signature size, alignment, page selection and whether annotations cover existing content",
    mistakes: [
      "Using visual edits as a replacement for legally valid e-signature workflows.",
      "Placing text too close to existing form labels.",
      "Forgetting to review every edited page.",
      "Editing a compressed copy when the original is clearer.",
    ],
    tips: [
      "Zoom in when placing text on form fields.",
      "Use consistent font size across a document.",
      "Keep an unedited source PDF.",
      "Open the exported file in a PDF viewer before sending.",
    ],
    relatedGuideSlugs: ["understanding-pdf-encryption-passwords-permissions-and-security"],
  },
  "sign-pdf": {
    audience:
      "a PDF needs a visible signature image or drawn signature added to one or more pages",
    requirement:
      "signature placement, page selection and whether the receiving party accepts a visual signature",
    workflow:
      "draw or upload the signature, place it on the right page, adjust size and export a signed copy",
    checks:
      "signature readability, page position, document completeness and whether additional formal signing is required",
    mistakes: [
      "Assuming a visual signature always equals a compliant digital signature.",
      "Placing the signature on the wrong page.",
      "Using a signature image with a visible background when transparency is expected.",
      "Sending the file without opening the signed output.",
    ],
    tips: [
      "Use a clear signature image with enough contrast.",
      "Check whether the recipient requires certificate-based signing.",
      "Keep a clean unsigned copy.",
      "Review all signature fields before sharing.",
    ],
    relatedGuideSlugs: ["understanding-pdf-encryption-passwords-permissions-and-security"],
  },
  "crop-pdf": {
    audience:
      "PDF pages have excess margins, scan borders or unwanted edge areas that should be trimmed",
    requirement:
      "which page edges need cropping and whether the same crop should apply to all pages or selected pages",
    workflow:
      "set crop margins carefully, preview the result and save a new copy after confirming no content was cut off",
    checks:
      "headers, footers, page numbers, stamps and signatures near the page edges",
    mistakes: [
      "Cropping too aggressively and cutting off page numbers.",
      "Applying one crop to pages with different layouts.",
      "Confusing crop with permanent redaction.",
      "Not keeping the uncropped original.",
    ],
    tips: [
      "Use small crop values first.",
      "Check the first and last page before export.",
      "Use selected ranges for mixed layouts.",
      "Use redaction when content must be permanently hidden.",
    ],
    relatedGuideSlugs: ["merge-pdf-files-online"],
  },
  "pdf-to-text": {
    audience:
      "selectable text from a PDF needs to be copied, searched, indexed or saved as a plain text file",
    requirement:
      "whether the PDF contains selectable text or scanned page images that may need OCR instead",
    workflow:
      "load the PDF, extract available text, review page separators and copy or download the text output",
    checks:
      "missing sections, reading order, tables, headers and whether scanned pages produced little or no text",
    mistakes: [
      "Expecting selectable text extraction to read scanned image-only PDFs.",
      "Copying extracted text without reviewing line breaks.",
      "Using plain text when layout and tables must be preserved.",
      "Assuming every PDF stores text in natural reading order.",
    ],
    tips: [
      "Use OCR for image-only scans.",
      "Review tables and multi-column pages manually.",
      "Keep page separators when source context matters.",
      "Use the original PDF when formatting must be preserved.",
    ],
    relatedGuideSlugs: ["how-ocr-works-extracting-text-from-images-explained"],
  },
  "redact-pdf": {
    audience:
      "a PDF contains private names, numbers, addresses, account details or sensitive areas that must be hidden before sharing",
    requirement:
      "which areas must be removed and whether visual covering is enough or rasterized redaction is needed",
    workflow:
      "mark every sensitive area, export the redacted copy and inspect the PDF to confirm hidden details are not visible",
    checks:
      "text under redaction boxes, repeated details, headers, footers and thumbnails",
    mistakes: [
      "Using a black box annotation that leaves underlying text selectable.",
      "Missing repeated private details on later pages.",
      "Redacting a compressed blurry copy instead of the clearest source.",
      "Sharing without checking the output in a PDF viewer.",
    ],
    tips: [
      "Search the document for repeated sensitive terms before redacting.",
      "Use strong redaction for IDs, account numbers and addresses.",
      "Keep the original in a secure place.",
      "Open the exported PDF and try selecting around redacted areas.",
    ],
    relatedGuideSlugs: [
      "browser-based-file-tools-privacy",
      "understanding-pdf-encryption-passwords-permissions-and-security",
    ],
  },
  "add-page-numbers-to-pdf": {
    audience:
      "reports, notes, contracts, submissions or compiled PDFs need clear page numbers before review or printing",
    requirement:
      "start number, skipped cover pages, position, prefix, suffix and margins",
    workflow:
      "choose numbering style, apply it to the correct pages, then check that numbers do not overlap existing text",
    checks:
      "cover pages, footers, margins, existing page numbers and the final sequence",
    mistakes: [
      "Numbering a cover page that should stay unnumbered.",
      "Placing numbers over existing footer text.",
      "Using inconsistent numbering after merging documents.",
      "Forgetting prefixes or suffixes required by a document style.",
    ],
    tips: [
      "Skip the first page for cover-page documents.",
      "Use bottom center for general reports.",
      "Use margins that avoid stamps and footers.",
      "Review the last page to confirm the final number is correct.",
    ],
    relatedGuideSlugs: ["merge-pdf-files-online"],
  },
  "view-pdf-metadata": {
    audience:
      "you need to inspect PDF title, author, software, page sizes, encryption status or document properties before publishing",
    requirement:
      "which metadata fields should be preserved, changed or removed before sharing",
    workflow:
      "open the PDF, review document information and page details, then clean or edit metadata when privacy or organization requires it",
    checks:
      "author, title, producer, creation date, page sizes and encryption state",
    mistakes: [
      "Publishing PDFs with unintended author or software metadata.",
      "Assuming metadata is the same as visible document text.",
      "Ignoring encryption status before sharing.",
      "Forgetting to check page sizes in mixed documents.",
    ],
    tips: [
      "Clean metadata before public sharing when privacy matters.",
      "Use title and author fields for organized archives.",
      "Check page sizes before printing.",
      "Keep a source copy when metadata is needed for records.",
    ],
    relatedGuideSlugs: ["browser-based-file-tools-privacy"],
  },
};

const contentNotes: Partial<Record<ToolContentSlug, ContentNotes>> = {
  resize: {
    bestFor: [
      "Preparing photos for exam forms, job applications and profile uploads with exact width and height limits.",
      "Keeping proportions consistent when a portal asks for pixels, centimeters or a fixed maximum file size.",
    ],
    notes: [
      "Set dimensions before reducing file size so the final export keeps the right shape.",
      "For passport-style photos, check the face area and background after resizing before submitting the image.",
    ],
  },
  compress: {
    bestFor: [
      "Reducing JPG, PNG and WebP files for forms, email attachments and website uploads.",
      "Targeting a specific KB limit without sending the original image to a remote converter.",
    ],
    notes: [
      "Photos usually compress well as JPEG or WebP, while screenshots and transparent graphics often need PNG or WebP.",
      "If a strict KB target is hard to reach, reduce dimensions first and then compress.",
    ],
  },
  convert: {
    bestFor: [
      "Changing images between JPEG, PNG, WebP and AVIF for browser, design and upload compatibility.",
      "Creating a format that matches a portal requirement without changing the original file.",
    ],
    notes: [
      "Use PNG when transparency must be preserved.",
      "Use JPEG or WebP when small photo file size matters more than transparency.",
    ],
  },
  crop: {
    bestFor: [
      "Cutting photos to a fixed ratio for IDs, thumbnails, documents and social profiles.",
      "Removing extra background while keeping the selected subject centered.",
    ],
    notes: [
      "Use fixed ratios when a site expects a square, portrait or landscape image.",
      "Check the preview after cropping so important details are not outside the selected area.",
    ],
  },
  "rotate-flip": {
    bestFor: [
      "Correcting sideways images from phones, scanners and document captures.",
      "Mirroring images horizontally or vertically before sharing or submitting them.",
    ],
    notes: [
      "Use 90 degree steps for scanned documents and phone photos.",
      "Use a custom angle for small straightening adjustments.",
    ],
  },
  "background-removal": {
    bestFor: [
      "Creating transparent-background images for profile photos, catalog items and quick design work.",
      "Removing distracting backgrounds while keeping file processing on the device.",
    ],
    notes: [
      "Clear subject edges and good contrast usually produce cleaner background removal.",
      "Export as PNG when the transparent background must stay transparent.",
    ],
  },
  watermark: {
    bestFor: [
      "Adding ownership marks to photos, previews, certificates and shared image drafts.",
      "Placing text or logo watermarks with opacity, rotation and repeated tile options.",
    ],
    notes: [
      "Use lower opacity when the image content should remain easy to inspect.",
      "Use tiled watermarks for drafts that may be copied or shared outside your workflow.",
    ],
  },
  merge: {
    bestFor: [
      "Joining screenshots, product photos or document images into one side-by-side or grid image.",
      "Creating quick comparison sheets without opening a desktop editor.",
    ],
    notes: [
      "Use a grid layout for many images and a horizontal layout for before-after comparisons.",
      "Choose a neutral background color when the source images have different sizes.",
    ],
  },
  filters: {
    bestFor: [
      "Adjusting brightness, contrast, saturation and tone for photos before sharing or printing.",
      "Making quick visual corrections without installing a full image editor.",
    ],
    notes: [
      "Small brightness and contrast changes are usually better than extreme adjustments.",
      "Keep the original file if you may need to re-edit later.",
    ],
  },
  metadata: {
    bestFor: [
      "Checking dimensions, file size, camera details and EXIF data before publishing an image.",
      "Removing metadata by re-exporting an image when privacy matters.",
    ],
    notes: [
      "Metadata can include camera, software or date information depending on the source file.",
      "Re-exporting can remove many metadata fields while keeping visible pixels intact.",
    ],
  },
  "merge-pdf": {
    bestFor: [
      "Combining applications, certificates, invoices, notes and scanned PDFs into one ordered document.",
      "Creating a single PDF with optional size reduction after the merge.",
    ],
    notes: [
      "Arrange files in the final reading order before creating the output.",
      "Use compression when the merged file needs to fit an email or portal size limit.",
    ],
  },
  "compress-pdf": {
    bestFor: [
      "Reducing PDF size for email, government portals, job applications and document sharing.",
      "Targeting an approximate KB size when the original PDF contains large scanned pages.",
    ],
    notes: [
      "Compression works best on image-heavy or scanned PDFs.",
      "Very strong compression may make text less sharp, so use the preview result before submitting.",
    ],
  },
  "split-pdf": {
    bestFor: [
      "Separating a long PDF into single pages, fixed ranges or custom document sections.",
      "Saving only the parts needed for a form, email or archive.",
    ],
    notes: [
      "Use custom ranges when one PDF contains multiple certificates or records.",
      "For many outputs, download as a ZIP to keep the files organized.",
    ],
  },
  "convert-pdf-to-image": {
    bestFor: [
      "Exporting PDF pages as JPG, PNG or WebP images for previews, thumbnails and form uploads.",
      "Converting selected pages instead of exporting an entire document.",
    ],
    notes: [
      "Use PNG for sharp text or transparent-style graphics.",
      "Use JPG or WebP when smaller image files are more important.",
    ],
  },
  "convert-image-to-pdf": {
    bestFor: [
      "Turning photos, scans and screenshots into a single PDF document.",
      "Preparing image sets with page size, margin, fit and metadata controls.",
    ],
    notes: [
      "Use A4 or Letter for documents meant to print cleanly.",
      "Use match-image sizing when each source image should keep its natural page shape.",
    ],
  },
  "rotate-pdf": {
    bestFor: [
      "Fixing scanned pages that appear sideways or upside down in a PDF.",
      "Rotating only selected pages while leaving the rest of the document unchanged.",
    ],
    notes: [
      "Use 90 or 270 degrees for landscape-to-portrait corrections.",
      "Check page thumbnails before saving when a document mixes portrait and landscape pages.",
    ],
  },
  "add-watermark-to-pdf": {
    bestFor: [
      "Marking contracts, drafts, reports and shared documents as confidential or sample copies.",
      "Adding text or image watermarks to all pages or selected page ranges.",
    ],
    notes: [
      "Use a light opacity for readable documents.",
      "Place repeated or centered marks on drafts that should not be reused as final copies.",
    ],
  },
  "protect-pdf": {
    bestFor: [
      "Adding an open password to sensitive PDFs before sending or storing them.",
      "Restricting common permissions such as printing, copying and editing when supported by PDF viewers.",
    ],
    notes: [
      "Keep the password somewhere safe because the site does not store it.",
      "Permissions depend on PDF viewer behavior, so use a strong open password for real protection.",
    ],
  },
  "unlock-pdf": {
    bestFor: [
      "Removing password protection from PDFs when you already know the current password.",
      "Saving a document copy that opens faster for your own authorized files.",
    ],
    notes: [
      "This tool is not for cracking or bypassing unknown passwords.",
      "Use it only on files you own or have permission to modify.",
    ],
  },
  "extract-pdf-pages": {
    bestFor: [
      "Saving selected pages from a large PDF as a smaller document.",
      "Pulling certificates, forms, invoices or chapters out of a combined file.",
    ],
    notes: [
      "Visual selection helps avoid off-by-one page mistakes.",
      "Export separate PDFs when each selected page must be shared independently.",
    ],
  },
  "reorder-pdf-pages": {
    bestFor: [
      "Fixing scanned PDFs where pages were captured in the wrong order.",
      "Reversing, moving or organizing pages before sharing a final document.",
    ],
    notes: [
      "Check thumbnails after each move so the final reading sequence is correct.",
      "Use reset when you want to return to the original order before exporting.",
    ],
  },
  "add-page-numbers-to-pdf": {
    bestFor: [
      "Numbering reports, notes, contracts and multi-page PDFs before printing or sharing.",
      "Adding prefixes, suffixes and page positions that match a document style.",
    ],
    notes: [
      "Skip the first page when the PDF has a cover page.",
      "Use consistent margins so numbers do not overlap existing text.",
    ],
  },
  "view-pdf-metadata": {
    bestFor: [
      "Checking PDF title, author, page size, version and encryption status.",
      "Cleaning or editing metadata before publishing or sending a document.",
    ],
    notes: [
      "Metadata can reveal software, author or document history depending on the file.",
      "Clean metadata when sharing documents outside your organization.",
    ],
  },
};

function getRelatedTools(kind: "image" | "pdf", slug: ToolContentSlug) {
  const list = kind === "pdf" ? pdfTools : tools;
  return list.filter((tool) => tool.slug !== slug).slice(0, 4);
}

function fallbackNotes(kind: "image" | "pdf", tool: { name: string; features: string[] }) {
  const label = kind === "pdf" ? "PDF" : "image";

  return {
    bestFor: [
      `Completing ${tool.name.toLowerCase()} tasks quickly without installing desktop software.`,
      `Handling ${label} files privately because the selected files stay in your browser.`,
    ],
    notes: [
      tool.features[0] || "Check the preview or output before downloading the final file.",
      tool.features[1] || "Large files can take longer because processing happens on your device.",
    ],
  };
}

function joinList(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function fallbackGuideProfile(
  kind: "image" | "pdf",
  tool: { name: string; features: string[] },
  notes: ContentNotes,
): GuideProfile {
  const label = kind === "pdf" ? "PDF document" : "image";

  return {
    audience: `a ${label} needs a quick browser-based change and the original file should stay on your device`,
    requirement: `the expected output, accepted format, file size limit and any quality requirements before using ${tool.name}`,
    workflow: `review the source file, choose the most relevant settings for ${joinList(
      tool.features.slice(0, 3),
    )}, create the output and keep the original until the result is accepted`,
    checks: `the downloaded output, final file size and the details that matter most for the destination workflow`,
    mistakes: [
      `Using ${tool.name} without checking the destination requirements first.`,
      "Replacing the original file before the new output has been reviewed.",
      "Ignoring the final file size when the upload portal has a strict limit.",
      "Skipping a quick preview before sharing or submitting the result.",
    ],
    tips: [
      notes.notes[0] ?? "Start with the cleanest source file available.",
      notes.notes[1] ?? "Large files can take longer because processing happens on your device.",
      "Use a clear file name for the downloaded copy.",
      "Open the result once before sending it to someone else.",
    ],
    relatedGuideSlugs:
      kind === "pdf"
        ? ["file-upload-size-limits-checklist", "browser-based-file-tools-privacy"]
        : ["file-upload-size-limits-checklist", "compress-image-without-quality-loss"],
  };
}

function buildContentGuide({
  kind,
  notes,
  slug,
  tool,
}: {
  kind: "image" | "pdf";
  notes: ContentNotes;
  slug: ToolContentSlug;
  tool: { name: string; description: string; features: string[] };
}): ContentGuide {
  const profile =
    guideProfiles[slug] ?? fallbackGuideProfile(kind, tool, notes);
  const label = kind === "pdf" ? "PDF file" : "image";
  const featureSummary = joinList(tool.features.slice(0, 3));

  return {
    whenToUse: [
      `Use ${tool.name} when ${profile.audience}. ${tool.description} This gives the page a practical role beyond a simple upload area: it helps you decide whether this is the right tool before selecting a private file.`,
      `Before you begin, confirm ${profile.requirement}. For ${tool.name}, the most important controls usually relate to ${featureSummary}. Knowing those details first reduces repeated exports and helps avoid quality loss or rejected uploads.`,
      `A reliable workflow is to ${profile.workflow}. Because the processing happens in the browser, the original ${label} remains available on your device while the tool creates a separate output for download.`,
      `After export, check ${profile.checks}. This final review is important for application forms, business documents, public uploads and any file that will be forwarded to someone else.`,
    ],
    commonMistakes: profile.mistakes,
    tips: profile.tips,
    relatedGuideSlugs: profile.relatedGuideSlugs,
  };
}

function getRelatedGuides(slugs: string[]) {
  return slugs
    .map((guideSlug) => blogPosts.find((post) => post.slug === guideSlug))
    .filter((post): post is (typeof blogPosts)[number] => Boolean(post))
    .slice(0, 3);
}

export function ToolContentSections({
  kind,
  slug,
}: {
  kind: "image";
  slug: ToolSlug;
} | {
  kind: "pdf";
  slug: PDFToolSlug;
}) {
  const tool = kind === "pdf" ? pdfToolConfigs[slug] : toolConfigs[slug];
  const notes = contentNotes[slug] ?? fallbackNotes(kind, tool);
  const faqs = kind === "pdf" ? getPdfToolFaqs(slug) : getImageToolFaqs(slug);
  const relatedTools = getRelatedTools(kind, slug);
  const guide = buildContentGuide({ kind, notes, slug, tool });
  const relatedGuides = getRelatedGuides(guide.relatedGuideSlugs);
  const categoryLabel = kind === "pdf" ? "PDF tool" : "Image tool";
  const fileLabel = kind === "pdf" ? "PDFs" : "images";
  const steps =
    kind === "pdf"
      ? [
          `Add the ${fileLabel} you want to work with.`,
          "Choose page ranges, quality, order or protection settings where the tool supports them.",
          "Create the output, review it once and download a fresh PDF copy.",
        ]
      : [
          `Add the ${fileLabel.slice(0, -1)} you want to edit or convert.`,
          "Choose the output format, size, quality or visual settings required for your task.",
          "Preview the result and download a new file while keeping the original unchanged.",
        ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase text-[var(--accent)]">
            {categoryLabel}
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-[var(--text)]">
            About {tool.name}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {tool.description} The work happens in your browser, so the selected
            {` ${fileLabel} `}stay on your device while you prepare the result.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {notes.bestFor.map((item) => (
              <p
                className="rounded-lg bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]"
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        </article>

        <aside className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            What it includes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {tool.features.map((feature) => (
              <li className="flex gap-3" key={feature}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            How to use {tool.name}
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            {steps.map((step, index) => (
              <li className="flex gap-3" key={step}>
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-extrabold text-[var(--accent)]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            Practical notes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            {notes.notes.map((note) => (
              <li className="flex gap-3" key={note}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--success)]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            Related tools
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {relatedTools.map((related) => (
              <Link
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={related.href}
                key={related.href}
              >
                {related.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
          When to use {tool.name}
        </h2>
        <div className="mt-4 space-y-4">
          {guide.whenToUse.map((paragraph) => (
            <p
              className="text-sm leading-7 text-[var(--muted)]"
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              Common mistakes to avoid
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
              {guide.commonMistakes.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              Practical tips
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
              {guide.tips.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedGuides.length ? (
        <section className="mt-5 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
            Related guides
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {relatedGuides.map((guidePost) => (
              <Link
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-bold leading-6 text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                href={`/blog/${guidePost.slug}`}
                key={guidePost.slug}
              >
                {guidePost.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-5 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-[var(--text)]">
          Common questions
        </h2>
        <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
          {faqs.map((faq) => (
            <article className="bg-[var(--surface-2)] p-5" key={faq.question}>
              <h3 className="text-sm font-extrabold leading-6 text-[var(--text)]">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
