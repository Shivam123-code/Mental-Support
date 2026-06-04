export default function VendorDashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--surface)] animate-pulse">
      {/* Top nav */}
      <div className="h-14 border-b border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)] px-6 flex items-center gap-3">
        <div className="h-6 w-6 rounded-lg bg-[var(--surface-container)]" />
        <div className="h-5 w-36 bg-[var(--surface-container)] rounded-lg" />
        <div className="ml-auto flex gap-3">
          <div className="h-8 w-24 rounded-xl bg-[var(--surface-container)]" />
          <div className="h-8 w-8 rounded-full bg-[var(--surface-container)]" />
        </div>
      </div>
      {/* Cards */}
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="h-32 rounded-2xl bg-[var(--surface-container)]" />
        <div className="h-24 rounded-2xl bg-[var(--surface-container)]" />
        <div className="h-48 rounded-2xl bg-[var(--surface-container)]" />
        <div className="h-32 rounded-2xl bg-[var(--surface-container)]" />
      </div>
    </div>
  );
}
