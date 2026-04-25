import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainsLayout";
import ProtectedRoute from "./ProtectedRoute";

// Páginas
import HomePage from "../pages/HomePage";
import { TeamPage }from "../pages/TeamPage";
import { MatchesPage } from "../pages/MatchesPage";
import {News} from "../pages/News";
import { FansZonePage } from "../pages/FansZonePage";
import LogIn from "../pages/LogIn";
import { UserProfile} from "../components/features/UserProfile"

import SignUp from "../pages/SignUp";
import AuthCallback from "../pages/AuthCallback";
import ForgotPassword from "../pages/ForgotPassword";
import {Juego} from "../pages/Juego";
import { NouMestellaPage } from "../pages/NouMestellaPage";

import { ManageCards } from "@/pages/AdminViews/ManageCards";
import  AdminLayout  from "@/layouts/AdminLayout"
import { VirtualWorld } from "@/components/VirtualWorld.tsx";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas sin Layout (Login/Signup) */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Rutas con MainLayout (Header/Footer del Wireframe) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/nou-mestalla" element={<NouMestellaPage/>} />
        
        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/fanzone" element={<FansZonePage />} />
          {/*Rutas dentro de FAN ZONE*/}
          <Route path="/virtual-world" element={<VirtualWorld />} />

          <Route path="/profile" element={<UserProfile />} />
          <Route path="/juego" element={<Juego />} />
        </Route>
      </Route>
      
      {/*Rutas de Admin*/}
      <Route element={<AdminLayout />}>
        <Route path="/admin/cards" element={<ManageCards />} />
        <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}