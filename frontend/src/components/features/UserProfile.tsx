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
} from "lucide-react";
import { useAtom } from "jotai";
import { usePrivacySettings } from "@/hooks/useUserPreferences";
import { ToggleItem } from "@/components/ToggleItem";
import { useAuth } from "@/hooks/useAuth";
import { setUserAtom } from "@/stores/authStore";
import { uploadAvatar, updateProfile } from "@/services/authService";

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "privacy" | "settings">("profile");
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
    } else if (url) {
      setUser({ ...user, avatar_url: url });
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
          Gestiona tu información y configuración
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {[
          { id: "profile", label: "PERFIL", icon: User },
          { id: "stats", label: "ESTADÍSTICAS", icon: TrendingUp },
          { id: "privacy", label: "PRIVACIDAD", icon: Shield },
          { id: "settings", label: "CONFIGURACIÓN", icon: Lock },
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
              <div className="relative group cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Foto de perfil"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-vcf-orange flex items-center justify-center text-white text-4xl font-black ${avatarSrc ? "hidden" : ""}`}>
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
                {uploading ? "Subiendo foto..." : "Haz clic para cambiar la foto"}
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
                      {user?.full_name || <span className="text-muted-foreground italic font-normal">Sin nombre</span>}
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
                  onClick={() => { setNameValue(user?.full_name ?? ""); setEditing(true); }}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-vcf-orange text-vcf-orange font-black rounded-lg hover:bg-vcf-orange hover:text-white transition-colors"
                >
                  <Edit size={16} />
                  EDITAR NOMBRE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Pestaña PRIVACIDAD ── */}
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
                <Shield size={24} className="text-vcf-blue flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-2 text-foreground">Sobre tu privacidad</h4>
                  <p className="text-sm text-muted-foreground">
                    Tu información está protegida. Solo compartes lo que eliges compartir. Lee
                    nuestra{" "}
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
    </div>
  );
}
