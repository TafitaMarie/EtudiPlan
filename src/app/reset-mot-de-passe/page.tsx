"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Logo from "@/app/components/layout/Logo";
import { Lock, CheckCircle } from "lucide-react";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur");
        return;
      }

      setDone(true);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Lock size={24} />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Lien invalide</h1>
        <p className="mt-2 text-sm text-muted-foreground">Aucun token de réinitialisation fourni.</p>
        <Link href="/mot-de-passe-oublie" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
          <CheckCircle size={24} />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Mot de passe modifié</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tu peux maintenant te connecter avec ton nouveau mot de passe.</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground">Nouveau mot de passe</h1>
      <p className="mt-2 text-sm text-muted-foreground">Saisis ton nouveau mot de passe.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">Nouveau mot de passe</label>
          <div className="relative mt-1.5">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl border border-card-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Confirmer le mot de passe</label>
          <div className="relative mt-1.5">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl border border-card-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Réinitialisation..." : "Réinitialiser"}
        </button>
      </form>
    </>
  );
}

export default function ResetMotDePasse() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="rounded-2xl bg-card border border-card-border p-8 shadow-sm">
          <Suspense fallback={<p className="text-center text-muted-foreground">Chargement...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
