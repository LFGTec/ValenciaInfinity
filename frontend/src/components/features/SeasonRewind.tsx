import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, X, Play, Star, Trophy, Flame,
  Zap, Heart, Users, Target, Award, TrendingUp, Share2,
  Volume2, VolumeX
} from 'lucide-react';

const STADIUM_IMG = "https://images.unsplash.com/photo-1765130729366-b54d7b2c8ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const CELEBRATION_IMG = "https://images.unsplash.com/photo-1698786039213-1d3aec21c6ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const AERIAL_IMG = "https://images.unsplash.com/photo-1754253780399-aa2dcd99eded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const TROPHY_IMG = "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const BALL_IMG = "https://images.unsplash.com/photo-1604329003703-dcd7f21527e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

interface Slide {
  id: number;
  type: 'intro' | 'stat' | 'achievement' | 'moment' | 'finale';
  bg: string;
  accent: string;
}

const slides: Slide[] = [
  { id: 0, type: 'intro', bg: 'from-black via-[#1a0a00] to-[#D18817]', accent: '#D18817' },
  { id: 1, type: 'stat', bg: 'from-[#001a2e] via-[#002a4a] to-[#0097D8]', accent: '#0097D8' },
  { id: 2, type: 'stat', bg: 'from-black via-[#1a0000] to-[#EE3524]', accent: '#EE3524' },
  { id: 3, type: 'achievement', bg: 'from-[#1a1500] via-[#2a2200] to-[#FFDF1B]', accent: '#FFDF1B' },
  { id: 4, type: 'moment', bg: 'from-black via-[#0a1500] to-[#1a3000]', accent: '#4CAF50' },
  { id: 5, type: 'stat', bg: 'from-[#1a0030] via-[#2d0060] to-[#8B00FF]', accent: '#B060FF' },
  { id: 6, type: 'achievement', bg: 'from-black via-[#1a0a00] to-[#D18817]', accent: '#D18817' },
  { id: 7, type: 'finale', bg: 'from-black via-[#1a0000] to-[#8B0000]', accent: '#EE3524' },
];

