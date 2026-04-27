import { useState } from "react";
import type { MatchRoom } from "@/components/features/matchrooms/types";
import { RoomCard } from "@/components/features/matchrooms/RoomCard";
import { RoomView } from "@/components/features/matchrooms/RoomView";
import { CreateRoomForm } from "@/components/features/matchrooms/CreateRoomForm";

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

type Tab = "discover" | "my-rooms" | "create";

const tabs: { id: Tab; label: string }[] = [
  { id: "discover", label: "DESCUBRIR ROOMS" },
  { id: "my-rooms", label: "MIS ROOMS" },
  { id: "create", label: "CREAR ROOM" },
];

export function MatchRooms() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [selectedRoom, setSelectedRoom] = useState<MatchRoom | null>(null);

  if (selectedRoom) {
    return (
      <RoomView room={selectedRoom} onLeave={() => setSelectedRoom(null)} />
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          MATCH <span className="text-vcf-orange">ROOMS</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Sigue los partidos en tiempo real con estadisticas y chat en vivo
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Discover */}
      {activeTab === "discover" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-vcf-red rounded-full animate-pulse" />
            <h2 className="text-3xl font-black text-foreground">
              ROOMS <span className="text-vcf-orange">EN VIVO</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                variant="discover"
                onJoin={setSelectedRoom}
              />
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
              <RoomCard key={room.id} room={room} variant="mine" />
            ))}
          </div>
        </div>
      )}

      {/* Create */}
      {activeTab === "create" && (
        <CreateRoomForm onCreateRoom={() => setActiveTab("my-rooms")} />
      )}
    </div>
  );
}
