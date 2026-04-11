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
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: "FanVCF2024",
    email: "fan@valencia.com",
    age: 25,
    country: "España",
    city: "Valencia",
    favoritePlayer: "Hugo Duro",
    memberSince: "2024",
    bio: "Hincha del Valencia CF desde que tengo memoria. ¡Amunt Valencia!",
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showLocation: true,
    allowMessages: true,
    showStats: true,
    showCollection: false,
  });

  const userStats = {
    level: 15,
    totalPoints: 2340,
    streak: 12,
    longestStreak: 28,
    cardsOwned: 145,
    cardsTotal: 200,
    triviasCompleted: 28,
    triviasTotal: 45,
    matchesWatched: 34,
    matchRoomsJoined: 23,
    rank: 24,
    achievements: 18,
  };

  const recentActivity = [
    {
      type: "trivia",
      title: 'Completó "Quiz Histórico"',
      points: 50,
      time: "Hace 2 horas",
      icon: Gamepad2,
    },
    {
      type: "card",
      title: "Obtuvo carta legendaria",
      points: 100,
      time: "Hace 5 horas",
      icon: BookOpen,
    },
    {
      type: "match",
      title: "Asistió a Match Room",
      points: 25,
      time: "Hace 1 día",
      icon: Video,
    },
    {
      type: "rank",
      title: "Subió al puesto #24",
      points: 0,
      time: "Hace 2 días",
      icon: Trophy,
    },
  ];

  const achievements = [
    {
      id: 1,
      name: "Hincha Dedicado",
      desc: "Racha de 7 días",
      unlocked: true,
    },
    {
      id: 2,
      name: "Coleccionista",
      desc: "50% del álbum",
      unlocked: true,
    },
    {
      id: 3,
      name: "Maestro de Trivias",
      desc: "10 trivias completadas",
      unlocked: true,
    },
    {
      id: 4,
      name: "Social",
      desc: "5 Match Rooms",
      unlocked: true,
    },
    {
      id: 5,
      name: "Leyenda",
      desc: "Nivel 20",
      unlocked: false,
    },
    {
      id: 6,
      name: "Completista",
      desc: "Álbum 100%",
      unlocked: false,
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    alert("Perfil actualizado correctamente");
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border-2 border-border rounded-lg p-8 text-center mb-6 shadow-md">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full border-4 border-vcf-orange mx-auto shadow-xl"></div>
                {!isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-vcf-orange text-white rounded-full flex items-center justify-center hover:bg-[#a86d12] transition-colors shadow-lg">
                    <Edit size={16} />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-black mb-1 text-foreground">
                {profileData.nickname}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {profileData.email}
              </p>

              <div className="flex justify-center gap-2 mb-6">
                <span className="bg-vcf-orange text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  NIVEL {userStats.level}
                </span>
                <span className="bg-muted text-foreground px-4 py-2 rounded-full text-sm font-bold">
                  {userStats.totalPoints} pts
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2 text-muted-foreground">
                  <span>
                    Progreso al Nivel {userStats.level + 1}
                  </span>
                  <span className="font-bold text-foreground">
                    75%
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-vcf-orange shadow-inner"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Edit size={18} />
                  EDITAR PERFIL
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Save size={18} />
                    GUARDAR
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 bg-muted text-foreground rounded-lg font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    CANCELAR
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-card border-2 border-border rounded-lg p-6 shadow-md">
              <h3 className="font-black mb-4 text-foreground">
                LOGROS{" "}
                <span className="text-vcf-blue">RÁPIDOS</span>
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Racha Actual",
                    value: `${userStats.streak} días`,
                    icon: Star,
                    color: "text-vcf-yellow",
                  },
                  {
                    label: "Ranking",
                    value: `#${userStats.rank}`,
                    icon: Trophy,
                    color: "text-vcf-red",
                  },
                  {
                    label: "Álbum",
                    value: `${Math.round((userStats.cardsOwned / userStats.cardsTotal) * 100)}%`,
                    icon: BookOpen,
                    color: "text-vcf-blue",
                  },
                  {
                    label: "Trivias",
                    value: userStats.triviasCompleted,
                    icon: Gamepad2,
                    color: "text-vcf-orange",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon
                        size={20}
                        className={stat.color}
                      />
                      <span className="text-sm font-bold text-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-lg font-black text-foreground">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-foreground">
                  INFORMACIÓN{" "}
                  <span className="text-vcf-orange">
                    PERSONAL
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2 text-sm text-foreground">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={profileData.nickname}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        nickname: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-foreground">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        age: parseInt(e.target.value),
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-foreground">
                    Jugador Favorito
                  </label>
                  <input
                    type="text"
                    value={profileData.favoritePlayer}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        favoritePlayer: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-foreground">
                    País
                  </label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        country: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-foreground">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        city: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block font-bold mb-2 text-sm text-foreground">
                  Biografía
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      bio: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none disabled:opacity-60"
                ></textarea>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-black mb-6 text-foreground">
                LOGROS{" "}
                <span className="text-vcf-orange">
                  DESBLOQUEADOS
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-lg border-2 text-center transition-all ${
                      achievement.unlocked
                        ? "border-vcf-orange bg-muted hover:border-vcf-yellow shadow-md"
                        : "border-border bg-muted opacity-50"
                    }`}
                  >
                    <div className="text-4xl mb-3">
                      {achievement.icon}
                    </div>
                    <div className="font-black mb-1 text-foreground">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.desc}
                    </div>
                    {achievement.unlocked && (
                      <div className="mt-3 text-xs font-bold text-green-600">
                        ✓ DESBLOQUEADO
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div>
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Nivel",
                value: userStats.level,
                icon: TrendingUp,
                color: "bg-vcf-orange",
              },
              {
                label: "Puntos Totales",
                value: userStats.totalPoints.toLocaleString(),
                icon: Star,
                color: "bg-vcf-yellow",
              },
              {
                label: "Ranking",
                value: `#${userStats.rank}`,
                icon: Trophy,
                color: "bg-vcf-red",
              },
              {
                label: "Logros",
                value: userStats.achievements,
                icon: Award,
                color: "bg-vcf-blue",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-card border-2 border-border rounded-lg p-6 shadow-md hover:border-vcf-orange transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
                  >
                    <stat.icon
                      size={20}
                      className="text-white"
                    />
                  </div>
                  <div className="text-4xl font-black text-foreground">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Collection Stats */}
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                <BookOpen size={24} className="text-vcf-blue" />
                COLECCIÓN DE CARTAS
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>Progreso del Álbum</span>
                    <span className="font-bold text-foreground">
                      {Math.round(
                        (userStats.cardsOwned /
                          userStats.cardsTotal) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-vcf-blue shadow-inner"
                      style={{
                        width: `${(userStats.cardsOwned / userStats.cardsTotal) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {userStats.cardsOwned} de{" "}
                    {userStats.cardsTotal} cartas
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-black mb-1 text-vcf-orange">
                      24
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Legendarias
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-black mb-1 text-vcf-red">
                      38
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Duplicadas
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trivia Stats */}
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                <Gamepad2
                  size={24}
                  className="text-vcf-yellow"
                />
                TRIVIAS & QUIZZES
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>Completadas</span>
                    <span className="font-bold text-foreground">
                      {userStats.triviasCompleted}/
                      {userStats.triviasTotal}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-vcf-yellow shadow-inner"
                      style={{
                        width: `${(userStats.triviasCompleted / userStats.triviasTotal) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-black mb-1 text-green-600">
                      85%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Precisión Promedio
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-black mb-1 text-vcf-orange">
                      1,420
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Puntos Ganados
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Stats */}
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                <Video size={24} className="text-vcf-red" />
                MATCH ROOMS
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-black mb-1 text-vcf-blue">
                      {userStats.matchesWatched}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Partidos Vistos
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-black mb-1 text-vcf-orange">
                      {userStats.matchRoomsJoined}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rooms Participados
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-border">
                  <div className="text-sm text-muted-foreground mb-2">
                    Rooms Creados
                  </div>
                  <div className="text-3xl font-black text-vcf-red">
                    7
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Stats */}
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                <Star size={24} className="text-vcf-yellow" />
                RACHAS
              </h3>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-vcf-orange via-vcf-yellow to-vcf-orange text-white rounded-lg shadow-lg">
                  <div className="text-5xl font-black mb-2">
                    {userStats.streak}
                  </div>
                  <div className="text-sm font-bold">
                    Días Consecutivos
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-black mb-1 text-vcf-blue">
                      {userStats.longestStreak}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Racha Más Larga
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-black mb-1 text-vcf-orange">
                      156
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Días Totales
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-black mb-6 text-foreground">
              CONFIGURACIÓN DE{" "}
              <span className="text-vcf-blue">PRIVACIDAD</span>
            </h3>

            <div className="space-y-6">
              {[
                {
                  key: "profilePublic",
                  label: "Perfil Público",
                  desc: "Otros usuarios pueden ver tu perfil",
                },
                {
                  key: "showLocation",
                  label: "Mostrar Ubicación",
                  desc: "Tu ciudad aparecerá en tu perfil",
                },
                {
                  key: "allowMessages",
                  label: "Permitir Mensajes",
                  desc: "Otros fans pueden enviarte mensajes",
                },
                {
                  key: "showStats",
                  label: "Mostrar Estadísticas",
                  desc: "Tus estadísticas serán visibles",
                },
                {
                  key: "showCollection",
                  label: "Mostrar Colección",
                  desc: "Otros pueden ver tu álbum de cartas",
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-bold mb-1 text-foreground">
                      {setting.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {setting.desc}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setPrivacySettings({
                        ...privacySettings,
                        [setting.key]:
                          !privacySettings[
                            setting.key as keyof typeof privacySettings
                          ],
                      })
                    }
                    className={`w-14 h-8 rounded-full transition-colors shadow-inner ${
                      privacySettings[
                        setting.key as keyof typeof privacySettings
                      ]
                        ? "bg-green-600"
                        : "bg-border"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                        privacySettings[
                          setting.key as keyof typeof privacySettings
                        ]
                          ? "transform translate-x-7"
                          : "transform translate-x-1"
                      }`}
                    ></div>
                  </button>
                </div>
              ))}
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

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Change Password */}
          <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-black mb-6 text-foreground">
              CAMBIAR{" "}
              <span className="text-vcf-orange">
                CONTRASEÑA
              </span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2 text-sm text-foreground">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-sm text-foreground">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-sm text-foreground">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                />
              </div>
              <button className="w-full py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-colors shadow-md">
                ACTUALIZAR CONTRASEÑA
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-foreground">
              <Bell size={24} className="text-vcf-blue" />
              NOTIFICACIONES
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Nuevas Noticias del Equipo",
                  enabled: true,
                },
                { label: "Próximos Partidos", enabled: true },
                {
                  label: "Nuevas Trivias Disponibles",
                  enabled: true,
                },
                {
                  label: "Solicitudes de Intercambio",
                  enabled: true,
                },
                {
                  label: "Mensajes de Otros Fans",
                  enabled: false,
                },
                {
                  label: "Actualizaciones del Ranking",
                  enabled: false,
                },
              ].map((notif, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <span className="font-bold text-sm text-foreground">
                    {notif.label}
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked={notif.enabled}
                    className="w-5 h-5 accent-vcf-orange"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-vcf-red/10 border-2 border-vcf-red rounded-lg p-8">
            <h3 className="text-2xl font-black mb-6 text-vcf-red">
              ZONA DE PELIGRO
            </h3>
            <div className="space-y-4">
              <button className="w-full py-3 bg-card border-2 border-vcf-red text-vcf-red rounded-lg font-bold hover:bg-vcf-red/10 transition-colors">
                DESACTIVAR CUENTA
              </button>
              <button className="w-full py-3 bg-vcf-red text-white rounded-lg font-bold hover:bg-[#c72b1d] transition-colors shadow-md">
                ELIMINAR CUENTA PERMANENTEMENTE
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Esta acción no se puede deshacer. Perderás todo
                tu progreso y colección.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}