"use client";

import "./globals.css";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <html lang="en-IN">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 py-16 text-center text-[var(--text)]">
          <p className="text-sm font-semibold text-[var(--accent)]">Error</p>
          <h1 className="mt-4 text-3xl font-extrabold">
            Something went wrong
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
            {error.message ||
              "An unexpected error occurred. Your files were not affected."}
          </p>
          {retry ? (
            <button
              className="button-primary mt-8"
              type="button"
              onClick={() => retry()}
            >
              Try again
            </button>
          ) : null}
        </main>
      </body>
    </html>
  );
}
