import { useState, useRef, useCallback } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

// ─── Card Data ────────────────────────────────────────────────────────────────
const CARDS = [
  { id: 1, name: "Dragón Celestial", type: "legendary", power: 98, color: "#ff6b00,#ffd700", emoji: "🐉" },
  { id: 2, name: "Fénix de Cristal",  type: "rare",      power: 82, color: "#00c6ff,#7b2ff7", emoji: "🦅" },
  { id: 3, name: "Lobo Ártico",       type: "uncommon",  power: 67, color: "#56ccf2,#2f80ed", emoji: "🐺" },
  { id: 4, name: "Golem de Piedra",   type: "common",    power: 44, color: "#636e72,#b2bec3", emoji: "🗿" },
  { id: 5, name: "Sirena Oscura",     type: "rare",      power: 79, color: "#a29bfe,#6c5ce7", emoji: "🧜" },
];

const TYPE_STYLES = {
  legendary: { label: "LEGENDARIA", glow: "#ffd700", badge: "#ff6b00" },
  rare:      { label: "RARA",       glow: "#7b2ff7", badge: "#6c5ce7" },
  uncommon:  { label: "POCO COMÚN", glow: "#2f80ed", badge: "#2980b9" },
  common:    { label: "COMÚN",      glow: "#636e72", badge: "#b2bec3" },
};

// ─── Holographic Card ─────────────────────────────────────────────────────────
function HoloCard({ card, delay, onDismiss }) {
  const cardRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [holo, setHolo] = useState({ x: 50, y: 50, active: false });
  const ts = TYPE_STYLES[card.type];

  const [spring, api] = useSpring(() => ({
    rotateY: 180,
    scale: 0.6,
    opacity: 0,
    y: 60,
    config: config.gentle,
  }));

  // Entrada con delay
  setTimeout(() => {
    api.start({ rotateY: 180, scale: 1, opacity: 1, y: 0, delay: delay * 120 });
    setTimeout(() => setFlipped(true), delay * 120 + 400);
  }, 50);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHolo({ x, y, active: true });
    const rotX = (y - 50) * -0.3;
    const rotY = (x - 50) * 0.3;
    cardRef.current.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${flipped ? 0 + rotY : 180 + rotY}deg) scale(1.04)`;
  }, [flipped]);

  const handleMouseLeave = useCallback(() => {
    setHolo({ x: 50, y: 50, active: false });
    if (cardRef.current)
      cardRef.current.style.transform = `perspective(600px) rotateY(${flipped ? 0 : 180}deg) scale(1)`;
  }, [flipped]);

  const [dismiss, dismissApi] = useSpring(() => ({ opacity: 1, y: 0 }));
  const handleDismiss = () => {
    dismissApi.start({ opacity: 0, y: -40, config: config.stiff, onRest: onDismiss });
  };

  const grad = card.color;

  return (
    <animated.div style={{ ...spring, ...dismiss, display: "inline-block" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleDismiss}
        style={{
          width: 160,
          height: 224,
          borderRadius: 16,
          cursor: "pointer",
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease",
          transform: `perspective(600px) rotateY(${flipped ? 0 : 180}deg)`,
          position: "relative",
        }}
      >
        {/* Cara trasera */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16,
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
          backfaceVisibility: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: 48, opacity: 0.3 }}>✦</div>
        </div>

        {/* Cara delantera */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16,
          background: `linear-gradient(135deg, ${grad})`,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          overflow: "hidden",
          boxShadow: `0 8px 32px ${ts.glow}66, 0 0 0 2px ${ts.glow}44`,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "12px",
        }}>
          {/* Efecto holográfico */}
          {holo.active && (
            <div style={{
              position: "absolute", inset: 0, borderRadius: 16,
              background: `radial-gradient(circle at ${holo.x}% ${holo.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              pointerEvents: "none", zIndex: 2,
              mixBlendMode: "overlay",
            }} />
          )}
          {/* Shimmer lines */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 16,
            background: `repeating-linear-gradient(
              ${holo.active ? holo.x * 1.8 : 45}deg,
              transparent 0px, transparent 6px,
              rgba(255,255,255,0.04) 6px, rgba(255,255,255,0.04) 7px
            )`,
            pointerEvents: "none", zIndex: 1,
          }} />

          <div style={{ position: "relative", zIndex: 3 }}>
            <div style={{
              background: ts.badge, color: "#fff",
              fontSize: 9, fontWeight: 800, letterSpacing: 2,
              padding: "2px 8px", borderRadius: 20, display: "inline-block",
              fontFamily: "monospace",
            }}>
              {ts.label}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
            <div style={{ fontSize: 52, filter: `drop-shadow(0 0 12px ${ts.glow})` }}>
              {card.emoji}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 3 }}>
            <div style={{
              color: "#fff", fontWeight: 800, fontSize: 13,
              fontFamily: "'Georgia', serif", textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              marginBottom: 4,
            }}>
              {card.name}
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "monospace" }}>
                PWR
              </div>
              <div style={{
                color: "#fff", fontWeight: 900, fontSize: 18,
                textShadow: `0 0 10px ${ts.glow}`,
              }}>
                {card.power}
              </div>
            </div>
            <div style={{
              height: 4, borderRadius: 2, marginTop: 4,
              background: "rgba(255,255,255,0.2)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 2,
                width: `${card.power}%`,
                background: `linear-gradient(90deg, rgba(255,255,255,0.9), ${ts.glow})`,
              }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 8, color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
        clic para continuar
      </div>
    </animated.div>
  );
}

