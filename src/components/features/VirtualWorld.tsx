import React, { useState } from "react";
import {
  Globe,
  Map,
  Users,
  Camera,
  User,
  MapPin,
  Video,
  Wifi,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Locate,
} from "lucide-react";
import valenciaMapBg from "../../assets/Mapa.png";

interface FanOnMap {
  id: string;
  name: string;
  city: string;
  country: string;
  x: number; // Position on map (percentage)
  y: number; // Position on map (percentage)
  avatar: {
    skinTone: number;
    hairStyle: string;
    hairColor: number;
    jersey: string;
  };
  status: string;
  lastActive: string;
  level: number;
}

export function VirtualWorld() {
  const [activeTab, setActiveTab] = useState<
    "map" | "avatar" | "stadium" | "nearby"
  >("map");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedFan, setSelectedFan] =
    useState<FanOnMap | null>(null);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });

  // Simulated fans on the map (like Snapchat)
  const fansOnMap: FanOnMap[] = [
    // España
    {
      id: "1",
      name: "Carlos M.",
      city: "Valencia",
      country: "España",
      x: 50,
      y: 42,
      avatar: {
        skinTone: 2,
        hairStyle: "corto",
        hairColor: 1,
        jersey: "local",
      },
      status: "Viendo el partido",
      lastActive: "Ahora",
      level: 15,
    },
    {
      id: "2",
      name: "María L.",
      city: "Madrid",
      country: "España",
      x: 48,
      y: 41,
      avatar: {
        skinTone: 1,
        hairStyle: "largo",
        hairColor: 2,
        jersey: "visitante",
      },
      status: "Amunt Valencia!",
      lastActive: "hace 2 min",
      level: 22,
    },
    {
      id: "3",
      name: "Juan P.",
      city: "Barcelona",
      country: "España",
      x: 52,
      y: 40,
      avatar: {
        skinTone: 3,
        hairStyle: "rapado",
        hairColor: 0,
        jersey: "tercera",
      },
      status: "En Mestalla",
      lastActive: "hace 5 min",
      level: 18,
    },
    {
      id: "4",
      name: "Ana R.",
      city: "Sevilla",
      country: "España",
      x: 48,
      y: 44,
      avatar: {
        skinTone: 2,
        hairStyle: "rizado",
        hairColor: 3,
        jersey: "local",
      },
      status: "Coleccionando cartas",
      lastActive: "hace 10 min",
      level: 12,
    },

    // América Latina
    {
      id: "5",
      name: "Diego S.",
      city: "Buenos Aires",
      country: "Argentina",
      x: 35,
      y: 68,
      avatar: {
        skinTone: 2,
        hairStyle: "liso",
        hairColor: 1,
        jersey: "visitante",
      },
      status: "Vamos Valencia!",
      lastActive: "hace 15 min",
      level: 25,
    },
    {
      id: "6",
      name: "Luis M.",
      city: "CDMX",
      country: "México",
      x: 18,
      y: 45,
      avatar: {
        skinTone: 4,
        hairStyle: "corto",
        hairColor: 0,
        jersey: "local",
      },
      status: "Jugando Mestalla Rivals",
      lastActive: "hace 3 min",
      level: 30,
    },
    {
      id: "7",
      name: "Sofia C.",
      city: "Bogotá",
      country: "Colombia",
      x: 28,
      y: 52,
      avatar: {
        skinTone: 3,
        hairStyle: "ondulado",
        hairColor: 2,
        jersey: "tercera",
      },
      status: "En la trivia",
      lastActive: "Ahora",
      level: 14,
    },
    {
      id: "8",
      name: "Mateo R.",
      city: "Santiago",
      country: "Chile",
      x: 32,
      y: 70,
      avatar: {
        skinTone: 1,
        hairStyle: "afro",
        hairColor: 1,
        jersey: "local",
      },
      status: "Match Room activa",
      lastActive: "hace 1 min",
      level: 19,
    },

    // Europa
    {
      id: "9",
      name: "Pierre D.",
      city: "París",
      country: "Francia",
      x: 52,
      y: 37,
      avatar: {
        skinTone: 0,
        hairStyle: "corto",
        hairColor: 4,
        jersey: "visitante",
      },
      status: "Intercambiando cartas",
      lastActive: "hace 8 min",
      level: 16,
    },
    {
      id: "10",
      name: "Marco V.",
      city: "Roma",
      country: "Italia",
      x: 54,
      y: 41,
      avatar: {
        skinTone: 2,
        hairStyle: "largo",
        hairColor: 1,
        jersey: "local",
      },
      status: "Che! Che! Che!",
      lastActive: "hace 12 min",
      level: 21,
    },
    {
      id: "11",
      name: "Hans K.",
      city: "Berlín",
      country: "Alemania",
      x: 54,
      y: 35,
      avatar: {
        skinTone: 0,
        hairStyle: "rapado",
        hairColor: 3,
        jersey: "tercera",
      },
      status: "VCF por siempre",
      lastActive: "hace 20 min",
      level: 11,
    },
    {
      id: "12",
      name: "John S.",
      city: "Londres",
      country: "Reino Unido",
      x: 50,
      y: 35,
      avatar: {
        skinTone: 1,
        hairStyle: "corto",
        hairColor: 2,
        jersey: "local",
      },
      status: "Watching highlights",
      lastActive: "hace 7 min",
      level: 13,
    },

    // Asia
    {
      id: "13",
      name: "Kenji T.",
      city: "Tokio",
      country: "Japón",
      x: 85,
      y: 43,
      avatar: {
        skinTone: 1,
        hairStyle: "liso",
        hairColor: 0,
        jersey: "visitante",
      },
      status: "Valencia fan from Japan!",
      lastActive: "hace 30 min",
      level: 28,
    },
    {
      id: "14",
      name: "Wei L.",
      city: "Shanghai",
      country: "China",
      x: 80,
      y: 45,
      avatar: {
        skinTone: 1,
        hairStyle: "corto",
        hairColor: 0,
        jersey: "local",
      },
      status: "Amunt!",
      lastActive: "hace 45 min",
      level: 10,
    },

    // Norte América
    {
      id: "15",
      name: "Mike R.",
      city: "Nueva York",
      country: "USA",
      x: 25,
      y: 40,
      avatar: {
        skinTone: 3,
        hairStyle: "rapado",
        hairColor: 1,
        jersey: "tercera",
      },
      status: "Go Valencia!",
      lastActive: "hace 5 min",
      level: 17,
    },
    {
      id: "16",
      name: "Sarah P.",
      city: "Los Angeles",
      country: "USA",
      x: 15,
      y: 42,
      avatar: {
        skinTone: 2,
        hairStyle: "largo",
        hairColor: 4,
        jersey: "local",
      },
      status: "West coast VCF fan",
      lastActive: "hace 25 min",
      level: 9,
    },

    // África
    {
      id: "17",
      name: "Omar A.",
      city: "El Cairo",
      country: "Egipto",
      x: 56,
      y: 48,
      avatar: {
        skinTone: 4,
        hairStyle: "corto",
        hairColor: 0,
        jersey: "visitante",
      },
      status: "Valencia en África",
      lastActive: "hace 18 min",
      level: 14,
    },

    // Oceanía
    {
      id: "18",
      name: "Jake M.",
      city: "Sydney",
      country: "Australia",
      x: 88,
      y: 72,
      avatar: {
        skinTone: 0,
        hairStyle: "rapado",
        hairColor: 3,
        jersey: "local",
      },
      status: "Aussie VCF supporter",
      lastActive: "hace 1 hora",
      level: 8,
    },

    // Más fans en España
    {
      id: "19",
      name: "Pedro V.",
      city: "Alicante",
      country: "España",
      x: 50,
      y: 43,
      avatar: {
        skinTone: 3,
        hairStyle: "corto",
        hairColor: 1,
        jersey: "local",
      },
      status: "En el estadio!",
      lastActive: "Ahora",
      level: 26,
    },
    {
      id: "20",
      name: "Isabel G.",
      city: "Bilbao",
      country: "España",
      x: 49,
      y: 39,
      avatar: {
        skinTone: 1,
        hairStyle: "rizado",
        hairColor: 2,
        jersey: "visitante",
      },
      status: "Preparando la trivia",
      lastActive: "hace 4 min",
      level: 20,
    },
  ];

  const globalStats = {
    totalFans: 12456,
    onlineNow: 3421,
    countries: 89,
    cities: 1234,
  };

  const renderBlockyAvatar = (
    avatar: FanOnMap["avatar"],
    size: "small" | "medium" | "large" = "small",
  ) => {
    const dimensions =
      size === "small"
        ? { w: 24, h: 36 }
        : size === "medium"
          ? { w: 40, h: 60 }
          : { w: 60, h: 90 };
    const scale =
      size === "small" ? 0.5 : size === "medium" ? 0.8 : 1.2;

    const skinTones = [
      "#F5D5B8",
      "#E8C4A0",
      "#D4A574",
      "#C68642",
      "#8D5524",
      "#6F4E37",
    ];
    const hairColors = [
      "#2C1810",
      "#5C4033",
      "#8B6F47",
      "#C19A6B",
      "#E6C7A0",
    ];
    const jerseyColors = {
      local: {
        bg: "#FFFFFF",
        num: "#000000",
        border: "#000000",
      },
      visitante: {
        bg: "#000000",
        num: "#FFFFFF",
        border: "#FFFFFF",
      },
      tercera: {
        bg: "#0097D8",
        num: "#FFFFFF",
        border: "#FFFFFF",
      },
    };

    return (
      <div
        className="relative inline-block"
        style={{ width: dimensions.w, height: dimensions.h }}
      >
        {/* Head */}
        <div
          className="absolute rounded-sm"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10 * scale,
            height: 10 * scale,
            background: skinTones[avatar.skinTone],
          }}
        />

        {/* Hair */}
        {avatar.hairStyle !== "calvo" && (
          <div
            className="absolute rounded-sm"
            style={{
              top: -2 * scale,
              left: "50%",
              transform: "translateX(-50%)",
              width:
                avatar.hairStyle === "rapado"
                  ? 10 * scale
                  : 11 * scale,
              height:
                avatar.hairStyle === "rapado"
                  ? 3 * scale
                  : avatar.hairStyle === "afro"
                    ? 10 * scale
                    : 4 * scale,
              background: hairColors[avatar.hairColor],
            }}
          />
        )}

        {/* Body/Jersey */}
        <div
          className="absolute rounded-sm"
          style={{
            top: 11 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10 * scale,
            height: 14 * scale,
            background:
              jerseyColors[
                avatar.jersey as keyof typeof jerseyColors
              ].bg,
            border: `1px solid ${jerseyColors[avatar.jersey as keyof typeof jerseyColors].border}`,
          }}
        />

        {/* Arms */}
        <div
          className="absolute rounded-sm"
          style={{
            top: 12 * scale,
            left: `calc(50% - ${7 * scale}px)`,
            width: 3 * scale,
            height: 10 * scale,
            background: skinTones[avatar.skinTone],
          }}
        />
        <div
          className="absolute rounded-sm"
          style={{
            top: 12 * scale,
            right: `calc(50% - ${7 * scale}px)`,
            width: 3 * scale,
            height: 10 * scale,
            background: skinTones[avatar.skinTone],
          }}
        />

        {/* Legs */}
        <div
          className="absolute rounded-sm"
          style={{
            top: 25 * scale,
            left: `calc(50% - ${4 * scale}px)`,
            width: 3.5 * scale,
            height: 12 * scale,
            background: "#000000",
          }}
        />
        <div
          className="absolute rounded-sm"
          style={{
            top: 25 * scale,
            right: `calc(50% - ${4 * scale}px)`,
            width: 3.5 * scale,
            height: 12 * scale,
            background: "#000000",
          }}
        />
      </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          MUNDO <span className="text-vcf-blue">VIRTUAL</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Conecta con fans del Valencia CF en tiempo real
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Fans Totales",
            value: globalStats.totalFans.toLocaleString(),
            icon: Users,
            color: "bg-vcf-orange",
          },
          {
            label: "En Línea",
            value: globalStats.onlineNow.toLocaleString(),
            icon: Wifi,
            color: "bg-green-500",
          },
          {
            label: "Países",
            value: globalStats.countries,
            icon: Globe,
            color: "bg-vcf-blue",
          },
          {
            label: "Ciudades",
            value: globalStats.cities.toLocaleString(),
            icon: MapPin,
            color: "bg-vcf-red",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border-2 border-border rounded-lg p-4 shadow-md hover:border-vcf-blue transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
              >
                <stat.icon size={20} className="text-white" />
              </div>
              <div className="text-3xl font-black text-foreground">
                {stat.value}
              </div>
            </div>
            <div className="text-sm text-muted-foreground font-bold">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border overflow-x-auto">
        {[
          { id: "map", label: "MAPA GLOBAL", icon: Map },
          { id: "stadium", label: "ESTADIO VR", icon: Video },
          {
            id: "nearby",
            label: "FANS CERCANOS",
            icon: MapPin,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-4 border-vcf-blue text-vcf-blue"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Snap Map Style - Global Map */}
      {activeTab === "map" && (
        <div>
          {/* Map Controls */}
          <div className="bg-card border-2 border-vcf-blue rounded-t-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 font-bold text-sm">
                  {fansOnMap.length} fans en vivo
                </span>
              </div>
              <button className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-colors text-sm flex items-center gap-2">
                <Navigation size={16} />
                Mi ubicación
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setZoomLevel(Math.min(zoomLevel + 0.2, 2))
                }
                className="p-2 bg-muted hover:bg-border rounded-lg transition-colors"
                title="Acercar"
              >
                <ZoomIn size={20} className="text-foreground" />
              </button>
              <button
                onClick={() =>
                  setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))
                }
                className="p-2 bg-muted hover:bg-border rounded-lg transition-colors"
                title="Alejar"
              >
                <ZoomOut
                  size={20}
                  className="text-foreground"
                />
              </button>
              <button
                className="p-2 bg-muted hover:bg-border rounded-lg transition-colors"
                title="Pantalla completa"
              >
                <Maximize2
                  size={20}
                  className="text-foreground"
                />
              </button>
            </div>
          </div>

          {/* Interactive World Map */}
          <div className="bg-card border-2 border-vcf-blue border-t-0 rounded-b-xl overflow-hidden shadow-2xl">
            <div
              className="relative overflow-hidden cursor-move"
              style={{
                height: "600px",
                background: "#E5E3DF",
              }}
            >
              {/* Street Map Background - Snapchat Style */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${valenciaMapBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-white/10" />

              {/* Fan Avatars on Map */}
              {fansOnMap.map((fan) => (
                <div
                  key={fan.id}
                  className="absolute group cursor-pointer z-10"
                  style={{
                    left: `${fan.x}%`,
                    top: `${fan.y}%`,
                    transform: `translate(-50%, -100%) scale(${zoomLevel})`,
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => setSelectedFan(fan)}
                >
                  {/* Avatar Container - Standing on map */}
                  <div className="relative">
                    {/* Pulse ring for online status */}
                    {fan.lastActive === "Ahora" && (
                      <div className="absolute inset-0 -m-3">
                        <div className="w-full h-full rounded-full border-4 border-vcf-orange animate-ping opacity-60"></div>
                      </div>
                    )}

                    {/* Shadow under avatar */}
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm"
                      style={{
                        transform:
                          "translateX(-50%) scaleY(0.5)",
                      }}
                    />

                    {/* Full Body Avatar - No circle background */}
                    <div className="relative group-hover:scale-125 transition-transform drop-shadow-xl">
                      {renderBlockyAvatar(fan.avatar, "medium")}

                      {/* Online Indicator */}
                      {(fan.lastActive.includes("min") ||
                        fan.lastActive === "Ahora") && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                      )}
                    </div>

                    {/* Name label on hover */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      <div className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-2xl border border-gray-200">
                        <div className="font-black">
                          {fan.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {fan.city}
                        </div>
                      </div>
                      {/* Pointer */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-l border-t border-gray-200"></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white border border-white/20">
                <div className="font-black text-sm mb-3 text-vcf-yellow">
                  LEYENDA
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>En línea ahora</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Activo recientemente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-vcf-orange animate-pulse"></div>
                    <span>Transmitiendo en vivo</span>
                  </div>
                </div>
              </div>

              {/* Popular Locations Overlay */}
              <div className="absolute top-4 right-4 space-y-2">
                {[
                  { city: "Valencia", fans: 834, flag: "🇪🇸" },
                  { city: "Madrid", fans: 567, flag: "🇪🇸" },
                  {
                    city: "Buenos Aires",
                    fans: 342,
                    flag: "🇦🇷",
                  },
                ].map((loc, i) => (
                  <div
                    key={i}
                    className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white border border-white/20 min-w-[180px]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {loc.flag}
                        </span>
                        <span className="font-bold text-sm">
                          {loc.city}
                        </span>
                      </div>
                      <span className="text-vcf-orange font-black">
                        {loc.fans}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Fan Details */}
          {selectedFan && (
            <div className="mt-6 bg-gradient-to-br from-vcf-orange via-vcf-yellow to-vcf-orange p-1 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {/* Large Avatar */}
                    <div className="bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-2xl p-4 shadow-xl">
                      {renderBlockyAvatar(
                        selectedFan.avatar,
                        "large",
                      )}
                    </div>

                    {/* Fan Info */}
                    <div>
                      <h3 className="text-2xl font-black text-foreground mb-1">
                        {selectedFan.name}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <MapPin
                          size={16}
                          className="text-vcf-blue"
                        />
                        <span className="font-medium">
                          {selectedFan.city},{" "}
                          {selectedFan.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${selectedFan.lastActive === "Ahora" ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                          <span className="text-sm text-muted-foreground">
                            {selectedFan.lastActive}
                          </span>
                        </div>
                        <div className="px-2 py-1 bg-vcf-blue/10 rounded-full">
                          <span className="text-xs font-bold text-vcf-blue">
                            Nivel {selectedFan.level}
                          </span>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2 inline-block">
                        <span className="text-sm font-medium text-foreground">
                          {selectedFan.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFan(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <span className="text-2xl text-muted-foreground">
                      ×
                    </span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                  <button className="px-4 py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-colors text-sm">
                    CONECTAR
                  </button>
                  <button className="px-4 py-3 bg-card border-2 border-border rounded-lg font-bold hover:border-vcf-blue transition-colors text-sm text-foreground">
                    VER PERFIL
                  </button>
                  <button className="px-4 py-3 bg-card border-2 border-border rounded-lg font-bold hover:border-vcf-blue transition-colors text-sm text-foreground">
                    CHAT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Global Stats by Country */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { country: "España", fans: 5234, flag: "🇪🇸" },
              { country: "México", fans: 1823, flag: "🇲🇽" },
              { country: "Argentina", fans: 1456, flag: "🇦🇷" },
              { country: "Colombia", fans: 987, flag: "🇨🇴" },
              { country: "Chile", fans: 765, flag: "🇨🇱" },
              {
                country: "Estados Unidos",
                fans: 654,
                flag: "🇺🇸",
              },
            ].map((location, i) => (
              <div
                key={i}
                className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-blue transition-all shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">
                    {location.flag}
                  </span>
                  <div className="text-3xl font-black text-vcf-orange">
                    {location.fans}
                  </div>
                </div>
                <div className="font-bold text-lg text-foreground">
                  {location.country}
                </div>
                <div className="text-sm text-muted-foreground">
                  fans registrados
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Virtual Stadium */}
      {activeTab === "stadium" && (
        <div>
          <div className="bg-gradient-to-br from-black via-vcf-blue to-black text-white rounded-xl p-12 mb-8 text-center shadow-2xl">
            <Camera
              size={64}
              className="mx-auto mb-6 opacity-75"
            />
            <h2 className="text-4xl font-black mb-4">
              EXPERIENCIA{" "}
              <span className="text-vcf-yellow">
                MESTALLA VR
              </span>
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Vive la emoción del estadio desde dentro con
              nuestra experiencia de realidad virtual
            </p>
            <button className="px-8 py-4 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105">
              <Video size={24} />
              INICIAR EXPERIENCIA VR
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "VISTA DEL CAMPO",
                desc: "Desde el banquillo",
              },
              { title: "GRADAS", desc: "Tribunas norte" },
              { title: "PALCO VIP", desc: "Vista premium" },
              { title: "TÚNEL", desc: "Entrada al campo" },
              {
                title: "360° CENTRAL",
                desc: "Centro del campo",
              },
              { title: "VESTUARIOS", desc: "Tour exclusivo" },
            ].map((view, i) => (
              <button
                key={i}
                className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-blue transition-all text-left group shadow-md hover:shadow-lg"
              >
                <div className="aspect-video bg-gradient-to-br from-vcf-blue/30 to-vcf-orange/30 rounded-lg mb-4 flex items-center justify-center">
                  <Camera
                    size={32}
                    className="text-vcf-orange"
                  />
                </div>
                <h3 className="font-black mb-1 group-hover:underline text-foreground">
                  {view.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {view.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Fans */}
      {activeTab === "nearby" && (
        <div>
          <div className="bg-card border-2 border-border rounded-lg p-6 mb-8 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-foreground">
                FANS{" "}
                <span className="text-vcf-orange">
                  CERCA DE TI
                </span>
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Basado en tu ubicación:{" "}
              <span className="font-bold text-foreground">
                Valencia, España
              </span>
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-vcf-blue" />
              <span>Radio de búsqueda: 50 km</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fansOnMap
              .filter((f) => f.country === "España")
              .slice(0, 6)
              .map((fan) => (
                <div
                  key={fan.id}
                  className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-orange transition-all shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-xl p-3 shadow-lg">
                        {renderBlockyAvatar(
                          fan.avatar,
                          "medium",
                        )}
                        {fan.lastActive === "Ahora" && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-foreground">
                          {fan.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {fan.city}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {fan.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all text-sm shadow-lg hover:shadow-xl hover:scale-105">
                      CONECTAR
                    </button>

                    <button className="flex-1 py-2 bg-card text-foreground rounded-lg font-bold transition-all text-sm shadow-lg hover:shadow-xl hover:scale-105">
                      VER PERFIL
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}