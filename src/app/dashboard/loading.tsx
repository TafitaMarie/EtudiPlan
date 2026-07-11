export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded-xl" />
        <div className="h-4 w-64 bg-muted rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-card rounded-2xl border border-card-border" />
        ))}
      </div>
      <div className="h-48 bg-card rounded-2xl border border-card-border" />
      <div className="h-32 bg-card rounded-2xl border border-card-border" />
      <div className="h-48 bg-card rounded-2xl border border-card-border" />
      <div className="h-24 bg-card rounded-2xl border border-card-border" />
    </div>
  );
}
