import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Si está cargando la sesión inicial, mostramos un spinner o nada
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-vcf-orange">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-vcf-orange"></div>
      </div>
    );
  }

  // 2. Si no está autenticado, lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Validación de Admin
  // Asumiendo que en tu base de datos el rol se guarda como 'admin'
  const isAdmin = user?.role === 'admin';

  if (adminOnly && !isAdmin) {
    console.warn("Acceso denegado: Se requiere rol de administrador");
    return <Navigate to="/home" replace />;
  }

  // 4. Si todo es correcto, renderiza las rutas hijas
  return <Outlet />;
}