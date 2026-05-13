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
