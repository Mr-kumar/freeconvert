"use client";

import { ArrowDown, ArrowUp, CheckSquare, RotateCw, Square } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PDFPageGridProps {
  totalPages: number;
  thumbnails: string[];
  selectedPages?: number[];
  pageOrder?: number[];
  rotations?: Record<number, number>;
  reorderMode?: boolean;
  onSelectedPagesChange?: (pages: number[]) => void;
  onPageOrderChange?: (order: number[]) => void;
}

export function PDFPageGrid({
  totalPages,
  thumbnails,
  selectedPages = [],
  pageOrder,
  rotations,
  reorderMode = false,
  onSelectedPagesChange,
  onPageOrderChange,
}: PDFPageGridProps) {
  const orderedPages =
    pageOrder && pageOrder.length > 0
      ? pageOrder
      : Array.from({ length: totalPages }, (_, index) => index + 1);
  const selectedSet = new Set(selectedPages);

  function toggle(page: number) {
    if (!onSelectedPagesChange) {
      return;
    }

    onSelectedPagesChange(
      selectedSet.has(page)
        ? selectedPages.filter((item) => item !== page)
        : [...selectedPages, page].sort((a, b) => a - b),
    );
  }

  function move(from: number, to: number) {
    if (!onPageOrderChange || to < 0 || to >= orderedPages.length) {
      return;
    }

    const next = [...orderedPages];
    const [item] = next.splice(from, 1);

    if (!item) {
      return;
    }

    next.splice(to, 0, item);
    onPageOrderChange(next);
  }

  if (!totalPages) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-6 text-center text-sm text-[var(--muted)]">
        Upload a PDF to see pages.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {onSelectedPagesChange ? (
        <div className="flex flex-wrap gap-2">
          <button
            className="segmented-button"
            type="button"
            onClick={() => onSelectedPagesChange(orderedPages)}
          >
            Select all
          </button>
          <button
            className="segmented-button"
            type="button"
            onClick={() => onSelectedPagesChange([])}
          >
            Clear
          </button>
          <button
            className="segmented-button"
            type="button"
            onClick={() =>
              onSelectedPagesChange(orderedPages.filter((page) => page % 2 === 0))
            }
          >
            Even
          </button>
          <button
            className="segmented-button"
            type="button"
            onClick={() =>
              onSelectedPagesChange(orderedPages.filter((page) => page % 2 === 1))
            }
          >
            Odd
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {orderedPages.map((page, index) => {
          const selected = selectedSet.has(page);
          const rotation = rotations?.[page] || 0;

          return (
            <article
              className={cn(
                "overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm",
                selected ? "border-[var(--accent)]" : "border-[var(--border)]",
              )}
              key={`${page}-${index}`}
            >
              <button
                className="block w-full bg-[var(--surface-2)] p-2 text-left"
                type="button"
                onClick={() => toggle(page)}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                  {thumbnails[page - 1] ? (
                    <Image
                      alt={`Page ${page}`}
                      className="object-contain transition-transform"
                      fill
                      sizes="180px"
                      src={thumbnails[page - 1]}
                      style={{ transform: `rotate(${rotation}deg)` }}
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-[var(--surface-3)]" />
                  )}
                  {onSelectedPagesChange ? (
                    <span className="absolute left-2 top-2 rounded-md bg-white/90 p-1 text-[var(--accent)] shadow-sm">
                      {selected ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </span>
                  ) : null}
                  {rotation ? (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 font-mono text-[10px] font-bold text-[var(--accent)] shadow-sm">
                      <RotateCw className="h-3 w-3" />
                      {rotation}°
                    </span>
                  ) : null}
                </div>
              </button>
              <div className="flex items-center justify-between gap-2 p-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--text)]">
                    Page {page}
                  </p>
                  {reorderMode ? (
                    <p className="text-[10px] font-semibold text-[var(--muted)]">
                      Now {index + 1}
                    </p>
                  ) : null}
                </div>
                {reorderMode ? (
                  <div className="flex gap-1">
                    <button
                      aria-label="Move page up"
                      className="icon-button h-8 w-8"
                      disabled={index === 0}
                      type="button"
                      onClick={() => move(index, index - 1)}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label="Move page down"
                      className="icon-button h-8 w-8"
                      disabled={index === orderedPages.length - 1}
                      type="button"
                      onClick={() => move(index, index + 1)}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
