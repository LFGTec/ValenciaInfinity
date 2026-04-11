import React from 'react';
import player1 from "../../assets/Jugador1.png";
import player2 from "../../assets/Jugador2.png";
import player3 from "../../assets/Jugador3.png";
import player4 from "../../assets/Jugador4.png";
import player5 from "../../assets/Jugador5.png";
import player6 from "../../assets/Jugador6.png";
import player7 from "../../assets/Jugador7.png";
import player8 from "../../assets/Jugador8.png";
import player9 from "../../assets/Jugador9.png";
import player10 from "../../assets/Jugador10.png";

export function TeamPage() {
  const players = [
    { id: 18, name: "Pepelu", position: "Mediocampista", image: player1 },
    { id: 9, name: "Hugo Duro", position: "Delantero", image: player2 },
    { id: 11, name: "Rafa Mir", position: "Delantero", image: player3 },
    { id: 7, name: "Barrenechea", position: "Mediocampista", image: player4 },
    { id: 22, name: "López", position: "Delantero", image: player5 },
    { id: 8, name: "Javi Guerra", position: "Mediocampista", image: player6 },
    { id: 15, name: "Centelles", position: "Defensa", image: player7 },
    { id: 17, name: "Mosquera", position: "Mediocampista", image: player8 },
    { id: 5, name: "Guillamón", position: "Defensa", image: player9 },
    { id: 20, name: "Foulquier", position: "Defensa", image: player10 },
  ];

  // Repetir los jugadores para llenar la plantilla completa
  const allPlayers = [...players, ...players, ...players.slice(0, 5)];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-3 text-foreground">EL <span className="text-vcf-orange">EQUIPO</span></h1>
        <p className="text-base text-muted-foreground">Conoce a los jugadores del Valencia CF</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {allPlayers.map((player, i) => (
          <div key={i} className="bg-card border-2 border-border rounded-lg p-4 hover:border-vcf-orange transition-all cursor-pointer group shadow-md hover:shadow-lg">
            <div className="aspect-square bg-gradient-to-br from-muted to-card rounded-lg mb-3 overflow-hidden relative">
              <img 
                src={player.image} 
                alt={player.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-black mb-1 text-vcf-orange">{player.id}</div>
              <div className="font-bold mb-1 text-foreground text-sm">{player.name}</div>
              <div className="text-xs text-muted-foreground">{player.position}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
