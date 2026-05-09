"use client";

import { useEffect } from "react";

export default function Error({
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
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-semibold text-[var(--accent)]">Error</p>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--text)]">
        Something went wrong
      </h1>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        {error.message || "An unexpected error occurred. Your files were not affected."}
      </p>
      {retry ? (
        <button className="button-primary mt-8" type="button" onClick={() => retry()}>
          Try again
        </button>
      ) : null}
    </main>
  );
}
