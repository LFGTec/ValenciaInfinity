import { useAtom } from "jotai";
import AppRoutes from "./router/AppRoutes";
import { AuthProvider } from "./providers/AuthProvider";
import { loadingAtom } from "./stores/authStore";
import vcfShield from "./assets/EscudoValenciaCF.png";

function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading] = useAtom(loadingAtom);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <img
          src={vcfShield}
          alt="Valencia CF"
          className="w-24 h-24 object-contain opacity-90"
        />
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-vcf-orange rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 bg-vcf-orange rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 bg-vcf-orange rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function App() {
  return (
    <AuthProvider>
      <AppLoader>
        <AppRoutes />
      </AppLoader>
    </AuthProvider>
  );
}
