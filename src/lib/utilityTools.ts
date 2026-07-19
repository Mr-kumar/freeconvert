import type { Metadata } from "next";
import { BASE_URL } from "@/lib/tools";

export type UtilityToolCategory =
  | "qr"
  | "text"
  | "calculator"
  | "color"
  | "converter"
  | "password"
  | "developer"
  | "html"
  | "file"
  | "media";

export type UtilityToolSlug =
  | "qr-code-generator"
  | "upi-qr-code-generator"
  | "word-counter"
  | "character-counter"
  | "text-case-converter"
  | "remove-duplicate-lines"
  | "emi-calculator"
  | "gst-calculator"
  | "percentage-calculator"
  | "age-calculator"
  | "bmi-calculator"
  | "sip-calculator"
  | "time-zone-converter"
  | "color-picker"
  | "color-contrast-checker"
  | "length-converter"
  | "weight-converter"
  | "area-converter"
  | "password-generator"
  | "password-strength-checker"
  | "json-formatter"
  | "base64-encoder-decoder"
  | "url-encoder-decoder"
  | "html-to-pdf"
  | "html-viewer"
  | "html-formatter"
  | "html-minifier"
  | "html-validator"
  | "html-to-markdown"
  | "markdown-to-html"
  | "html-to-text"
  | "html-entities-encoder-decoder"
  | "html-table-generator"
  | "html-to-image"
  | "responsive-html-preview"
  | "iframe-generator"
  | "meta-tag-generator"
  | "css-js-formatter-minifier"
  | "file-hash-checksum"
  | "zip-extractor"
  | "video-compressor"
  | "mp4-to-mp3"
  | "mp4-to-gif"
  | "audio-converter";

export interface UtilityCategoryConfig {
  id: UtilityToolCategory;
  label: string;
  title: string;
  description: string;
  anchor: string;
}

export interface UtilityToolConfig {
  slug: UtilityToolSlug;
  name: string;
  shortName: string;
  title: string;
  description: string;
  homeDescription: string;
  href: string;
  category: UtilityToolCategory;
  priority: number;
  popular?: boolean;
  keywords: string[];
  features: string[];
  bestFor: string[];
  notes: string[];
  faqs: { question: string; answer: string }[];
}

export const utilityCategoryConfigs: Record<
  UtilityToolCategory,
  UtilityCategoryConfig
> = {
  qr: {
    id: "qr",
    label: "QR Tools",
    title: "Free QR Tools",
    description: "Generate QR codes for links, text, contact details and UPI payments.",
    anchor: "qr-tools",
  },
  text: {
    id: "text",
    label: "Text Tools",
    title: "Free Text Tools",
    description: "Count words, convert case and clean repeated lines in text.",
    anchor: "text-tools",
  },
  calculator: {
    id: "calculator",
    label: "Calculators",
    title: "Free Calculators",
    description: "Useful finance, percentage and date calculators for daily work.",
    anchor: "calculator-tools",
  },
  color: {
    id: "color",
    label: "Color Tools",
    title: "Free Color Tools",
    description: "Pick colors, convert formats and check accessible contrast ratios.",
    anchor: "color-tools",
  },
  converter: {
    id: "converter",
    label: "Unit Converters",
    title: "Free Unit Converters",
    description: "Convert length, weight and area units without leaving the browser.",
    anchor: "converter-tools",
  },
  password: {
    id: "password",
    label: "Password Tools",
    title: "Free Password Tools",
    description: "Generate strong passwords and check password strength locally.",
    anchor: "password-tools",
  },
  developer: {
    id: "developer",
    label: "Developer Tools",
    title: "Free Developer Tools",
    description: "Format JSON and encode or decode Base64 and URL text.",
    anchor: "developer-tools",
  },
  html: {
    id: "html",
    label: "HTML Tools",
    title: "Free HTML Tools",
    description:
      "Preview, format, minify, validate and convert HTML code in the browser.",
    anchor: "html-tools",
  },
  file: {
    id: "file",
    label: "File Tools",
    title: "Free File Tools",
    description: "Create ZIP archives, inspect ZIP files and calculate checksums locally.",
    anchor: "file-tools",
  },
  media: {
    id: "media",
    label: "Media Tools",
    title: "Free Media Tools",
    description: "Compress video and convert audio or short clips directly in the browser.",
    anchor: "media-tools",
  },
};

const privacyFaq = {
  question: "Does this tool upload my data?",
  answer:
    "No. The tool runs in your browser and keeps the selected content on your device.",
};

const freeFaq = {
  question: "Is this tool free?",
  answer:
    "Yes. It is free to use in the browser and does not require an account.",
};

