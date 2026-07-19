"use client";

import DOMPurify from "dompurify";
import { marked } from "marked";
import TurndownService from "turndown";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type IframeHTMLAttributes,
  type ReactNode,
} from "react";
import { Download, FileUp, Loader2, RotateCcw } from "lucide-react";
import type { UtilityToolConfig } from "@/lib/utilityTools";
import {
  CodeBlock,
  ControlSection,
  CopyButton,
  Field,
  PreviewShell,
  SegmentedChoice,
  StatCard,
  TextDownloadButton,
  ToggleRow,
  UtilityToolLayout,
  clampNumber,
  formatNumber,
} from "@/components/utility/shared";
import { useHydrated } from "@/components/useHydrated";
import { cn } from "@/lib/utils";

const sampleHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Invoice preview</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #222; }
    .invoice { max-width: 760px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 12px; }
    h1 { margin-top: 0; color: #e5322d; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border-bottom: 1px solid #e5e5e5; padding: 10px; text-align: left; }
    .total { font-weight: 700; }
  </style>
</head>
<body>
  <main class="invoice">
    <h1>Invoice</h1>
    <p>Convert this HTML preview to a PDF or image directly in your browser.</p>
    <table>
      <thead><tr><th>Item</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Design work</td><td>₹4,000</td></tr>
        <tr><td>Development</td><td>₹8,000</td></tr>
        <tr class="total"><td>Total</td><td>₹12,000</td></tr>
      </tbody>
    </table>
  </main>
</body>
</html>`;

const sampleMarkdown = `# HTML Tools

Use **Markdown to HTML** when you want a quick preview and clean HTML output.

- Write notes
- Preview content
- Copy the generated HTML

[Open FreeConvert](https://freeconvert.in)`;

const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const rawTextTags = new Set(["pre", "script", "style", "textarea"]);
const blockTags = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "body",
  "br",
  "dd",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
]);

type ValidationIssue = {
  severity: "error" | "warning" | "info";
  message: string;
};

function browserReady() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function stripActiveContent(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+javascript:/gi, " ");
}

