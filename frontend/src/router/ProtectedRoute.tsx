/*
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
*/

// TEMPORAL: ProtectedRoute desactivado para poder visualizar rutas de administrador.
// TODO: Reactivar la validación de usuario y rol cuando se corrija useAuth / roles.

import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  console.warn("ProtectedRoute temporalmente desactivado. Acceso permitido.", {
    adminOnly,
  });

  return <Outlet />;
}