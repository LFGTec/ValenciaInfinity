import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // MIENTRAS ESTÉ CARGANDO, NO RENDERIZAS NADA O UN SPINNER
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Verificando credenciales...</div>;
  }

  // SI YA NO CARGA Y NO HAY USUARIO
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // VALIDACIÓN DE ROL
  const isAdmin = user.role?.toLowerCase() === 'admin';

  if (adminOnly && !isAdmin) {
    console.warn("Acceso denegado: No eres admin", user);
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}