// Particle component
function Particles({ color }: { color: string }) {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-70"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -Math.random() * 200 - 50],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0.7, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Animated counter
function Counter({ value, suffix = '', duration = 1500 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display.toLocaleString()}{suffix}</>;
}

// Progress bar at top
function ProgressBar({ current, total, accent }: { current: number; total: number; accent: string }) {
  return (
    <div className="flex gap-1 w-full">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
          {i < current ? (
            <div className="h-full w-full rounded-full" style={{ backgroundColor: accent }} />
          ) : i === current ? (
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accent }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

// === SLIDE COMPONENTS ===

function SlideIntro() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white text-center px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${STADIUM_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      <Particles color="#D18817" />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D18817] to-[#FFDF1B] flex items-center justify-center mb-6 shadow-2xl shadow-[#D18817]/50"
        >
          <Trophy size={48} className="text-black" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-[#D18817] tracking-[0.3em] uppercase mb-2"
          style={{ fontSize: '0.85rem' }}
        >
          Valencia CF • Temporada
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="font-black leading-none mb-2"
          style={{ fontSize: 'clamp(4rem, 15vw, 8rem)' }}
        >
          2025
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, type: 'spring' }}
          className="font-black leading-none text-[#D18817] mb-6"
          style={{ fontSize: 'clamp(3rem, 12vw, 6rem)' }}
        >
          REWIND
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-white/70 max-w-xs"
        >
          Tu año como fan del Valencia CF. Revive cada momento.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 flex items-center gap-2 text-white/50"
        >
          <span style={{ fontSize: '0.8rem' }}>Toca para continuar</span>
          <ChevronRight size={16} />
        </motion.div>
      </div>
    </div>
  );
}

function SlideMatches() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${AERIAL_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a2e]/95 via-[#002a4a]/90 to-[#0097D8]/80" />
      <Particles color="#0097D8" />
      <div className="relative z-10 w-full max-w-sm">
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#0097D8] tracking-widest uppercase mb-2"
          style={{ fontSize: '0.8rem' }}
        >
          Este año viste...
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          className="mb-4"
        >
          <span className="font-black text-white" style={{ fontSize: 'clamp(5rem, 20vw, 9rem)', lineHeight: 1 }}>
            <Counter value={38} duration={1200} />
          </span>
          <span className="font-black text-[#0097D8]" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
            {' '}partidos
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/70 mb-8"
        >
          Estuviste presente en cada jornada de LaLiga esta temporada.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Victorias', value: 22, color: '#4CAF50', icon: '🏆' },
            { label: 'Empates', value: 9, color: '#FFDF1B', icon: '🤝' },
            { label: 'Derrotas', value: 7, color: '#EE3524', icon: '💔' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.15 }}
              className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: s.color + '22', border: `1px solid ${s.color}44` }}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-2xl" style={{ color: s.color }}>{s.value}</div>
              <div className="text-white/60" style={{ fontSize: '0.7rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function SlideGoals() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CELEBRATION_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-[#1a0000]/90 to-[#EE3524]/60" />
      <Particles color="#EE3524" />
      <div className="relative z-10 w-full max-w-sm text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl mb-4"
        >
          ⚽
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#EE3524] tracking-widest uppercase mb-3"
          style={{ fontSize: '0.8rem' }}
        >
          Presenciaste
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 80 }}
        >
          <span className="font-black" style={{ fontSize: 'clamp(5rem, 20vw, 9rem)', lineHeight: 1 }}>
            <Counter value={71} duration={1000} />
          </span>
          <div className="font-black text-[#EE3524]" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>
            goles
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-white/70 mt-4 mb-6"
        >
          Cada uno te hizo saltar de tu asiento. Algunos los gritaste hasta quedarte sin voz.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="rounded-2xl p-4"
          style={{ backgroundColor: '#EE352422', border: '1px solid #EE352444' }}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div className="text-left">
              <div className="font-black text-[#EE3524]">Gol más gritado</div>
              <div className="text-white/80" style={{ fontSize: '0.85rem' }}>Pepelu min. 87' vs Real Madrid</div>
              <div className="text-white/50" style={{ fontSize: '0.75rem' }}>Remontada épica en Mestalla</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideAchievements() {
  const badges = [
    { icon: '🦇', label: 'Murciélago de Oro', desc: 'Top 1% de fans', unlocked: true },
    { icon: '🎯', label: 'Trivia Master', desc: '500 respuestas correctas', unlocked: true },
    { icon: '📸', label: 'Coleccionista', desc: 'Álbum 100% completo', unlocked: true },
    { icon: '🤝', label: 'Intercambiador', desc: '50 intercambios exitosos', unlocked: true },
    { icon: '🌍', label: 'Global Fan', desc: 'Conectado desde 3 países', unlocked: false },
    { icon: '👑', label: 'Leyenda', desc: '365 días seguidos', unlocked: false },
  ];
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1500] via-[#2a2200] to-[#3d3300]" />
      <Particles color="#FFDF1B" />
      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-2"
        >
          <Award size={20} className="text-[#FFDF1B]" />
          <span className="text-[#FFDF1B] tracking-widest uppercase" style={{ fontSize: '0.8rem' }}>
            Logros desbloqueados
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="font-black mb-6"
          style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}
        >
          TU AÑO<br />
          <span className="text-[#FFDF1B]">EN LOGROS</span>
        </motion.h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
              className={`rounded-2xl p-3 flex items-center gap-3 ${b.unlocked ? '' : 'opacity-30'}`}
              style={{
                backgroundColor: b.unlocked ? '#FFDF1B22' : '#ffffff11',
                border: `1px solid ${b.unlocked ? '#FFDF1B55' : '#ffffff22'}`,
              }}
            >
              <div className="text-2xl">{b.icon}</div>
              <div>
                <div className="font-black text-sm text-white leading-tight">{b.label}</div>
                <div className="text-white/50" style={{ fontSize: '0.65rem' }}>{b.desc}</div>
              </div>
              {b.unlocked && (
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full bg-[#FFDF1B] flex items-center justify-center">
                    <span style={{ fontSize: '0.6rem' }}>✓</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideMoment() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BALL_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
      <div className="relative z-10 w-full max-w-sm">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#4CAF50] tracking-widest uppercase mb-3"
          style={{ fontSize: '0.8rem' }}
        >
          ✦ Tu momento del año ✦
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl overflow-hidden mb-4"
          style={{ border: '2px solid #4CAF5055' }}
        >
          <div
            className="h-44 bg-cover bg-center"
            style={{ backgroundImage: `url(${STADIUM_IMG})` }}
          />
          <div className="p-4 bg-black/80">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 tracking-wide" style={{ fontSize: '0.7rem' }}>JORNADA 34 • 12 MAY 2025</span>
            </div>
            <div className="font-black text-xl">Valencia CF 3 — 2 Atlético</div>
            <div className="text-white/60 mt-1" style={{ fontSize: '0.8rem' }}>Remontada histórica en Mestalla</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { label: 'Reacciones tuyas', value: '847', icon: '❤️' },
            { label: 'En match room', value: '3h 24m', icon: '👥' },
            { label: 'Trivias jugadas', value: '12', icon: '🎯' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: '#ffffff11', border: '1px solid #ffffff22' }}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black text-white">{s.value}</div>
              <div className="text-white/50" style={{ fontSize: '0.6rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function SlideTrivia() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0030] via-[#2d0060] to-[#6000cc]" />
      <Particles color="#B060FF" />
      <div className="relative z-10 w-full max-w-sm text-center">
        <motion.div
          initial={{ opacity: 0, rotate: -10, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-7xl mb-4"
        >
          🧠
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#B060FF] tracking-widest uppercase mb-2"
          style={{ fontSize: '0.8rem' }}
        >
          Eres un crack en trivias
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 80 }}
        >
          <span className="font-black text-white" style={{ fontSize: 'clamp(4rem, 18vw, 8rem)', lineHeight: 1 }}>
            <Counter value={1247} duration={1200} />
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="font-black text-[#B060FF] mb-4"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}
        >
          preguntas respondidas
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Aciertos', value: '89%', color: '#4CAF50', icon: '✅' },
            { label: 'Racha máxima', value: '42', color: '#FFDF1B', icon: '🔥' },
            { label: 'Ranking global', value: '#3', color: '#B060FF', icon: '👑' },
            { label: 'XP ganados', value: '8,540', color: '#0097D8', icon: '⚡' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + i * 0.1 }}
              className="rounded-2xl p-3 text-center"
              style={{ backgroundColor: s.color + '22', border: `1px solid ${s.color}44` }}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black" style={{ color: s.color, fontSize: '1.2rem' }}>{s.value}</div>
              <div className="text-white/60" style={{ fontSize: '0.65rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function SlideCards() {
  const cards = [
    { name: 'Pepelu', rating: 88, color: '#D18817', pos: 'MED' },
    { name: 'Mamardashvili', rating: 92, color: '#0097D8', pos: 'POR' },
    { name: 'Hugo Duro', rating: 85, color: '#EE3524', pos: 'DEL' },
  ];
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0a00] to-[#2d1500]" />
      <Particles color="#D18817" />
      <div className="relative z-10 w-full max-w-sm">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#D18817] tracking-widest uppercase mb-2"
          style={{ fontSize: '0.8rem' }}
        >
          Tu álbum este año
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="font-black mb-2"
          style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}
        >
          <Counter value={156} duration={1000} />
          <span className="text-[#D18817]"> cartas</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/60 mb-6"
        >
          Coleccionadas, intercambiadas y atesoradas durante la temporada.
        </motion.p>
        <div className="flex gap-3 justify-center mb-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 40, rotate: (i - 1) * 8 }}
              animate={{ opacity: 1, y: 0, rotate: (i - 1) * 5 }}
              transition={{ delay: 1 + i * 0.2, type: 'spring', stiffness: 100 }}
              className="rounded-2xl p-3 w-24 text-center shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${card.color}33, ${card.color}11)`,
                border: `2px solid ${card.color}88`,
                boxShadow: `0 0 20px ${card.color}44`,
              }}
            >
              <div className="text-xs text-white/50 mb-1">{card.pos}</div>
              <div
                className="w-14 h-14 rounded-xl mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: card.color + '33', border: `1px solid ${card.color}66` }}
              >
                <span className="text-2xl">⚽</span>
              </div>
              <div className="font-black text-xs text-white leading-tight">{card.name}</div>
              <div className="font-black mt-1" style={{ color: card.color, fontSize: '1.1rem' }}>{card.rating}</div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ backgroundColor: '#D1881722', border: '1px solid #D1881744' }}
        >
          <div>
            <div className="font-black text-[#D18817]">Carta más rara</div>
            <div className="text-white/70 text-sm">Mamardashvili ICON 🌟</div>
          </div>
          <div className="text-4xl">💎</div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideFinale() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-white text-center px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${TROPHY_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60" />
      <Particles color="#EE3524" />
      <Particles color="#FFDF1B" />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 60 }}
          className="text-7xl mb-6"
        >
          🦇
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[#D18817] tracking-widest uppercase mb-3"
          style={{ fontSize: '0.8rem' }}
        >
          Eres parte de algo grande
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-black mb-2"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', lineHeight: 1.1 }}
        >
          AMUNT<br />
          <span className="text-[#D18817]">VALENCIA!</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-white/70 max-w-xs mb-8"
        >
          Gracias por vivir cada partido, cada trivia y cada momento con nosotros. Hasta la próxima temporada.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6"
        >
          {[
            { label: 'Puesto en ranking', value: '#7', emoji: '🏆' },
            { label: 'Días activo', value: '312', emoji: '📅' },
            { label: 'XP total', value: '24,850', emoji: '⚡' },
            { label: 'Amigos fans', value: '89', emoji: '👥' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + i * 0.1 }}
              className="rounded-2xl p-3 text-center"
              style={{ backgroundColor: '#ffffff11', border: '1px solid #ffffff22' }}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-black text-[#FFDF1B]">{s.value}</div>
              <div className="text-white/50" style={{ fontSize: '0.65rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.4 }}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-black text-black shadow-xl"
          style={{ backgroundColor: '#FFDF1B' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 size={18} />
          COMPARTIR MI REWIND
        </motion.button>
      </div>
    </div>
  );
}

const SLIDE_COMPONENTS = [
  SlideIntro,
  SlideMatches,
  SlideGoals,
  SlideAchievements,
  SlideMoment,
  SlideTrivia,
  SlideCards,
  SlideFinale,
];

const SLIDE_DURATION = 6000; // auto-advance ms

export function SeasonRewind({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;

  const goTo = (idx: number, dir: number) => {
    if (idx < 0 || idx >= total) return;
    setDirection(dir);
    setCurrent(idx);
  };

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      if (current < total - 1) goTo(current + 1, 1);
    }, SLIDE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const w = (e.currentTarget as HTMLElement).offsetWidth;
    const x = e.clientX - (e.currentTarget as HTMLElement).getBoundingClientRect().left;
    if (x < w * 0.3) {
      goTo(current - 1, -1);
    } else if (x > w * 0.7) {
      goTo(current + 1, 1);
    } else {
      setPaused(p => !p);
    }
  };

  const CurrentSlide = SLIDE_COMPONENTS[current];
  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      {/* Container - phone-like */}
      <div
        className="relative w-full max-w-sm h-full max-h-[860px] overflow-hidden rounded-none sm:rounded-3xl shadow-2xl cursor-pointer select-none"
        style={{ aspectRatio: undefined }}
        onClick={handleTap}
      >
        {/* Slides */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
          >
            <CurrentSlide />
          </motion.div>
        </AnimatePresence>

        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3">
          <ProgressBar current={current} total={total} accent={slide.accent} />
        </div>

        {/* Header controls */}
        <div className="absolute top-6 left-0 right-0 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-black" style={{ fontSize: '0.6rem' }}>VCF</span>
            </div>
            <span className="text-white font-bold text-xs">Season Rewind '25</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); setPaused(p => !p); }}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              {paused
                ? <Play size={14} className="text-white ml-0.5" />
                : <div className="flex gap-0.5"><div className="w-1 h-3 bg-white rounded"/><div className="w-1 h-3 bg-white rounded"/></div>
              }
            </button>
            <button
              onClick={e => { e.stopPropagation(); onClose(); }}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Side tap zones hint */}
        <div className="absolute inset-y-0 left-0 w-[30%] z-20" />
        <div className="absolute inset-y-0 right-0 w-[30%] z-20" />

        {/* Nav arrows (visible on desktop hover) */}
        <button
          onClick={e => { e.stopPropagation(); goTo(current - 1, -1); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); goTo(current + 1, 1); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} className="text-white" />
        </button>

        {/* Slide counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-white/40 text-xs">
          {current + 1} / {total}
        </div>
      </div>
    </div>
  );
}
