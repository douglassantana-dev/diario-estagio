"use client";

import Link from "next/link";

import {
  ClipboardList,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import {
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/context/AuthContext";

export default function Sidebar() {

  const router = useRouter();

  const { user } = useAuth();

  async function sair() {

    await signOut(auth);

    router.push("/login");

  }

  return (
    <aside className="hidden md:flex w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl flex-col justify-between p-6">

      <div>

        <div className="mb-10">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
            Diário
          </h1>

          <p className="text-stone-400 mt-2 text-sm">
            Sistema escolar
          </p>

        </div>

        {/* USER */}
        <div className="mb-8 bg-black/20 border border-white/10 rounded-2xl p-4">

          <p className="text-xs text-stone-500 mb-1">
            Usuário logado
          </p>

          <p className="text-sm font-medium text-white break-all">
            {user?.email}
          </p>

        </div>

        <nav className="space-y-3">

          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <ClipboardList size={20} />
            Nova Observação
          </Link>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/relatorios"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <FileText size={20} />
            Relatórios
          </Link>

          <Link
            href="/configuracoes"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <Settings size={20} />
            Configurações
          </Link>

        </nav>

      </div>

      {/* LOGOUT */}
      <button
        onClick={sair}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-red-300"
      >

        <LogOut size={18} />

        Sair

      </button>

    </aside>
  );
}