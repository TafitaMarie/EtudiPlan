"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/app/components/layout/Logo";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur");
        return;
      }

      setSent(true);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <Logo className="h-8 w-auto" />
        </Link>

        <div className="rounded-2xl bg-card border border-card-border p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                <CheckCircle size={24} />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Email envoyé</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
                Vérifie la console du serveur pour le token.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-foreground">Mot de passe oublié</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Saisis ton email pour recevoir un lien de réinitialisation.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <div className="relative mt-1.5">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="exemple@mail.com"
                      required
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
                  {loading ? "Envoi..." : "Envoyer"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  <ArrowLeft size={14} />
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
