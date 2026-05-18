import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Calendar, X, ChevronDown } from 'lucide-react'


type HeaderSectionProps = {
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
}

type OpenCard = "longest" | "total" | null;

function getBadge(totalDays: number): { label: string; color: string; next: number | null } {
    if (totalDays >= 100) return { label: "FAN LEGENDARIO",  color: "text-yellow-400",   next: null };
    if (totalDays >= 60)  return { label: "FAN VETERANO",    color: "text-purple-400",   next: 100  };
    if (totalDays >= 30)  return { label: "FAN DEDICADO",    color: "text-blue-400",     next: 60   };
    if (totalDays >= 14)  return { label: "FAN CONSTANTE",   color: "text-green-400",    next: 30   };
    if (totalDays >= 7)   return { label: "FAN ACTIVO",      color: "text-vcf-orange",   next: 14   };
    return                       { label: "FAN NUEVO",       color: "text-gray-400",     next: 7    };
}

function HeaderSection({ currentStreak, longestStreak, totalDays }: HeaderSectionProps) {
    const [openCard, setOpenCard] = useState<OpenCard>(null);
    const toggle = (card: Exclude<OpenCard, null>) =>
        setOpenCard(prev => prev === card ? null : card);

    // Últimos 14 días: los últimos min(streak, 14) están activos
    const clampedStreak = Math.min(currentStreak, 14);
    const calendarDays = Array.from({ length: 14 }, (_, i) => ({
        pos: i + 1,
        active: i + 1 > 14 - clampedStreak,
        isToday: i + 1 === 14,
    }));

    const daysUntilRecord = longestStreak - currentStreak;
    const isBreakingRecord = currentStreak > 0 && currentStreak >= longestStreak;
    const daysUntilWeeklyBonus = currentStreak % 7 === 0 && currentStreak > 0 ? 0 : 7 - (currentStreak % 7);
    const cyclesCompleted = Math.floor(totalDays / 14);
    const estimatedPoints = totalDays * 150;
    const badge = getBadge(totalDays);

    const panelVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" },
    };

    const active = (c: Exclude<OpenCard, null>) => openCard === c;

    const cardCls = (c: Exclude<OpenCard, null>) =>
        `relative cursor-pointer select-none rounded-2xl p-8 text-center border-2 transition-all duration-300 bg-card shadow-lg ${
            active(c) ? "border-vcf-orange" : "border-border hover:border-vcf-orange/50"
        }`;

    const iconCls    = () => "text-vcf-orange";
    const numCls     = () => "text-foreground";
    const labelCls   = () => "text-muted-foreground";
    const chevronCls = (c: Exclude<OpenCard, null>) =>
        `absolute bottom-3 right-3 text-muted-foreground transition-transform duration-300 ${active(c) ? "rotate-180" : ""}`;

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-5xl font-black mb-4 text-foreground">
                    RACHA DE <span className="text-vcf-orange">DÍAS</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    Inicia sesión cada día y reclama increíbles recompensas
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

                {/* RACHA ACTUAL — estático */}
                <div className="relative rounded-2xl p-8 text-center border-2 border-border bg-card shadow-lg">
                    <Flame size={48} className="mx-auto mb-4 text-vcf-orange" />
                    <div className="text-6xl font-black mb-2 text-foreground">{currentStreak}</div>
                    <div className="text-lg font-bold text-muted-foreground">RACHA ACTUAL</div>
                </div>

                {/* RACHA MÁS LARGA */}
                <motion.div
                    onClick={() => toggle("longest")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={cardCls("longest")}
                >
                    <Trophy size={48} className={`mx-auto mb-4 ${iconCls()}`} />
                    <div className={`text-6xl font-black mb-2 ${numCls()}`}>{longestStreak}</div>
                    <div className={`text-lg font-bold ${labelCls()}`}>RACHA MÁS LARGA</div>
                    <ChevronDown size={16} className={chevronCls("longest")} />
                </motion.div>

                {/* DÍAS TOTALES */}
                <motion.div
                    onClick={() => toggle("total")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={cardCls("total")}
                >
                    <Calendar size={48} className={`mx-auto mb-4 ${iconCls()}`} />
                    <div className={`text-6xl font-black mb-2 ${numCls()}`}>{totalDays}</div>
                    <div className={`text-lg font-bold ${labelCls()}`}>DÍAS TOTALES</div>
                    <ChevronDown size={16} className={chevronCls("total")} />
                </motion.div>
            </div>

            {/* ── Paneles expandibles ─────────────────────────────────────────── */}
            <AnimatePresence>

                {/* Panel: RACHA MÁS LARGA */}
                {openCard === "longest" && (
                    <motion.div
                        key="longest-panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden mb-4"
                    >
                        <div className="bg-card border-2 border-vcf-orange rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-xl font-black text-foreground">TU RÉCORD PERSONAL</h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setOpenCard(null); }}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {isBreakingRecord ? (
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-vcf-orange rounded-xl p-6 text-center"
                                >
                                    <Trophy size={44} className="mx-auto mb-3 text-white" />
                                    <p className="text-white font-black text-2xl mb-1">¡NUEVO RÉCORD!</p>
                                    <p className="text-white/80 text-sm">
                                        Llevas {currentStreak} días — tu anterior marca era {longestStreak}
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-black text-muted-foreground">PROGRESO HACIA TU RÉCORD</span>
                                        <span className="text-sm font-black text-vcf-orange">
                                            {currentStreak} / {longestStreak} días
                                        </span>
                                    </div>

                                    {/* Segmentos por día */}
                                    <div className="flex gap-1 mb-2">
                                        {Array.from({ length: longestStreak }, (_, i) => (
                                            <motion.div
                                                key={i}
                                                className={`flex-1 h-7 rounded-sm ${
                                                    i < currentStreak
                                                        ? "bg-vcf-orange"
                                                        : "bg-muted border border-border"
                                                }`}
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: 1 }}
                                                transition={{ delay: i * 0.025, duration: 0.15, ease: "easeOut" }}
                                                style={{ originY: 1 }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black text-muted-foreground mb-5">
                                        <span>DÍA 1</span>
                                        <span>DÍA {longestStreak}</span>
                                    </div>

                                    <div className="bg-muted/50 rounded-xl p-5 text-center">
                                        <p className="text-5xl font-black text-foreground mb-1">{daysUntilRecord}</p>
                                        <p className="text-sm font-bold text-muted-foreground">
                                            {daysUntilRecord === 1
                                                ? "día para superar tu récord"
                                                : "días para superar tu récord"}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Panel: DÍAS TOTALES */}
                {openCard === "total" && (
                    <motion.div
                        key="total-panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden mb-4"
                    >
                        <div className="bg-card border-2 border-vcf-orange rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-xl font-black text-foreground">TUS LOGROS</h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setOpenCard(null); }}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="bg-muted/50 rounded-xl p-4 text-center">
                                    <p className="text-4xl font-black text-vcf-orange">{cyclesCompleted}</p>
                                    <p className="text-xs font-black text-muted-foreground mt-1 tracking-wide">CICLOS DE 14 DÍAS</p>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-4 text-center">
                                    <p className="text-4xl font-black text-vcf-orange">~{estimatedPoints.toLocaleString()}</p>
                                    <p className="text-xs font-black text-muted-foreground mt-1 tracking-wide">PUNTOS GANADOS</p>
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="flex items-center gap-4 border-2 border-vcf-orange/30 rounded-xl p-4">
                                <div className="w-14 h-14 rounded-full bg-vcf-orange/10 border-2 border-vcf-orange/30 flex items-center justify-center flex-shrink-0">
                                    <Trophy size={28} className="text-vcf-orange" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground tracking-widest mb-0.5">TU TÍTULO</p>
                                    <p className={`text-2xl font-black ${badge.color}`}>{badge.label}</p>
                                    {badge.next !== null && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Próximo título a los <span className="font-bold text-foreground">{badge.next} días</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* Progress Bar */}
            {(() => {
                const daysInWeek = currentStreak % 7 === 0 && currentStreak > 0 ? 7 : currentStreak % 7;
                return (
                    <div className="bg-card border-2 border-border rounded-2xl p-8 mb-12 shadow-lg">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-2xl font-black text-foreground">PROGRESO SEMANAL</h2>
                            <span className="text-lg font-bold text-vcf-orange">{daysInWeek}/7 días</span>
                        </div>
                        <div className="flex gap-2">
                            {Array.from({ length: 7 }, (_, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        className={`w-full h-8 rounded-md ${i < daysInWeek ? "bg-vcf-orange" : "bg-muted border border-border"}`}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ delay: i * 0.07, duration: 0.2, ease: "easeOut" }}
                                        style={{ originY: 1 }}
                                    />
                                    <span className={`text-[11px] font-black ${i < daysInWeek ? "text-vcf-orange" : "text-muted-foreground"}`}>
                                        {["L", "M", "X", "J", "V", "S", "D"][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}
        </>
    );
}

export default HeaderSection
