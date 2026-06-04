export default function AdminDashboardLoading() {
  return (
    <div className="flex h-screen bg-[var(--surface)] animate-pulse">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 flex-col border-r border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)] p-4 gap-2.5">
        <div className="h-8 w-32 bg-[var(--surface-container)] rounded-xl mb-5" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-8 rounded-xl bg-[var(--surface-container)]" style={{ opacity: 1 - i * 0.06 }} />
        ))}
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)] px-6 flex items-center gap-4">
          <div className="h-5 w-36 bg-[var(--surface-container)] rounded-lg" />
          <div className="ml-auto flex gap-2">
            <div className="h-7 w-20 rounded-full bg-[var(--surface-container)]" />
            <div className="h-7 w-7 rounded-full bg-[var(--surface-container)]" />
          </div>
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="grid grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-[var(--surface-container)]" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 h-56 rounded-2xl bg-[var(--surface-container)]" />
            <div className="h-56 rounded-2xl bg-[var(--surface-container)]" />
          </div>
          <div className="h-40 rounded-2xl bg-[var(--surface-container)]" />
        </div>
      </div>
    </div>
  );
}
