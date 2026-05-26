import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ConfiguracoesPage() {
  return (
     <ProtectedRoute>
    <main className="min-h-screen bg-[#020617] text-white flex">

      <Sidebar />

      <section className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Configurações
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <p className="text-stone-400">
            Configurações do sistema futuramente.
          </p>

        </div>

      </section>
    </main>
    </ProtectedRoute>
  );
}