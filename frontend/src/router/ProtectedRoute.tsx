import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import vcfShield from "../assets/EscudoValenciaCF.png";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={vcfShield}
            alt="Valencia CF"
            className="w-20 h-20 object-contain"
          />
          <div className="absolute inset-0 -m-4 rounded-full border-4 border-vcf-orange/20 border-t-vcf-orange animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-vcf-orange animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = user.role?.toLowerCase() === "admin";

  if (adminOnly && !isAdmin) {
    console.warn("Acceso denegado: No eres admin", user);
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
