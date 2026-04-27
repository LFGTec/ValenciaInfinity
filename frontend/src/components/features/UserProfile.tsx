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
import { usePrivacySettings } from "@/hooks/useUserPreferences";
import { ToggleItem } from "@/components/ToggleItem"

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "stats" | "privacy" | "settings"
  >("profile");


  const { settings, toggleSetting, loading} = usePrivacySettings()

 

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

        {/* Preferencias de Privacidad*/}
        {activeTab === "privacy" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-black mb-6 text-foreground">
              CONFIGURACIÓN DE{" "}
              <span className="text-vcf-blue">PRIVACIDAD</span>
            </h3>

            <div className="space-y-6">

              <ToggleItem
                label="Perfil Público"
                desc="Otros usuarios pueden ver tu perfil"
                value={settings.profile_public}
                onToggle={() => toggleSetting("profile_public")}
              />

              <ToggleItem
                label="Mostrar Ubicación"
                desc="Tu ciudad aparecerá en tu perfil"
                value={settings.show_location}
                onToggle={() => toggleSetting("show_location")}
              />

              <ToggleItem
                label="Permitir Mensajes"
                desc="Otros fans pueden enviarte mensajes"
                value={settings.allow_messages}
                onToggle={() => toggleSetting("allow_messages")}
              />

              <ToggleItem
                label="Mostrar Estadísticas"
                desc="Tus estadísticas serán visibles"
                value={settings.show_stats}
                onToggle={() => toggleSetting("show_stats")}
              />

              <ToggleItem
                label="Mostrar Colección"
                desc="Otros pueden ver tu álbum de cartas"
                value={settings.show_collection}
                onToggle={() => toggleSetting("show_collection")}
              />
            </div>

              <div className="mt-8 p-6 bg-vcf-blue/10 border-2 border-vcf-blue rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield
                    size={24}
                    className="text-vcf-blue flex-shrink-0 mt-1"
                  />
                  <div>
                    <h4 className="font-bold mb-2 text-foreground">
                      Sobre tu privacidad
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tu información está protegida. Solo
                      compartes lo que eliges compartir. Lee
                      nuestra{" "}
                      <a
                        href="#"
                        className="text-vcf-blue underline font-bold"
                      >
                        Política de Privacidad
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
      </div>
  );
}