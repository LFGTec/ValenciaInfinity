import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  Zap,
  Globe,
  Sun,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Hammer,
  CheckCircle2,
  AlertCircle,
  Star,
  Bell,
} from "lucide-react";
import renderAereo from "../assets/EstadiioVestalla.png";
import renderInterior from "../assets/Mestalla.png";

const IMG_CONSTRUCTION =
  "https://images.unsplash.com/photo-1765130420831-e33e58daac37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_ARCHITECTURE =
  "https://images.unsplash.com/photo-1770838215803-5a1768c78de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_VALENCIA_CITY =
  "https://images.unsplash.com/photo-1649718686833-d56300951034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_SOLAR =
  "https://images.unsplash.com/photo-1623331093892-587a082a7efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_WORLDCUP =
  "https://images.unsplash.com/photo-1703379650594-e981d8e26d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

const TIMELINE = [
  {
    year: "2007",
    title: "Inicio de las obras",
    desc: "Comienza la construcción del Nou Mestalla con grandes expectativas para el club y la ciudad.",
    status: "done",
    icon: Hammer,
  },
  {
    year: "2009",
    title: "Primeras dificultades",
    desc: "El proyecto entra en problemas financieros. La crisis económica global golpea al Valencia CF.",
    status: "done",
    icon: AlertCircle,
  },
  {
    year: "2010",
    title: "Paralización de obras",
    desc: "Las obras se detienen por completo. El estadio queda en estructura básica de hormigón durante años.",
    status: "done",
    icon: AlertCircle,
  },
  {
    year: "2010–2024",
    title: "15 años de espera",
    desc: "Durante más de una década la estructura permanece abandonada, convirtiéndose en símbolo de la crisis del club.",
    status: "done",
    icon: Clock,
  },
  {
    year: "Ene 2025",
    title: "Reinicio oficial de obras",
    desc: "El club anuncia oficialmente la reanudación de la construcción con nuevos inversores y un plan definitivo.",
    status: "done",
    icon: CheckCircle2,
  },
  {
    year: "Verano 2027",
    title: "Inauguración prevista",
    desc: "Fecha objetivo para abrir el Nou Mestalla al público, a tiempo para la temporada 2027-2028.",
    status: "future",
    icon: Star,
  },
];

const FEATURES = [
  {
    icon: Users,
    title: "70,000 Espectadores",
    desc: "Capacidad total del estadio, convirtiéndolo en uno de los más grandes de España.",
    color: "text-vcf-orange",
    bg: "bg-vcf-orange/10 border-vcf-orange/30",
  },
  {
    icon: Sun,
    title: "Cubierta Solar",
    desc: "Techo translúcido con paneles fotovoltaicos integrados que generarán energía renovable.",
    color: "text-vcf-orange",
    bg: "bg-vcf-orange/10 border-vcf-orange/30",
  },
  {
    icon: Zap,
    title: "Energía Propia",
    desc: "El estadio será en parte autosuficiente energéticamente gracias a su cubierta solar.",
    color: "text-vcf-orange",
    bg: "bg-vcf-orange/10 border-vcf-orange/30",
  },
  {
    icon: ShoppingBag,
    title: "Fan Zones & Comercios",
    desc: "Exteriores con plaza pública abierta, fan zones, restaurantes y espacios comerciales.",
    color: "text-vcf-orange",
    bg: "bg-vcf-orange/10 border-vcf-orange/30",
  },
  {
    icon: Globe,
    title: "Diseño Internacional",
    desc: "Obra del estudio Fenwick Iribarren Architects, referentes mundiales en arquitectura deportiva.",
    color: "text-vcf-orange",
    bg: "bg-vcf-orange/10 border-vcf-orange/30",
  },
  {
    icon: Calendar,
    title: "Actividad 365 días",
    desc: "Concebido como centro de entretenimiento y cultura abierto durante todo el año, no solo los días de partido.",
    color: "text-vcf-orange",
    bg: "bg-vcf-orange/10 border-vcf-orange/30",
  },
];

const STATS = [
  {
    value: "70,000",
    label: "Asientos",
    sub: "todos cubiertos",
  },
  {
    value: "2027",
    label: "Inauguración",
    sub: "verano previsto",
  },
  { value: "+15", label: "Años en espera", sub: "2010 – 2025" },
  {
    value: "100%",
    label: "Cubierto",
    sub: "gran cubierta moderna",
  },
];

