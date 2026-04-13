import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Team from "../pages/Team";
import Matches from "../pages/Matches";
import News from "../pages/News";
import FanZone from "../pages/FanZone";
import Shop from "../pages/Shop";
import NouMestalla from "../pages/NouMestalla";
import MainLayout from "../layouts/MainLayout";
import Game from "../pages/Game";
import LogIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";
import AuthCallback from "../pages/AuthCallback";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Redirect root to home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/news" element={<News />} />
          <Route path="/fanzone" element={<FanZone />} />
          <Route path="/game" element={<Game />} />
          <Route path="/nou-mestalla" element={<NouMestalla />} />
          <Route path="/shop" element={<Shop />} />
        </Route>
      </Route>
    </Routes>
  );
}
