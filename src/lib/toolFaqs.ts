import type { PDFToolSlug, ToolSlug } from "@/lib/types";

export interface ToolFaq {
  question: string;
  answer: string;
}

export const imageToolFaqs: Partial<Record<ToolSlug, ToolFaq[]>> = {
  resize: [
    {
      question: "Can I resize an image to exact pixels?",
      answer: "Yes. Enter the required width and height in pixels, centimeters or percent before exporting the image.",
    },
    {
      question: "Can I resize and reduce file size together?",
      answer: "Yes. Use the target KB option after setting dimensions to create an image that fits strict upload limits.",
    },
    {
      question: "Will my image be uploaded?",
      answer: "No. Resizing runs in your browser and the selected image stays on your device.",
    },
  ],
  compress: [
    {
      question: "Can I compress an image to a target KB size?",
      answer: "Yes. Set the target KB value and FreeConvert will try to export a smaller file that matches the limit.",
    },
    {
      question: "Which format is best for compressed photos?",
      answer: "JPEG and WebP usually work best for photos, while PNG or WebP are better when transparency is needed.",
    },
    {
      question: "Does image compression happen privately?",
      answer: "Yes. Compression runs locally in the browser without uploading your image to FreeConvert servers.",
    },
  ],
  convert: [
    {
      question: "Which image formats can I convert?",
      answer: "You can convert common browser image formats such as JPEG, PNG, WebP and AVIF where supported by your browser.",
    },
    {
      question: "Should I choose JPG or PNG?",
      answer: "Choose JPG for small photo files and PNG when you need transparency or crisp graphics.",
    },
    {
      question: "Does conversion change the original file?",
      answer: "No. The original file stays unchanged and the converted image is saved as a new download.",
    },
  ],
  crop: [
    {
      question: "Can I crop to a fixed aspect ratio?",
      answer: "Yes. Use a fixed ratio when a form or profile image requires a square, portrait or landscape crop.",
    },
    {
      question: "Can I choose the exact crop area?",
      answer: "Yes. Select the area visually and preview the result before exporting.",
    },
    {
      question: "Is cropping done in the browser?",
      answer: "Yes. The crop operation runs locally and your image remains on your device.",
    },
  ],
  "rotate-flip": [
    {
      question: "Can I rotate by 90 degrees?",
      answer: "Yes. You can rotate images by 90, 180 or 270 degrees, or use a custom angle for straightening.",
    },
    {
      question: "Can I flip an image horizontally or vertically?",
      answer: "Yes. The tool supports horizontal and vertical flips before export.",
    },
    {
      question: "Will rotation reduce quality?",
      answer: "The result is re-exported in your chosen format and quality, so use a high quality setting when detail matters.",
    },
  ],
  "background-removal": [
    {
      question: "Does background removal upload my photo?",
      answer: "No. The AI background removal model runs in your browser after it loads.",
    },
    {
      question: "Which output format keeps transparency?",
      answer: "PNG is the safest choice when you need the removed background to stay transparent.",
    },
    {
      question: "What images work best?",
      answer: "Images with a clear subject and strong contrast between subject and background usually produce cleaner results.",
    },
  ],
  watermark: [
    {
      question: "Can I add text and logo watermarks?",
      answer: "Yes. You can add a text watermark or use an image logo with opacity, position and rotation controls.",
    },
    {
      question: "Can I repeat the watermark across the image?",
      answer: "Yes. Use tile mode when you want a repeated watermark pattern across the whole image.",
    },
    {
      question: "Does watermarking happen locally?",
      answer: "Yes. The watermark is applied in your browser and the original image is not uploaded.",
    },
  ],
  merge: [
    {
      question: "Can I combine multiple images into one?",
      answer: "Yes. Add multiple images and choose horizontal, vertical or grid layout before exporting.",
    },
    {
      question: "Can I control spacing between images?",
      answer: "Yes. You can adjust gap, background color, alignment and grid columns.",
    },
    {
      question: "Which format should I export?",
      answer: "Use JPG or WebP for smaller photo collages and PNG when sharp graphics or transparency matter.",
    },
  ],
  filters: [
    {
      question: "Which adjustments are available?",
      answer: "You can adjust brightness, contrast, saturation, hue, blur, sepia, grayscale, invert and opacity.",
    },
    {
      question: "Can I preview filters before saving?",
      answer: "Yes. The preview updates so you can check the look before downloading the edited image.",
    },
    {
      question: "Is the original image changed?",
      answer: "No. The original remains unchanged and the edited version is exported as a new file.",
    },
  ],
  metadata: [
    {
      question: "Can I view EXIF data online?",
      answer: "Yes. The tool reads available EXIF, dimensions, file size and other image details in the browser.",
    },
    {
      question: "Can I remove image metadata?",
      answer: "Yes. Re-exporting the image can strip many metadata fields while keeping the visible image.",
    },
    {
      question: "Is metadata sent to a server?",
      answer: "No. Metadata inspection runs locally on your device.",
    },
  ],
  "webp-to-jpg": [
    {
      question: "Why convert WebP to JPG?",
      answer: "JPG is accepted by more older apps, upload portals and desktop workflows than WebP.",
    },
    {
      question: "Will transparency be preserved?",
      answer: "No. JPG does not support transparency, so transparent WebP areas are flattened to a background color.",
    },
    {
      question: "Does the WebP file upload to a server?",
      answer: "No. Conversion runs in your browser and creates a new JPG download locally.",
    },
  ],
  "png-to-jpg": [
    {
      question: "When should I convert PNG to JPG?",
      answer: "Use JPG for photos or large PNG files when transparency is not needed and smaller file size matters.",
    },
    {
      question: "What happens to transparent PNG areas?",
      answer: "Transparent pixels are flattened onto a background because JPG cannot store transparency.",
    },
    {
      question: "Can I control JPG quality?",
      answer: "Yes. Choose the quality setting before downloading the converted JPG file.",
    },
  ],
  "jpg-to-png": [
    {
      question: "Does converting JPG to PNG improve quality?",
      answer: "No. PNG keeps the current pixels losslessly, but it cannot restore detail already lost in the JPG.",
    },
    {
      question: "Will the PNG have transparency?",
      answer: "No. A regular JPG does not contain transparent pixels, so the PNG copy will remain opaque.",
    },
    {
      question: "Why is the PNG larger?",
      answer: "PNG is lossless and often creates larger files for photos than JPG.",
    },
  ],
  "avif-to-jpg": [
    {
      question: "Can every browser convert AVIF?",
      answer: "AVIF conversion depends on your browser's ability to decode the selected AVIF file.",
    },
    {
      question: "Why use JPG output?",
      answer: "JPG is more widely accepted by older apps, forms and document workflows.",
    },
    {
      question: "Does AVIF to JPG happen locally?",
      answer: "Yes. The browser decodes the AVIF and exports a JPG copy on your device.",
    },
  ],
  "png-to-webp": [
    {
      question: "Does WebP support transparency?",
      answer: "Yes. WebP can preserve transparency when the browser supports the export.",
    },
    {
      question: "Is WebP smaller than PNG?",
      answer: "Often yes, especially for web images, but screenshots with tiny text should still be checked visually.",
    },
    {
      question: "Where should I use WebP?",
      answer: "Use WebP for websites or apps that clearly support it, and keep PNG for maximum compatibility.",
    },
  ],
  "compress-jpg": [
    {
      question: "Can I compress JPG to a target KB?",
      answer: "Yes. Set a target KB and the tool will try to create a JPG close to that limit.",
    },
    {
      question: "Will JPG compression reduce quality?",
      answer: "Strong compression can reduce detail, so preview the result before submitting important files.",
    },
    {
      question: "Should I resize before compressing JPG?",
      answer: "Yes, if the image is very large or the upload portal also has dimension limits.",
    },
  ],
  "compress-png": [
    {
      question: "Can PNG files be compressed as much as JPG?",
      answer: "Usually no. PNG is lossless, so photos often shrink less than they would as JPG or WebP.",
    },
    {
      question: "Will PNG transparency remain?",
      answer: "Yes. PNG output keeps transparency when the source image has transparent areas.",
    },
    {
      question: "What if the PNG is still too large?",
      answer: "Reduce dimensions or convert to WebP if the destination supports WebP.",
    },
  ],
  "heic-to-jpg": [
    {
      question: "Can I convert iPhone HEIC photos to JPG?",
      answer: "Yes. The tool decodes HEIC or HEIF photos in the browser and exports JPG copies.",
    },
    {
      question: "Why is JPG useful for HEIC photos?",
      answer: "JPG is accepted by more forms, printers, older apps and desktop workflows than HEIC.",
    },
    {
      question: "Are HEIC photos uploaded?",
      answer: "No. HEIC decoding and JPG export happen locally in your browser.",
    },
  ],
  "heic-to-png": [
    {
      question: "When should I convert HEIC to PNG?",
      answer: "Use PNG when you need a lossless editing copy or a destination specifically asks for PNG.",
    },
    {
      question: "Will PNG be larger than JPG?",
      answer: "Often yes, especially for phone photos, because PNG is lossless.",
    },
    {
      question: "Does conversion keep the original HEIC?",
      answer: "Yes. The source HEIC remains unchanged and a new PNG file is downloaded.",
    },
  ],
  "image-to-text": [
    {
      question: "Can OCR read every image perfectly?",
      answer: "No. OCR works best on sharp, well-lit images with clear printed text and good contrast.",
    },
    {
      question: "Can I copy the extracted text?",
      answer: "Yes. You can copy the recognized text or download it as a TXT file.",
    },
    {
      question: "Is OCR processed locally?",
      answer: "Yes. The OCR engine runs in your browser after its language data loads.",
    },
  ],
  "svg-to-png": [
    {
      question: "Can I choose output size?",
      answer: "Yes. Use the scale and size controls to export a larger or smaller raster image.",
    },
    {
      question: "Which formats are supported?",
      answer: "You can rasterize SVG files to PNG, JPG or WebP where supported by the browser.",
    },
    {
      question: "Is the SVG sanitized?",
      answer: "Yes. The tool sanitizes SVG content before rendering it to a canvas output.",
    },
  ],
  "favicon-generator": [
    {
      question: "What image should I use for a favicon?",
      answer: "Use a simple square image or logo with enough padding so it remains readable at small sizes.",
    },
    {
      question: "Does it create multiple icon sizes?",
      answer: "Yes. The generator creates common PNG icon sizes and an ICO file in a ZIP download.",
    },
    {
      question: "Can I use transparent icons?",
      answer: "Yes. Transparent PNG source images are supported for icon generation.",
    },
  ],
  "blur-image": [
    {
      question: "Can I blur only part of an image?",
      answer: "Yes. Add blur boxes over faces, numbers, addresses or other private areas.",
    },
    {
      question: "Is blur enough for sensitive text?",
      answer: "Use strong blur or pixelation for sensitive text, and inspect the output at full size before sharing.",
    },
    {
      question: "Does the original image change?",
      answer: "No. The blurred image is exported as a new download.",
    },
  ],
  "image-collage-maker": [
    {
      question: "Can I make a grid collage?",
      answer: "Yes. Choose grid layouts and adjust spacing, background and aspect settings before export.",
    },
    {
      question: "Can I combine screenshots and photos?",
      answer: "Yes. You can combine mixed images, but check readability when screenshots are scaled down.",
    },
    {
      question: "Which format should I download?",
      answer: "Use JPG or WebP for smaller photo collages and PNG for crisp graphics or transparency.",
    },
  ],
};

