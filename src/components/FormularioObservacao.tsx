"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UploadCloud } from "lucide-react";

interface FormularioEstagio {
  turma: string;
  categoria: string;
  observacao: string;
  imagens: File[];
}

export default function FormularioObservacao() {
  const [dados, setDados] = useState<FormularioEstagio>({
    turma: "",
    categoria: "",
    observacao: "",
    imagens: [],
  });

  const [carregando, setCarregando] = useState(false);

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

  const salvarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      let imagensUrls: string[] = [];

     if (dados.imagens.length > 0) {

  for (const imagem of dados.imagens) {

    const formData = new FormData();

    formData.append("image", imagem);

    const imgRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const imgData = await imgRes.json();

    if (imgData.success) {

      imagensUrls.push(imgData.data.url);

    } else {

      throw new Error(
        "Erro ao enviar imagem"
      );
    }
  }
}

      await addDoc(collection(db, "observacoes"), {
        turma: dados.turma,
        categoria: dados.categoria,
        relato: dados.observacao,
        fotosUrls: imagensUrls,
        data: serverTimestamp(),
      });

      alert("Observação salva com sucesso!");

      setDados({
        turma: "",
        categoria: "",
        observacao: "",
        imagens: [],
      });

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">

      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Nova Observação
        </h2>

        <p className="text-stone-400 mt-2">
          Registre experiências, comportamentos e acontecimentos importantes.
        </p>
      </div>

      <form onSubmit={salvarRegistro} className="space-y-6">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* TURMA */}
          <div>
            <label className="block mb-2 text-sm text-stone-300">
              Turma
            </label>

            <select
              required
              value={dados.turma}
              onChange={(e) =>
                setDados({ ...dados, turma: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-rose-500 transition-all"
            >
              <option value="">Selecione a turma</option>
              <option value="4ano">4º Ano</option>
              <option value="5ano">5º Ano</option>
              <option value="6ano">6º Ano</option>
              <option value="7ano">7º Ano</option>
              <option value="8ano">8º Ano</option>
              <option value="9ano">9º Ano</option>
            </select>
          </div>

          {/* CATEGORIA */}
          <div>
            <label className="block mb-2 text-sm text-stone-300">
              Categoria
            </label>

            <select
              required
              value={dados.categoria}
              onChange={(e) =>
                setDados({ ...dados, categoria: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-rose-500 transition-all"
            >
              <option value="">Selecione a categoria</option>
              <option value="metodologia">Metodologia</option>
              <option value="comportamento">Comportamento</option>
              <option value="gestao">Gestão de Sala</option>
              <option value="inclusao">Inclusão</option>
            </select>
          </div>

        </div>

        {/* TEXTO */}
        <div>
          <label className="block mb-2 text-sm text-stone-300">
            Relato da Experiência
          </label>

          <textarea
            rows={6}
            required
            value={dados.observacao}
            onChange={(e) =>
              setDados({ ...dados, observacao: e.target.value })
            }
            placeholder="Descreva o que aconteceu durante a observação..."
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-4 outline-none resize-none focus:border-rose-500 transition-all"
          />
        </div>

        {/* UPLOAD */}
        <div>
          <label className="block mb-3 text-sm text-stone-300">
            Anexar Imagem
          </label>

          <label className="border-2 border-dashed border-white/10 rounded-3xl h-60 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 transition-all bg-black/10">

            <UploadCloud size={50} className="text-stone-400 mb-4" />

            <p className="text-lg font-medium">
              Clique para enviar
            </p>

            <p className="text-stone-500 mt-2 text-sm">
              ou arraste uma imagem aqui
            </p>

            <p className="text-xs text-stone-500 mt-8">
              Atenção com rostos de alunos (LGPD)
            </p>

            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={(e) => {

  if (e.target.files) {

    setDados({
      ...dados,
      imagens: Array.from(e.target.files),
    });

  }
}}
            />
          </label>

          {dados.imagens.length > 0 && (

  <div className="mt-4 space-y-2">

    {dados.imagens.map((img, index) => (

      <div
        key={index}
        className="text-sm text-rose-400 font-medium"
      >
        📷 {img.name}
      </div>

    ))}

  </div>

)}
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:scale-[1.01] transition-all rounded-2xl py-5 text-lg font-semibold shadow-lg shadow-rose-500/20"
        >
          {carregando
            ? "Enviando..."
            : "Salvar Observação"}
        </button>

      </form>
    </div>
  );
}