import React, { useState } from 'react';
import { Gamepad2, Play, Info, Maximize2, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import gamePreviewImage from "../../assets/Juego.png";

export function UnityGame() {
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // URL del juego Unity (el usuario debe reemplazar esto con su URL real)
  const unityGameUrl = "YOUR_UNITY_GAME_URL_HERE";

  const handleLoadGame = () => {
    setIsGameLoaded(true);
    setShowInstructions(false);
  };

  return (
    <div className="min-h-screen bg-content">
      {/* Hero Section - Más compacto */}
      <div className="bg-white py-8 mb-6 border-b-4 border-vcf-orange">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
                MESTALLA <span className="text-vcf-orange">RIVALS</span>
              </h1>
              <p className="text-black/70 text-base md:text-lg mt-1 font-semibold">Experiencia Valencia CF en Unity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 pb-8">
        {/* Game Stats - Grid horizontal completo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: 'Jugadores Activos', value: '2,456', color: 'bg-vcf-orange' },
            { label: 'Partidas Jugadas', value: '18,934', color: 'bg-vcf-orange' },
            { label: 'Récord del Día', value: '9,850', color: 'bg-vcf-orange' },
            { label: 'Tu Mejor Score', value: '4,250', color: 'bg-vcf-orange' }
          ].map((stat, index) => (
            <div key={index} className="bg-card border-2 border-border rounded-xl p-4 hover:border-vcf-orange transition-all">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                <Gamepad2 size={20} className="text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-foreground mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Game Container - Layout reorganizado */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Frame - Más ancho */}
          <div className="xl:col-span-3">
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Game Controls Header */}
              <div className="bg-gradient-to-r from-vcf-orange to-[#a86d12] p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-vcf-red rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-sm md:text-base">EN VIVO</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
                  </button>
                  <button 
                    onClick={() => setIsGameLoaded(false)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Reiniciar juego"
                  >
                    <RotateCcw size={18} className="text-white" />
                  </button>
                  <button 
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Pantalla completa"
                  >
                    <Maximize2 size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Game Display Area - Más alto */}
              <div className="relative bg-black" style={{ height: 'calc(100vh - 380px)', minHeight: '500px' }}>
                {!isGameLoaded ? (
                  // Pre-load screen with game preview image
                  <div className="relative w-full h-full">
                    {/* Background Image */}
                    <img 
                      src={gamePreviewImage} 
                      alt="Mestalla Rivals Preview" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <div className="text-center mb-8">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-2xl">
                          ¿LISTO PARA JUGAR?
                        </h3>
                        <p className="text-white/90 text-lg md:text-xl mb-8 drop-shadow-lg">
                          Experimenta el Valencia CF como nunca antes
                        </p>
                      </div>
                      <button 
                        onClick={handleLoadGame}
                        className="group bg-vcf-orange hover:bg-[#a86d12] text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl hover:shadow-vcf-orange/50 hover:scale-110 flex items-center gap-4 text-xl"
                      >
                        <Play size={28} fill="white" className="group-hover:scale-110 transition-transform" />
                        INICIAR JUEGO
                      </button>
                    </div>
                  </div>
                ) : (
                  // Game iframe
                  <iframe
                    src={unityGameUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Valencia CF Unity Game"
                  />
                )}
              </div>

              {/* Game Footer Info */}
              <div className="bg-muted p-3 border-t border-border">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Conexión estable</span>
                  </div>
                  <div className="text-muted-foreground">
                    Presiona <kbd className="px-2 py-1 bg-card border border-border rounded text-xs">ESC</kbd> para pausar
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Más compacta y vertical */}
          <div className="xl:col-span-1 space-y-4">
            {/* Instructions Card - Colapsable */}
            {showInstructions ? (
              <div className="bg-card border-2 border-vcf-orange rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-vcf-orange p-3">
                  <div className="flex items-center gap-2">
                    <Info size={20} className="text-white" />
                    <h3 className="font-black text-white text-sm">INSTRUCCIONES</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-vcf-orange rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      Controles
                    </h4>
                    <ul className="space-y-1 text-xs text-muted-foreground ml-7">
                      <li>• <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">WASD</kbd> Movimiento</li>
                      <li>• <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">ESPACIO</kbd> Saltar</li>
                      <li>• <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">CLICK</kbd> Interactuar</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-vcf-orange rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      Objetivos
                    </h4>
                    <ul className="space-y-1 text-xs text-muted-foreground ml-7">
                      <li>• Completa misiones VCF</li>
                      <li>• Colecciona recompensas</li>
                      <li>• Sube en el ranking</li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => setShowInstructions(false)}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold py-2 rounded-lg transition-colors text-xs"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowInstructions(true)}
                className="w-full bg-card border-2 border-vcf-orange hover:bg-vcf-orange/10 text-vcf-orange font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Info size={18} />
                Ver Instrucciones
              </button>
            )}

            {/* Leaderboard Preview - Más compacto */}
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-vcf-orange to-vcf-yellow p-3">
                <h3 className="font-black text-white text-sm">TOP JUGADORES HOY</h3>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { name: 'Carlos M.', score: '9,850', avatar: '🥇' },
                  { name: 'María L.', score: '8,420', avatar: '🥈' },
                  { name: 'Pedro S.', score: '7,890', avatar: '🥉' },
                  { name: 'Ana R.', score: '6,540', avatar: '👤' },
                  { name: 'Jorge P.', score: '5,320', avatar: '👤' }
                ].map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{player.avatar}</span>
                      <div>
                        <div className="font-bold text-foreground text-xs">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.score} pts</div>
                      </div>
                    </div>
                    <div className="text-vcf-orange font-bold text-xs">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}