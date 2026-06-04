export default function UserDashboardLoading() {
  return (
    <div className="flex h-screen bg-[var(--surface)] animate-pulse">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 flex-col border-r border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)] p-4 gap-2.5">
        <div className="h-8 w-28 bg-[var(--surface-container)] rounded-xl mb-5" />
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-9 rounded-xl bg-[var(--surface-container)]" style={{ opacity: 1 - i * 0.08 }} />
        ))}
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)] px-6 flex items-center gap-4">
          <div className="h-5 w-40 bg-[var(--surface-container)] rounded-lg" />
          <div className="ml-auto h-8 w-8 rounded-full bg-[var(--surface-container)]" />
        </div>
        <div className="flex-1 p-6 space-y-5">
          <div className="h-8 w-52 bg-[var(--surface-container)] rounded-xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[var(--surface-container)]" />
            ))}
          </div>
          <div className="h-48 rounded-2xl bg-[var(--surface-container)]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-36 rounded-2xl bg-[var(--surface-container)]" />
            <div className="h-36 rounded-2xl bg-[var(--surface-container)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