// ─── Pack Opener ──────────────────────────────────────────────────────────────
function PackOpener({ onOpen }) {
  const THRESHOLD = 90;
  const [pulled, setPulled] = useState(0);
  const [opened, setOpened] = useState(false);
  const [tearProgress, setTearProgress] = useState(0);

  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(({ down, movement: [, my], cancel }) => {
    if (opened) return;
    const clamped = Math.max(0, Math.min(my, THRESHOLD + 30));
    if (!down) {
      if (clamped >= THRESHOLD) {
        api.start({ y: 160, config: config.wobbly });
        setOpened(true);
        setTearProgress(100);
        setTimeout(onOpen, 600);
      } else {
        api.start({ y: 0, config: config.wobbly });
        setPulled(0);
        setTearProgress(0);
      }
    } else {
      api.start({ y: clamped, immediate: true });
      setPulled(clamped);
      setTearProgress((clamped / THRESHOLD) * 100);
    }
  }, { axis: "y", from: () => [0, y.get()] });

  const progress = Math.min(pulled / THRESHOLD, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {/* Instrucción */}
      <div style={{
        color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 16,
        letterSpacing: 2, fontFamily: "monospace", textTransform: "uppercase",
        animation: opened ? "none" : "pulse 2s ease infinite",
      }}>
        ↓ arrastra el tab para abrir
      </div>

      {/* Sobre principal */}
      <div style={{ position: "relative", width: 200, userSelect: "none" }}>
        {/* Sombra dinámica */}
        <div style={{
          position: "absolute", bottom: -20, left: "50%",
          transform: "translateX(-50%)",
          width: 160, height: 20,
          background: "rgba(0,0,0,0.4)",
          borderRadius: "50%",
          filter: "blur(12px)",
          opacity: 1 - progress * 0.6,
        }} />

        {/* Cuerpo del sobre */}
        <div style={{
          width: 200, height: 300, borderRadius: "12px 12px 8px 8px",
          background: "linear-gradient(160deg, #1a0533 0%, #2d0a5e 40%, #1a0533 100%)",
          border: "2px solid rgba(180,100,255,0.3)",
          boxShadow: `
            0 20px 60px rgba(120,0,255,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 0 0 1px rgba(120,0,255,0.2)
          `,
          position: "relative",
          overflow: "hidden",
          transform: `perspective(400px) rotateX(${progress * -4}deg)`,
          transition: "transform 0.1s ease",
        }}>
          {/* Brillo interior */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(180deg, rgba(180,100,255,0.08) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />

          {/* Patrón de fondo */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(180,100,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(100,0,255,0.08) 0%, transparent 50%)`,
            pointerEvents: "none",
          }} />

          {/* Estrella central */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 64, opacity: 0.15 + progress * 0.1,
            filter: `blur(${progress * 2}px)`,
            pointerEvents: "none",
          }}>✦</div>

          {/* Logo del pack */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 36, marginBottom: 8,
              filter: `drop-shadow(0 0 ${8 + progress * 12}px #a855f7)`,
            }}>⚡</div>
            <div style={{
              color: "rgba(200,150,255,0.9)", fontSize: 11,
              fontFamily: "monospace", letterSpacing: 3,
              textTransform: "uppercase", fontWeight: 700,
            }}>Sobre</div>
            <div style={{
              color: "rgba(200,150,255,0.6)", fontSize: 9,
              fontFamily: "monospace", letterSpacing: 2,
            }}>EDICIÓN ESPECIAL</div>
          </div>

          {/* Línea de tear */}
          {tearProgress > 0 && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: 3,
              background: `linear-gradient(90deg,
                transparent ${0}%,
                rgba(255,255,255,0.8) ${Math.min(tearProgress, 100)}%,
                transparent ${Math.min(tearProgress, 100)}%
              )`,
              boxShadow: tearProgress > 30 ? "0 0 8px rgba(255,255,255,0.6)" : "none",
            }} />
          )}

          {/* Efecto tear visual en el sobre */}
          {tearProgress > 10 && (
            <div style={{
              position: "absolute", top: 0, left: "5%", right: "5%",
              height: `${tearProgress * 0.8}%`,
              maxHeight: "60%",
              background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
              borderRadius: "0 0 40% 40%",
              pointerEvents: "none",
            }} />
          )}
        </div>

        {/* TAB arrastrable */}
        <animated.div
          {...bind()}
          style={{
            y,
            position: "absolute",
            top: -16,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            zIndex: 10,
            cursor: opened ? "default" : "grab",
            touchAction: "none",
          }}
        >
          {/* Strip visual */}
          <div style={{
            width: 60,
            height: 32,
            borderRadius: "6px 6px 0 0",
            background: `linear-gradient(160deg, 
              hsl(${270 + progress * 60}, 80%, ${55 + progress * 20}%) 0%, 
              hsl(${290 + progress * 40}, 90%, 40%) 100%
            )`,
            boxShadow: `
              0 -4px 16px rgba(180,100,255,${0.3 + progress * 0.5}),
              inset 0 1px 0 rgba(255,255,255,0.3)
            `,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Líneas del strip */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `repeating-linear-gradient(
                90deg, transparent 0, transparent 4px,
                rgba(255,255,255,0.07) 4px, rgba(255,255,255,0.07) 5px
              )`,
            }} />
            {/* Flecha */}
            <div style={{
              color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 900,
              transform: `rotate(${180 + progress * 0}deg)`,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
            }}>
              {opened ? "✓" : "↓"}
            </div>
          </div>

          {/* Dientes de perforación */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            padding: "0 6px",
            marginTop: -1,
          }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6,
                borderRadius: "0 0 50% 50%",
                background: "linear-gradient(180deg, #2d0a5e, #1a0533)",
                boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.5)",
              }} />
            ))}
          </div>
        </animated.div>

        {/* Barra de progreso debajo */}
        <div style={{
          width: 200, height: 3,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 2, marginTop: 12, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: `${Math.min(progress * 100, 100)}%`,
            background: "linear-gradient(90deg, #a855f7, #ec4899)",
            transition: "width 0.05s linear",
            boxShadow: "0 0 8px #a855f7",
          }} />
        </div>
        <div style={{
          textAlign: "center", color: "rgba(180,100,255,0.5)",
          fontSize: 10, marginTop: 6, fontFamily: "monospace",
        }}>
          {opened ? "¡ABIERTO!" : `${Math.round(progress * 100)}% — ${progress >= 1 ? "¡suelta!" : "sigue tirando..."}`}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5 }
          50% { opacity: 1 }
        }
      `}</style>
    </div>
  );
}

// ─── Reveal Screen ────────────────────────────────────────────────────────────
function CardReveal({ onReset }) {
  const [dismissed, setDismissed] = useState([]);

  const handleDismiss = (id) => setDismissed(p => [...p, id]);
  const remaining = CARDS.filter(c => !dismissed.includes(c.id));

  if (remaining.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          ¡Colección completa!
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 24 }}>
          Has visto todas las cartas del sobre
        </div>
        <button
          onClick={onReset}
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            border: "none", borderRadius: 12, padding: "12px 28px",
            color: "#fff", fontWeight: 700, fontSize: 14,
            cursor: "pointer", letterSpacing: 1,
            boxShadow: "0 4px 20px rgba(168,85,247,0.4)",
          }}
        >
          Abrir otro sobre
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        color: "rgba(255,255,255,0.5)", fontSize: 11, textAlign: "center",
        marginBottom: 20, letterSpacing: 2, fontFamily: "monospace",
      }}>
        {remaining.length} carta{remaining.length !== 1 ? "s" : ""} restante{remaining.length !== 1 ? "s" : ""}
      </div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16,
        justifyContent: "center", maxWidth: 560,
      }}>
        {remaining.map((card, i) => (
          <HoloCard
            key={card.id}
            card={card}
            delay={i}
            onDismiss={() => handleDismiss(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("pack"); // "pack" | "reveal"
  const [key, setKey] = useState(0);

  const handleReset = () => {
    setPhase("pack");
    setKey(k => k + 1);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 0%, #1a003a 0%, #0a0015 50%, #000510 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "'Georgia', serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{
          fontSize: 11, letterSpacing: 6, color: "rgba(168,85,247,0.6)",
          fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8,
        }}>
          Colección Digital
        </div>
        <h1 style={{
          margin: 0, fontSize: 28, fontWeight: 900,
          background: "linear-gradient(135deg, #e879f9, #a855f7, #818cf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: -1,
        }}>
          CardVault
        </h1>
      </div>

      {/* Content */}
      {phase === "pack" ? (
        <PackOpener key={key} onOpen={() => setPhase("reveal")} />
      ) : (
        <CardReveal onReset={handleReset} />
      )}
    </div>
  );
}