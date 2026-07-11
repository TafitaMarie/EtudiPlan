export default function TachesLoading() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted rounded-xl" />
        <div className="h-4 w-48 bg-muted rounded-lg" />
      </div>
      <div className="h-64 bg-card rounded-2xl border border-card-border" />
      <div className="h-96 bg-card rounded-2xl border border-card-border" />
    </div>
  );
}
