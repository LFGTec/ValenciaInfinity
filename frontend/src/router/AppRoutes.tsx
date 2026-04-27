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
import NewsAdmin from "../pages/AdminViews/NewsAdmin.tsx";
import SignUp from "../pages/SignUp";
import AuthCallback from "../pages/AuthCallback";
import ForgotPassword from "../pages/ForgotPassword";
import {Juego} from "../pages/Juego";
import { NouMestellaPage } from "../pages/NouMestellaPage";
import { ManageCards } from "@/pages/AdminViews/ManageCards";
import  AdminLayout  from "@/layouts/AdminLayout"
import { TriviasQuizzes } from  "../components/features/TriviasQuizzes"
import { CrearTrivias } from "@/pages/AdminViews/CrearTrivias";
import { TimelineAdmin } from "@/pages/AdminViews/TimelineaAdmin";


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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/juego" element={<Juego />} />
          <Route path="/trivias" element={<TriviasQuizzes />} />
        </Route>
      </Route>
      
      {/*Rutas de Admin*/}
      <Route element={<AdminLayout />}>
      <Route path="/admin/news" element={<NewsAdmin />} />
            <Route path="/admin/cards" element={<ManageCards />} />
      <Route path="/admin/trivias" element={<CrearTrivias/>} />
      <Route path="/admin/timeline" element={<TimelineAdmin />} />
        <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}