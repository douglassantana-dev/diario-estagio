"use client";

import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");

  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(e: React.FormEvent) {

    e.preventDefault();

    setErro("");

    setCarregando(true);

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      router.push("/dashboard");

    } catch (error: any) {

      console.error(error);

      setErro("Email ou senha inválidos");

    } finally {

      setCarregando(false);

    }
  }

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-white">
            Login
          </h1>

          <p className="text-stone-400 mt-3">
            Acesse o sistema de estágio
          </p>

        </div>

        <form
          onSubmit={fazerLogin}
          className="space-y-5"
        >

          <div>

            <label className="block text-sm text-stone-300 mb-2">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-rose-500"
              placeholder="Digite seu email"
            />

          </div>

          <div>

            <label className="block text-sm text-stone-300 mb-2">
              Senha
            </label>

            <input
              type="password"
              required
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-rose-500"
              placeholder="Digite sua senha"
            />

          </div>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-4 text-sm">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl py-4 font-semibold text-white hover:scale-[1.01] transition-all"
          >

            {carregando
              ? "Entrando..."
              : "Entrar"}

          </button>

        </form>

      </div>
    </main>
  );
}