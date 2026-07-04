"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Wallet,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/emploi_du_temp", label: "Emploi du temps", icon: Calendar },
  { href: "/taches", label: "Tâches", icon: ListTodo },
  { href: "/budget", label: "Budget", icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);

  return (
    <>
      {/* Bouton menu, visible uniquement sur mobile */}
      <button
        onClick={() => setOuvert(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
      >
        <Menu size={22} className="text-gray-700" />
      </button>

      {/* Fond sombre derrière le menu mobile ouvert */}
      {ouvert && (
        <div
          onClick={() => setOuvert(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-100
          p-6 z-50 transform transition-transform duration-200
          ${ouvert ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-600">
            ÉtudiPlan
          </h1>
          <button
            onClick={() => setOuvert(false)}
            className="md:hidden text-gray-400"
          >
            <X size={22} />
          </button>
        </div>

        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const actif = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOuvert(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      actif
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
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
      </aside>
    </>
  );
}