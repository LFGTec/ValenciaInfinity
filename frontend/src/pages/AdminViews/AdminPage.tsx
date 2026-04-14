import React, { useState, useEffect } from "react";
// import vcfShield from "../assets/EscudoValenciaCF.png";
// import valenciaPointsIcon from "../assets/ValenciaPoints.png";
import {
  Home,
  Trophy,
  Calendar,
  Users,
  Bell,
  ShoppingBag,
  Video,
  Menu,
  X,
  Search,
  ChevronDown,
  Play,
  MessageSquare,
  TrendingUp,
  FileText,
  Gift,
  Gamepad2,
  Globe,
  User,
  Settings,
  LogOut,
  Clock,
  Star,
  Award,
  Share2,
  Heart,
  Eye,
  ArrowRight,
  BookOpen,
  Ticket,
  Sun,
  Moon,
} from "lucide-react";


export function AdminPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          PANEL DE{" "}
          <span className="text-vcf-orange">
            ADMINISTRACIÓN
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Gestión de contenido y usuarios
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Usuarios Activos",
            value: "1,234",
            icon: Users,
            color: "bg-vcf-blue",
          },
          {
            label: "Noticias",
            value: "89",
            icon: FileText,
            color: "bg-vcf-orange",
          },
          {
            label: "Trivias",
            value: "45",
            icon: Gamepad2,
            color: "bg-vcf-yellow",
          },
          {
            label: "Cartas",
            value: "200",
            icon: BookOpen,
            color: "bg-vcf-red",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border-2 border-vcf-orange rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-4xl font-black text-foreground">
                {stat.value}
              </div>
            </div>
            <div className="text-sm font-bold text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "GESTIONAR NOTICIAS",
            color: "hover:border-vcf-orange",
          },
          {
            title: "GESTIONAR CALENDARIO",
            color: "hover:border-vcf-blue",
          },
          {
            title: "GESTIONAR CARTAS",
            color: "hover:border-vcf-yellow",
          },
          {
            title: "GESTIONAR TRIVIAS",
            color: "hover:border-vcf-red",
          },
          {
            title: "ESTADÍSTICAS USUARIOS",
            color: "hover:border-vcf-orange",
          },
          {
            title: "VER GANADORES",
            color: "hover:border-vcf-blue",
          },
        ].map((module) => (
          <button
            key={module.title}
            className={`bg-card border-2 border-border rounded-lg p-8 text-left ${module.color} transition-all group hover:shadow-lg`}
          >
            <h3 className="text-xl font-black mb-2 text-foreground group-hover:text-vcf-orange transition-colors">
              {module.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Administrar y configurar
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-vcf-orange">
              ACCEDER{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}