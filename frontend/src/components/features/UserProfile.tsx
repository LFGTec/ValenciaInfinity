import React, { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Star,
  Trophy,
  BookOpen,
  Gamepad2,
  Video,
  Award,
  TrendingUp,
  Shield,
  Lock,
  Bell,
  Eye,
  EyeOff,
} from "lucide-react";


export function UserProfile() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "stats" | "privacy" | "settings"
  >("profile");

  return (
     <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
        <div className="mb-8">
          <h1 className="text-5xl font-black mb-4 text-foreground">
            MI <span className="text-vcf-orange">PERFIL</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Gestiona tu información y configuración
          </p>
        </div>

        <div className="flex gap-2 mb-8 border-b-2 border-border">
          {[
            { id: "profile", label: "PERFIL", icon: User },
            {
              id: "stats",
              label: "ESTADÍSTICAS",
              icon: TrendingUp,
            },
            { id: "privacy", label: "PRIVACIDAD", icon: Shield },
            {
              id: "settings",
              label: "CONFIGURACIÓN",
              icon: Lock,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-b-4 border-vcf-orange text-vcf-orange"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        
      </div>
  );
}