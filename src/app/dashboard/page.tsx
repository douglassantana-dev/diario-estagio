"use client";

import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Observacao {
  id: string;
  turma: string;
  categoria: string;
  relato: string;
}

export default function DashboardPage() {

  const [dados, setDados] = useState<Observacao[]>([]);

  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {

    async function carregar() {

      const q = query(
        collection(db, "observacoes"),
        orderBy("data", "desc")
      );

      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Observacao[];

      setDados(docs);

      const mapa: any = {};

      docs.forEach((item) => {
        mapa[item.categoria] =
          (mapa[item.categoria] || 0) + 1;
      });

      const resultado = Object.keys(mapa).map((key) => ({
        name: key,
        value: mapa[key],
      }));

      setCategorias(resultado);
    }

    carregar();

  }, []);

  const COLORS = [
    "#f43f5e",
    "#3b82f6",
    "#8b5cf6",
    "#14b8a6",
  ];

  return (
     <ProtectedRoute>
    <main className="min-h-screen bg-[#020617] text-white flex">

      <Sidebar />

      <section className="flex-1 p-8">

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-stone-400 mt-2">
            Visão geral das observações registradas.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-stone-400">
              Total de Observações
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {dados.length}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-stone-400">
              Categorias
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {categorias.length}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-stone-400">
              Última Turma
            </p>

            <h2 className="text-3xl font-bold mt-4">
              {dados[0]?.turma || "-"}
            </h2>
          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* GRÁFICO */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-[500px]">

            <h2 className="text-2xl font-semibold mb-8">
              Categorias
            </h2>

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={categorias}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={140}
                  label
                >

                  {categorias.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* ÚLTIMAS OBSERVAÇÕES */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-2xl font-semibold mb-8">
              Últimas Observações
            </h2>

            <div className="space-y-5">

              {dados.slice(0, 5).map((item) => (

                <div
                  key={item.id}
                  className="border border-white/10 rounded-2xl p-4 bg-black/20"
                >

                  <div className="flex gap-3 mb-3">

                    <span className="bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-sm">
                      {item.turma}
                    </span>

                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {item.categoria}
                    </span>

                  </div>

                  <p className="text-stone-300 line-clamp-3">
                    {item.relato}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>
    </main>
    </ProtectedRoute>
  );
}