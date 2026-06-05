import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { type Card } from "../../services/cardsService";

interface PackOpenAnimationProps {
  isOpen: boolean;
  cards: Card[];
  onClose: () => void;
}

// Jagged rip SVG path for the tear edge
const RIP_PATH =
  "M0,14 Q8,2 18,14 T38,14 T58,12 T78,16 T98,12 T118,16 T138,12 T158,16 T178,12 T198,16 T218,12 T220,14";

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 44 }).map((_, i) => ({
    id: i,
    color: ["#ff6b35", "#f7931e", "#fdb913", "#ffffff", "#e85c17", "#ffdd57"][
      i % 6
    ],
    delay: Math.random() * 0.35,
    duration: 2.2 + Math.random() * 1.4,
    tx: (Math.random() - 0.5) * 420,
    ty: (Math.random() - 0.5) * 380,
    rot: Math.random() * 720 - 360,
    shape: Math.random() > 0.5 ? "50%" : "2px",
  }));

  return (
    <>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none fixed w-2.5 h-2.5 z-[200]"
          style={{
            background: p.color,
            borderRadius: p.shape,
            left: "50%",
            top: "40%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, rotate: p.rot, scale: 0.6 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </>
  );
}

export function PackOpenAnimation({
  isOpen,
  cards,
  onClose,
}: PackOpenAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "tearing" | "split" | "cards">(
    "idle",
  );
  const [pullProgress, setPullProgress] = useState(0); // 0–1
  const [cardRotations, setCardRotations] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const isDragging = useRef(false);
  const startY = useRef(0);
  const stripRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setPhase("idle");
      setPullProgress(0);
      setCardRotations({});
    }
  }, [isOpen]);

  /* ─── Drag handlers ─── */
  const getPointerY = (
    e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent,
  ) => ("touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY);

  const handleStripDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (phase !== "idle" && phase !== "tearing") return;
      isDragging.current = true;
      startY.current = getPointerY(e as any);
      setPhase("tearing");
      e.stopPropagation();
    },
    [phase],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const dy = startY.current - getPointerY(e); // negative = up
      const progress = Math.min(Math.max(dy / 90, 0), 1);
      setPullProgress(progress);
      if (progress >= 1) triggerSplit();
    };

    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (phase === "tearing") {
        // Snap back if not fully pulled
        setPullProgress(0);
        setPhase("idle");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [phase]);

  const triggerSplit = useCallback(() => {
    if (phase === "split" || phase === "cards") return;
    isDragging.current = false;
    setPhase("split");
    setTimeout(() => setPhase("cards"), 900);
  }, [phase]);

  /* ─── Card 3D hover ─── */
  const handleCardMouseMove = (
    id: string,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setCardRotations((p) => ({ ...p, [id]: { x: x * 28, y: y * 28 } }));
  };
  const handleCardMouseLeave = (id: string) =>
    setCardRotations((p) => ({ ...p, [id]: { x: 0, y: 0 } }));

  /* ─── Derived pack transforms from drag ─── */
  const topY = -pullProgress * 44;
  const botY = pullProgress * 44;
  const stripOpacity = 1 - pullProgress;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.45))",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => phase === "idle" && onClose()}
        >
          <Confetti active={phase === "split" || phase === "cards"} />

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 24 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ══════════ PACK (idle + tearing + split) ══════════ */}
            {phase !== "cards" && (
              <div className="relative" style={{ width: 220, height: 320 }}>
                {/* ── Top half ── */}
                <motion.div
                  className="absolute left-0 right-0 overflow-hidden rounded-t-3xl"
                  style={{
                    top: 0,
                    height: "30%",
                    transformOrigin: "top center",
                  }}
                  animate={
                    phase === "split"
                      ? { y: -180, rotate: -8, opacity: 0 }
                      : { y: topY, rotate: 0, opacity: 1 }
                  }
                  transition={
                    phase === "split"
                      ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 0 }
                  }
                >
                  <PackFace half="top" />
                  {/* Rip edge on bottom of top half */}
                  {pullProgress > 0.15 && (
                    <svg
                      className="absolute bottom-0 left-0 w-full pointer-events-none"
                      viewBox="0 0 220 16"
                      style={{ height: 16 }}
                    >
                      <path d={RIP_PATH} fill="rgba(200,77,18,0.6)" />
                    </svg>
                  )}
                </motion.div>

                {/* ── Bottom half ── */}
                <motion.div
                  className="absolute left-0 right-0 overflow-hidden rounded-b-3xl"
                  style={{
                    bottom: 0,
                    height: "70%",
                    transformOrigin: "bottom center",
                  }}
                  animate={
                    phase === "split"
                      ? { y: 180, rotate: 5, opacity: 0 }
                      : { y: botY, rotate: 0, opacity: 1 }
                  }
                  transition={
                    phase === "split"
                      ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 0 }
                  }
                >
                  <PackFace half="bottom" />
                  {/* Rip edge on top of bottom half */}
                  {pullProgress > 0.15 && (
                    <svg
                      className="absolute top-0 left-0 w-full pointer-events-none"
                      viewBox="0 0 220 16"
                      style={{ height: 16 }}
                    >
                      <path d={RIP_PATH} fill="rgba(200,77,18,0.6)" />
                    </svg>
                  )}
                </motion.div>

                {/* ── Tear strip ── */}
                <motion.div
                  ref={stripRef}
                  className="absolute left-0 right-0 z-20 flex items-center justify-center select-none"
                  style={{
                    top: "calc(30% - 14px)",
                    height: 28,
                    opacity: stripOpacity,
                    cursor:
                      phase === "idle" || phase === "tearing"
                        ? "ns-resize"
                        : "default",
                  }}
                  onMouseDown={handleStripDown}
                  onTouchStart={handleStripDown}
                >
                  <div
                    className="relative w-full h-full flex items-center justify-center gap-1.5"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      borderTop: "2.5px dashed rgba(200,77,18,0.4)",
                      borderBottom: "2.5px dashed rgba(200,77,18,0.4)",
                    }}
                  >
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#e85c17] opacity-60"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* ── Pull hint ── */}
                {phase === "idle" && (
                  <motion.p
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[#ff8a1f] text-xs font-bold whitespace-nowrap"
                    animate={{ opacity: [1, 0.45, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    ↑ Tira de los ... para abrir ↑
                  </motion.p>
                )}

                {/* ── Floating idle animation ── */}
                {phase === "idle" && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* ── Visual drag feedback: gap + rip line ── */}
                {pullProgress > 0.05 && (
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none flex items-center justify-center"
                    style={{
                      top: `calc(30% + ${topY}px - 1px)`,
                      height: Math.max(2, botY - topY),
                    }}
                  >
                    <svg
                      className="w-full"
                      viewBox="0 0 220 8"
                      style={{ height: 8 }}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,4 Q14,1 28,4 T56,4 T84,4 T112,4 T140,4 T168,4 T196,4 T220,4"
                        fill="none"
                        stroke="rgba(255,255,255,0.75)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}

            {/* ══════════ CARDS ══════════ */}
            {phase === "cards" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center gap-4 px-4"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-white font-black text-2xl drop-shadow-lg"
                >
                  ¡{cards.length} cartas reveladas!
                </motion.h2>

                <div className="grid grid-cols-5 gap-2 max-w-lg">
                  {cards.map((card, index) => {
                    const rot = cardRotations[card.id] || { x: 0, y: 0 };
                    return (
                      <motion.div
                        key={card.id}
                        className="group relative"
                        style={{
                          transformStyle: "preserve-3d",
                          perspective: 1000,
                        }}
                        initial={{ opacity: 0, scale: 0.4, rotateY: 180 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{
                          delay: 0.5 + index * 0.11,
                          duration: 0.8,
                          type: "spring",
                          stiffness: 75,
                          damping: 14,
                        }}
                        onMouseMove={(e) => handleCardMouseMove(card.id, e)}
                        onMouseLeave={() => handleCardMouseLeave(card.id)}
                      >
                        <motion.div
                          style={{
                            transformStyle: "preserve-3d",
                            aspectRatio: "2.5/3.5",
                          }}
                          animate={{ rotateX: rot.x, rotateY: rot.y }}
                          transition={{
                            type: "spring",
                            stiffness: 220,
                            damping: 20,
                          }}
                          className="w-full"
                        >
                          <div
                            className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                            style={{ background: "#f0f0f0" }}
                          >
                            {card.image_url ? (
                              <img
                                src={card.image_url}
                                alt={card.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#ff8a1f]/40 to-[#fdb913]/40 flex flex-col items-center justify-center p-2 gap-1">
                                <p className="font-black text-center text-gray-800 text-xs break-words leading-tight">
                                  {card.name}
                                </p>
                                {card.season && (
                                  <p className="text-[10px] text-gray-600 font-bold">
                                    #{card.season}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Holographic foil */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                              style={{
                                backgroundImage: `
                                  linear-gradient(105deg, rgba(138,43,226,0.3) 0%, transparent 40%),
                                  linear-gradient(200deg, rgba(0,191,255,0.3) 0%, transparent 40%),
                                  linear-gradient(270deg, rgba(255,215,0,0.2) 0%, transparent 40%),
                                  linear-gradient(45deg, rgba(255,105,180,0.2) 0%, transparent 40%)
                                `,
                              }}
                            />

                            {/* Rarity badge */}
                            {card.rarity && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  delay: 0.75 + index * 0.11,
                                  type: "spring",
                                  stiffness: 140,
                                }}
                                className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-lg text-[8px] font-black text-white shadow-lg ${
                                  ["legendary", "legendaria"].includes(
                                    card.rarity,
                                  )
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                    : ["epic", "epica"].includes(card.rarity)
                                      ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                      : ["rare", "rara"].includes(card.rarity)
                                        ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                                }`}
                                style={{
                                  boxShadow: [
                                    "legendary",
                                    "legendaria",
                                  ].includes(card.rarity)
                                    ? "0 0 12px rgba(255,215,0,0.7)"
                                    : ["epic", "epica"].includes(card.rarity)
                                      ? "0 0 12px rgba(147,51,234,0.7)"
                                      : ["rare", "rara"].includes(card.rarity)
                                        ? "0 0 12px rgba(59,130,246,0.7)"
                                        : undefined,
                                }}
                              >
                                {card.rarity}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.button
                  onClick={onClose}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + cards.length * 0.11 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-3.5 bg-gradient-to-r from-[#ff8a1f] to-[#fdb913] text-white font-black text-base rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                >
                  Continuar
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Pack face sub-component ── */
function PackFace({ half }: { half: "top" | "bottom" }) {
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ff8a1f 0%, #e85c17 60%, #c84d12 100%)",
      }}
    >
      {/* Holographic sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
        }}
        animate={{ x: [-300, 300] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />

      {half === "bottom" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <motion.span
            className="text-5xl"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📦
          </motion.span>
          <p className="text-white font-black text-xl tracking-widest drop-shadow-lg">
            SOBRE
          </p>
          <p className="text-white/85 font-bold text-xs tracking-[4px]">
            DE CARTAS
          </p>
        </div>
      )}

     
    </div>
  );
}
