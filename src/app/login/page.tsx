"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/app/components/layout/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <Logo className="h-8 w-auto" />
        </Link>

        <div className="rounded-2xl bg-card border border-card-border p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connecte-toi pour accéder à ton tableau de bord.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="exemple@mail.com"
                className="mt-2 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Mot de passe</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Se connecter
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link href="/mot-de-passe-oublie" className="text-muted-foreground hover:text-foreground transition-colors">
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas de compte ?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Créer un compte
            </Link>
          </p>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Retour à l&rsquo;accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