export function NouMestellaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "¿Cuándo se podrá ver el primer partido en el Nou Mestalla?",
      a: "Según el plan actual, la inauguración está prevista para el verano de 2027, lo que permitiría jugar en él en la temporada 2027-2028. Sin embargo, el calendario puede variar según el avance de obras.",
    },
    {
      q: "¿Qué pasará con el estadio Mestalla actual?",
      a: "El histórico Estadio de Mestalla será reconvertido. Los planes incluyen su posible demolición parcial o transformación en un complejo residencial y comercial, aunque esto aún está sujeto a acuerdos con el Ayuntamiento de Valencia.",
    },
    {
      q: "¿El Nou Mestalla será sede del Mundial 2030?",
      a: "FIFA está evaluando seriamente el Nou Mestalla como sede del Mundial 2030 (co-organizado por España, Portugal y Marruecos). La condición principal es que esté finalizado antes de 2028, algo que el club espera cumplir.",
    },
    {
      q: "¿Cuánto cuesta el proyecto?",
      a: "El coste total estimado del proyecto ronda los 300-400 millones de euros, aunque la cifra exacta actualizada no ha sido confirmada oficialmente por el club tras el reinicio de obras en 2025.",
    },
    {
      q: "¿Habrá visitas de obra para los fans?",
      a: "El club ha indicado su intención de organizar visitas guiadas a la obra para socios y aficionados una vez que el avance de la construcción lo permita de forma segura.",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <img
          src={IMG_CONSTRUCTION}
          alt="Nou Mestalla construcción"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-12 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-vcf-orange rounded-full animate-pulse" />
              <span className="text-vcf-orange font-black text-sm tracking-widest uppercase">
                En Construcción · 2025–2027
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 leading-none tracking-tight">
              NOU
              <br />
              <span className="text-vcf-orange">MESTALLA</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mb-8 leading-relaxed">
              El futuro hogar del Valencia CF. Un estadio de
              70,000 espectadores que redefinirá el fútbol en
              España.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-vcf-orange/20 border border-vcf-orange/50 px-5 py-3 rounded-full backdrop-blur-sm">
                <Users size={18} className="text-vcf-orange" />
                <span className="text-white font-black text-base">
                  70,000 espectadores
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/30 px-5 py-3 rounded-full backdrop-blur-sm">
                <MapPin size={18} className="text-white" />
                <span className="text-white font-black text-base">
                  Av. Cortes Valencianas, Valencia
                </span>
              </div>
              <div className="flex items-center gap-2 bg-vcf-orange/20 border border-vcf-orange/50 px-5 py-3 rounded-full backdrop-blur-sm">
                <Calendar
                  size={18}
                  className="text-vcf-orange"
                />
                <span className="text-white font-black text-base">
                  Inauguración: Verano 2027
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-black border-y-2 border-vcf-orange">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`py-8 px-6 text-center ${i < STATS.length - 1 ? "border-r border-vcf-orange/30" : ""}`}
              >
                <div className="text-4xl font-black text-vcf-orange mb-1">
                  {s.value}
                </div>
                <div className="text-white font-black text-base">
                  {s.label}
                </div>
                <div className="text-white/50 text-sm">
                  {s.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RENDER VISUAL ───────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/40 px-4 py-2 rounded-full mb-4">
            <Star size={16} className="text-vcf-orange" />
            <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
              Visión del futuro
            </span>
          </div>
          <h2 className="text-5xl font-black text-foreground mb-3">
            ASÍ LUCIRÁ EL{" "}
            <span className="text-vcf-orange">
              NOU MESTALLA
            </span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Un espectáculo arquitectónico que redefinirá
            Valencia. Cubierta translúcida, fachada iluminada y
            70,000 fans en su interior.
          </p>
        </div>

        {/* Main render — full width */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6 group">
          <img
            src={renderAereo}
            alt="Render aéreo Nou Mestalla terminado"
            className="w-full h-[520px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-vcf-orange/50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-vcf-orange rounded-full animate-pulse" />
            <span className="text-vcf-orange font-black text-sm tracking-widest uppercase">
              Visión del proyecto
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h3 className="text-white font-black text-3xl md:text-4xl mb-1 drop-shadow-lg">
                NOU MESTALLA
              </h3>
              <p className="text-white/70 text-lg">
                Fenwick Iribarren Architects · Valencia, España
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-vcf-orange/90 backdrop-blur-sm px-5 py-3 rounded-xl text-center shadow-lg">
                <div className="text-white font-black text-xl">
                  70,000
                </div>
                <div className="text-white/80 text-xs font-bold">
                  AFORO
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl text-center shadow-lg">
                <div className="text-white font-black text-xl">
                  2027
                </div>
                <div className="text-white/80 text-xs font-bold">
                  APERTURA
                </div>
              </div>
              <div className="bg-vcf-orange/90 backdrop-blur-sm px-5 py-3 rounded-xl text-center shadow-lg">
                <div className="text-white font-black text-xl">
                  100%
                </div>
                <div className="text-white/70 text-xs font-bold">
                  CUBIERTO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second render + detail cards side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-xl group">
            <img
              src={renderInterior}
              alt="Nou Mestalla interior vista panorámica"
              className="w-full h-[340px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-vcf-orange font-black text-xs tracking-widest uppercase mb-1">
                Vista interior
              </div>
              <p className="text-white font-black text-xl leading-snug">
                70,000 asientos naranjas bajo una espectacular
                cubierta translúcida
              </p>
            </div>
          </div>

          {/* Detail cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[
              {
                title: "Cubierta translúcida",
                desc: "Techo de paneles traslúcidos que dejan pasar la luz natural mientras protegen a todos los espectadores.",
                color: "border-vcf-orange/40 bg-vcf-orange/5",
                accent: "text-vcf-orange",
              },
              {
                title: "Paneles solares integrados",
                desc: "La cubierta genera energía renovable, convirtiendo el estadio en una central fotovoltaica.",
                color: "border-vcf-orange/40 bg-vcf-orange/5",
                accent: "text-vcf-orange",
              },
              {
                title: "Plaza pública exterior",
                desc: "Espacio de 40,000 m² de zona pública con fan zones, restaurantes y comercios abiertos 365 días.",
                color: "border-vcf-orange/40 bg-vcf-orange/5",
                accent: "text-vcf-orange",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-5 rounded-xl border-2 ${card.color} shadow-md flex-1`}
              >
                <div className="text-3xl flex-shrink-0">
                  {card.emoji}
                </div>
                <div>
                  <h4
                    className={`font-black text-base mb-1 ${card.accent}`}
                  >
                    {card.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-muted-foreground/50 text-sm mt-6 italic">
          * Las imágenes son representaciones visuales del
          concepto arquitectónico. El resultado final puede
          variar según el diseño oficial.
        </p>
      </section>

      {/* ── INTRO + IMAGE ────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 px-4 py-2 rounded-full mb-6">
              <Building2
                size={16}
                className="text-vcf-orange"
              />
              <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
                El proyecto
              </span>
            </div>
            <h2 className="text-5xl font-black text-foreground mb-6 leading-tight">
              Un sueño de más de{" "}
              <span className="text-vcf-orange">15 años</span>
            </h2>
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>
                El Nou Mestalla es el proyecto más ambicioso de
                la historia del Valencia CF. Diseñado por el
                reconocido estudio{" "}
                <strong className="text-foreground">
                  Fenwick Iribarren Architects
                </strong>
                , el nuevo estadio prometía modernizar
                completamente la experiencia del fútbol en
                Valencia.
              </p>
              <p>
                Tras más de una década paralizado por problemas
                económicos del club, en{" "}
                <strong className="text-vcf-orange">
                  enero de 2025
                </strong>{" "}
                el Valencia CF anunció el reinicio definitivo de
                las obras, marcando un punto de inflexión
                histórico para el club y sus aficionados.
              </p>
              <p>
                Con todos los asientos cubiertos por una
                espectacular cubierta translúcida y paneles
                solares integrados, el Nou Mestalla será uno de
                los estadios más avanzados tecnológicamente de
                Europa.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={IMG_ARCHITECTURE}
                alt="Arquitectura Nou Mestalla"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-vcf-orange/30">
                  <div className="text-vcf-orange font-black text-sm tracking-widest uppercase mb-1">
                    Estudio de diseño
                  </div>
                  <div className="text-white font-black text-lg">
                    Fenwick Iribarren Architects
                  </div>
                  <div className="text-white/60 text-sm">
                    Referentes mundiales en arquitectura
                    deportiva
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-vcf-orange rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-background">
              <span className="text-white font-black text-xl leading-none">
                70K
              </span>
              <span className="text-white/80 text-xs font-bold">
                AFORO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────── */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 px-4 py-2 rounded-full mb-4">
              <Zap size={16} className="text-vcf-orange" />
              <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
                Características
              </span>
            </div>
            <h2 className="text-5xl font-black text-foreground mb-4">
              LO QUE TENDRÁ EL{" "}
              <span className="text-vcf-orange">
                NOU MESTALLA
              </span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Un estadio diseñado para el siglo XXI, con la
              mejor tecnología y la mejor experiencia para los
              fans.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-7 border-2 ${f.bg} hover:scale-[1.02] transition-transform shadow-md`}
              >
                <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center mb-5 shadow-md">
                  <f.icon size={28} className={f.color} />
                </div>
                <h3
                  className={`font-black text-xl mb-3 ${f.color}`}
                >
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 px-4 py-2 rounded-full mb-4">
            <Clock size={16} className="text-vcf-orange" />
            <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
              Historia del proyecto
            </span>
          </div>
          <h2 className="text-5xl font-black text-foreground mb-4">
            UNA HISTORIA DE{" "}
            <span className="text-vcf-orange">CONSTANCIA</span>
          </h2>
          <p className="text-muted-foreground text-xl">
            Desde los primeros cimientos en 2007 hasta el sueño
            hecho realidad en 2027
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5 bg-vcf-orange/30 -translate-x-px" />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              const statusColor =
                item.status === "done"
                  ? "bg-vcf-orange border-vcf-orange"
                  : item.status === "active"
                    ? "bg-white border-white animate-pulse"
                    : "bg-muted border-border";
              const textColor =
                item.status === "done"
                  ? "text-vcf-orange"
                  : item.status === "active"
                    ? "text-white"
                    : "text-muted-foreground";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-40px)] ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                  >
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:border-vcf-orange transition-colors">
                      <div
                        className={`font-black text-sm tracking-widest mb-2 ${textColor}`}
                      >
                        {item.year}
                      </div>
                      <h3 className="font-black text-xl text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {item.desc}
                      </p>
                      {item.status === "active" && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-white/10 border border-white/30 px-3 py-1 rounded-full">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-white font-black text-xs">
                            EN CURSO AHORA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`absolute left-4 md:left-1/2 top-6 w-8 h-8 rounded-full border-4 ${statusColor} -translate-x-1/2 z-10 flex items-center justify-center bg-background`}
                  >
                    <item.icon
                      size={14}
                      className={
                        item.status === "active"
                          ? "text-white"
                          : item.status === "future"
                            ? "text-muted-foreground"
                            : "text-vcf-orange"
                      }
                    />
                  </div>

                  <div className="hidden md:block md:w-[calc(50%-40px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WORLD CUP 2030 ──────────────────────────────────── */}
      <section className="relative overflow-hidden py-24">
        <img
          src={IMG_WORLDCUP}
          alt="Mundial 2030"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-vcf-orange/20 border border-vcf-orange/50 px-4 py-2 rounded-full mb-6">
              <Globe size={16} className="text-vcf-orange" />
              <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
                Posible sede
              </span>
            </div>
            <h2 className="text-6xl font-black text-white mb-6 leading-tight">
              MUNDIAL
              <br />
              <span className="text-vcf-orange">2030 🌍</span>
            </h2>
            <p className="text-white/80 text-xl leading-relaxed mb-8">
              La FIFA está considerando seriamente el{" "}
              <strong className="text-vcf-orange">
                Nou Mestalla
              </strong>{" "}
              como posible sede del Mundial 2030, co-organizado
              por España, Portugal y Marruecos. La condición
              fundamental: que el estadio esté terminado antes
              de 2028.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "🏆",
                  title: "Mundial 2030",
                  desc: "Posible sede oficial FIFA",
                },
                {
                  icon: "📅",
                  title: "Requisito",
                  desc: "Finalizado antes de 2028",
                },
                {
                  icon: "🌐",
                  title: "Co-sede",
                  desc: "España · Portugal · Marruecos",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center"
                >
                  <div className="text-4xl mb-2">{c.icon}</div>
                  <div className="text-white font-black text-base mb-1">
                    {c.title}
                  </div>
                  <div className="text-white/60 text-sm">
                    {c.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLAR & SUSTAINABILITY ──────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <img
              src={IMG_SOLAR}
              alt="Cubierta solar"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-vcf-orange/30">
                <Sun
                  size={28}
                  className="text-vcf-orange flex-shrink-0"
                />
                <div>
                  <div className="text-vcf-orange font-black text-base">
                    Cubierta fotovoltaica
                  </div>
                  <div className="text-white/70 text-sm">
                    Paneles solares integrados en el techo
                    translúcido
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 px-4 py-2 rounded-full mb-6">
              <Sun size={16} className="text-vcf-orange" />
              <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
                Sostenibilidad
              </span>
            </div>
            <h2 className="text-5xl font-black text-foreground mb-6 leading-tight">
              Un estadio{" "}
              <span className="text-vcf-orange">verde</span> y
              sostenible
            </h2>
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>
                La cubierta del Nou Mestalla no es solo un
                techo: es una{" "}
                <strong className="text-foreground">
                  central energética
                </strong>
                . Los paneles solares integrados en su
                superficie translúcida permitirán al estadio
                generar su propia energía limpia.
              </p>
              <p>
                Además, el diseño completo del recinto incluye
                sistemas de gestión eficiente del agua,
                iluminación LED de alta eficiencia y materiales
                de construcción de bajo impacto ambiental.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                {
                  icon: Sun,
                  label: "Energía solar",
                  value: "Autosuficiente",
                },
                {
                  icon: Zap,
                  label: "Iluminación LED",
                  value: "100%",
                },
                {
                  icon: Users,
                  label: "Todos cubiertos",
                  value: "70,000",
                },
                {
                  icon: Globe,
                  label: "Huella de carbono",
                  value: "Reducida",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-card border-2 border-border rounded-xl p-4 flex items-center gap-3 shadow-md"
                >
                  <s.icon
                    size={22}
                    className="text-vcf-orange flex-shrink-0"
                  />
                  <div>
                    <div className="font-black text-foreground text-base">
                      {s.value}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATION ────────────────────────────────────────── */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 px-4 py-2 rounded-full mb-6">
                <MapPin size={16} className="text-vcf-orange" />
                <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
                  Ubicación
                </span>
              </div>
              <h2 className="text-5xl font-black text-foreground mb-6 leading-tight">
                En el corazón de{" "}
                <span className="text-vcf-orange">
                  Valencia
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                El Nou Mestalla se levanta en la{" "}
                <strong className="text-foreground">
                  Avenida de las Cortes Valencianas
                </strong>
                , una ubicación estratégica en el norte de
                Valencia, perfectamente comunicada con
                transporte público y con amplias zonas de
                aparcamiento alrededor.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    label: "Dirección",
                    value:
                      "Av. de las Cortes Valencianas, Valencia",
                  },
                  {
                    icon: Building2,
                    label: "Arquitectos",
                    value: "Fenwick Iribarren Architects",
                  },
                  {
                    icon: Users,
                    label: "Capacidad",
                    value: "~70,000 espectadores",
                  },
                  {
                    icon: Calendar,
                    label: "Apertura",
                    value: "Verano 2027 (T2027-28)",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border shadow-sm"
                  >
                    <div className="w-10 h-10 bg-vcf-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <d.icon
                        size={20}
                        className="text-vcf-orange"
                      />
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">
                        {d.label}
                      </div>
                      <div className="font-black text-foreground text-base">
                        {d.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={IMG_VALENCIA_CITY}
                alt="Valencia ciudad"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-14 h-14 bg-vcf-orange rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                    <Building2
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-vcf-orange rotate-45 shadow-md" />
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white px-3 py-1.5 rounded-lg whitespace-nowrap font-black text-sm border border-vcf-orange/50">
                    Nou Mestalla 📍
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 px-4 py-2 rounded-full mb-4">
              <Award size={16} className="text-vcf-orange" />
              <span className="text-vcf-orange font-black text-sm uppercase tracking-widest">
                Preguntas frecuentes
              </span>
            </div>
            <h2 className="text-4xl font-black text-foreground">
              TODO LO QUE NECESITAS{" "}
              <span className="text-vcf-orange">SABER</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-md hover:border-vcf-orange transition-colors"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-black text-foreground text-base leading-snug">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp
                      size={20}
                      className="text-vcf-orange flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={20}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 pb-5 border-t border-border bg-muted/40"
                  >
                    <p className="text-muted-foreground text-base leading-relaxed pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-black via-vcf-orange/20 to-black border-t-2 border-vcf-orange py-16">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🦇</div>
          <h2 className="text-4xl font-black text-white mb-4">
            ¿LISTO PARA EL FUTURO?
          </h2>
          <p className="text-white/70 text-xl mb-8 max-w-xl mx-auto">
            Sigue de cerca la construcción del Nou Mestalla y
            vívelo junto a toda la afición valencianista.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-vcf-orange text-white rounded-xl font-black hover:bg-[#a86d12] transition-all shadow-lg hover:scale-105 flex items-center gap-2 text-lg">
              <Bell size={20} /> RECIBIR NOVEDADES
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-xl font-black hover:border-vcf-orange hover:text-vcf-orange transition-all text-lg">
              COMPARTIR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}