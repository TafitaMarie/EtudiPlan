"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Wallet,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Search,
  Settings,
  ChevronDown,
  User,
} from "lucide-react";
import { useTheme } from "@/app/contexts/themeProvider";
import Logo from "./Logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/emploi_du_temp", label: "Emploi du temps", icon: Calendar },
  { href: "/taches", label: "Tâches", icon: ListTodo },
  { href: "/budget", label: "Budget", icon: Wallet },

  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data && setUserName(data.name || data.email));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      <button
        onClick={() => setOuvert(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-card border border-card-border rounded-xl p-2 shadow-sm"
        aria-label="Ouvrir le menu"
      >
        <Menu size={22} className="text-foreground" />
      </button>

      {ouvert && (
        <div
          onClick={() => setOuvert(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-dvh w-64 bg-card border-r border-sidebar-border
          p-6 z-50 transform transition-transform duration-200 flex flex-col
          ${ouvert ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" onClick={() => setOuvert(false)}>
            <Logo />
          </Link>
          <button
            onClick={() => setOuvert(false)}
            className="md:hidden text-muted-foreground"
            aria-label="Fermer le menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const actif = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOuvert(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      actif
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border pt-4 space-y-2">
          {/* Profil */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors w-full"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <span className="flex-1 truncate text-left">{userName || "Utilisateur"}</span>
              <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-card-border rounded-xl shadow-lg p-1">
                <Link
                  href="/parametres"
                  onClick={() => { setOuvert(false); setUserMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
                >
                  <Settings size={16} />
                  Paramètres
                </Link>
                <button
                  onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Mode clair" : "Mode sombre"}
          </button>
        </div>
      </aside>
    </>
  );
}
