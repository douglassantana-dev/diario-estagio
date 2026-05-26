"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { useEffect, useState } from "react";

interface Observacao {
  id: string;
  turma: string;
  categoria: string;
  relato: string;
  fotoUrl?: string;
}

export default function RelatoriosPage() {
  const [dados, setDados] = useState<Observacao[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const q = query(
          collection(db, "observacoes"),
          orderBy("data", "desc")
        );

        const snapshot = await getDocs(q);

        const lista: Observacao[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Observacao[];

        setDados(lista);

      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const filtrados = dados.filter((item) =>
    item.relato.toLowerCase().includes(busca.toLowerCase()) ||
    item.turma.toLowerCase().includes(busca.toLowerCase()) ||
    item.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
     <ProtectedRoute>
    <main className="min-h-screen bg-[#020617] text-white flex">

      <Sidebar />

      <section className="flex-1 p-8">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Relatórios
          </h1>

          <p className="text-stone-400 mt-2">
            Histórico completo das observações.
          </p>

        </div>

        {/* BUSCA */}
        <input
          type="text"
          placeholder="Buscar observações..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-8 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-rose-500"
        />

        {/* LISTA */}
        <div className="space-y-6">

          {carregando && (
            <p className="text-stone-400">
              Carregando observações...
            </p>
          )}

          {!carregando && filtrados.length === 0 && (
            <p className="text-stone-400">
              Nenhuma observação encontrada.
            </p>
          )}

          {filtrados.map((item) => (

            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6"
            >

              <div className="flex flex-wrap gap-3 mb-4">

                <span className="bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-sm">
                  {item.turma}
                </span>

                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                  {item.categoria}
                </span>

              </div>

              <p className="text-stone-200 leading-relaxed">
                {item.relato}
              </p>

              {item.fotoUrl && (
                <img
                  src={item.fotoUrl}
                  alt="Imagem da observação"
                  className="mt-6 rounded-2xl border border-white/10 max-h-96 object-cover"
                />
              )}

            </div>

          ))}

        </div>

      </section>
    </main>
    </ProtectedRoute>
  );
}