export const utilityToolConfigs: Record<UtilityToolSlug, UtilityToolConfig> = {
  "qr-code-generator": {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortName: "QR Code",
    title: "Free QR Code Generator Online - Create QR Codes",
    description:
      "Create custom QR codes online free for links, text, email, phone numbers and Wi-Fi details. Generate PNG QR codes in your browser.",
    homeDescription: "Create custom QR codes",
    href: "/qr-code-generator",
    category: "qr",
    priority: 0.92,
    popular: true,
    keywords: [
      "free qr code generator",
      "qr code generator online",
      "create qr code free",
      "custom qr code generator",
    ],
    features: [
      "Text and URL QR codes",
      "Custom size, margin and colors",
      "Error correction settings",
      "PNG download",
    ],
    bestFor: [
      "Creating scannable QR codes for websites, documents, menus and quick sharing.",
      "Generating private QR codes without sending the content to a remote service.",
    ],
    notes: [
      "Use strong contrast between QR and background colors for better scanning.",
      "Keep enough margin around the QR code when printing or placing it in a design.",
    ],
    faqs: [
      privacyFaq,
      freeFaq,
      {
        question: "Can I change QR colors?",
        answer:
          "Yes. You can set the QR foreground and background colors before downloading the PNG.",
      },
    ],
  },
  "upi-qr-code-generator": {
    slug: "upi-qr-code-generator",
    name: "UPI QR Code Generator",
    shortName: "UPI QR",
    title: "Free UPI QR Code Generator Online",
    description:
      "Generate UPI payment QR codes online free with UPI ID, payee name, amount and note. The QR code is created locally in your browser.",
    homeDescription: "Create UPI payment QR codes",
    href: "/upi-qr-code-generator",
    category: "qr",
    priority: 0.9,
    popular: true,
    keywords: [
      "upi qr code generator free",
      "upi payment qr generator",
      "create upi qr code",
      "upi id qr code generator",
    ],
    features: [
      "UPI ID and payee name fields",
      "Optional fixed amount and payment note",
      "Live payment URI preview",
      "PNG download",
    ],
    bestFor: [
      "Creating simple UPI QR codes for shops, invoices, events and personal payments.",
      "Sharing a payment QR with a fixed amount or keeping the amount editable by the payer.",
    ],
    notes: [
      "Check the UPI ID carefully before printing or sharing the QR code.",
      "Leave amount blank when the payer should enter the amount in their payment app.",
    ],
    faqs: [
      privacyFaq,
      freeFaq,
      {
        question: "Does this collect payments?",
        answer:
          "No. It only generates a UPI payment QR payload. Payment is completed inside the user's UPI app.",
      },
    ],
  },
  "word-counter": {
    slug: "word-counter",
    name: "Word Counter",
    shortName: "Word Counter",
    title: "Free Word Counter Online - Count Words and Characters",
    description:
      "Count words, characters, sentences, paragraphs and reading time online free. Paste text and get instant browser-only statistics.",
    homeDescription: "Count words and characters",
    href: "/word-counter",
    category: "text",
    priority: 0.88,
    popular: true,
    keywords: [
      "free word counter",
      "word count online",
      "character counter",
      "reading time calculator",
    ],
    features: [
      "Word and character count",
      "Sentence and paragraph count",
      "Reading and speaking time",
      "Keyword frequency",
    ],
    bestFor: [
      "Checking article, assignment, form and social post length before submitting.",
      "Estimating reading time for blog posts, scripts and documents.",
    ],
    notes: [
      "Word counting uses visible text, so extra spaces and line breaks are cleaned before counting.",
      "Reading time is an estimate and depends on the reader and content complexity.",
    ],
    faqs: [
      privacyFaq,
      freeFaq,
      {
        question: "Can it count characters without spaces?",
        answer:
          "Yes. The results include both total characters and characters excluding spaces.",
      },
    ],
  },
  "character-counter": {
    slug: "character-counter",
    name: "Character Counter",
    shortName: "Character Counter",
    title: "Free Character Counter Online - Count Characters and Words",
    description:
      "Count characters online free with and without spaces, plus words, sentences, paragraphs and reading time. Everything runs in your browser.",
    homeDescription: "Count characters with spaces",
    href: "/character-counter",
    category: "text",
    priority: 0.91,
    popular: true,
    keywords: [
      "character counter",
      "count characters online",
      "letter counter",
      "character count with spaces",
    ],
    features: [
      "Characters with and without spaces",
      "Word, sentence and paragraph counts",
      "Reading and speaking time",
      "Keyword frequency",
    ],
    bestFor: [
      "Checking form limits, meta descriptions, messages, posts and assignments before submitting.",
      "Counting both visible characters and characters excluding spaces in pasted text.",
    ],
    notes: [
      "Character limits can count spaces differently, so check both results when a platform is strict.",
      "The text stays in your browser and is not sent to a server for counting.",
    ],
    faqs: [
      privacyFaq,
      freeFaq,
      {
        question: "Does it count spaces?",
        answer:
          "Yes. The result shows total characters, characters excluding spaces and words.",
      },
    ],
  },
  "text-case-converter": {
    slug: "text-case-converter",
    name: "Text Case Converter",
    shortName: "Case Converter",
    title: "Free Text Case Converter Online",
    description:
      "Convert text case online free to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case and kebab-case.",
    homeDescription: "Uppercase, title case and more",
    href: "/text-case-converter",
    category: "text",
    priority: 0.82,
    keywords: [
      "text case converter",
      "uppercase lowercase converter",
      "title case converter",
      "camelcase converter",
    ],
    features: [
      "Common writing case formats",
      "Developer naming formats",
      "Copy or download output",
      "Private browser processing",
    ],
    bestFor: [
      "Cleaning titles, headings, labels and pasted text before publishing.",
      "Converting words into code-friendly camelCase, PascalCase, snake_case or kebab-case.",
    ],
    notes: [
      "Title case works best for short headings and labels.",
      "Review brand names and acronyms after conversion because style rules can vary.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "remove-duplicate-lines": {
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    shortName: "Duplicate Lines",
    title: "Remove Duplicate Lines Online Free",
    description:
      "Remove duplicate lines online free with trim, case-sensitive and sorting options. Clean lists locally in your browser.",
    homeDescription: "Clean repeated list items",
    href: "/remove-duplicate-lines",
    category: "text",
    priority: 0.78,
    keywords: [
      "remove duplicate lines",
      "duplicate line remover",
      "unique lines online",
      "clean list online",
    ],
    features: [
      "Case-sensitive or case-insensitive matching",
      "Trim whitespace option",
      "Remove empty lines",
      "Optional sorting",
    ],
    bestFor: [
      "Cleaning email lists, keywords, IDs, URLs and pasted spreadsheet values.",
      "Turning repeated lines into a unique list before sharing or importing.",
    ],
    notes: [
      "Use trim matching when duplicates may contain extra spaces around the value.",
      "Keep original order off only when alphabetical sorting is useful for the final list.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "emi-calculator": {
    slug: "emi-calculator",
    name: "EMI Calculator",
    shortName: "EMI",
    title: "Free EMI Calculator Online - Loan EMI Calculator",
    description:
      "Calculate loan EMI online free with principal, interest rate and tenure. See monthly EMI, total interest and total repayment instantly.",
    homeDescription: "Loan EMI and interest",
    href: "/emi-calculator",
    category: "calculator",
    priority: 0.86,
    popular: true,
    keywords: [
      "emi calculator free",
      "loan emi calculator",
      "home loan emi calculator",
      "personal loan emi calculator",
    ],
    features: [
      "Monthly EMI calculation",
      "Total interest and repayment",
      "Principal and interest split",
      "Instant recalculation",
    ],
    bestFor: [
      "Estimating monthly loan payments before applying for home, car or personal loans.",
      "Comparing loan amounts, rates and tenure combinations quickly.",
    ],
    notes: [
      "The EMI calculation is an estimate and does not include lender fees or taxes.",
      "Small rate changes can significantly change the total interest over long tenures.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "gst-calculator": {
    slug: "gst-calculator",
    name: "GST Calculator",
    shortName: "GST",
    title: "Free GST Calculator Online - Add or Remove GST",
    description:
      "Calculate GST online free. Add GST to a base amount or remove GST from an inclusive price with common GST rates.",
    homeDescription: "Add or remove GST",
    href: "/gst-calculator",
    category: "calculator",
    priority: 0.82,
    keywords: [
      "gst calculator free",
      "gst amount calculator",
      "remove gst calculator",
      "add gst calculator",
    ],
    features: [
      "Add GST mode",
      "Remove GST mode",
      "Common GST rates",
      "Tax and net amount output",
    ],
    bestFor: [
      "Preparing quick invoice, purchase and tax-inclusive price calculations.",
      "Finding the base price and tax component from an inclusive amount.",
    ],
    notes: [
      "Choose the correct GST rate for your item or service before relying on the result.",
      "The calculator is informational and is not tax advice.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "percentage-calculator": {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    shortName: "Percentage",
    title: "Free Percentage Calculator Online",
    description:
      "Calculate percentages online free, including percent of a number, percentage share and percentage change.",
    homeDescription: "Find percent, share and change",
    href: "/percentage-calculator",
    category: "calculator",
    priority: 0.8,
    keywords: [
      "percentage calculator",
      "percent calculator free",
      "percentage change calculator",
      "what percent calculator",
    ],
    features: [
      "Percent of a number",
      "Percentage share",
      "Increase or decrease percentage",
      "Instant results",
    ],
    bestFor: [
      "Calculating discounts, marks, growth, loss, tax and proportion values.",
      "Checking percentage change between two numbers without a spreadsheet.",
    ],
    notes: [
      "Percentage share is calculated as part divided by total multiplied by 100.",
      "Percentage change compares the new value against the original value.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "age-calculator": {
    slug: "age-calculator",
    name: "Age Calculator",
    shortName: "Age",
    title: "Free Age Calculator Online - Years Months Days",
    description:
      "Calculate age online free in years, months and days. Choose date of birth and as-of date to get instant age details.",
    homeDescription: "Age in years, months and days",
    href: "/age-calculator",
    category: "calculator",
    priority: 0.78,
    keywords: [
      "age calculator",
      "date of birth calculator",
      "age in years months days",
      "birthday calculator",
    ],
    features: [
      "Age by date of birth",
      "Custom as-of date",
      "Total days lived",
      "Next birthday countdown",
    ],
    bestFor: [
      "Checking age for forms, applications, eligibility and personal records.",
      "Calculating age on a specific past or future date.",
    ],
    notes: [
      "Use the exact date format from the date picker to avoid day and month confusion.",
      "For legal eligibility, always verify requirements with the official source.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "bmi-calculator": {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    shortName: "BMI",
    title: "Free BMI Calculator Online - Body Mass Index",
    description:
      "Calculate BMI online free using metric or imperial units. See body mass index, healthy weight range and category instantly in your browser.",
    homeDescription: "Metric and imperial BMI",
    href: "/bmi-calculator",
    category: "calculator",
    priority: 0.92,
    popular: true,
    keywords: [
      "bmi calculator",
      "body mass index calculator",
      "bmi calculator online",
      "healthy weight calculator",
    ],
    features: [
      "Metric and imperial units",
      "BMI category output",
      "Healthy weight range",
      "Instant recalculation",
    ],
    bestFor: [
      "Quickly estimating BMI from height and weight without uploading or saving data.",
      "Checking an approximate healthy weight range for the selected height.",
    ],
    notes: [
      "BMI is a general screening number and does not measure body fat, muscle mass or health by itself.",
      "Use medical advice for personal health decisions, especially for children, pregnancy or athletic body types.",
    ],
    faqs: [
      privacyFaq,
      freeFaq,
      {
        question: "Is BMI medical advice?",
        answer:
          "No. It is an informational calculation and should not replace advice from a qualified health professional.",
      },
    ],
  },
  "sip-calculator": {
    slug: "sip-calculator",
    name: "SIP Calculator",
    shortName: "SIP",
    title: "Free SIP Calculator Online - Mutual Fund SIP Returns",
    description:
      "Calculate SIP returns online free with monthly investment, expected annual return and investment period. Estimate future value instantly.",
    homeDescription: "Estimate SIP future value",
    href: "/sip-calculator",
    category: "calculator",
    priority: 0.82,
    keywords: [
      "sip calculator free",
      "mutual fund sip calculator",
      "sip return calculator",
      "investment calculator",
    ],
    features: [
      "Monthly SIP input",
      "Expected return and duration",
      "Invested amount and gains",
      "Future value estimate",
    ],
    bestFor: [
      "Estimating long-term mutual fund SIP outcomes before planning investments.",
      "Comparing monthly investment values and expected return assumptions.",
    ],
    notes: [
      "SIP results are estimates and actual returns can vary with market performance.",
      "Do not treat the output as financial advice or guaranteed returns.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "time-zone-converter": {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    shortName: "Time Zone",
    title: "Free Time Zone Converter Online",
    description:
      "Convert times between time zones online free. Compare meeting times across cities with browser time-zone data.",
    homeDescription: "Compare city meeting times",
    href: "/time-zone-converter",
    category: "calculator",
    priority: 0.9,
    popular: true,
    keywords: [
      "time zone converter",
      "world time converter",
      "meeting time converter",
      "convert time zones",
    ],
    features: [
      "Searchable time zones",
      "Meeting time comparison",
      "12-hour and 24-hour display",
      "Browser Intl API",
    ],
    bestFor: [
      "Planning calls and meetings across countries without opening a calendar app.",
      "Checking what a selected date and time means in multiple time zones.",
    ],
    notes: [
      "The browser time-zone database handles daylight saving changes for supported zones.",
      "Use a city or IANA time-zone name when a country has more than one time zone.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "color-picker": {
    slug: "color-picker",
    name: "Color Picker",
    shortName: "Color Picker",
    title: "Free Color Picker Online - HEX RGB HSL Converter",
    description:
      "Pick colors online free and convert between HEX, RGB, HSL and CMYK values. Copy color codes instantly in your browser.",
    homeDescription: "HEX, RGB, HSL and CMYK",
    href: "/color-picker",
    category: "color",
    priority: 0.8,
    keywords: [
      "color picker online",
      "hex to rgb converter",
      "rgb to hsl converter",
      "free color picker",
    ],
    features: [
      "Native color picker",
      "HEX, RGB, HSL and CMYK values",
      "Color swatch preview",
      "One-click copy",
    ],
    bestFor: [
      "Finding and copying exact color values for websites, designs and documents.",
      "Converting a color between common design and CSS formats.",
    ],
    notes: [
      "HEX and RGB are commonly used in web CSS.",
      "CMYK conversion is approximate because browser colors are displayed in RGB.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "color-contrast-checker": {
    slug: "color-contrast-checker",
    name: "Color Contrast Checker",
    shortName: "Contrast Checker",
    title: "Free Color Contrast Checker Online - WCAG Ratio",
    description:
      "Check color contrast online free with WCAG ratio results for text and background colors. Test AA and AAA accessibility levels.",
    homeDescription: "Check WCAG contrast",
    href: "/color-contrast-checker",
    category: "color",
    priority: 0.8,
    keywords: [
      "color contrast checker",
      "wcag contrast checker",
      "accessibility contrast checker",
      "text contrast ratio",
    ],
    features: [
      "Foreground and background pickers",
      "WCAG contrast ratio",
      "AA and AAA checks",
      "Live preview",
    ],
    bestFor: [
      "Checking whether text colors are readable on buttons, cards and page backgrounds.",
      "Improving accessibility before publishing a UI or graphic.",
    ],
    notes: [
      "WCAG AA requires at least 4.5:1 for normal text and 3:1 for large text.",
      "Do not rely on color alone for important interface states.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "length-converter": {
    slug: "length-converter",
    name: "Length Converter",
    shortName: "Length",
    title: "Free Length Converter Online",
    description:
      "Convert length units online free including meter, kilometer, centimeter, millimeter, inch, foot, yard and mile.",
    homeDescription: "Meters, inches, feet and more",
    href: "/length-converter",
    category: "converter",
    priority: 0.76,
    keywords: [
      "length converter",
      "meter to feet converter",
      "cm to inch converter",
      "unit converter length",
    ],
    features: [
      "Metric and imperial units",
      "Instant conversion table",
      "Copy result values",
      "Browser-only calculation",
    ],
    bestFor: [
      "Converting measurements for forms, construction, design, travel and daily use.",
      "Checking several length units at once without a spreadsheet.",
    ],
    notes: [
      "Results are rounded for display while calculations use full numeric values.",
      "Use official specifications where exact engineering tolerance is required.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "weight-converter": {
    slug: "weight-converter",
    name: "Weight Converter",
    shortName: "Weight",
    title: "Free Weight Converter Online",
    description:
      "Convert weight units online free including kilogram, gram, milligram, tonne, pound, ounce and stone.",
    homeDescription: "Kg, grams, pounds and ounces",
    href: "/weight-converter",
    category: "converter",
    priority: 0.76,
    keywords: [
      "weight converter",
      "kg to lbs converter",
      "grams to kg converter",
      "unit converter weight",
    ],
    features: [
      "Metric and imperial weight units",
      "Instant conversion table",
      "Copy result values",
      "Browser-only calculation",
    ],
    bestFor: [
      "Converting recipe, parcel, fitness and product weight values quickly.",
      "Comparing kilogram, gram, pound and ounce values in one view.",
    ],
    notes: [
      "Weight values are displayed with sensible rounding for readability.",
      "For shipping, check the carrier's own rounding and billing rules.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "area-converter": {
    slug: "area-converter",
    name: "Area Converter",
    shortName: "Area",
    title: "Free Area Converter Online",
    description:
      "Convert area units online free including square meter, square foot, acre, hectare, square kilometer and square yard.",
    homeDescription: "Sq m, sq ft, acre and hectare",
    href: "/area-converter",
    category: "converter",
    priority: 0.76,
    keywords: [
      "area converter",
      "square feet to square meter",
      "acre to hectare converter",
      "land area converter",
    ],
    features: [
      "Common land and room units",
      "Instant conversion table",
      "Copy result values",
      "Browser-only calculation",
    ],
    bestFor: [
      "Converting land, room, construction and property area values.",
      "Comparing square feet, square meters, acres and hectares quickly.",
    ],
    notes: [
      "Area conversions are mathematical estimates and do not verify survey records.",
      "Use local legal documents for official property measurements.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "password-generator": {
    slug: "password-generator",
    name: "Password Generator",
    shortName: "Password Generator",
    title: "Free Password Generator Online - Strong Random Passwords",
    description:
      "Generate strong random passwords online free with length, uppercase, lowercase, numbers and symbol options. Runs locally in your browser.",
    homeDescription: "Create strong random passwords",
    href: "/password-generator",
    category: "password",
    priority: 0.86,
    popular: true,
    keywords: [
      "password generator free",
      "strong password generator",
      "random password generator",
      "secure password generator",
    ],
    features: [
      "Cryptographic browser randomness",
      "Length and character options",
      "Ambiguous character filter",
      "Strength estimate",
    ],
    bestFor: [
      "Creating strong passwords for accounts, devices and one-time credentials.",
      "Generating passwords locally without sending them to a server.",
    ],
    notes: [
      "Use unique passwords for each account and store them in a trusted password manager.",
      "Longer passwords are generally stronger than short complex passwords.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "password-strength-checker": {
    slug: "password-strength-checker",
    name: "Password Strength Checker",
    shortName: "Strength Checker",
    title: "Free Password Strength Checker Online",
    description:
      "Check password strength online free with length, character variety and entropy estimates. The password stays in your browser.",
    homeDescription: "Check password quality locally",
    href: "/password-strength-checker",
    category: "password",
    priority: 0.8,
    keywords: [
      "password strength checker",
      "check password strength",
      "password entropy checker",
      "secure password checker",
    ],
    features: [
      "Length and variety checks",
      "Entropy estimate",
      "Common weakness hints",
      "Local-only analysis",
    ],
    bestFor: [
      "Testing whether a new password has enough length and variety.",
      "Learning what makes a password easier or harder to guess.",
    ],
    notes: [
      "Do not paste a real sensitive password into any website you do not trust.",
      "A password manager can generate and store stronger unique passwords.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "json-formatter": {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortName: "JSON Formatter",
    title: "Free JSON Formatter Online - Format and Validate JSON",
    description:
      "Format, validate and minify JSON online free. Paste JSON and get readable formatted output locally in your browser.",
    homeDescription: "Format, validate and minify JSON",
    href: "/json-formatter",
    category: "developer",
    priority: 0.86,
    popular: true,
    keywords: [
      "json formatter free",
      "json validator online",
      "json beautifier",
      "json minifier",
    ],
    features: [
      "JSON format and validation",
      "Minify JSON",
      "Parse error messages",
      "Copy or download output",
    ],
    bestFor: [
      "Reading API responses, config files and structured data more clearly.",
      "Validating JSON before adding it to code, tools or documentation.",
    ],
    notes: [
      "JSON requires double quotes around keys and string values.",
      "Large JSON files may use more browser memory while formatting.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "base64-encoder-decoder": {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder Decoder",
    shortName: "Base64",
    title: "Free Base64 Encoder and Decoder Online",
    description:
      "Encode and decode Base64 text online free with UTF-8 support. Convert text to Base64 or Base64 back to readable text locally.",
    homeDescription: "Encode or decode Base64",
    href: "/base64-encoder-decoder",
    category: "developer",
    priority: 0.8,
    keywords: [
      "base64 encoder decoder",
      "base64 encode online",
      "base64 decode online",
      "free base64 converter",
    ],
    features: [
      "UTF-8 text support",
      "Encode and decode modes",
      "Copy or download output",
      "Local browser conversion",
    ],
    bestFor: [
      "Encoding small text snippets for development, testing and data transfer.",
      "Decoding Base64 strings from APIs, headers or configuration values.",
    ],
    notes: [
      "Base64 is encoding, not encryption.",
      "Decoded text may be unreadable if the Base64 data represents binary content.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "url-encoder-decoder": {
    slug: "url-encoder-decoder",
    name: "URL Encoder Decoder",
    shortName: "URL Encoder",
    title: "Free URL Encoder and Decoder Online",
    description:
      "Encode and decode URL text online free. Convert query parameters, paths and special characters safely in your browser.",
    homeDescription: "Encode or decode URL text",
    href: "/url-encoder-decoder",
    category: "developer",
    priority: 0.78,
    keywords: [
      "url encoder decoder",
      "url encode online",
      "url decode online",
      "percent encoding converter",
    ],
    features: [
      "Encode URI components",
      "Decode percent-encoded text",
      "URL parser summary",
      "Copy or download output",
    ],
    bestFor: [
      "Preparing query values, redirect URLs and encoded strings for web development.",
      "Reading percent-encoded URLs from logs, analytics or API responses.",
    ],
    notes: [
      "Use component encoding for query parameter values.",
      "Decode only trusted URLs before opening them in a browser.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-to-pdf": {
    slug: "html-to-pdf",
    name: "HTML to PDF Converter",
    shortName: "HTML to PDF",
    title: "HTML to PDF Converter Online Free",
    description:
      "Convert pasted or uploaded HTML to PDF online free in your browser with page size, orientation, margin and preview options.",
    homeDescription: "Convert HTML code to PDF",
    href: "/html-to-pdf",
    category: "html",
    priority: 0.94,
    popular: true,
    keywords: [
      "html to pdf",
      "html to pdf converter",
      "convert html to pdf online",
      "html code to pdf",
      "webpage to pdf from html",
    ],
    features: [
      "Paste or upload HTML",
      "Sandboxed live preview",
      "A4, Letter and long-page PDF options",
      "Client-side PDF download",
    ],
    bestFor: [
      "Saving receipts, email templates, reports and simple HTML documents as PDF files.",
      "Testing how HTML content exports before sharing or archiving it.",
    ],
    notes: [
      "This browser tool converts pasted or uploaded HTML; converting arbitrary live URLs usually needs a server-side browser.",
      "External images and fonts may be blocked by browser CORS rules during PDF export.",
    ],
    faqs: [
      privacyFaq,
      freeFaq,
      {
        question: "Can it convert a live website URL?",
        answer:
          "No. To stay client-side, paste the HTML code or upload an HTML file instead of sending a URL to a server.",
      },
    ],
  },
  "html-viewer": {
    slug: "html-viewer",
    name: "HTML Viewer",
    shortName: "HTML Viewer",
    title: "HTML Viewer Online Free - Live HTML Preview",
    description:
      "Preview HTML code online free with a sandboxed browser frame, source statistics, upload support and desktop or mobile view sizes.",
    homeDescription: "Preview HTML code live",
    href: "/html-viewer",
    category: "html",
    priority: 0.92,
    popular: true,
    keywords: [
      "html viewer",
      "html preview online",
      "live html editor",
      "view html code online",
      "html renderer online",
    ],
    features: [
      "Live HTML preview",
      "Sandboxed iframe output",
      "Desktop, tablet and mobile widths",
      "HTML file upload",
    ],
    bestFor: [
      "Checking small HTML snippets, email fragments and layout examples before publishing.",
      "Viewing an HTML file without opening a full code editor.",
    ],
    notes: [
      "Scripts are disabled by default so pasted HTML cannot run active code in the page.",
      "Use the responsive preview tool when you need several viewport widths at once.",
    ],
    faqs: [
      privacyFaq,
      freeFaq,
      {
        question: "Does the preview run JavaScript?",
        answer:
          "No. The preview is sandboxed and keeps scripts disabled by default for safer testing.",
      },
    ],
  },
  "html-formatter": {
    slug: "html-formatter",
    name: "HTML Formatter",
    shortName: "HTML Formatter",
    title: "HTML Formatter Online Free - Beautify HTML Code",
    description:
      "Format and beautify HTML online free with indentation, readable line breaks and clean output that you can copy or download.",
    homeDescription: "Beautify messy HTML code",
    href: "/html-formatter",
    category: "html",
    priority: 0.9,
    popular: true,
    keywords: [
      "html formatter",
      "html beautifier",
      "beautify html online",
      "pretty print html",
      "format html code",
    ],
    features: [
      "Indent HTML code",
      "Choose two or four spaces",
      "Format fragments or full documents",
      "Copy or download output",
    ],
    bestFor: [
      "Making minified or messy HTML easier to read during debugging and review.",
      "Cleaning copied snippets before placing them in docs, templates or source files.",
    ],
    notes: [
      "Formatting can normalize some browser-parsed HTML structure.",
      "Review template syntax from frameworks before replacing source files.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-minifier": {
    slug: "html-minifier",
    name: "HTML Minifier",
    shortName: "HTML Minifier",
    title: "HTML Minifier Online Free - Compress HTML Code",
    description:
      "Minify HTML online free by removing comments and extra whitespace while preserving script, style, pre and textarea content.",
    homeDescription: "Compress HTML code",
    href: "/html-minifier",
    category: "html",
    priority: 0.88,
    keywords: [
      "html minifier",
      "minify html online",
      "compress html code",
      "html compressor",
      "reduce html size",
    ],
    features: [
      "Remove HTML comments",
      "Collapse whitespace",
      "Preserve sensitive text blocks",
      "Size reduction summary",
    ],
    bestFor: [
      "Creating smaller HTML snippets for templates, demos and simple static pages.",
      "Comparing original and minified size before using code in a project.",
    ],
    notes: [
      "Do not minify framework templates with custom syntax unless you review the output.",
      "Whitespace inside pre, textarea, script and style blocks is preserved.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-validator": {
    slug: "html-validator",
    name: "HTML Validator",
    shortName: "HTML Validator",
    title: "HTML Validator Online Free - Check HTML Issues",
    description:
      "Validate HTML online free with browser parsing checks, duplicate ID detection, accessibility hints and SEO basics for common page markup.",
    homeDescription: "Check common HTML issues",
    href: "/html-validator",
    category: "html",
    priority: 0.86,
    keywords: [
      "html validator",
      "html lint online",
      "validate html online",
      "html checker",
      "html error checker",
    ],
    features: [
      "Duplicate ID checks",
      "Image alt and form label hints",
      "Title, viewport and language checks",
      "Issue severity summary",
    ],
    bestFor: [
      "Finding common HTML quality, accessibility and SEO issues before publishing.",
      "Reviewing snippets when a full W3C validation workflow is more than you need.",
    ],
    notes: [
      "This local checker catches common issues but is not a full standards validator.",
      "Use an official validator for final production conformance checks.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-to-markdown": {
    slug: "html-to-markdown",
    name: "HTML to Markdown Converter",
    shortName: "HTML to Markdown",
    title: "HTML to Markdown Converter Online Free",
    description:
      "Convert HTML to Markdown online free in your browser. Paste HTML and get clean Markdown for docs, README files and content systems.",
    homeDescription: "Convert HTML to Markdown",
    href: "/html-to-markdown",
    category: "html",
    priority: 0.86,
    keywords: [
      "html to markdown",
      "html to md converter",
      "convert html to markdown",
      "html markdown converter",
    ],
    features: [
      "HTML to Markdown conversion",
      "Sanitized input option",
      "Copy or download Markdown",
      "Live output statistics",
    ],
    bestFor: [
      "Turning web content, CMS snippets and exported HTML into Markdown drafts.",
      "Preparing readable Markdown for documentation, notes and README files.",
    ],
    notes: [
      "Complex tables and custom widgets may need manual cleanup after conversion.",
      "Sanitizing removes scripts and unsafe attributes before conversion.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "markdown-to-html": {
    slug: "markdown-to-html",
    name: "Markdown to HTML Converter",
    shortName: "Markdown to HTML",
    title: "Markdown to HTML Converter Online Free",
    description:
      "Convert Markdown to HTML online free with sanitized live preview, generated HTML code and copy or download actions.",
    homeDescription: "Convert Markdown to HTML",
    href: "/markdown-to-html",
    category: "html",
    priority: 0.84,
    keywords: [
      "markdown to html",
      "md to html converter",
      "convert markdown to html",
      "markdown preview html",
    ],
    features: [
      "Markdown to HTML conversion",
      "Sanitized preview",
      "Generated HTML output",
      "Copy or download HTML",
    ],
    bestFor: [
      "Previewing Markdown notes, docs and README drafts as HTML.",
      "Creating simple HTML from Markdown content without opening a desktop editor.",
    ],
    notes: [
      "HTML output is sanitized before preview to remove unsafe active content.",
      "Custom Markdown extensions may not render exactly like every publishing platform.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-to-text": {
    slug: "html-to-text",
    name: "HTML to Text Converter",
    shortName: "HTML to Text",
    title: "HTML to Text Converter Online Free",
    description:
      "Convert HTML to plain text online free. Extract readable text from markup with options for link URLs and whitespace cleanup.",
    homeDescription: "Extract plain text from HTML",
    href: "/html-to-text",
    category: "html",
    priority: 0.82,
    keywords: [
      "html to text",
      "extract text from html",
      "html text extractor",
      "remove html tags",
    ],
    features: [
      "Strip HTML tags",
      "Optional link URL output",
      "Whitespace cleanup",
      "Copy or download text",
    ],
    bestFor: [
      "Extracting readable copy from HTML emails, snippets and exported pages.",
      "Removing markup before pasting content into forms, documents or messages.",
    ],
    notes: [
      "Hidden text and alt text may appear differently from a browser-rendered page.",
      "Review the output before using it as final copy.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-entities-encoder-decoder": {
    slug: "html-entities-encoder-decoder",
    name: "HTML Entities Encoder Decoder",
    shortName: "HTML Entities",
    title: "HTML Entities Encoder and Decoder Online Free",
    description:
      "Encode and decode HTML entities online free. Escape markup characters or decode entity text directly in your browser.",
    homeDescription: "Encode or decode HTML entities",
    href: "/html-entities-encoder-decoder",
    category: "html",
    priority: 0.82,
    keywords: [
      "html entities encoder",
      "html entities decoder",
      "html escape online",
      "decode html entities",
    ],
    features: [
      "Encode reserved HTML characters",
      "Decode named and numeric entities",
      "Copy or download output",
      "Local browser conversion",
    ],
    bestFor: [
      "Escaping code examples before placing them inside HTML pages.",
      "Reading encoded text from feeds, source code, emails or API responses.",
    ],
    notes: [
      "Encoding text is different from sanitizing unsafe HTML.",
      "Decode only trusted content before rendering it as HTML.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-table-generator": {
    slug: "html-table-generator",
    name: "HTML Table Generator",
    shortName: "HTML Table",
    title: "HTML Table Generator Online Free",
    description:
      "Generate HTML table code online free with rows, columns, caption, header, footer, responsive wrapper and CSS styling options.",
    homeDescription: "Create table HTML and CSS",
    href: "/html-table-generator",
    category: "html",
    priority: 0.84,
    keywords: [
      "html table generator",
      "table html generator",
      "create html table",
      "responsive table generator",
    ],
    features: [
      "Rows and columns controls",
      "Header, footer and caption options",
      "Responsive wrapper",
      "Generated HTML and CSS",
    ],
    bestFor: [
      "Building simple product, schedule, comparison and data tables without writing markup manually.",
      "Creating starter table HTML that can be copied into a website or document.",
    ],
    notes: [
      "Use real table headings for tabular data so screen readers can understand the structure.",
      "Very wide tables should use the responsive wrapper option.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "html-to-image": {
    slug: "html-to-image",
    name: "HTML to Image Converter",
    shortName: "HTML to Image",
    title: "HTML to PNG JPG Converter Online Free",
    description:
      "Convert HTML to PNG or JPG online free in your browser. Render pasted HTML as an image with width, scale and background controls.",
    homeDescription: "Export HTML as PNG or JPG",
    href: "/html-to-image",
    category: "html",
    priority: 0.86,
    keywords: [
      "html to image",
      "html to png",
      "html to jpg",
      "convert html to image",
      "html screenshot generator",
    ],
    features: [
      "PNG or JPG output",
      "Custom render width",
      "Scale and background controls",
      "Client-side image download",
    ],
    bestFor: [
      "Saving simple HTML cards, snippets and previews as images.",
      "Creating shareable screenshots from local HTML content without uploading it.",
    ],
    notes: [
      "External images may be skipped if the source blocks browser canvas access.",
      "Use a solid background for JPG output because JPG does not support transparency.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "responsive-html-preview": {
    slug: "responsive-html-preview",
    name: "Responsive HTML Preview",
    shortName: "Responsive Preview",
    title: "Responsive HTML Preview Online Free",
    description:
      "Preview HTML at mobile, tablet and desktop widths online free with sandboxed side-by-side frames and upload support.",
    homeDescription: "Preview HTML across devices",
    href: "/responsive-html-preview",
    category: "html",
    priority: 0.84,
    keywords: [
      "responsive html preview",
      "mobile html preview",
      "html viewport preview",
      "test html responsive online",
    ],
    features: [
      "Mobile, tablet and desktop frames",
      "Sandboxed preview",
      "HTML upload support",
      "Viewport width labels",
    ],
    bestFor: [
      "Checking whether a small HTML layout adapts across common viewport widths.",
      "Reviewing snippets before copying them into a website or email template.",
    ],
    notes: [
      "The preview estimates viewport widths but cannot simulate every device browser exactly.",
      "Scripts are disabled to keep the preview safer and predictable.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "iframe-generator": {
    slug: "iframe-generator",
    name: "iFrame Generator",
    shortName: "iFrame",
    title: "iFrame Generator Online Free",
    description:
      "Generate iframe HTML code online free with title, width, height, loading, sandbox, fullscreen and responsive wrapper options.",
    homeDescription: "Generate iframe embed code",
    href: "/iframe-generator",
    category: "html",
    priority: 0.8,
    keywords: [
      "iframe generator",
      "html iframe generator",
      "embed code generator",
      "responsive iframe generator",
    ],
    features: [
      "URL, title and size fields",
      "Sandbox and loading options",
      "Responsive wrapper code",
      "Live iframe preview",
    ],
    bestFor: [
      "Creating embed code for maps, videos, dashboards and external pages.",
      "Adding accessible iframe titles and common security attributes.",
    ],
    notes: [
      "Only embed content from sources you trust and have permission to use.",
      "Some websites block embedding with security headers, so their preview may not load.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "meta-tag-generator": {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    shortName: "Meta Tags",
    title: "Meta Tag and Open Graph Generator Online Free",
    description:
      "Generate SEO meta tags, Open Graph tags and Twitter card tags online free with search and social preview panels.",
    homeDescription: "Generate SEO and social tags",
    href: "/meta-tag-generator",
    category: "html",
    priority: 0.84,
    keywords: [
      "meta tag generator",
      "open graph generator",
      "twitter card generator",
      "seo meta tags",
      "og tag preview",
    ],
    features: [
      "Title and description tags",
      "Open Graph and Twitter card tags",
      "Search result preview",
      "Social card preview",
    ],
    bestFor: [
      "Drafting page metadata before adding it to a website or CMS.",
      "Checking whether titles and descriptions fit common search preview lengths.",
    ],
    notes: [
      "Search engines can rewrite titles and descriptions based on the query.",
      "Use accurate page-specific metadata instead of repeating the same text everywhere.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "css-js-formatter-minifier": {
    slug: "css-js-formatter-minifier",
    name: "CSS JS Formatter Minifier",
    shortName: "CSS JS Minifier",
    title: "CSS JS Formatter and Minifier Online Free",
    description:
      "Format or minify CSS and JavaScript snippets online free with quick copy and download output for front-end code cleanup.",
    homeDescription: "Format or minify CSS and JS",
    href: "/css-js-formatter-minifier",
    category: "html",
    priority: 0.82,
    keywords: [
      "css formatter",
      "js formatter",
      "css minifier",
      "javascript minifier",
      "format css javascript",
    ],
    features: [
      "CSS format and minify modes",
      "JavaScript format and minify modes",
      "Size reduction summary",
      "Copy or download output",
    ],
    bestFor: [
      "Cleaning small CSS and JavaScript snippets while working with HTML.",
      "Preparing compact code examples or readable snippets for documentation.",
    ],
    notes: [
      "This tool is best for small snippets, not complex production bundles.",
      "Review JavaScript output before replacing source code because formatting is intentionally lightweight.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "file-hash-checksum": {
    slug: "file-hash-checksum",
    name: "File Hash Checksum",
    shortName: "File Hash",
    title: "Free File Hash Checker Online - SHA Checksum",
    description:
      "Calculate file hash checksums online free using browser crypto. Generate SHA-1, SHA-256, SHA-384 or SHA-512 hashes locally.",
    homeDescription: "Create SHA checksums locally",
    href: "/file-hash-checksum",
    category: "file",
    priority: 0.8,
    keywords: [
      "file hash checker",
      "sha256 checksum online",
      "file checksum generator",
      "sha hash calculator",
    ],
    features: [
      "SHA-1, SHA-256, SHA-384 and SHA-512",
      "File or text input",
      "Hex checksum output",
      "Browser crypto API",
    ],
    bestFor: [
      "Verifying downloaded files against published SHA checksums.",
      "Creating checksums for files before sharing or archiving them.",
    ],
    notes: [
      "Browser crypto supports modern SHA algorithms but not MD5.",
      "Very large files may take time because the browser reads them before hashing.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "zip-extractor": {
    slug: "zip-extractor",
    name: "ZIP Creator and Extractor",
    shortName: "ZIP Tool",
    title: "Free ZIP Creator and Extractor Online",
    description:
      "Create ZIP files and inspect or extract ZIP archives online free. Files are processed locally in your browser with no upload.",
    homeDescription: "Create or extract ZIP files",
    href: "/zip-extractor",
    category: "file",
    priority: 0.8,
    keywords: [
      "zip extractor online free",
      "create zip online",
      "unzip file online",
      "zip creator free",
    ],
    features: [
      "Create ZIP from multiple files",
      "Inspect ZIP archive contents",
      "Download extracted files",
      "Local browser processing",
    ],
    bestFor: [
      "Combining multiple files into one ZIP before sharing or uploading.",
      "Checking ZIP contents and extracting files without installing desktop software.",
    ],
    notes: [
      "Encrypted ZIP archives are not supported by the browser ZIP engine used here.",
      "Large archives may need more time and memory on low-powered devices.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "video-compressor": {
    slug: "video-compressor",
    name: "Video Compressor",
    shortName: "Video Compressor",
    title: "Video Compressor Online Free - Compress MP4 WebM",
    description:
      "Compress videos online free in your browser with size, width, FPS and quality controls. No upload or account required.",
    homeDescription: "Compress short videos locally",
    href: "/video-compressor",
    category: "media",
    priority: 0.9,
    popular: true,
    keywords: [
      "video compressor",
      "compress video online",
      "compress mp4 online",
      "reduce video size",
    ],
    features: [
      "MP4 and WebM output",
      "Target width and FPS controls",
      "Quality/CRF control",
      "50 MB browser file limit",
    ],
    bestFor: [
      "Reducing short clips before uploading to chat apps, forms, websites or email.",
      "Keeping video processing private when the clip is small enough for browser memory.",
    ],
    notes: [
      "Large videos can exceed browser memory, so this tool limits files to 50 MB.",
      "Lower width, FPS and quality create smaller files but can reduce detail and motion smoothness.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "mp4-to-mp3": {
    slug: "mp4-to-mp3",
    name: "MP4 to MP3 Converter",
    shortName: "MP4 to MP3",
    title: "MP4 to MP3 Converter Online Free",
    description:
      "Convert MP4 video to MP3 audio online free in your browser. Extract audio from short video files without uploading.",
    homeDescription: "Extract MP3 from video",
    href: "/mp4-to-mp3",
    category: "media",
    priority: 0.92,
    popular: true,
    keywords: [
      "mp4 to mp3",
      "mp4 to mp3 converter",
      "video to audio converter",
      "extract audio from mp4",
    ],
    features: [
      "MP4, MOV and WebM inputs",
      "MP3 output",
      "Optional start and duration trim",
      "50 MB browser file limit",
    ],
    bestFor: [
      "Extracting audio from short recordings, lectures, clips and screen captures.",
      "Creating a smaller audio-only download while keeping the source file on your device.",
    ],
    notes: [
      "Only convert files you have the right to process.",
      "Long videos can take time because audio extraction runs inside the browser.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "mp4-to-gif": {
    slug: "mp4-to-gif",
    name: "MP4 to GIF Converter",
    shortName: "MP4 to GIF",
    title: "MP4 to GIF Converter Online Free",
    description:
      "Convert short MP4 clips to GIF online free with trim, width and FPS controls. Processing happens locally in your browser.",
    homeDescription: "Make GIFs from short clips",
    href: "/mp4-to-gif",
    category: "media",
    priority: 0.88,
    keywords: [
      "mp4 to gif",
      "video to gif",
      "convert mp4 to gif",
      "gif maker from video",
    ],
    features: [
      "Start and duration trim",
      "Width and FPS controls",
      "GIF palette generation",
      "50 MB browser file limit",
    ],
    bestFor: [
      "Turning a short moment from a video into a looping GIF for documentation or sharing.",
      "Creating lightweight visual examples from brief screen recordings.",
    ],
    notes: [
      "GIF files can become large; keep clips short and reduce FPS when possible.",
      "The file limit keeps browser memory usage reasonable on laptops and phones.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
  "audio-converter": {
    slug: "audio-converter",
    name: "Audio Converter",
    shortName: "Audio Converter",
    title: "Audio Converter Online Free - MP3 WAV M4A",
    description:
      "Convert audio online free between MP3, WAV, M4A and OGG formats in your browser. No upload or signup required.",
    homeDescription: "Convert audio formats locally",
    href: "/audio-converter",
    category: "media",
    priority: 0.82,
    keywords: [
      "audio converter",
      "mp3 converter online",
      "wav to mp3",
      "m4a to mp3",
    ],
    features: [
      "MP3, WAV, M4A and OGG output",
      "Audio bitrate control",
      "Optional trim controls",
      "20 MB browser file limit",
    ],
    bestFor: [
      "Converting short recordings, voice notes and audio exports into a compatible format.",
      "Reducing audio file size before sharing while keeping files on your device.",
    ],
    notes: [
      "Lossy formats such as MP3 and M4A reduce size by discarding some audio detail.",
      "Use WAV only when compatibility or uncompressed output matters more than file size.",
    ],
    faqs: [privacyFaq, freeFaq],
  },
};

export const utilityTools = Object.values(utilityToolConfigs);

export const utilityToolsByCategory = Object.values(utilityCategoryConfigs).map(
  (category) => ({
    ...category,
    tools: utilityTools.filter((tool) => tool.category === category.id),
  }),
);

export const popularUtilityTools = utilityTools.filter((tool) => tool.popular);

export function isUtilityToolSlug(value: string): value is UtilityToolSlug {
  return value in utilityToolConfigs;
}

export function buildUtilityToolMetadata(slug: UtilityToolSlug): Metadata {
  const tool = utilityToolConfigs[slug];
  const url = `${BASE_URL}${tool.href}`;

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.title} | FreeConvert`,
      description: tool.description,
      url,
      siteName: "FreeConvert",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | FreeConvert`,
      description: tool.description,
      images: ["/opengraph-image"],
    },
  };
}

export function utilityToolJsonLd(slug: UtilityToolSlug) {
  const tool = utilityToolConfigs[slug];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.name} - FreeConvert`,
    url: `${BASE_URL}${tool.href}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description: tool.description,
    featureList: tool.features,
  };
}

export function utilityToolFaqJsonLd(slug: UtilityToolSlug) {
  const tool = utilityToolConfigs[slug];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function utilityToolBreadcrumbJsonLd(slug: UtilityToolSlug) {
  const tool = utilityToolConfigs[slug];
  const category = utilityCategoryConfigs[tool.category];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "FreeConvert",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.title,
        item: `${BASE_URL}/#${category.anchor}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `${BASE_URL}${tool.href}`,
      },
    ],
  };
}
