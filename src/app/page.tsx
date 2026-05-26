import FormularioObservacao from "@/components/FormularioObservacao";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
     <ProtectedRoute>
    <main className="min-h-screen bg-[#020617] text-white flex">

      <Sidebar />

      <section className="flex-1 p-6 md:p-10 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-5xl mx-auto">

          <header className="mb-10">
            <h1 className="text-4xl font-bold">
              Diário de Estágio
            </h1>

            <p className="text-stone-400 mt-3">
              Registro e acompanhamento de observações escolares.
            </p>
          </header>

          <FormularioObservacao />

        </div>
      </section>
    </main>
    </ProtectedRoute>
  );
}