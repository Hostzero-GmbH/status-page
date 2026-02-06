export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header skeleton */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-[150px] animate-pulse rounded bg-muted" />
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="hidden h-4 w-24 animate-pulse rounded bg-muted sm:block" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
            <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {/* Status banner skeleton */}
        <div className="mb-8">
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Service groups skeleton */}
        <div className="mb-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>

        {/* Incidents skeleton */}
        <div>
          <div className="mb-6 h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="mb-3 h-5 w-44 animate-pulse rounded bg-muted" />
                <div className="rounded-lg border border-border bg-muted/30 px-5 py-4">
                  <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
      </footer>
    </div>
  )
}
