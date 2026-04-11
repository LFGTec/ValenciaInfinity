import React, { useState } from "react";
import {
  Video,
  Users,
  Share2,
  Settings,
  Lock,
  Send,
  TrendingUp,
  Check,
  Clock,
} from "lucide-react";

interface MatchRoom {
  id: string;
  name: string;
  host: string;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  match: string;
  isPrivate: boolean;
}

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

export function MatchRooms() {
  const [activeTab, setActiveTab] = useState<
    "discover" | "my-rooms" | "create"
  >("discover");
  const [selectedRoom, setSelectedRoom] =
    useState<MatchRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Juan",
      message: "Vamos Valencia!",
      timestamp: new Date(),
    },
    {
      id: "2",
      user: "Maria",
      message: "Amunt!",
      timestamp: new Date(),
    },
    {
      id: "3",
      user: "Carlos",
      message: "Gran partido!",
      timestamp: new Date(),
    },
    {
      id: "4",
      user: "Ana",
      message: "Vamos equipo!",
      timestamp: new Date(),
    },
    {
      id: "5",
      user: "Pedro",
      message: "A por ellos!",
      timestamp: new Date(),
    },
    {
      id: "6",
      user: "Laura",
      message: "Forca Valencia!",
      timestamp: new Date(),
    },
    {
      id: "7",
      user: "Miguel",
      message: "Increible!",
      timestamp: new Date(),
    },
    {
      id: "8",
      user: "Sofia",
      message: "Gran jugada!",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showInviteLink, setShowInviteLink] = useState(false);

  const liveRooms: MatchRoom[] = [
    {
      id: "1",
      name: "Valencia vs Madrid - Room Oficial",
      host: "Juan",
      participants: 45,
      maxParticipants: 50,
      isLive: true,
      match: "Valencia CF vs Real Madrid",
      isPrivate: false,
    },
    {
      id: "2",
      name: "Los Che Fans",
      host: "Maria",
      participants: 23,
      maxParticipants: 30,
      isLive: true,
      match: "Valencia CF vs Real Madrid",
      isPrivate: false,
    },
    {
      id: "3",
      name: "Amigos del Mestalla",
      host: "Pedro",
      participants: 12,
      maxParticipants: 20,
      isLive: true,
      match: "Valencia CF vs Real Madrid",
      isPrivate: false,
    },
  ];

  const myRooms: MatchRoom[] = [
    {
      id: "4",
      name: "Mi Room Privado",
      host: "Tu",
      participants: 8,
      maxParticipants: 15,
      isLive: false,
      match: "Ultimo: Valencia vs Barcelona",
      isPrivate: true,
    },
    {
      id: "5",
      name: "Familia Valencia",
      host: "Tu",
      participants: 5,
      maxParticipants: 10,
      isLive: false,
      match: "Ultimo: Valencia vs Atletico",
      isPrivate: true,
    },
  ];

  const upcomingMatches = [
    {
      id: "1",
      teams: "Valencia CF vs Real Madrid",
      date: "Sabado, 22 Feb - 21:00h",
      competition: "LA LIGA",
    },
    {
      id: "2",
      teams: "Valencia CF vs Barcelona",
      date: "Miercoles, 26 Feb - 19:00h",
      competition: "COPA DEL REY",
    },
    {
      id: "3",
      teams: "Atletico vs Valencia CF",
      date: "Domingo, 2 Mar - 16:00h",
      competition: "LA LIGA",
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          user: "Tu",
          message: newMessage,
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
    }
  };

  const handleCreateRoom = (matchId: string) => {
    alert("Room creado para el partido");
    setActiveTab("my-rooms");
  };

  const copyInviteLink = () => {
    setShowInviteLink(true);
    setTimeout(() => setShowInviteLink(false), 2000);
  };

  if (selectedRoom) {
    return (
      <div className="min-h-screen bg-content">
        {/* Room Header */}
        <div className="bg-card border-b-2 border-vcf-orange">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  SALIR
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-foreground">
                      {selectedRoom.name}
                    </h2>
                    {selectedRoom.isLive && (
                      <span className="bg-vcf-red text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
                        EN VIVO
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoom.match}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-foreground bg-vcf-blue/20 px-3 py-2 rounded-lg">
                  <Users size={20} className="text-vcf-blue" />
                  <span className="font-bold">
                    {selectedRoom.participants}/
                    {selectedRoom.maxParticipants}
                  </span>
                </div>
                <button
                  onClick={copyInviteLink}
                  className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
                >
                  {showInviteLink ? (
                    <Check size={18} />
                  ) : (
                    <Share2 size={18} />
                  )}
                  {showInviteLink ? "COPIADO" : "INVITAR"}
                </button>
                <button className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Room Content */}
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Match Stats Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Live Match Score */}
              <div className="bg-gradient-to-br from-black via-vcf-orange to-black text-white rounded-xl overflow-hidden shadow-2xl border-2 border-vcf-orange">
                <div className="p-6">
                  {/* Match Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-vcf-red rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold">
                        EN VIVO
                      </span>
                    </div>
                    <div className="text-2xl font-black text-vcf-yellow">
                      67'
                    </div>
                    <div className="text-sm font-bold">
                      LA LIGA
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Home Team - Valencia */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-black text-white">
                          VCF
                        </span>
                      </div>
                      <h3 className="text-xl font-black mb-1">
                        VALENCIA CF
                      </h3>
                      <div className="text-5xl font-black text-vcf-yellow mb-2">
                        2
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-2xl font-black opacity-50">
                        VS
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl">
                        <span className="text-2xl font-black text-black">
                          RMA
                        </span>
                      </div>
                      <h3 className="text-xl font-black mb-1">
                        REAL MADRID
                      </h3>
                      <div className="text-5xl font-black mb-2">
                        1
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Events Timeline */}
              <div className="bg-card border-2 border-border rounded-lg p-4 shadow-lg">
                <h3 className="text-base font-black text-foreground mb-3 flex items-center gap-2">
                  <Clock
                    size={18}
                    className="text-vcf-orange"
                  />
                  EVENTOS DEL{" "}
                  <span className="text-vcf-orange">
                    PARTIDO
                  </span>
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      minute: "65'",
                      team: "Valencia CF",
                      event: "GOL! Hugo Duro",
                      type: "goal",
                      isHome: true,
                    },
                    {
                      minute: "58'",
                      team: "Real Madrid",
                      event:
                        "Cambio: Modric sale, Camavinga entra",
                      type: "sub",
                      isHome: false,
                    },
                    {
                      minute: "52'",
                      team: "Valencia CF",
                      event: "Tarjeta amarilla: Pepelu",
                      type: "card",
                      isHome: true,
                    },
                    {
                      minute: "41'",
                      team: "Real Madrid",
                      event: "GOL! Vinicius Jr",
                      type: "goal",
                      isHome: false,
                    },
                    {
                      minute: "23'",
                      team: "Valencia CF",
                      event: "GOL! Fran Perez",
                      type: "goal",
                      isHome: true,
                    },
                    {
                      minute: "12'",
                      team: "Valencia CF",
                      event: "Tarjeta amarilla: Yaremchuk",
                      type: "card",
                      isHome: true,
                    },
                  ].map((event, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        event.type === "goal"
                          ? "bg-vcf-orange/10 border-l-4 border-vcf-orange"
                          : "bg-muted"
                      }`}
                    >
                      <div className="w-12 h-12 bg-vcf-orange text-white rounded-lg flex items-center justify-center font-black flex-shrink-0">
                        {event.minute}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-bold text-sm mb-1 ${event.isHome ? "text-vcf-orange" : "text-foreground"}`}
                        >
                          {event.team}
                        </div>
                        <div className="text-sm text-foreground">
                          {event.event}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Statistics */}
              <div className="bg-card border-2 border-border rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-black text-foreground mb-6">
                  ESTADISTICAS{" "}
                  <span className="text-vcf-blue">EN VIVO</span>
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      stat: "Posesion",
                      home: 58,
                      away: 42,
                      homeColor: "bg-vcf-orange",
                      awayColor: "bg-gray-400",
                    },
                    {
                      stat: "Tiros totales",
                      home: 12,
                      away: 8,
                      homeColor: "bg-vcf-blue",
                      awayColor: "bg-gray-400",
                    },
                    {
                      stat: "Tiros a puerta",
                      home: 8,
                      away: 5,
                      homeColor: "bg-vcf-yellow",
                      awayColor: "bg-gray-400",
                    },
                    {
                      stat: "Corners",
                      home: 6,
                      away: 3,
                      homeColor: "bg-vcf-red",
                      awayColor: "bg-gray-400",
                    },
                    {
                      stat: "Faltas",
                      home: 9,
                      away: 11,
                      homeColor: "bg-purple-600",
                      awayColor: "bg-gray-400",
                    },
                    {
                      stat: "Tarjetas amarillas",
                      home: 2,
                      away: 1,
                      homeColor: "bg-yellow-500",
                      awayColor: "bg-gray-400",
                    },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-foreground">
                          {item.home}
                        </span>
                        <span className="font-bold text-foreground">
                          {item.stat}
                        </span>
                        <span className="font-bold text-foreground">
                          {item.away}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.homeColor} shadow-inner`}
                            style={{
                              width: `${(item.home / (item.home + item.away)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.awayColor} shadow-inner`}
                            style={{
                              width: `${(item.away / (item.home + item.away)) * 100}%`,
                              marginLeft: "auto",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Lineups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Valencia Lineup */}
                <div className="bg-card border-2 border-vcf-orange rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-black text-vcf-orange mb-4">
                    VALENCIA CF
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        num: 1,
                        name: "Mamardashvili",
                        pos: "POR",
                      },
                      { num: 2, name: "Foulquier", pos: "DEF" },
                      {
                        num: 15,
                        name: "Cenk Ozkacar",
                        pos: "DEF",
                      },
                      { num: 24, name: "Mosquera", pos: "DEF" },
                      { num: 21, name: "Gaya", pos: "DEF" },
                      {
                        num: 18,
                        name: "Pepelu",
                        pos: "MED",
                        hasCard: true,
                      },
                      { num: 6, name: "Guillamon", pos: "MED" },
                      {
                        num: 10,
                        name: "Fran Perez",
                        pos: "DEL",
                        scored: true,
                      },
                      {
                        num: 16,
                        name: "Diego Lopez",
                        pos: "DEL",
                      },
                      {
                        num: 9,
                        name: "Hugo Duro",
                        pos: "DEL",
                        scored: true,
                      },
                      {
                        num: 22,
                        name: "Yaremchuk",
                        pos: "DEL",
                        hasCard: true,
                      },
                    ].map((player, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-muted rounded hover:bg-vcf-orange/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-vcf-orange text-white rounded flex items-center justify-center font-bold text-sm">
                            {player.num}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-sm">
                              {player.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {player.pos}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {player.scored && (
                            <span className="text-xs font-bold text-vcf-orange">
                              GOL
                            </span>
                          )}
                          {player.hasCard && (
                            <span className="text-xs font-bold text-vcf-yellow bg-vcf-yellow/20 px-1 rounded">
                              TA
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real Madrid Lineup */}
                <div className="bg-card border-2 border-border rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-black text-foreground mb-4">
                    REAL MADRID
                  </h3>
                  <div className="space-y-2">
                    {[
                      { num: 1, name: "Courtois", pos: "POR" },
                      { num: 2, name: "Carvajal", pos: "DEF" },
                      { num: 3, name: "Militao", pos: "DEF" },
                      { num: 4, name: "Alaba", pos: "DEF" },
                      { num: 23, name: "Mendy", pos: "DEF" },
                      {
                        num: 10,
                        name: "Modric",
                        pos: "MED",
                        subbed: true,
                      },
                      { num: 8, name: "Kroos", pos: "MED" },
                      { num: 15, name: "Valverde", pos: "MED" },
                      { num: 11, name: "Rodrygo", pos: "DEL" },
                      { num: 9, name: "Benzema", pos: "DEL" },
                      {
                        num: 20,
                        name: "Vinicius Jr",
                        pos: "DEL",
                        scored: true,
                      },
                    ].map((player, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2 bg-muted rounded hover:bg-border transition-colors ${player.subbed ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-700 text-white rounded flex items-center justify-center font-bold text-sm">
                            {player.num}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-sm">
                              {player.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {player.pos}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {player.scored && (
                            <span className="text-lg">⚽</span>
                          )}
                          {player.subbed && (
                            <span className="text-xs font-bold text-muted-foreground">
                              SUB
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1">
              <div
                className="bg-card border-2 border-border rounded-lg flex flex-col shadow-lg"
                style={{
                  height: "calc(100vh - 180px)",
                  minHeight: "700px",
                }}
              >
                <div className="p-3 border-b-2 border-border bg-vcf-orange/10">
                  <h3 className="font-black text-foreground text-sm">
                    CHAT DEL ROOM
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedRoom.participants} participantes
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full flex-shrink-0"></div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground text-sm">
                            {msg.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString(
                              "es-ES",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t-2 border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) =>
                        setNewMessage(e.target.value)
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg border-2 border-border focus:border-vcf-orange outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          MATCH <span className="text-vcf-orange">ROOMS</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Sigue los partidos en tiempo real con estadisticas y
          chat en vivo
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {[
          { id: "discover", label: "DESCUBRIR ROOMS" },
          { id: "my-rooms", label: "MIS ROOMS" },
          { id: "create", label: "CREAR ROOM" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === tab.id
                ? "border-b-4 border-vcf-orange text-vcf-orange"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Discover Rooms */}
      {activeTab === "discover" && (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-vcf-red rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-black text-foreground">
                ROOMS{" "}
                <span className="text-vcf-orange">EN VIVO</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveRooms.map((room) => (
              <div
                key={room.id}
                className="bg-card border-2 border-border rounded-xl p-6 hover:border-vcf-orange transition-all shadow-md hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-xl mb-1 text-foreground">
                      {room.name}
                    </h3>
                    <p className="text-base text-muted-foreground">
                      Host: {room.host}
                    </p>
                  </div>
                  {room.isLive && (
                    <span className="bg-vcf-red text-white px-3 py-1 rounded-full text-sm font-black shadow-md flex items-center gap-1">
                      LIVE
                    </span>
                  )}
                </div>

                <p className="text-base text-muted-foreground mb-4">
                  {room.match}
                </p>

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-base text-vcf-blue bg-vcf-blue/10 px-3 py-1 rounded-full">
                    <Users size={16} />
                    <span className="font-bold">
                      {room.participants}/{room.maxParticipants}
                    </span>
                  </div>
                  {room.isPrivate && (
                    <div className="flex items-center gap-1 text-base text-muted-foreground">
                      <Lock size={14} />
                      <span>Privado</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedRoom(room)}
                  className="w-full py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 text-base"
                >
                  UNIRSE AL ROOM
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Rooms */}
      {activeTab === "my-rooms" && (
        <div>
          <h2 className="text-3xl font-black mb-6 text-foreground">
            TUS <span className="text-vcf-orange">ROOMS</span>
          </h2>
          <div className="space-y-4">
            {myRooms.map((room) => (
              <div
                key={room.id}
                className="bg-card border-2 border-border rounded-xl p-6 flex items-center justify-between shadow-md hover:border-vcf-orange transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-xl text-foreground">
                      {room.name}
                    </h3>
                    {room.isPrivate && (
                      <span className="flex items-center gap-1 text-base text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Lock size={14} />
                        Privado
                      </span>
                    )}
                  </div>
                  <p className="text-base text-muted-foreground mb-3">
                    {room.match}
                  </p>
                  <div className="flex items-center gap-4 text-base text-foreground">
                    <span className="flex items-center gap-1 bg-vcf-blue/10 text-vcf-blue px-2 py-1 rounded">
                      <Users size={14} />
                      {room.participants} miembros
                    </span>
                    <span className="text-muted-foreground">
                      Max: {room.maxParticipants}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-6 py-3 bg-white border-2 border-white text-vcf-orange rounded-lg font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105 text-base">
                    CONFIGURAR
                  </button>
                  <button className="px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 text-base">
                    <Share2 size={18} />
                    INVITAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Room */}
      {activeTab === "create" && (
        <div>
          <h2 className="text-3xl font-black mb-6 text-foreground">
            CREAR{" "}
            <span className="text-vcf-orange">NUEVO ROOM</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="bg-card border-2 border-vcf-orange rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-black mb-6 text-foreground">
                CONFIGURACION DEL ROOM
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block font-black mb-2 text-foreground text-base">
                    Nombre del Room
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Amigos del Mestalla"
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block font-black mb-2 text-foreground text-base">
                    Selecciona el partido
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base">
                    <option>Selecciona un partido...</option>
                    {upcomingMatches.map((match) => (
                      <option key={match.id} value={match.id}>
                        {match.teams} - {match.date}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-black mb-2 text-foreground text-base">
                    Maximo de participantes
                  </label>
                  <input
                    type="number"
                    defaultValue={20}
                    min={2}
                    max={100}
                    className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block font-black mb-3 text-foreground text-base">
                    Tipo de Room
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-vcf-orange bg-vcf-orange/10 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        defaultChecked
                        className="accent-vcf-orange w-5 h-5"
                      />
                      <div>
                        <div className="font-black text-foreground text-base">
                          Publico
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Cualquiera puede unirse
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border cursor-pointer hover:border-vcf-orange transition-colors">
                      <input
                        type="radio"
                        name="type"
                        className="accent-vcf-orange w-5 h-5"
                      />
                      <div>
                        <div className="font-black text-foreground text-base">
                          Privado
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Solo con enlace
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-black mb-3 text-foreground text-base">
                    Opciones adicionales
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Habilitar chat en tiempo real",
                        defaultChecked: true,
                      },
                      {
                        label:
                          "Permitir predicciones de partido",
                        defaultChecked: true,
                      },
                      {
                        label: "Trivias durante el partido",
                        defaultChecked: false,
                      },
                      {
                        label: "Notificaciones de goles",
                        defaultChecked: true,
                      },
                    ].map((opt) => (
                      <label
                        key={opt.label}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={opt.defaultChecked}
                          className="w-5 h-5 accent-vcf-orange"
                        />
                        <span className="text-base text-foreground">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCreateRoom("1")}
                  className="w-full py-4 bg-vcf-orange text-white rounded-xl font-black hover:bg-[#ff8c4a] transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
                >
                  <Video size={22} />
                  CREAR ROOM AHORA
                </button>
              </div>
            </div>

            {/* Right: Preview + Tips */}
            <div className="space-y-6">
              {/* Room Preview */}
              <div className="bg-card border-2 border-vcf-orange rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp
                    size={22}
                    className="text-vcf-orange"
                  />
                  VISTA PREVIA DEL ROOM
                </h3>
                <div className="bg-vcf-orange/10 rounded-xl p-5 mb-4 border border-vcf-orange/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-sm">
                        TU
                      </span>
                    </div>
                    <div>
                      <div className="text-foreground font-black text-base">
                        Mi Room Privado
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Host: Tu · 0/20 participantes
                      </div>
                    </div>
                    <span className="ml-auto bg-vcf-orange text-white text-sm px-3 py-1 rounded-full font-black">
                      NUEVO
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-vcf-orange/30">
                    <div className="text-vcf-orange font-bold text-sm">
                      Valencia CF vs Real Madrid
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Sabado, 22 Feb · 21:00h
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Predicciones", active: true },
                    { label: "Trivias", active: false },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className={`rounded-lg p-3 text-center border ${
                        f.active
                          ? "border-vcf-orange bg-vcf-orange/20"
                          : "border-border bg-muted opacity-50"
                      }`}
                    >
                      <div className="text-foreground text-sm font-bold">
                        {f.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming matches to pick */}
              <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-foreground mb-4">
                  PROXIMOS PARTIDOS
                </h3>
                <div className="space-y-3">
                  {upcomingMatches.map((match, i) => (
                    <div
                      key={match.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${i === 0 ? "border-vcf-orange bg-vcf-orange/10" : "border-border hover:border-vcf-orange"}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${i === 0 ? "bg-vcf-orange" : "bg-muted-foreground"}`}
                      />
                      <div className="flex-1">
                        <div className="font-black text-foreground text-base">
                          {match.teams}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {match.date}
                        </div>
                      </div>
                      <span className="text-sm font-black bg-vcf-blue/20 text-vcf-blue px-2 py-1 rounded">
                        {match.competition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-vcf-yellow/10 border-2 border-vcf-yellow rounded-xl p-5">
                <h3 className="text-lg font-black text-foreground mb-3">
                  CONSEJOS PARA TU ROOM
                </h3>
                <ul className="space-y-2 text-base text-foreground">
                  {[
                    "Dale un nombre divertido para atraer fans",
                    "Activa las trivias para mas emocion",
                    "Comparte el enlace antes del partido",
                    "Maximo 50 personas para una mejor experiencia",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2"
                    >
                      <span className="text-vcf-orange font-black mt-0.5">
                        •
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}