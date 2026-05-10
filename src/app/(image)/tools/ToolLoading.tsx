export default function ToolLoading() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr]">
      <aside className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-28 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-44 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-32 animate-pulse rounded bg-[var(--surface-2)]" />
      </aside>
      <section className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-[460px] animate-pulse rounded bg-[var(--surface-2)]" />
      </section>
    </main>
  );
}
