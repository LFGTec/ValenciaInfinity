import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  getPublicRooms,
  getMyRooms,
  deleteRoom,
  subscribeToRooms,
  getRoomByInviteCode,
  type RoomDB,
} from "@/services/matchRoomsService";
import { RoomCard } from "@/components/features/matchrooms/RoomCard";
import { RoomView } from "@/components/features/matchrooms/RoomView";
import { CreateRoomForm } from "@/components/features/matchrooms/CreateRoomForm";

type Tab = "discover" | "my-rooms" | "create";

const tabs: { id: Tab; label: string }[] = [
  { id: "discover", label: "DESCUBRIR ROOMS" },
  { id: "my-rooms", label: "MIS ROOMS" },
  { id: "create", label: "CREAR ROOM" },
];

export function MatchRooms() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [selectedRoom, setSelectedRoom] = useState<RoomDB | null>(null);
  const [publicRooms, setPublicRooms] = useState<RoomDB[]>([]);
  const [myRooms, setMyRooms] = useState<RoomDB[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = user
    ? {
        id: user.id,
        username: user.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Fan",
        avatar_url: user.avatar_url ?? user.user_metadata?.avatar_url,
      }
    : null;

  const loadRooms = async () => {
    try {
      const [pub, mine] = await Promise.all([
        getPublicRooms(),
        user ? getMyRooms(user.id) : Promise.resolve([]),
      ]);
      setPublicRooms(pub);
      setMyRooms(mine);
    } finally {
      setLoading(false);
    }
  };

  // Handle invite code from URL
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;
    getRoomByInviteCode(code).then((room) => {
      if (room) setSelectedRoom(room);
    });
  }, [searchParams]);

  useEffect(() => {
    loadRooms();
    const channel = subscribeToRooms(loadRooms);
    return () => { channel.unsubscribe(); };
  }, [user?.id]);

  const handleDelete = async (roomId: string) => {
    await deleteRoom(roomId);
  };

  if (selectedRoom && currentUser) {
    return (
      <RoomView
        room={selectedRoom}
        user={currentUser}
        onLeave={() => setSelectedRoom(null)}
      />
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          MATCH <span className="text-vcf-orange">ROOMS</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Sigue los partidos en tiempo real con estadísticas y chat en vivo
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
              ROOMS <span className="text-vcf-orange">DISPONIBLES</span>
            </h2>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Cargando salas...</p>
          ) : publicRooms.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-2xl font-black mb-2">No hay salas activas</p>
              <p className="text-base">Las salas aparecen cuando hay un partido próximo o en vivo</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  variant="discover"
                  onJoin={setSelectedRoom}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Rooms */}
      {activeTab === "my-rooms" && (
        <div>
          <h2 className="text-3xl font-black mb-6 text-foreground">
            TUS <span className="text-vcf-orange">ROOMS</span>
          </h2>
          {myRooms.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-2xl font-black mb-2">No tienes salas</p>
              <motion.button
                onClick={() => setActiveTab("create")}
                className="mt-4 px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black"
                whileHover={{ scale: 1.05, backgroundColor: "#e05516", borderColor: "#e05516" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                CREAR MI PRIMERA SALA
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  variant="mine"
                  onJoin={setSelectedRoom}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create */}
      {activeTab === "create" && (
        <CreateRoomForm
          userId={user?.id ?? ""}
          onCreateRoom={(room) => {
            setSelectedRoom(room);
          }}
        />
      )}
    </div>
  );
}
