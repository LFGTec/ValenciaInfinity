import React, { useState } from 'react';
import { Play, Info, Maximize2, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useAuth } from "../hooks/useAuth";

export function Juego() {
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const { user, isAuthenticated } = useAuth();

  const unityGameBaseUrl = "https://eloquent-profiterole-b89a2e.netlify.app/";

  const unityGameUrl = user?.id
    ? `${unityGameBaseUrl}?userId=${encodeURIComponent(user.id)}`
    : unityGameBaseUrl;

  const handleLoadGame = () => {
  if (!isAuthenticated || !user?.id) {
    alert("Debes iniciar sesión para jugar.");
    return;
  }

  console.log("Cargando Unity con userId:", user.id);

  setIsGameLoaded(true);
  setShowInstructions(false);
};

  const handleRestartGame = () => {
    setIsGameLoaded(false);
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById("unity-game-frame");

    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-content">
      {/* Hero Section */}
      <div className="bg-card py-8 mb-6 border-b-4 border-vcf-orange">
        <div className="max-w-[1600px] mx-auto px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              MESTALLA <span className="text-vcf-orange">RIVALS</span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg mt-1 font-semibold">
              Juega partidos multijugador inspirados en Valencia CF
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 pb-8">
        {/* Main Game Container */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Frame */}
          <div className="xl:col-span-3">
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Game Controls Header */}
              <div className="bg-gradient-to-r from-vcf-orange to-[#a86d12] p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-vcf-red rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-sm md:text-base">MESTALLA RIVALS</span>
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
                    onClick={handleRestartGame}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Reiniciar juego"
                  >
                    <RotateCcw size={18} className="text-white" />
                  </button>

                  <button 
                    onClick={handleFullscreen}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Pantalla completa"
                  >
                    <Maximize2 size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Game Display Area */}
              <div className="relative bg-black" style={{ height: 'calc(100vh - 300px)', minHeight: '560px' }}>
                {!isGameLoaded ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a] to-black" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,115,0,0.18),transparent_55%)]" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <div className="text-center mb-8">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-2xl">
                          ¿LISTO PARA JUGAR?
                        </h3>
                        <p className="text-white/90 text-lg md:text-xl mb-8 drop-shadow-lg max-w-2xl">
                          Crea o únete a un lobby, espera a tu rival y compite para meter más goles antes de que termine el tiempo.
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
                  <iframe
                    id="unity-game-frame"
                    src={unityGameUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title="Mestalla Rivals"
                  />
                )}
              </div>

              {/* Game Footer Info */}
              <div className="bg-muted p-3 border-t border-border">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Juego cargado desde Unity WebGL</span>
                  </div>
                  <div className="text-muted-foreground">
                    Usa el botón de pantalla completa para una mejor experiencia
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Instructions */}
          <div className="xl:col-span-1 space-y-4">
            {showInstructions ? (
              <div className="bg-card border-2 border-vcf-orange rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-vcf-orange p-3">
                  <div className="flex items-center gap-2">
                    <Info size={20} className="text-white" />
                    <h3 className="font-black text-white text-sm">INSTRUCCIONES</h3>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-vcf-orange rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      Crea o únete a un lobby
                    </h4>
                    <p className="text-xs text-muted-foreground ml-7">
                      Escribe un código de lobby y presiona <strong>Crear Lobby</strong> o <strong>Unirse a Lobby</strong> para jugar con otra persona.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-vcf-orange rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      Espera a tu rival
                    </h4>
                    <p className="text-xs text-muted-foreground ml-7">
                      Cuando haya dos jugadores conectados, aparecerá el mensaje de inicio y la partida cargará automáticamente.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-vcf-orange rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                      Carga tu impulso
                    </h4>
                    <p className="text-xs text-muted-foreground ml-7">
                      Mantén presionado el botón de carrera para cargar la fuerza de tu movimiento.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-vcf-orange rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                      Apunta con la flecha
                    </h4>
                    <p className="text-xs text-muted-foreground ml-7">
                      Mientras mantienes presionado, mueve el mouse para elegir la dirección hacia donde saldrá tu jugador.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-vcf-orange rounded-full flex items-center justify-center text-white text-xs font-bold">5</div>
                      Suelta y mete gol
                    </h4>
                    <p className="text-xs text-muted-foreground ml-7">
                      Suelta el botón para impulsarte, golpear la pelota y anotar en la portería rival antes de que termine el tiempo.
                    </p>
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
                Ver instrucciones
              </button>
            )}

            <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-lg">
              <h3 className="font-black text-foreground text-sm mb-3">OBJETIVO</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Marca más goles que tu rival antes de que acabe el tiempo. Usa bien la dirección de la flecha, calcula la fuerza y aprovecha los rebotes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}