import React, { useState } from 'react';
import {
  Video, Star, Trophy, Award, TrendingUp, BookOpen, Gamepad2,
  Share2, Globe, ArrowRight, Gift, Heart, Play, User, Palette, 
  Shirt, ShoppingBag, Crown, Sparkles
} from 'lucide-react';
import { SeasonRewind } from '../features/SeasonRewind';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

export function FansZonePage({ setCurrentPage }: PageProps) {
  const [showRewind, setShowRewind] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('rostros');
  
  // Avatar customization states
  const [skinTone, setSkinTone] = useState(2);
  const [hairStyle, setHairStyle] = useState('corto');
  const [hairColor, setHairColor] = useState(2);
  const [jersey, setJersey] = useState('local');
  const [jerseyNumber, setJerseyNumber] = useState('7');
  const [jerseyName, setJerseyName] = useState('');
  
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      {showRewind && <SeasonRewind onClose={() => setShowRewind(false)} />}
      
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-4 text-foreground">ZONA <span className="text-vcf-orange">FAN</span></h1>
        <p className="text-base text-muted-foreground">Tu espacio para interactuar y disfrutar</p>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Video, title: 'MATCH ROOMS', desc: 'Ve los partidos en directo con tus amigos', page: 'match-rooms' },
          { icon: BookOpen, title: 'ÁLBUM DE CARTAS', desc: 'Colecciona y completa tu álbum', page: 'album' },
          { icon: Gamepad2, title: 'TRIVIAS & QUIZZES', desc: 'Demuestra tus conocimientos', page: 'trivias' },
          { icon: Share2, title: 'INTERCAMBIO', desc: 'Comercia cartas con otros fans', page: 'exchange' },
          { icon: Globe, title: 'MUNDO VIRTUAL', desc: 'Explora y conecta globalmente', page: 'virtual-world' },
          { icon: Heart, title: 'FAN MOOD TRACKER', desc: 'Vota tu emoción después de cada partido ✦ Nuevo', page: 'mood-tracker' },
        ].map((feature, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(feature.page)}
            className="group relative overflow-hidden rounded-xl p-8 transition-all hover:scale-105 shadow-lg hover:shadow-2xl border-4 border-vcf-orange bg-white"
          >
            <div className="relative z-10 text-left">
              <feature.icon size={48} className="mb-4 text-vcf-orange" strokeWidth={2.5} />
              <h3 className="text-2xl font-black mb-2 text-black">{feature.title}</h3>
              <p className="text-sm mb-4 font-semibold text-black">{feature.desc}</p>
              <div className="flex items-center gap-2 font-black text-sm group-hover:gap-3 transition-all text-black">
                EXPLORAR <ArrowRight size={16} strokeWidth={3} className="text-vcf-orange" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Season Rewind Banner */}
      <div
        className="relative overflow-hidden rounded-2xl mb-10 cursor-pointer group shadow-2xl"
        onClick={() => setShowRewind(true)}
        style={{ minHeight: 180 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1765130729366-b54d7b2c8ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080')` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(0,0,0,0.92) 0%, rgba(255,103,31,0.85) 50%, rgba(255,103,31,0.7) 100%)' }} />
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: Math.random() * 6 + 3,
                height: Math.random() * 6 + 3,
                backgroundColor: i % 2 === 0 ? '#ff671f' : '#ff8c42',
                left: `${(i / 12) * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.6,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 gap-6">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform"
              style={{ background: 'linear-gradient(135deg, #ff671f, #ff8c42)' }}
            >
              <span className="text-4xl">🦇</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white tracking-[0.25em] uppercase font-bold" style={{ fontSize: '0.7rem' }}>
                  ✦ Disponible ahora
                </span>
              </div>
              <h2 className="text-white font-black mb-1" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', lineHeight: 1.1 }}>
                SEASON REWIND <span style={{ color: '#ff671f' }}>2026</span>
              </h2>
              <p className="text-white/90" style={{ fontSize: '0.9rem' }}>
                Revive tu temporada como fan del Valencia CF. Partidos, goles, logros y mucho más.
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-3 px-8 py-4 rounded-full font-black text-white shadow-xl group-hover:shadow-vcf-orange/40 group-hover:scale-105 transition-all flex-shrink-0"
            style={{ backgroundColor: '#ff671f', fontSize: '1rem' }}
          >
            <Play size={20} fill="white" />
            VER MI REWIND
          </button>
        </div>
      </div>

      {/* Avatar Customization Section */}
      <section className="mb-12">
        <div className="bg-white rounded-2xl border-4 border-black shadow-2xl">
          <div className="bg-white rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-black mb-2">
                  PERSONALIZA TU <span className="text-vcf-orange">AVATAR</span>
                </h2>
                <p className="text-sm text-black/60">Crea tu identidad única como valencianista</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Avatar Preview - Left Side */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-8 border-2 border-black">
                  <div className="text-center mb-6">
                    <h3 className="text-black font-black text-base mb-2">VISTA PREVIA</h3>
                  </div>
                  
                  {/* Blocky Avatar Display */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 mb-6 flex items-center justify-center border-2 border-black" style={{ minHeight: '320px' }}>
                    <div className="relative" style={{ width: '140px', height: '200px' }}>
                      {/* Head */}
                      <div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-sm" 
                        style={{ 
                          width: '50px', 
                          height: '50px',
                          background: ['#F5D5B8', '#E8C4A0', '#D4A574', '#C68642', '#8D5524', '#6F4E37'][skinTone]
                        }}
                      />
                      
                      {/* Hair */}
                      {hairStyle !== 'calvo' && (
                        <div 
                          className="absolute rounded-sm" 
                          style={{ 
                            top: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: hairStyle === 'rapado' ? '50px' : '54px',
                            height: hairStyle === 'rapado' ? '12px' : hairStyle === 'afro' ? '45px' : '20px',
                            background: ['#2C1810', '#5C4033', '#8B6F47', '#C19A6B', '#E6C7A0'][hairColor]
                          }}
                        />
                      )}
                      
                      {/* Body/Jersey */}
                      <div 
                        className="absolute rounded-sm" 
                        style={{ 
                          top: '55px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '50px',
                          height: '70px',
                          background: jersey === 'local' ? '#FFFFFF' : jersey === 'visitante' ? '#000000' : '#0097D8',
                          border: `2px solid ${jersey === 'local' ? '#000000' : '#FFFFFF'}`
                        }}
                      >
                        {/* Jersey Number */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span 
                            className="font-black text-2xl" 
                            style={{ color: jersey === 'local' ? '#000000' : '#FFFFFF' }}
                          >
                            {jerseyNumber}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arms */}
                      <div 
                        className="absolute rounded-sm" 
                        style={{ 
                          top: '60px',
                          left: '15%',
                          width: '15px',
                          height: '50px',
                          background: ['#F5D5B8', '#E8C4A0', '#D4A574', '#C68642', '#8D5524', '#6F4E37'][skinTone]
                        }}
                      />
                      <div 
                        className="absolute rounded-sm" 
                        style={{ 
                          top: '60px',
                          right: '15%',
                          width: '15px',
                          height: '50px',
                          background: ['#F5D5B8', '#E8C4A0', '#D4A574', '#C68642', '#8D5524', '#6F4E37'][skinTone]
                        }}
                      />
                      
                      {/* Legs */}
                      <div 
                        className="absolute rounded-sm" 
                        style={{ 
                          top: '125px',
                          left: '28%',
                          width: '18px',
                          height: '75px',
                          background: '#000000'
                        }}
                      />
                      <div 
                        className="absolute rounded-sm" 
                        style={{ 
                          top: '125px',
                          right: '28%',
                          width: '18px',
                          height: '75px',
                          background: '#000000'
                        }}
                      />
                    </div>
                  </div>

                  {/* Avatar Summary */}
                  <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-black/60 font-bold">Tono de piel:</span>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400" style={{ background: ['#F5D5B8', '#E8C4A0', '#D4A574', '#C68642', '#8D5524', '#6F4E37'][skinTone] }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-black/60 font-bold">Cabello:</span>
                        <span className="text-black font-black capitalize">{hairStyle}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-black/60 font-bold">Color de cabello:</span>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400" style={{ background: ['#2C1810', '#5C4033', '#8B6F47', '#C19A6B', '#E6C7A0'][hairColor] }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-black/60 font-bold">Playera:</span>
                        <span className="text-black font-black capitalize">{jersey}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-black/60 font-bold">Número:</span>
                        <span className="text-black font-black">{jerseyNumber}</span>
                      </div>
                      {jerseyName && (
                        <div className="flex items-center justify-between">
                          <span className="text-black/60 font-bold">Nombre:</span>
                          <span className="text-black font-black">{jerseyName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customization Options - Right Side */}
              <div className="lg:col-span-3 space-y-6">
                {/* Skin Tone */}
                <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="text-black font-black mb-4 tracking-wider">TONO DE PIEL</h4>
                  <div className="grid grid-cols-6 gap-3">
                    {['#F5D5B8', '#E8C4A0', '#D4A574', '#C68642', '#8D5524', '#6F4E37'].map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSkinTone(i)}
                        className={`aspect-square rounded-lg transition-all hover:scale-110 ${ 
                          skinTone === i ? 'ring-4 ring-vcf-orange scale-110' : 'ring-2 ring-gray-300'
                        }`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="text-black font-black mb-4 tracking-wider">ESTILO DE CABELLO</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: 'corto', label: 'Corto' },
                      { id: 'largo', label: 'Largo' },
                      { id: 'rapado', label: 'Rapado' },
                      { id: 'rizado', label: 'Rizado' },
                      { id: 'liso', label: 'Liso' },
                      { id: 'ondulado', label: 'Ondulado' },
                      { id: 'afro', label: 'Afro' },
                      { id: 'calvo', label: 'Calvo' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setHairStyle(style.id)}
                        className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${ 
                          hairStyle === style.id 
                            ? 'bg-vcf-orange text-white scale-105 shadow-lg' 
                            : 'bg-white border-2 border-gray-300 text-black hover:bg-gray-100'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="text-black font-black mb-4 tracking-wider">COLOR DE CABELLO</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {['#2C1810', '#5C4033', '#8B6F47', '#C19A6B', '#E6C7A0'].map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setHairColor(i)}
                        className={`aspect-square rounded-lg transition-all hover:scale-110 ${ 
                          hairColor === i ? 'ring-4 ring-vcf-orange scale-110' : 'ring-2 ring-gray-300'
                        }`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Jersey Type */}
                <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="text-black font-black mb-4 tracking-wider">PLAYERA DEL EQUIPO</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'local', label: 'Local', color: '#FFFFFF', textColor: '#000000' },
                      { id: 'visitante', label: 'Visitante', color: '#000000', textColor: '#FFFFFF' },
                      { id: 'tercera', label: 'Tercera', color: '#0097D8', textColor: '#FFFFFF' }
                    ].map((j) => (
                      <button
                        key={j.id}
                        onClick={() => setJersey(j.id)}
                        className={`px-6 py-8 rounded-lg font-black transition-all border-2 ${ 
                          jersey === j.id 
                            ? 'border-vcf-orange scale-105 shadow-lg' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ background: j.color, color: j.textColor }}
                      >
                        {j.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Jersey Number & Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                    <h4 className="text-black font-black mb-4 tracking-wider">NÚMERO EN LA ESPALDA</h4>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(e.target.value)}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-black font-black text-2xl text-center focus:border-vcf-orange focus:outline-none transition-colors"
                      placeholder="7"
                    />
                  </div>
                  
                  <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                    <h4 className="text-black font-black mb-4 tracking-wider">NOMBRE EN LA ESPALDA</h4>
                    <input
                      type="text"
                      value={jerseyName}
                      onChange={(e) => setJerseyName(e.target.value.toUpperCase())}
                      maxLength={12}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-black font-bold text-center focus:border-vcf-orange focus:outline-none transition-colors uppercase"
                      placeholder="TU NOMBRE"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex gap-4">
              <button className="flex-1 px-8 py-4 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#e55a15] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                <Sparkles size={20} />
                GUARDAR AVATAR
              </button>
              <button 
                onClick={() => setCurrentPage('profile')}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-black rounded-lg font-black hover:bg-gray-100 transition-all"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Your Stats */}
      <section className="bg-card border-2 border-vcf-orange rounded-xl p-8 mb-12 shadow-lg">
        <h2 className="text-3xl font-black mb-6 text-foreground">TUS <span className="text-vcf-orange">ESTADÍSTICAS</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'RACHA', value: '12 DÍAS', icon: Star, color: 'text-vcf-yellow', bg: 'bg-vcf-yellow/10' },
            { label: 'NIVEL', value: '15', icon: TrendingUp, color: 'text-vcf-orange', bg: 'bg-vcf-orange/10' },
            { label: 'PUNTOS', value: '2,340', icon: Trophy, color: 'text-vcf-blue', bg: 'bg-vcf-blue/10' },
            { label: 'POSICIÓN', value: '#24', icon: Award, color: 'text-vcf-red', bg: 'bg-vcf-red/10' },
          ].map((stat, i) => (
            <div key={i} className={`text-center p-6 ${stat.bg} rounded-lg hover:shadow-md transition-all`}>
              <stat.icon size={32} className={`mx-auto mb-3 ${stat.color}`} />
              <div className="text-3xl font-black mb-1 text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rewards */}
      <section className="bg-gradient-to-br from-black via-vcf-orange to-black text-white rounded-xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black">RECOMPENSAS <span className="text-vcf-orange">DIARIAS</span></h2>
          <Gift size={32} className="text-vcf-orange" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                i < 3 ? 'bg-vcf-orange text-white shadow-lg' : 'bg-white/10 backdrop-blur-sm'
              }`}
            >
              <div className="text-xs font-bold mb-1">DÍA {i + 1}</div>
              {i < 3 && <div className="text-xl">✓</div>}
            </div>
          ))}
        </div>
        <button className="w-full py-4 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#e55a15] transition-all shadow-lg hover:shadow-xl hover:scale-105">
          CANJEAR RECOMPENSA DEL DÍA
        </button>
      </section>
    </div>
  );
}