import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="rounded-2xl bg-card p-8 shadow-sm border border-card-border max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground text-2xl font-bold">
          ?
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Page introuvable
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          La page que tu cherches n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
