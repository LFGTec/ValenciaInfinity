import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  TrendingUp,
  Shield,
  Lock,
  Camera,
  Edit,
  Save,
  X,
  Flame,
  Trophy,
  Calendar,
  Star,
} from "lucide-react";
import { useAtom } from "jotai";
import { usePrivacySettings } from "@/hooks/useUserPreferences";
import { ToggleItem } from "@/components/ToggleItem";
import { useAuth } from "@/hooks/useAuth";
import { setUserAtom } from "@/stores/authStore";
import { uploadAvatar, updateProfile } from "@/services/authService";
import { Toast } from "../ui.disabled/Toast";

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "stats" | "privacy" | "settings"
  >("profile");
  const { settings, toggleSetting } = usePrivacySettings();
  const { user } = useAuth();
  const [, setUser] = useAtom(setUserAtom);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Name edit
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const avatarSrc = user?.avatar_url ?? user?.user_metadata?.avatar_url ?? null;
  const initials = (user?.full_name ?? user?.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setUploadError(null);
    const { url, error } = await uploadAvatar(user.id, file);
    if (error) {
      setUploadError(error);

      setToast({
        message: "No se pudo actualizar la foto de perfil.",
        type: "error",
      });
    } else if (url) {
      setUser({ ...user, avatar_url: url });

      setToast({
        message: "Foto de perfil actualizada correctamente.",
        type: "success",
      });
    }
    
    setUploading(false);
    e.target.value = "";
  };

  const handleSaveName = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await updateProfile(user.id, { full_name: nameValue });
    if (!error) {
      setUser({ ...user, full_name: nameValue });
      setEditing(false);

      setToast({
        message: "Nombre actualizado correctamente.",
        type: "success",
      });
    } else {
      setToast({
        message: "No se pudo actualizar el nombre.",
        type: "error",
      });
    }
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setNameValue(user?.full_name ?? "");
    setEditing(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          MI <span className="text-vcf-orange">PERFIL</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Gestiona tu información
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {[
          { id: "profile", label: "PERFIL", icon: User },
          { id: "stats", label: "ESTADÍSTICAS", icon: TrendingUp },
          { id: "privacy", label: "PRIVACIDAD", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

      {/* ── Pestaña PERFIL ── */}
      {activeTab === "profile" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-10">
              <div
                className="relative group cursor-pointer"
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Foto de perfil"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (
                          e.target as HTMLImageElement
                        ).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-vcf-orange flex items-center justify-center text-white text-4xl font-black ${avatarSrc ? "hidden" : ""}`}
                  >
                    {initials}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={24} className="text-white" />
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground mt-3">
                {uploading
                  ? "Subiendo foto..."
                  : "Haz clic para cambiar la foto"}
              </p>
              {uploadError && (
                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
              )}
            </div>

            {/* Info */}
            <div className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-black tracking-widest text-muted-foreground mb-2">
                  NOMBRE
                </label>
                {editing ? (
                  <input
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-vcf-orange rounded-lg bg-background text-foreground font-bold outline-none focus:ring-2 focus:ring-vcf-orange/30"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-foreground font-bold text-lg">
                      {user?.full_name || (
                        <span className="text-muted-foreground italic font-normal">
                          Sin nombre
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-black tracking-widest text-muted-foreground mb-2">
                  EMAIL
                </label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={16} />
                  <p>{user?.email}</p>
                </div>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-xs font-black tracking-widest text-muted-foreground mb-2">
                  ROL
                </label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-bold border-2 border-vcf-orange text-vcf-orange capitalize">
                  {user?.role ?? "fan"}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="mt-8 flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-vcf-orange text-white font-black rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "GUARDANDO..." : "GUARDAR"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-border text-muted-foreground font-black rounded-lg hover:text-foreground hover:border-foreground transition-colors"
                  >
                    <X size={16} />
                    CANCELAR
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setNameValue(user?.full_name ?? "");
                    setEditing(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-vcf-orange text-vcf-orange font-black rounded-lg cursor-pointer "
                >
                  <Edit size={16} />
                  EDITAR NOMBRE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Pestaña ESTADÍSTICAS ── */}
      {activeTab === "stats" && (() => {
        const streak  = user?.current_streak ?? 0;
        const longest = user?.longest_streak ?? 0;
        const total   = user?.total_days ?? 0;
        const points  = user?.puntos ?? 0;

        const badge = (() => {
          if (total >= 100) return { label: "FAN LEGENDARIO", color: "text-yellow-400" };
          if (total >= 60)  return { label: "FAN VETERANO",   color: "text-purple-400" };
          if (total >= 30)  return { label: "FAN DEDICADO",   color: "text-blue-400"   };
          if (total >= 14)  return { label: "FAN CONSTANTE",  color: "text-green-400"  };
          if (total >= 7)   return { label: "FAN ACTIVO",     color: "text-vcf-orange" };
          return                   { label: "FAN NUEVO",      color: "text-gray-400"   };
        })();

        return (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Badge */}
            <div className="bg-card border-2 border-vcf-orange rounded-xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-vcf-orange/10 border-2 border-vcf-orange/40 flex items-center justify-center flex-shrink-0">
                <Trophy size={32} className="text-vcf-orange" />
              </div>
              <div>
                <p className="text-xs font-black tracking-widest text-muted-foreground mb-1">TU TÍTULO</p>
                <p className={`text-3xl font-black ${badge.color}`}>{badge.label}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border-2 border-border rounded-xl p-6 text-center">
                <Flame size={32} className="mx-auto mb-3 text-orange-400" />
                <p className="text-4xl font-black text-foreground tabular-nums">{streak}</p>
                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Racha actual</p>
              </div>

              <div className="bg-card border-2 border-border rounded-xl p-6 text-center">
                <Trophy size={32} className="mx-auto mb-3 text-vcf-orange" />
                <p className="text-4xl font-black text-foreground tabular-nums">{longest}</p>
                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Racha más larga</p>
              </div>

              <div className="bg-card border-2 border-border rounded-xl p-6 text-center">
                <Calendar size={32} className="mx-auto mb-3 text-vcf-orange" />
                <p className="text-4xl font-black text-foreground tabular-nums">{total}</p>
                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Días totales</p>
              </div>

              <div className="bg-card border-2 border-border rounded-xl p-6 text-center">
                <Star size={32} className="mx-auto mb-3 text-vcf-orange" />
                <p className="text-4xl font-black text-vcf-orange tabular-nums">{points.toLocaleString("es-ES")}</p>
                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Puntos Valencia</p>
              </div>
            </div>

            {streak === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                Inicia sesión cada día para construir tu racha y ganar recompensas.
              </p>
            )}
          </div>
        );
      })()}

      {/* ── Pestaña PRIVACIDAD ── */}
      {activeTab === "privacy" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-black mb-6 text-foreground">
              CONFIGURACIÓN DE <span className="text-vcf-blue">PRIVACIDAD</span>
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
                    Tu información está protegida. Solo compartes lo que eliges
                    compartir. Lee nuestra{" "}
                    <a href="#" className="text-vcf-blue underline font-bold">
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
