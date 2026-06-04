export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--surface)] flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 flex-col border-r border-[var(--outline-variant)]/60 bg-[var(--surface-container-low)] p-4 gap-3">
        <div className="h-10 w-32 bg-[var(--surface-container)] rounded-xl animate-pulse mb-4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-[var(--surface-container)] animate-pulse" style={{ opacity: 1 - i * 0.08 }} />
        ))}
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 p-6 space-y-5">
        <div className="h-10 w-48 bg-[var(--surface-container)] rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[var(--surface-container)] animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-[var(--surface-container)] animate-pulse" />
        <div className="h-40 rounded-2xl bg-[var(--surface-container)] animate-pulse" />
      </div>
    </div>
  );
}