export const pdfToolFaqs: Partial<Record<PDFToolSlug, ToolFaq[]>> = {
  "merge-pdf": [
    {
      question: "Can I merge PDF files in a custom order?",
      answer: "Yes. Add your PDF files, arrange them in order and create one combined PDF.",
    },
    {
      question: "Can I reduce the merged PDF size?",
      answer: "Yes. Use the merge tool compression option when you need the final PDF to fit a target size.",
    },
    {
      question: "Are my PDF files uploaded?",
      answer: "No. Merging runs in your browser and the selected PDFs stay on your device.",
    },
  ],
  "compress-pdf": [
    {
      question: "Can I compress a PDF to a target KB size?",
      answer: "Yes. Enter the target KB value and the tool will try to create a smaller PDF near that limit.",
    },
    {
      question: "Why can text become less selectable after compression?",
      answer: "Strong PDF compression may rasterize pages, which can turn text into page images.",
    },
    {
      question: "Which PDFs compress best?",
      answer: "Scanned and image-heavy PDFs usually compress more than text-only PDFs.",
    },
  ],
  "split-pdf": [
    {
      question: "Can I split every PDF page into a separate file?",
      answer: "Yes. Choose the every-page mode to export each page separately.",
    },
    {
      question: "Can I split only selected page ranges?",
      answer: "Yes. Use custom ranges to export only the parts you need.",
    },
    {
      question: "How are multiple split files downloaded?",
      answer: "Multiple outputs are packaged as a ZIP so the files stay organized.",
    },
  ],
  "convert-pdf-to-image": [
    {
      question: "Can I convert PDF pages to JPG?",
      answer: "Yes. You can export PDF pages as JPG, PNG or WebP images.",
    },
    {
      question: "Can I convert only selected pages?",
      answer: "Yes. Use page selection to export one page, a range or all pages.",
    },
    {
      question: "Can I control output image quality?",
      answer: "Yes. You can set output format, quality, DPI and scale before conversion.",
    },
  ],
  "convert-image-to-pdf": [
    {
      question: "Can I combine multiple images into one PDF?",
      answer: "Yes. Add multiple images and export them as one PDF with your chosen page settings.",
    },
    {
      question: "Can I set PDF title and author?",
      answer: "Yes. The image-to-PDF tool includes metadata fields for title, author, subject and keywords.",
    },
    {
      question: "Which page sizes are supported?",
      answer: "You can use common sizes like A4, Letter and Legal, or match the image size.",
    },
  ],
  "rotate-pdf": [
    {
      question: "Can I rotate only selected PDF pages?",
      answer: "Yes. Select the pages you want and rotate them without changing the rest of the PDF.",
    },
    {
      question: "Which rotation angles are supported?",
      answer: "The tool supports 90, 180 and 270 degree page rotation.",
    },
    {
      question: "Does rotating a PDF upload the file?",
      answer: "No. PDF rotation runs locally in your browser.",
    },
  ],
  "add-watermark-to-pdf": [
    {
      question: "Can I add text or image watermarks to a PDF?",
      answer: "Yes. You can add text watermarks or image/logo watermarks to selected pages.",
    },
    {
      question: "Can I choose watermark position and opacity?",
      answer: "Yes. You can set position, opacity, rotation and whether the watermark appears above or below content.",
    },
    {
      question: "Can I watermark only some pages?",
      answer: "Yes. Use page range controls to apply the watermark to selected pages.",
    },
  ],
  "protect-pdf": [
    {
      question: "Can I add a password to a PDF?",
      answer: "Yes. The protect tool can add an open password using qpdf WebAssembly in your browser.",
    },
    {
      question: "Can I set PDF permissions?",
      answer: "Yes. You can configure common permissions such as printing, copying and editing where supported by PDF viewers.",
    },
    {
      question: "Does FreeConvert store my PDF password?",
      answer: "No. Password processing runs in the browser and FreeConvert does not store your password.",
    },
  ],
  "unlock-pdf": [
    {
      question: "Can this tool crack an unknown PDF password?",
      answer: "No. It only removes protection when you already know the current password.",
    },
    {
      question: "When should I use Unlock PDF?",
      answer: "Use it for your own files or authorized documents when you want to save a copy without the known open password.",
    },
    {
      question: "Is unlocking processed locally?",
      answer: "Yes. The PDF and password are handled in your browser.",
    },
  ],
  "extract-pdf-pages": [
    {
      question: "Can I save selected PDF pages as a new PDF?",
      answer: "Yes. Select pages visually or by range and export them as one new PDF.",
    },
    {
      question: "Can I export selected pages separately?",
      answer: "Yes. You can export selected pages as separate PDFs and download them in a ZIP.",
    },
    {
      question: "Will extracted pages keep their original quality?",
      answer: "Yes. Page extraction copies PDF pages instead of rasterizing them.",
    },
  ],
  "reorder-pdf-pages": [
    {
      question: "Can I move PDF pages into a new order?",
      answer: "Yes. Use the page controls to move pages up or down before exporting.",
    },
    {
      question: "Can I reverse all PDF pages?",
      answer: "Yes. The reorder tool includes a reverse action for quickly flipping page order.",
    },
    {
      question: "Can I reset the order before saving?",
      answer: "Yes. Reset restores the original page order before you export.",
    },
  ],
  "add-page-numbers-to-pdf": [
    {
      question: "Can I add page numbers to selected pages?",
      answer: "Yes. Choose all pages or selected pages before adding numbers.",
    },
    {
      question: "Can I skip the first page?",
      answer: "Yes. Use skip first page when the PDF has a cover page.",
    },
    {
      question: "Can I customize page number style?",
      answer: "Yes. You can set position, start number, prefix, suffix, font, color and margin.",
    },
  ],
  "view-pdf-metadata": [
    {
      question: "Can I view PDF title and author?",
      answer: "Yes. The metadata viewer shows available document info such as title, author, subject and keywords.",
    },
    {
      question: "Can I check if a PDF is encrypted?",
      answer: "Yes. The tool shows encryption status along with page and version details where available.",
    },
    {
      question: "Can I clean PDF metadata?",
      answer: "Yes. You can strip or edit metadata locally before saving a new copy.",
    },
  ],
  "jpg-to-pdf": [
    {
      question: "Can I combine multiple JPG files into one PDF?",
      answer: "Yes. Add JPG files in the correct order and export them as a single PDF document.",
    },
    {
      question: "Can I choose A4 page size?",
      answer: "Yes. You can choose A4, Letter and other page settings before creating the PDF.",
    },
    {
      question: "Are JPG files uploaded?",
      answer: "No. The PDF is created locally in your browser.",
    },
  ],
  "png-to-pdf": [
    {
      question: "Can I convert screenshots to PDF?",
      answer: "Yes. PNG screenshots can be placed on PDF pages with your chosen page size and margins.",
    },
    {
      question: "What happens to transparent PNG areas?",
      answer: "Transparent areas are handled according to the PDF page background and image embedding settings.",
    },
    {
      question: "Can I add multiple PNG files?",
      answer: "Yes. Add multiple PNG images and export them in one PDF.",
    },
  ],
  "heic-to-pdf": [
    {
      question: "Can I turn iPhone HEIC photos into PDF?",
      answer: "Yes. HEIC or HEIF photos are decoded in the browser and placed into a PDF.",
    },
    {
      question: "Can I control page size?",
      answer: "Yes. Choose page size, margins and fit settings before exporting the PDF.",
    },
    {
      question: "Will the PDF be large?",
      answer: "Phone photos can create large PDFs, so compress the final PDF if the destination has a size limit.",
    },
  ],
  "delete-pages-from-pdf": [
    {
      question: "Can I remove selected PDF pages?",
      answer: "Yes. Select unwanted pages visually or by range and export a new PDF without those pages.",
    },
    {
      question: "Does deleting pages affect the original?",
      answer: "No. The original PDF remains unchanged and the cleaned PDF downloads as a new file.",
    },
    {
      question: "Can I undo before exporting?",
      answer: "Yes. Review the selected pages and reset before export if the selection is wrong.",
    },
  ],
  "edit-pdf": [
    {
      question: "Can I add text to a PDF?",
      answer: "Yes. You can place text, highlights, boxes, drawings and signature images on selected pages.",
    },
    {
      question: "Is this a full PDF editor?",
      answer: "It is designed for quick visual edits and annotations, not complex layout reconstruction.",
    },
    {
      question: "Does PDF editing upload my file?",
      answer: "No. The PDF is edited in your browser and exported as a new copy.",
    },
  ],
  "sign-pdf": [
    {
      question: "Can I draw a signature?",
      answer: "Yes. You can draw a signature or upload a signature image and place it on the PDF.",
    },
    {
      question: "Is this the same as certificate-based digital signing?",
      answer: "No. It adds a visible signature mark; use a compliant digital-signature workflow when legally required.",
    },
    {
      question: "Can I sign selected pages?",
      answer: "Yes. Place the signature on the page or pages where it is needed.",
    },
  ],
  "crop-pdf": [
    {
      question: "Can I crop margins from PDF pages?",
      answer: "Yes. Set top, right, bottom and left crop values for all pages or selected page ranges.",
    },
    {
      question: "Is cropping the same as redaction?",
      answer: "No. Cropping changes visible page boundaries; use redaction when sensitive content must be hidden.",
    },
    {
      question: "Can I apply crop to selected pages only?",
      answer: "Yes. Use page range controls when different pages need different handling.",
    },
  ],
  "pdf-to-text": [
    {
      question: "Can it extract text from scanned PDFs?",
      answer: "Only selectable text can be extracted directly. Scanned image-only PDFs may need OCR first.",
    },
    {
      question: "Can I download the text?",
      answer: "Yes. You can copy the extracted text or download it as a TXT file.",
    },
    {
      question: "Will tables keep their layout?",
      answer: "Plain text extraction may not preserve complex tables or multi-column layouts perfectly.",
    },
  ],
  "redact-pdf": [
    {
      question: "Can I black out sensitive PDF areas?",
      answer: "Yes. Draw redaction rectangles over private areas and export a redacted copy.",
    },
    {
      question: "Should I check the redacted output?",
      answer: "Yes. Always open the exported PDF and confirm sensitive text or areas are not visible.",
    },
    {
      question: "Is redaction processed locally?",
      answer: "Yes. Redaction runs in the browser and the selected PDF stays on your device.",
    },
  ],
};

export function getImageToolFaqs(slug: ToolSlug) {
  return imageToolFaqs[slug] ?? [
    {
      question: "Will my image be uploaded?",
      answer: "No. This tool runs in your browser and keeps the selected image on your device.",
    },
    {
      question: "Is this tool free?",
      answer: "Yes. You can use it without an account or watermark.",
    },
    {
      question: "Does it change the original file?",
      answer: "No. The original file stays unchanged and the result is saved as a new download.",
    },
  ];
}

export function getPdfToolFaqs(slug: PDFToolSlug) {
  return pdfToolFaqs[slug] ?? [
    {
      question: "Are my PDF files uploaded?",
      answer: "No. This PDF tool runs in your browser and keeps the selected file on your device.",
    },
    {
      question: "Is this PDF tool free?",
      answer: "Yes. You can use it without an account or watermark.",
    },
    {
      question: "Does it change the original PDF?",
      answer: "No. The original file stays unchanged and the result is saved as a new download.",
    },
  ];
}
