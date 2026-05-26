export default function LoadingScreen() {

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden relative">

      {/* Glow fundo */}
      <div className="absolute w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[140px]" />

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Spinner */}
        <div className="relative w-24 h-24">

          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>

          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-500 animate-spin"></div>

          <div className="absolute inset-3 rounded-full bg-[#020617] border border-white/10"></div>

        </div>

        {/* Texto */}
        <h2 className="mt-8 text-2xl font-bold text-white">
          Carregando sistema
        </h2>

        <p className="text-stone-400 mt-2">
          Aguarde alguns instantes...
        </p>

      </div>

    </main>
  );
}