function sanitizeHtml(value: string) {
  if (!browserReady()) {
    return stripActiveContent(value);
  }

  return DOMPurify.sanitize(value, {
    FORBID_TAGS: ["script"],
    RETURN_TRUSTED_TYPE: false,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function decodeHtmlEntities(value: string) {
  if (!browserReady()) return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function isFullHtmlDocument(value: string) {
  return /<!doctype|<html[\s>]|<head[\s>]|<body[\s>]/i.test(value);
}

function buildPreviewDocument(html: string, sanitize = true) {
  const source = sanitize ? sanitizeHtml(html) : stripActiveContent(html);

  if (isFullHtmlDocument(source)) {
    return source;
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 24px; font-family: Arial, sans-serif; color: #222; background: #fff; }
    img, video, canvas, svg { max-width: 100%; height: auto; }
    table { border-collapse: collapse; max-width: 100%; }
  </style>
</head>
<body>${source}</body>
</html>`;
}

function getRenderableMarkup(html: string, sanitize = true) {
  const source = sanitize ? sanitizeHtml(html) : stripActiveContent(html);

  if (!browserReady() || !isFullHtmlDocument(source)) {
    return source;
  }

  const parsed = new DOMParser().parseFromString(source, "text/html");
  const headContent = Array.from(
    parsed.head.querySelectorAll("style, link[rel='stylesheet']"),
  )
    .map((node) => node.outerHTML)
    .join("\n");

  return `${headContent}\n${parsed.body.innerHTML}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function readTextFile(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return null;
  return file.text();
}

function UploadTextButton({
  accept,
  onText,
}: {
  accept: string;
  onText: (value: string) => void;
}) {
  return (
    <label className="segmented-button cursor-pointer justify-center">
      <FileUp className="h-4 w-4" />
      Upload file
      <input
        accept={accept}
        className="sr-only"
        type="file"
        onChange={async (event) => {
          const text = await readTextFile(event);
          if (text !== null) onText(text);
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="segmented-button justify-center" type="button" onClick={onClick}>
      <RotateCcw className="h-4 w-4" />
      Reset sample
    </button>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="button-primary"
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function HtmlTextarea({
  value,
  onChange,
  minHeight = "min-h-80",
}: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}) {
  return (
    <textarea
      className={cn("field-input resize-y font-mono text-xs leading-5", minHeight)}
      spellCheck={false}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function PreviewFrame({
  html,
  title = "HTML preview",
  width,
  height = 460,
  sanitize = true,
}: {
  html: string;
  title?: string;
  width?: number | string;
  height?: number;
  sanitize?: boolean;
}) {
  const srcDoc = useMemo(() => buildPreviewDocument(html, sanitize), [html, sanitize]);

  return (
    <iframe
      className="w-full rounded-lg border border-[var(--border)] bg-white"
      sandbox=""
      srcDoc={srcDoc}
      style={{ height, width: width ?? "100%" }}
      title={title}
    />
  );
}

function textStats(value: string) {
  return {
    chars: value.length,
    lines: value ? value.split(/\r\n|\r|\n/).length : 0,
    bytes: new Blob([value]).size,
  };
}

function serializeAttributes(element: Element) {
  return Array.from(element.attributes)
    .map((attribute) =>
      attribute.value === ""
        ? attribute.name
        : `${attribute.name}="${escapeAttribute(attribute.value)}"`,
    )
    .join(" ");
}

function serializeNode(
  node: Node,
  depth: number,
  indentText: string,
  inRawText = false,
): string {
  const pad = indentText.repeat(depth);

  if (node.nodeType === Node.DOCUMENT_TYPE_NODE) {
    return "<!doctype html>";
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${pad}<!--${node.nodeValue ?? ""}-->`;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    const cleaned = inRawText ? text.replace(/\n+$/g, "") : text.replace(/\s+/g, " ").trim();
    return cleaned ? `${pad}${escapeHtml(cleaned)}` : "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  const attrs = serializeAttributes(element);
  const open = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;

  if (voidTags.has(tag)) {
    return `${pad}${open}`;
  }

  const children = Array.from(element.childNodes);
  if (!children.length) {
    return `${pad}${open}</${tag}>`;
  }

  const raw = rawTextTags.has(tag);
  if (
    children.length === 1 &&
    children[0].nodeType === Node.TEXT_NODE &&
    !raw &&
    !blockTags.has(tag)
  ) {
    const text = (children[0].textContent ?? "").replace(/\s+/g, " ").trim();
    return `${pad}${open}${escapeHtml(text)}</${tag}>`;
  }

  const childLines: string[] = children
    .map((child): string => serializeNode(child, depth + 1, indentText, raw))
    .filter(Boolean);

  return [`${pad}${open}`, ...childLines, `${pad}</${tag}>`].join("\n");
}

function formatHtml(input: string, spaces: number) {
  if (!browserReady() || !input.trim()) return input.trim();

  const parser = new DOMParser();
  const document = parser.parseFromString(input, "text/html");
  const indentText = " ".repeat(spaces);
  const fullDocument = isFullHtmlDocument(input);
  const lines: string[] = [];

  if (fullDocument) {
    lines.push("<!doctype html>");
    lines.push(serializeNode(document.documentElement, 0, indentText));
  } else {
    lines.push(
      ...Array.from(document.body.childNodes)
        .map((node) => serializeNode(node, 0, indentText))
        .filter(Boolean),
    );
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function minifyHtml(
  input: string,
  opts: { removeComments: boolean; collapseWhitespace: boolean },
) {
  let index = 0;
  const preserved: string[] = [];
  let output = input.replace(
    /<(pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
    (match) => {
      preserved.push(match);
      return `___FREECONVERT_PRESERVE_${index++}___`;
    },
  );

  if (opts.removeComments) {
    output = output.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");
  }

  if (opts.collapseWhitespace) {
    output = output
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .replace(/\s+>/g, ">")
      .replace(/<\s+/g, "<");
  }

  output = output.trim();
  preserved.forEach((value, preserveIndex) => {
    output = output.replace(`___FREECONVERT_PRESERVE_${preserveIndex}___`, value);
  });

  return output;
}

function validateHtml(input: string) {
  const issues: ValidationIssue[] = [];

  if (!input.trim()) {
    return [{ severity: "error" as const, message: "HTML input is empty." }];
  }

  if (!browserReady()) return issues;

  const document = new DOMParser().parseFromString(input, "text/html");
  const fullDocument = isFullHtmlDocument(input);
  const ids = new Map<string, number>();

  document.querySelectorAll("[id]").forEach((node) => {
    const id = node.getAttribute("id")?.trim();
    if (id) ids.set(id, (ids.get(id) ?? 0) + 1);
  });
  ids.forEach((count, id) => {
    if (count > 1) {
      issues.push({
        severity: "error",
        message: `Duplicate id "${id}" appears ${count} times.`,
      });
    }
  });

  document.querySelectorAll("img").forEach((img, index) => {
    if (!img.hasAttribute("alt")) {
      issues.push({
        severity: "warning",
        message: `Image ${index + 1} is missing an alt attribute.`,
      });
    }
  });

  document.querySelectorAll("a").forEach((anchor, index) => {
    const text = anchor.textContent?.trim() ?? "";
    const href = anchor.getAttribute("href")?.trim() ?? "";
    if (!text && !anchor.getAttribute("aria-label")) {
      issues.push({
        severity: "warning",
        message: `Link ${index + 1} has no visible text or aria-label.`,
      });
    }
    if (!href || href === "#") {
      issues.push({
        severity: "info",
        message: `Link ${index + 1} has an empty or placeholder href.`,
      });
    }
  });

  document.querySelectorAll("button").forEach((button, index) => {
    if (!button.textContent?.trim() && !button.getAttribute("aria-label")) {
      issues.push({
        severity: "warning",
        message: `Button ${index + 1} has no text or aria-label.`,
      });
    }
  });

  document.querySelectorAll("input, select, textarea").forEach((field, index) => {
    const id = field.getAttribute("id");
    const hasLabel = Boolean(
      field.closest("label") ||
        field.getAttribute("aria-label") ||
        field.getAttribute("aria-labelledby") ||
        (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)),
    );
    const type = field.getAttribute("type");

    if (type !== "hidden" && !hasLabel) {
      issues.push({
        severity: "warning",
        message: `Form field ${index + 1} is missing an accessible label.`,
      });
    }
  });

  document.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (/^on/i.test(attribute.name)) {
        issues.push({
          severity: "warning",
          message: `<${element.tagName.toLowerCase()}> uses inline event handler "${attribute.name}".`,
        });
      }
    });
  });

  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  const h1Count = headings.filter((heading) => heading.tagName.toLowerCase() === "h1").length;
  if (fullDocument && h1Count === 0) {
    issues.push({ severity: "info", message: "The page has no h1 heading." });
  }
  if (h1Count > 1) {
    issues.push({ severity: "info", message: `The page has ${h1Count} h1 headings.` });
  }
  headings.reduce((previousLevel, heading) => {
    const currentLevel = Number(heading.tagName.slice(1));
    if (previousLevel && currentLevel - previousLevel > 1) {
      issues.push({
        severity: "info",
        message: `${heading.tagName.toLowerCase()} follows h${previousLevel}; avoid skipping heading levels.`,
      });
    }
    return currentLevel;
  }, 0);

  if (fullDocument) {
    if (!/^(\s*)<!doctype html>/i.test(input)) {
      issues.push({ severity: "info", message: "Add <!doctype html> at the top of the document." });
    }
    if (!document.documentElement.getAttribute("lang")) {
      issues.push({ severity: "warning", message: "The html tag is missing a lang attribute." });
    }
    if (!document.querySelector("meta[charset]")) {
      issues.push({ severity: "warning", message: "The document is missing a charset meta tag." });
    }
    if (!document.querySelector("meta[name='viewport']")) {
      issues.push({ severity: "warning", message: "The document is missing a viewport meta tag." });
    }
    const title = document.querySelector("title")?.textContent?.trim() ?? "";
    if (!title) {
      issues.push({ severity: "error", message: "The document is missing a title tag." });
    } else if (title.length > 65) {
      issues.push({ severity: "info", message: "The title is longer than 65 characters." });
    }
    const description =
      document.querySelector("meta[name='description']")?.getAttribute("content")?.trim() ?? "";
    if (!description) {
      issues.push({ severity: "info", message: "Add a meta description for search previews." });
    } else if (description.length > 160) {
      issues.push({ severity: "info", message: "The meta description is longer than 160 characters." });
    }
  }

  return issues;
}

function htmlToPlainText(input: string, includeLinks: boolean) {
  if (!browserReady()) return input.replace(/<[^>]+>/g, " ");

  const document = new DOMParser().parseFromString(sanitizeHtml(input), "text/html");
  const chunks: string[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      chunks.push(node.textContent ?? "");
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    const tag = element.tagName.toLowerCase();

    if (tag === "br") chunks.push("\n");
    if (tag === "li") chunks.push("\n- ");
    if (blockTags.has(tag) && chunks.length) chunks.push("\n");

    Array.from(element.childNodes).forEach(walk);

    if (tag === "a" && includeLinks) {
      const href = element.getAttribute("href");
      if (href) chunks.push(` (${href})`);
    }
    if (blockTags.has(tag)) chunks.push("\n");
  }

  Array.from(document.body.childNodes).forEach(walk);

  return chunks
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function buildTableCode(opts: {
  rows: number;
  columns: number;
  caption: string;
  includeHeader: boolean;
  includeFooter: boolean;
  striped: boolean;
  bordered: boolean;
  responsive: boolean;
}) {
  const headers = Array.from({ length: opts.columns }, (_, index) => `Column ${index + 1}`);
  const bodyRows = Array.from({ length: opts.rows }, (_, row) =>
    Array.from({ length: opts.columns }, (_, column) => `Row ${row + 1} cell ${column + 1}`),
  );
  const classes = ["fc-table", opts.striped ? "fc-table-striped" : "", opts.bordered ? "fc-table-bordered" : ""]
    .filter(Boolean)
    .join(" ");

  const table = `<table class="${classes}">
${opts.caption ? `  <caption>${escapeHtml(opts.caption)}</caption>\n` : ""}${
    opts.includeHeader
      ? `  <thead>
    <tr>
${headers.map((header) => `      <th scope="col">${header}</th>`).join("\n")}
    </tr>
  </thead>
`
      : ""
  }  <tbody>
${bodyRows
  .map(
    (row) => `    <tr>
${row.map((cell) => `      <td>${cell}</td>`).join("\n")}
    </tr>`,
  )
  .join("\n")}
  </tbody>
${
    opts.includeFooter
      ? `  <tfoot>
    <tr>
${headers.map((header) => `      <td>${header} total</td>`).join("\n")}
    </tr>
  </tfoot>
`
      : ""
  }</table>`;

  const css = `<style>
.fc-table-wrapper {
  width: 100%;
  overflow-x: auto;
}
.fc-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}
.fc-table caption {
  margin-bottom: 0.75rem;
  font-weight: 700;
  text-align: left;
}
.fc-table th,
.fc-table td {
  padding: 0.75rem;
  text-align: left;
}
.fc-table thead {
  background: #f7f7fb;
}
.fc-table-bordered th,
.fc-table-bordered td {
  border: 1px solid #d9d9e3;
}
.fc-table-striped tbody tr:nth-child(even) {
  background: #fafafa;
}
</style>`;

  return `${css}
${opts.responsive ? `<div class="fc-table-wrapper">\n${table}\n</div>` : table}`;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildIframeCode(opts: {
  url: string;
  title: string;
  width: number;
  height: number;
  lazy: boolean;
  fullscreen: boolean;
  sandbox: boolean;
  responsive: boolean;
  referrerPolicy: string;
}) {
  const attrs = [
    `src="${escapeAttribute(normalizeUrl(opts.url))}"`,
    `title="${escapeAttribute(opts.title)}"`,
    `width="${opts.width}"`,
    `height="${opts.height}"`,
    `loading="${opts.lazy ? "lazy" : "eager"}"`,
    `referrerpolicy="${escapeAttribute(opts.referrerPolicy)}"`,
    opts.fullscreen ? "allowfullscreen" : "",
    opts.sandbox ? `sandbox="allow-scripts allow-same-origin allow-popups"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const iframe = `<iframe ${attrs}></iframe>`;

  if (!opts.responsive) return iframe;

  return `<div style="position:relative;width:100%;padding-top:56.25%;">
  <iframe ${attrs} style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>`;
}

function buildMetaTags(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  type: string;
  twitterHandle: string;
}) {
  const url = normalizeUrl(opts.url);
  const image = opts.image.trim();
  const twitter = opts.twitterHandle.trim().replace(/^@/, "");

  return [
    `<title>${escapeHtml(opts.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(opts.description)}">`,
    `<link rel="canonical" href="${escapeAttribute(url)}">`,
    `<meta property="og:type" content="${escapeAttribute(opts.type)}">`,
    `<meta property="og:title" content="${escapeAttribute(opts.title)}">`,
    `<meta property="og:description" content="${escapeAttribute(opts.description)}">`,
    `<meta property="og:url" content="${escapeAttribute(url)}">`,
    opts.siteName ? `<meta property="og:site_name" content="${escapeAttribute(opts.siteName)}">` : "",
    image ? `<meta property="og:image" content="${escapeAttribute(image)}">` : "",
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeAttribute(opts.title)}">`,
    `<meta name="twitter:description" content="${escapeAttribute(opts.description)}">`,
    image ? `<meta name="twitter:image" content="${escapeAttribute(image)}">` : "",
    twitter ? `<meta name="twitter:site" content="@${escapeAttribute(twitter)}">` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function stripCodeComments(input: string) {
  let output = "";
  let quote: string | null = null;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (quote) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      output += char;
      continue;
    }

    if (char === "/" && next === "/") {
      while (index < input.length && input[index] !== "\n") index += 1;
      output += "\n";
      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;
      while (index < input.length && !(input[index] === "*" && input[index + 1] === "/")) {
        index += 1;
      }
      index += 1;
      continue;
    }

    output += char;
  }

  return output;
}

function formatCodeLike(input: string, language: "css" | "js") {
  const source = language === "css" ? input.replace(/\/\*[\s\S]*?\*\//g, "") : stripCodeComments(input);
  let output = "";
  let depth = 0;
  let quote: string | null = null;
  let escaped = false;

  function newline(nextDepth = depth) {
    output = output.trimEnd();
    output += `\n${"  ".repeat(Math.max(0, nextDepth))}`;
  }

  for (const char of source) {
    if (quote) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      output += char;
      continue;
    }

    if (char === "{") {
      output = output.trimEnd() + " {";
      depth += 1;
      newline();
      continue;
    }

    if (char === "}") {
      depth -= 1;
      newline(depth);
      output += "}";
      newline(depth);
      continue;
    }

    if (char === ";") {
      output += ";";
      newline();
      continue;
    }

    if (char === "," && language === "css") {
      output += ",";
      newline();
      continue;
    }

    output += char;
  }

  return output.replace(/\n{3,}/g, "\n\n").trim();
}

function minifyCodeLike(input: string, language: "css" | "js") {
  const source = language === "css" ? input.replace(/\/\*[\s\S]*?\*\//g, "") : stripCodeComments(input);

  if (language === "css") {
    return source
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,>+~])\s*/g, "$1")
      .replace(/;}/g, "}")
      .trim();
  }

  return source
    .replace(/\s+/g, " ")
    .replace(/\s*([{}()[\];,:+\-*/%=<>])\s*/g, "$1")
    .trim();
}

function reductionPercent(input: string, output: string) {
  if (!input.length) return 0;
  return Math.max(0, Math.round(((input.length - output.length) / input.length) * 100));
}

function pdfPreviewWidth(pageSize: "a4" | "letter", orientation: "portrait" | "landscape") {
  if (pageSize === "letter") {
    return orientation === "portrait" ? 816 : 1056;
  }

  return orientation === "portrait" ? 794 : 1123;
}

function HtmlPdfTool({ tool }: { tool: UtilityToolConfig }) {
  const [html, setHtml] = useState(sampleHtml);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(10);
  const [sanitizeInput, setSanitizeInput] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const hydrated = useHydrated();
  const renderRef = useRef<HTMLDivElement>(null);
  const renderMarkup = useMemo(
    () => (hydrated ? getRenderableMarkup(html, sanitizeInput) : ""),
    [html, hydrated, sanitizeInput],
  );
  const previewWidth = pdfPreviewWidth(pageSize, orientation);

  async function downloadPdf() {
    const sourceElement = renderRef.current;
    if (!sourceElement) return;
    setWorking(true);
    setError("");

    try {
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(sourceElement, {
        backgroundColor: "#ffffff",
        logging: false,
        scale: Math.min(3, window.devicePixelRatio || 2),
        useCORS: true,
        windowHeight: sourceElement.scrollHeight,
        windowWidth: sourceElement.scrollWidth,
      });

      if (!canvas.width || !canvas.height) {
        throw new Error("The rendered HTML preview is empty.");
      }

      const pdf = new jsPDF({
        compress: true,
        format: pageSize,
        orientation,
        unit: "mm",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;
      const imageHeight = (canvas.height * usableWidth) / canvas.width;
      const imageData = canvas.toDataURL("image/png");

      let offsetY = 0;
      while (offsetY < imageHeight) {
        if (offsetY > 0) {
          pdf.addPage(pageSize, orientation);
        }
        pdf.addImage(imageData, "PNG", margin, margin - offsetY, usableWidth, imageHeight);
        offsetY += usableHeight;
      }

      pdf.save("freeconvert-html-to-pdf.pdf");
    } catch (pdfError) {
      setError(pdfError instanceof Error ? pdfError.message : "Could not create PDF.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="HTML input">
            <HtmlTextarea value={html} onChange={setHtml} />
            <div className="grid gap-2 sm:grid-cols-2">
              <UploadTextButton accept=".html,.htm,text/html,text/plain" onText={setHtml} />
              <ResetButton onClick={() => setHtml(sampleHtml)} />
            </div>
          </ControlSection>
          <ControlSection title="PDF options">
            <Field label="Page size">
              <select
                className="field-input"
                value={pageSize}
                onChange={(event) => setPageSize(event.target.value as "a4" | "letter")}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </Field>
            <SegmentedChoice
              onChange={setOrientation}
              options={[
                { label: "Portrait", value: "portrait" },
                { label: "Landscape", value: "landscape" },
              ]}
              value={orientation}
            />
            <Field label={`Margin: ${margin} mm`}>
              <input
                className="range-input"
                max={30}
                min={0}
                type="range"
                value={margin}
                onChange={(event) => setMargin(Number(event.target.value))}
              />
            </Field>
            <ToggleRow
              checked={sanitizeInput}
              label="Sanitize active HTML"
              onChange={setSanitizeInput}
            />
            <ActionButton disabled={working || !html.trim() || !renderMarkup} onClick={downloadPdf}>
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </ActionButton>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title="PDF preview">
          {error ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          <div className="overflow-auto rounded-lg bg-[var(--surface-2)] p-3">
            <div
              ref={renderRef}
              className="mx-auto min-h-[520px] bg-white p-6 text-black shadow-sm ring-1 ring-[var(--border)]"
              dangerouslySetInnerHTML={{ __html: renderMarkup }}
              style={{ width: previewWidth }}
            />
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlViewerTool({ tool, responsive = false }: { tool: UtilityToolConfig; responsive?: boolean }) {
  const [html, setHtml] = useState(sampleHtml);
  const [sanitizeInput, setSanitizeInput] = useState(true);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const stats = useMemo(() => textStats(html), [html]);
  const viewportWidth = { mobile: 375, tablet: 768, desktop: "100%" }[viewport];
  const frames = [
    ["Mobile", 375],
    ["Tablet", 768],
    ["Desktop", 1120],
  ] as const;

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="HTML input">
            <HtmlTextarea value={html} onChange={setHtml} />
            <div className="grid gap-2 sm:grid-cols-2">
              <UploadTextButton accept=".html,.htm,text/html,text/plain" onText={setHtml} />
              <ResetButton onClick={() => setHtml(sampleHtml)} />
            </div>
          </ControlSection>
          <ControlSection title="Preview options">
            {!responsive ? (
              <SegmentedChoice
                onChange={setViewport}
                options={[
                  { label: "Mobile", value: "mobile" },
                  { label: "Tablet", value: "tablet" },
                  { label: "Desktop", value: "desktop" },
                ]}
                value={viewport}
              />
            ) : null}
            <ToggleRow
              checked={sanitizeInput}
              label="Sanitize active HTML"
              onChange={setSanitizeInput}
            />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title={responsive ? "Responsive preview" : "Live preview"}>
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Characters" value={formatNumber(stats.chars)} />
            <StatCard label="Lines" value={formatNumber(stats.lines)} />
            <StatCard label="Bytes" value={formatNumber(stats.bytes)} />
          </div>
          {responsive ? (
            <div className="grid gap-5 overflow-x-auto xl:grid-cols-3">
              {frames.map(([label, width]) => (
                <section className="min-w-[280px]" key={label}>
                  <h3 className="mb-2 text-xs font-extrabold uppercase text-[var(--muted)]">
                    {label} - {width}px
                  </h3>
                  <PreviewFrame
                    height={520}
                    html={html}
                    sanitize={sanitizeInput}
                    title={`${label} HTML preview`}
                    width={width}
                  />
                </section>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-[var(--surface-2)] p-3">
              <PreviewFrame html={html} sanitize={sanitizeInput} width={viewportWidth} />
            </div>
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlFormatterTool({ tool, minifier = false }: { tool: UtilityToolConfig; minifier?: boolean }) {
  const [html, setHtml] = useState(
    minifier
      ? sampleHtml
      : minifyHtml(sampleHtml, { removeComments: true, collapseWhitespace: true }),
  );
  const [spaces, setSpaces] = useState(2);
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const hydrated = useHydrated();
  const output = useMemo(
    () =>
      !hydrated
        ? html
        : minifier
          ? minifyHtml(html, { removeComments, collapseWhitespace })
          : formatHtml(html, spaces),
    [collapseWhitespace, html, hydrated, minifier, removeComments, spaces],
  );
  const originalStats = textStats(html);
  const outputStats = textStats(output);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="HTML input">
            <HtmlTextarea value={html} onChange={setHtml} />
            <div className="grid gap-2 sm:grid-cols-2">
              <UploadTextButton accept=".html,.htm,text/html,text/plain" onText={setHtml} />
              <ResetButton onClick={() => setHtml(sampleHtml)} />
            </div>
          </ControlSection>
          <ControlSection title={minifier ? "Minify options" : "Format options"}>
            {minifier ? (
              <>
                <ToggleRow checked={removeComments} label="Remove comments" onChange={setRemoveComments} />
                <ToggleRow
                  checked={collapseWhitespace}
                  label="Collapse whitespace"
                  onChange={setCollapseWhitespace}
                />
              </>
            ) : (
              <Field label="Indent spaces">
                <select
                  className="field-input"
                  value={spaces}
                  onChange={(event) => setSpaces(Number(event.target.value))}
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </Field>
            )}
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={output} />
              <TextDownloadButton filename={minifier ? "minified.html" : "formatted.html"} text={output} />
            </>
          }
          title={minifier ? "Minified HTML" : "Formatted HTML"}
        >
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Original" value={`${formatNumber(originalStats.bytes)} bytes`} />
            <StatCard label="Output" value={`${formatNumber(outputStats.bytes)} bytes`} />
            <StatCard
              label="Reduction"
              tone={minifier ? "success" : "default"}
              value={`${reductionPercent(html, output)}%`}
            />
          </div>
          <CodeBlock value={output} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlValidatorTool({ tool }: { tool: UtilityToolConfig }) {
  const [html, setHtml] = useState(sampleHtml);
  const hydrated = useHydrated();
  const issues = useMemo(() => (hydrated ? validateHtml(html) : []), [html, hydrated]);
  const counts = {
    error: issues.filter((issue) => issue.severity === "error").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    info: issues.filter((issue) => issue.severity === "info").length,
  };

  return (
    <UtilityToolLayout
      controls={
        <ControlSection title="HTML input">
          <HtmlTextarea value={html} onChange={setHtml} />
          <div className="grid gap-2 sm:grid-cols-2">
            <UploadTextButton accept=".html,.htm,text/html,text/plain" onText={setHtml} />
            <ResetButton onClick={() => setHtml(sampleHtml)} />
          </div>
        </ControlSection>
      }
      preview={
        <PreviewShell title="Validation report">
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Errors" tone={counts.error ? "warning" : "success"} value={counts.error} />
            <StatCard label="Warnings" value={counts.warning} />
            <StatCard label="Info" value={counts.info} />
          </div>
          {issues.length ? (
            <div className="grid gap-3">
              {issues.map((issue, index) => (
                <article
                  className={cn(
                    "rounded-lg border p-4 text-sm font-semibold leading-6",
                    issue.severity === "error" && "border-red-200 bg-red-50 text-red-700",
                    issue.severity === "warning" && "border-amber-200 bg-amber-50 text-amber-800",
                    issue.severity === "info" && "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]",
                  )}
                  key={`${issue.message}-${index}`}
                >
                  {issue.message}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              No common issues found in this local check.
            </p>
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlMarkdownTool({ tool, reverse = false }: { tool: UtilityToolConfig; reverse?: boolean }) {
  const [input, setInput] = useState(reverse ? sampleMarkdown : sampleHtml);
  const [sanitizeInput, setSanitizeInput] = useState(true);
  const output = useMemo(() => {
    if (reverse) {
      const html = marked.parse(input, { async: false, breaks: false, gfm: true }) as string;
      return sanitizeInput ? sanitizeHtml(html) : stripActiveContent(html);
    }

    const service = new TurndownService({
      codeBlockStyle: "fenced",
      headingStyle: "atx",
    });
    return service.turndown(sanitizeInput ? sanitizeHtml(input) : stripActiveContent(input));
  }, [input, reverse, sanitizeInput]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title={reverse ? "Markdown input" : "HTML input"}>
            <HtmlTextarea
              minHeight="min-h-80"
              value={input}
              onChange={setInput}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <UploadTextButton
                accept={reverse ? ".md,.markdown,text/markdown,text/plain" : ".html,.htm,text/html,text/plain"}
                onText={setInput}
              />
              <ResetButton onClick={() => setInput(reverse ? sampleMarkdown : sampleHtml)} />
            </div>
          </ControlSection>
          <ControlSection title="Conversion options">
            <ToggleRow
              checked={sanitizeInput}
              label="Sanitize active HTML"
              onChange={setSanitizeInput}
            />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={output} />
              <TextDownloadButton filename={reverse ? "converted.html" : "converted.md"} text={output} />
            </>
          }
          title={reverse ? "Generated HTML" : "Generated Markdown"}
        >
          {reverse ? (
            <>
              <div
                className="mb-5 rounded-lg border border-[var(--border)] bg-white p-4 text-sm leading-7"
                dangerouslySetInnerHTML={{ __html: output }}
              />
              <CodeBlock value={output} />
            </>
          ) : (
            <CodeBlock value={output} />
          )}
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlTextTool({ tool }: { tool: UtilityToolConfig }) {
  const [html, setHtml] = useState(sampleHtml);
  const [includeLinks, setIncludeLinks] = useState(true);
  const hydrated = useHydrated();
  const text = useMemo(
    () => (hydrated ? htmlToPlainText(html, includeLinks) : ""),
    [html, hydrated, includeLinks],
  );

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="HTML input">
            <HtmlTextarea value={html} onChange={setHtml} />
            <div className="grid gap-2 sm:grid-cols-2">
              <UploadTextButton accept=".html,.htm,text/html,text/plain" onText={setHtml} />
              <ResetButton onClick={() => setHtml(sampleHtml)} />
            </div>
          </ControlSection>
          <ControlSection title="Text options">
            <ToggleRow checked={includeLinks} label="Append link URLs" onChange={setIncludeLinks} />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={text} />
              <TextDownloadButton filename="html-text.txt" text={text} />
            </>
          }
          title="Plain text"
        >
          <CodeBlock value={text} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlEntitiesTool({ tool }: { tool: UtilityToolConfig }) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState('<a href="https://freeconvert.in">FreeConvert & tools</a>');
  const output = useMemo(() => (mode === "encode" ? escapeHtml(input) : decodeHtmlEntities(input)), [input, mode]);

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Mode">
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "Encode", value: "encode" },
                { label: "Decode", value: "decode" },
              ]}
              value={mode}
            />
          </ControlSection>
          <ControlSection title="Input">
            <HtmlTextarea minHeight="min-h-72" value={input} onChange={setInput} />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={output} />
              <TextDownloadButton filename="html-entities.txt" text={output} />
            </>
          }
          title="Output"
        >
          <CodeBlock value={output} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlTableTool({ tool }: { tool: UtilityToolConfig }) {
  const [rows, setRows] = useState(4);
  const [columns, setColumns] = useState(3);
  const [caption, setCaption] = useState("Pricing table");
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(false);
  const [striped, setStriped] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [responsive, setResponsive] = useState(true);
  const code = useMemo(
    () =>
      buildTableCode({
        rows,
        columns,
        caption,
        includeHeader,
        includeFooter,
        striped,
        bordered,
        responsive,
      }),
    [bordered, caption, columns, includeFooter, includeHeader, responsive, rows, striped],
  );

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Table size">
            <Field label="Rows">
              <input
                className="field-input"
                max={20}
                min={1}
                type="number"
                value={rows}
                onChange={(event) => setRows(clampNumber(Number(event.target.value), 1, 20))}
              />
            </Field>
            <Field label="Columns">
              <input
                className="field-input"
                max={10}
                min={1}
                type="number"
                value={columns}
                onChange={(event) => setColumns(clampNumber(Number(event.target.value), 1, 10))}
              />
            </Field>
            <Field label="Caption">
              <input className="field-input" value={caption} onChange={(event) => setCaption(event.target.value)} />
            </Field>
          </ControlSection>
          <ControlSection title="Options">
            <ToggleRow checked={includeHeader} label="Include header" onChange={setIncludeHeader} />
            <ToggleRow checked={includeFooter} label="Include footer" onChange={setIncludeFooter} />
            <ToggleRow checked={striped} label="Striped rows" onChange={setStriped} />
            <ToggleRow checked={bordered} label="Cell borders" onChange={setBordered} />
            <ToggleRow checked={responsive} label="Responsive wrapper" onChange={setResponsive} />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={code} />
              <TextDownloadButton filename="table.html" text={code} />
            </>
          }
          title="Table preview and code"
        >
          <PreviewFrame height={300} html={code} sanitize={false} />
          <div className="mt-5">
            <CodeBlock value={code} />
          </div>
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function HtmlImageTool({ tool }: { tool: UtilityToolConfig }) {
  const [html, setHtml] = useState(sampleHtml);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [width, setWidth] = useState(900);
  const [scale, setScale] = useState(2);
  const [background, setBackground] = useState("#ffffff");
  const [sanitizeInput, setSanitizeInput] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const hydrated = useHydrated();
  const renderRef = useRef<HTMLDivElement>(null);
  const renderMarkup = useMemo(
    () => (hydrated ? getRenderableMarkup(html, sanitizeInput) : ""),
    [html, hydrated, sanitizeInput],
  );

  async function downloadImage() {
    if (!renderRef.current) return;
    setWorking(true);
    setError("");

    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;
      const canvas = await html2canvas(renderRef.current, {
        backgroundColor: format === "jpeg" ? background : background || null,
        scale,
        useCORS: true,
      });
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Could not create image output.");
            return;
          }
          downloadBlob(blob, `freeconvert-html-to-image.${format === "jpeg" ? "jpg" : "png"}`);
        },
        `image/${format}`,
        0.92,
      );
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Could not create image.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="HTML input">
            <HtmlTextarea value={html} onChange={setHtml} />
            <div className="grid gap-2 sm:grid-cols-2">
              <UploadTextButton accept=".html,.htm,text/html,text/plain" onText={setHtml} />
              <ResetButton onClick={() => setHtml(sampleHtml)} />
            </div>
          </ControlSection>
          <ControlSection title="Image options">
            <SegmentedChoice
              onChange={setFormat}
              options={[
                { label: "PNG", value: "png" },
                { label: "JPG", value: "jpeg" },
              ]}
              value={format}
            />
            <Field label="Render width">
              <input
                className="field-input"
                max={1600}
                min={320}
                type="number"
                value={width}
                onChange={(event) => setWidth(clampNumber(Number(event.target.value), 320, 1600))}
              />
            </Field>
            <Field label={`Scale: ${scale}x`}>
              <input
                className="range-input"
                max={3}
                min={1}
                step={0.5}
                type="range"
                value={scale}
                onChange={(event) => setScale(Number(event.target.value))}
              />
            </Field>
            <Field label="Background">
              <input className="field-input" type="color" value={background} onChange={(event) => setBackground(event.target.value)} />
            </Field>
            <ToggleRow checked={sanitizeInput} label="Sanitize active HTML" onChange={setSanitizeInput} />
            <ActionButton disabled={working || !html.trim()} onClick={downloadImage}>
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download image
            </ActionButton>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell title="Image preview">
          {error ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          <PreviewFrame html={html} sanitize={sanitizeInput} />
          <div
            ref={renderRef}
            className="fixed left-[-10000px] top-0 bg-white p-6 text-black"
            dangerouslySetInnerHTML={{ __html: renderMarkup }}
            style={{ width }}
          />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function IframeGeneratorTool({ tool }: { tool: UtilityToolConfig }) {
  const [url, setUrl] = useState("https://freeconvert.in");
  const [title, setTitle] = useState("FreeConvert tools");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(450);
  const [lazy, setLazy] = useState(true);
  const [fullscreen, setFullscreen] = useState(true);
  const [sandbox, setSandbox] = useState(false);
  const [responsive, setResponsive] = useState(true);
  const [referrerPolicy, setReferrerPolicy] = useState("no-referrer-when-downgrade");
  const code = useMemo(
    () =>
      buildIframeCode({
        url,
        title,
        width,
        height,
        lazy,
        fullscreen,
        sandbox,
        responsive,
        referrerPolicy,
      }),
    [fullscreen, height, lazy, referrerPolicy, responsive, sandbox, title, url, width],
  );

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Embed details">
            <Field label="URL">
              <input className="field-input" value={url} onChange={(event) => setUrl(event.target.value)} />
            </Field>
            <Field label="Accessible title">
              <input className="field-input" value={title} onChange={(event) => setTitle(event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Width">
                <input className="field-input" min={200} type="number" value={width} onChange={(event) => setWidth(clampNumber(Number(event.target.value), 200, 2000))} />
              </Field>
              <Field label="Height">
                <input className="field-input" min={120} type="number" value={height} onChange={(event) => setHeight(clampNumber(Number(event.target.value), 120, 1600))} />
              </Field>
            </div>
          </ControlSection>
          <ControlSection title="Attributes">
            <Field label="Referrer policy">
              <select className="field-input" value={referrerPolicy} onChange={(event) => setReferrerPolicy(event.target.value)}>
                <option value="no-referrer-when-downgrade">no-referrer-when-downgrade</option>
                <option value="no-referrer">no-referrer</option>
                <option value="origin">origin</option>
                <option value="strict-origin-when-cross-origin">strict-origin-when-cross-origin</option>
              </select>
            </Field>
            <ToggleRow checked={responsive} label="Responsive wrapper" onChange={setResponsive} />
            <ToggleRow checked={lazy} label="Lazy loading" onChange={setLazy} />
            <ToggleRow checked={fullscreen} label="Allow fullscreen" onChange={setFullscreen} />
            <ToggleRow checked={sandbox} label="Sandbox iframe" onChange={setSandbox} />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={code} />
              <TextDownloadButton filename="iframe.html" text={code} />
            </>
          }
          title="Generated iframe"
        >
          <div className="mb-5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <iframe
              allowFullScreen={fullscreen}
              className="w-full rounded border border-[var(--border)] bg-white"
              height={Math.min(height, 420)}
              loading={lazy ? "lazy" : "eager"}
              referrerPolicy={referrerPolicy as IframeHTMLAttributes<HTMLIFrameElement>["referrerPolicy"]}
              sandbox={sandbox ? "allow-scripts allow-same-origin allow-popups" : undefined}
              src={normalizeUrl(url) || "about:blank"}
              title={title || "iframe preview"}
            />
          </div>
          <CodeBlock value={code} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function MetaTagTool({ tool }: { tool: UtilityToolConfig }) {
  const [title, setTitle] = useState("Free Online Image, PDF and HTML Tools");
  const [description, setDescription] = useState(
    "Use browser-based tools to convert, preview, format and clean files without uploading them.",
  );
  const [url, setUrl] = useState("https://freeconvert.in/html-to-pdf");
  const [image, setImage] = useState("https://freeconvert.in/opengraph-image");
  const [siteName, setSiteName] = useState("FreeConvert");
  const [type, setType] = useState("website");
  const [twitterHandle, setTwitterHandle] = useState("");
  const code = useMemo(
    () => buildMetaTags({ title, description, url, image, siteName, type, twitterHandle }),
    [description, image, siteName, title, twitterHandle, type, url],
  );

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Page metadata">
            <Field label="Title">
              <input className="field-input" maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} />
            </Field>
            <Field label="Description">
              <textarea className="field-input min-h-28 resize-y" maxLength={220} value={description} onChange={(event) => setDescription(event.target.value)} />
            </Field>
            <Field label="Canonical URL">
              <input className="field-input" value={url} onChange={(event) => setUrl(event.target.value)} />
            </Field>
            <Field label="Image URL">
              <input className="field-input" value={image} onChange={(event) => setImage(event.target.value)} />
            </Field>
          </ControlSection>
          <ControlSection title="Social options">
            <Field label="Site name">
              <input className="field-input" value={siteName} onChange={(event) => setSiteName(event.target.value)} />
            </Field>
            <Field label="Open Graph type">
              <select className="field-input" value={type} onChange={(event) => setType(event.target.value)}>
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </select>
            </Field>
            <Field label="Twitter handle">
              <input className="field-input" placeholder="@username" value={twitterHandle} onChange={(event) => setTwitterHandle(event.target.value)} />
            </Field>
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={code} />
              <TextDownloadButton filename="meta-tags.html" text={code} />
            </>
          }
          title="Meta tags"
        >
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <StatCard label="Title length" value={title.length} tone={title.length > 65 ? "warning" : "success"} />
            <StatCard label="Description length" value={description.length} tone={description.length > 160 ? "warning" : "success"} />
          </div>
          <div className="mb-5 grid gap-5 lg:grid-cols-2">
            <article className="rounded-lg border border-[var(--border)] bg-white p-4">
              <p className="truncate text-xs text-emerald-700">{normalizeUrl(url)}</p>
              <h3 className="mt-1 text-base font-semibold leading-6 text-blue-700">{title || "Page title"}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description || "Page description preview."}</p>
            </article>
            <article className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
              <div className="flex aspect-[1.91/1] items-center justify-center bg-[var(--surface-2)] text-xs font-bold text-[var(--muted)]">
                {image ? "Social image URL set" : "No image URL"}
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase text-[var(--muted)]">{siteName || "Website"}</p>
                <h3 className="mt-1 text-sm font-extrabold text-[var(--text)]">{title || "Page title"}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--muted)]">{description || "Page description preview."}</p>
              </div>
            </article>
          </div>
          <CodeBlock value={code} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

function CssJsTool({ tool }: { tool: UtilityToolConfig }) {
  const [language, setLanguage] = useState<"css" | "js">("css");
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [code, setCode] = useState(`.card{display:flex;gap:16px;padding:24px;background:#fff}.card h2{margin:0;color:#e5322d}`);
  const output = useMemo(
    () => (mode === "format" ? formatCodeLike(code, language) : minifyCodeLike(code, language)),
    [code, language, mode],
  );

  return (
    <UtilityToolLayout
      controls={
        <>
          <ControlSection title="Code type">
            <SegmentedChoice
              onChange={(value) => {
                setLanguage(value);
                setCode(
                  value === "css"
                    ? `.card{display:flex;gap:16px;padding:24px;background:#fff}.card h2{margin:0;color:#e5322d}`
                    : `function total(items){return items.reduce((sum,item)=>sum+item.price,0)} console.log(total([{price:10},{price:15}]))`,
                );
              }}
              options={[
                { label: "CSS", value: "css" },
                { label: "JavaScript", value: "js" },
              ]}
              value={language}
            />
            <SegmentedChoice
              onChange={setMode}
              options={[
                { label: "Format", value: "format" },
                { label: "Minify", value: "minify" },
              ]}
              value={mode}
            />
          </ControlSection>
          <ControlSection title="Input">
            <HtmlTextarea minHeight="min-h-80" value={code} onChange={setCode} />
          </ControlSection>
        </>
      }
      preview={
        <PreviewShell
          actions={
            <>
              <CopyButton value={output} />
              <TextDownloadButton filename={`output.${language}`} text={output} />
            </>
          }
          title="Output"
        >
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Input bytes" value={formatNumber(textStats(code).bytes)} />
            <StatCard label="Output bytes" value={formatNumber(textStats(output).bytes)} />
            <StatCard label="Reduction" tone={mode === "minify" ? "success" : "default"} value={`${reductionPercent(code, output)}%`} />
          </div>
          <CodeBlock value={output} />
        </PreviewShell>
      }
      tool={tool}
    />
  );
}

export function HtmlTool({ tool }: { tool: UtilityToolConfig }) {
  switch (tool.slug) {
    case "html-to-pdf":
      return <HtmlPdfTool tool={tool} />;
    case "html-viewer":
      return <HtmlViewerTool tool={tool} />;
    case "responsive-html-preview":
      return <HtmlViewerTool responsive tool={tool} />;
    case "html-formatter":
      return <HtmlFormatterTool tool={tool} />;
    case "html-minifier":
      return <HtmlFormatterTool minifier tool={tool} />;
    case "html-validator":
      return <HtmlValidatorTool tool={tool} />;
    case "html-to-markdown":
      return <HtmlMarkdownTool tool={tool} />;
    case "markdown-to-html":
      return <HtmlMarkdownTool reverse tool={tool} />;
    case "html-to-text":
      return <HtmlTextTool tool={tool} />;
    case "html-entities-encoder-decoder":
      return <HtmlEntitiesTool tool={tool} />;
    case "html-table-generator":
      return <HtmlTableTool tool={tool} />;
    case "html-to-image":
      return <HtmlImageTool tool={tool} />;
    case "iframe-generator":
      return <IframeGeneratorTool tool={tool} />;
    case "meta-tag-generator":
      return <MetaTagTool tool={tool} />;
    case "css-js-formatter-minifier":
      return <CssJsTool tool={tool} />;
    default:
      return <HtmlViewerTool tool={tool} />;
  }
}
