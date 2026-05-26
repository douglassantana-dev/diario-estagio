"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Sparkles, Copy, Check, FileText } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function RelatorioIAPage() {
  const [relatorio, setRelatorio] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);

  async function gerarRelatorio() {
    setCarregando(true);
    setErro("");
    setRelatorio("");
    setCopiado(false);

    try {
      // 1. Busca os dados no Firebase pelo navegador (que está logado e autorizado)
      const q = query(collection(db, "observacoes"), orderBy("data", "asc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Nenhuma observação encontrada no banco de dados para basear o relatório.");
      }

      // 2. Formata os dados
      const historicoEstagio = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return `Turma/Local: ${data.turma} | Categoria: ${data.categoria}\nRelato: ${data.relato}\nImagens: ${data.fotosUrls?.join(", ") || "Nenhuma"}\n---`;
        })
        .join("\n");

      // 3. Envia os dados formatados para a IA no servidor
      const res = await fetch("/api/gerar-relatorio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ historico: historicoEstagio }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || "Falha ao gerar o relatório.");
      }

      setRelatorio(data.relatorio);
    } catch (err: any) {
      console.error(err);
      setErro(err.message || "Ocorreu um erro ao comunicar com a IA.");
    } finally {
      setCarregando(false);
    }
  }

  function copiarTexto() {
    if (!relatorio) return;
    navigator.clipboard.writeText(relatorio);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#020617] text-white flex">
        <Sidebar />

        <section className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Sparkles className="text-purple-400 animate-pulse" />
              Relatório Final com IA
            </h1>
            <p className="text-stone-400 mt-2">
              A inteligência artificial irá analisar todas as observações salvas no Firebase para estruturar o seu relatório acadêmico automaticamente.
            </p>
          </div>

          <div className="space-y-6 max-w-5xl">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Pronto para consolidar os dados?</h3>
                <p className="text-sm text-stone-400 mt-1">
                  Certifique-se de que já registou todas as turmas, documentos e relatos necessários antes de iniciar.
                </p>
              </div>

              <button
                onClick={gerarRelatorio}
                disabled={carregando}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.99] disabled:scale-100 disabled:opacity-50 transition-all text-white font-semibold px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 whitespace-nowrap"
              >
                {carregando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Analisando evidências...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Gerar Relatório Académico
                  </>
                )}
              </button>
            </div>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-5 rounded-2xl text-sm">
                ⚠️ {erro}
              </div>
            )}

            {relatorio && (
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-300 font-medium">
                    <FileText size={18} />
                    Documento Gerado (Formato Markdown)
                  </div>

                  <button
                    onClick={copiarTexto}
                    className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all font-medium text-stone-300"
                  >
                    {copiado ? (
                      <>
                        <Check size={14} className="text-green-400" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copiar Texto
                      </>
                    )}
                  </button>
                </div>

                <div className="p-8 overflow-x-auto selection:bg-purple-500/30">
                  <pre className="text-stone-200 font-sans whitespace-pre-wrap leading-relaxed text-base tracking-wide border-0 bg-transparent p-0">
                    {relatorio}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}