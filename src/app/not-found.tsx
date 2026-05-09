import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl flex-col justify-center px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold text-[var(--accent)]">404</p>
      <h1 className="mt-4 font-display text-5xl font-extrabold text-[var(--text)]">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">
        The requested page is not available.
      </p>
      <Link className="button-primary mt-8 w-fit" href="/">
        Open tools
      </Link>
    </main>
  );
}
