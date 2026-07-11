"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="rounded-2xl bg-card p-8 shadow-sm border border-card-border max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive text-2xl font-bold">
          !
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Une erreur est survenue
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || "Quelque chose s'est mal passé. Réessaie."}
        </p>
        <button
          onClick={reset}
          className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
