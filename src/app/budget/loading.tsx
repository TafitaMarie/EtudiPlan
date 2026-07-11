export default function BudgetLoading() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-muted rounded-xl" />
        <div className="h-4 w-56 bg-muted rounded-lg" />
      </div>
      <div className="h-48 bg-card rounded-2xl border border-card-border" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-card rounded-2xl border border-card-border" />
        ))}
      </div>
      <div className="h-64 bg-card rounded-2xl border border-card-border" />
    </div>
  );
}
