export default function Loading() {
  return (
    <div className="h-full flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sidebar-border pb-6">
        <div>
          <div className="h-8 w-32 bg-sidebar-border rounded mb-2"></div>
          <div className="h-8 w-48 bg-sidebar-border rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-[54px] w-64 bg-sidebar-border rounded-lg"></div>
          <div className="h-[54px] w-[120px] bg-sidebar-border rounded-lg"></div>
          <div className="h-[54px] w-[140px] bg-sidebar-border rounded-lg"></div>
        </div>
      </div>

      {/* Table Container Skeleton */}
      <div className="flex-1 bg-card rounded-xl border border-card-border flex flex-col overflow-hidden">
        <div className="bg-[#1a1a1a] h-12 w-full border-b border-sidebar-border"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full border-b border-sidebar-border/50 flex items-center px-6 gap-6">
            <div className="h-10 w-10 bg-sidebar-border rounded-lg shrink-0"></div>
            <div className="h-4 w-32 bg-sidebar-border rounded"></div>
            <div className="h-4 w-24 bg-sidebar-border rounded ml-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
