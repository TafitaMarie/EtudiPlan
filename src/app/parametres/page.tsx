"use client";

import AppLayout from "@/app/components/layout/appLayout";
import { useState, useEffect } from "react";
import { useToast } from "@/app/contexts/toastProvider";
import { Settings, User, Mail, Lock, Save, Send, CheckCircle, ExternalLink } from "lucide-react";

export default function Parametres() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifySending, setVerifySending] = useState(false);
  const [verifyLink, setVerifyLink] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setName(data.name || "");
          setEmail(data.email || "");
          setVerified(data.verified || false);
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        addToast(data.error || "Erreur lors de la mise à jour", "error");
        return;
      }

      addToast("Profil mis à jour avec succès", "success");
      setPassword("");
    } catch {
      addToast("Erreur réseau", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setVerifySending(true);
    setVerifyLink("");
    try {
      const res = await fetch("/api/auth/send-verification", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setVerifyLink(data.link || "");
        addToast("Lien de vérification généré", "info");
      } else {
        addToast(data.error || "Erreur", "error");
      }
    } catch {
      addToast("Erreur réseau", "error");
    } finally {
      setVerifySending(false);
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Settings className="text-primary" size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Gère ton profil et tes informations</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email verification */}
        <div className="rounded-2xl bg-card border border-card-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Mail size={18} /> Email
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">{email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {verified ? "Vérifié" : "Non vérifié"}
              </p>
            </div>
            {verified ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                <CheckCircle size={14} /> Vérifié
              </span>
            ) : (
              <button
                onClick={handleVerify}
                disabled={verifySending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 text-primary px-4 py-2 text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <Send size={14} />
                {verifySending ? "Envoi..." : "Vérifier"}
              </button>
            )}
          </div>
          {verifyLink && (
            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-2">Clique ici pour vérifier ton email :</p>
              <a
                href={verifyLink}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline break-all"
              >
                <ExternalLink size={14} /> {verifyLink}
              </a>
            </div>
          )}
        </div>

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-card-border p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User size={18} /> Informations personnelles
          </h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Ton nom"
                className="w-full rounded-xl border border-card-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="exemple@mail.com"
                className="w-full rounded-xl border border-card-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nouveau mot de passe (optionnel)</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Laisser vide pour ne pas changer"
                className="w-full rounded-xl border border-card-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
