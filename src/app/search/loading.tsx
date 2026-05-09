export default function SearchLoading() {
  return (
    <main className="mx-auto min-h-[calc(100vh-64px)] max-w-7xl px-4 py-12 sm:px-6">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto h-5 w-20 rounded bg-[var(--surface-3)]" />
        <div className="mx-auto mt-4 h-12 w-full max-w-xl rounded bg-[var(--surface-3)]" />
        <div className="mx-auto mt-4 h-6 w-full max-w-2xl rounded bg-[var(--surface-3)]" />
        <div className="mt-8 h-20 rounded-2xl border border-[var(--border)] bg-white shadow-sm" />
      </section>
      <section className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
        <div className="h-56 rounded-2xl border border-[var(--border)] bg-white shadow-sm" />
        <div className="h-56 rounded-2xl border border-[var(--border)] bg-white shadow-sm" />
      </section>
    </main>
  );
}
