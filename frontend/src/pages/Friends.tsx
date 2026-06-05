import React, { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  Users,
  X,
  Check,
  Trophy,
  BookOpen,
  Video,
  MapPin,
  Gamepad2,
} from "lucide-react";
import { Toast } from "@/components/ui.disabled/Toast";
import { useFriends } from "@/hooks/useFriends";
import { Link } from "react-router-dom";

export function Friends() {
    const [activeTab, setActiveTab] = useState<"friends" | "search" | "requests">("friends");
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
     const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [searchQuery, setSearchQuery] =
            useState("");

    const {
        myFriends,
        pendingRequests,
        searchResults,
        searchUsers,

        sendRequest,
        acceptRequest,
        rejectRequest,
        removeFriend,

        loading,
    } = useFriends();

    

    useEffect(() => {
    const timeout = setTimeout(() => {
        searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
    }, [searchQuery]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-12 bg-content min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
                MIS <span className="text-vcf-orange">AMIGOS</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                Conecta con otros fanáticos del Valencia CF
                </p>
            </div>

            <div className="mb-8">
                <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md max-w-md">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-16 h-16 bg-vcf-orange rounded-lg flex items-center justify-center">
                    <Users size={32} className="text-white" />
                    </div>
                    <div className="text-6xl font-black text-foreground">
                    {myFriends.length}
                    </div>
                </div>
                <div className="text-lg font-bold text-muted-foreground">
                    Total de Amigos
                </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b-2 border-border">
                <button
                onClick={() => setActiveTab("friends")}
                className={`px-6 py-3 font-black transition-all ${
                    activeTab === "friends"
                    ? "border-b-4 border-vcf-orange text-vcf-orange"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                >
                MIS AMIGOS
                </button>
                <button
                onClick={() => setActiveTab("requests")}
                className={`px-6 py-3 font-black transition-all relative ${
                    activeTab === "requests"
                    ? "border-b-4 border-vcf-orange text-vcf-orange"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                >
                SOLICITUDES
                {pendingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-vcf-orange text-white rounded-full text-xs flex items-center justify-center font-black">
                    {pendingRequests.length}
                    </span>
                )}
                </button>
                <button
                onClick={() => setActiveTab("search")}
                className={`px-6 py-3 font-black transition-all ${
                    activeTab === "search"
                    ? "border-b-4 border-vcf-orange text-vcf-orange"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                >
                BUSCAR USUARIOS
                </button>
            </div>

            {/* Friends List */}
            {activeTab === "friends" && (
                <div>
                {myFriends.length === 0 ? (
                    <div className="text-center py-16">
                    <Users size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-black mb-2 text-foreground">
                        Aún no tienes amigos
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Busca usuarios y agrégalos como amigos
                    </p>
                    <button
                        onClick={() => setActiveTab("search")}
                        className="px-6 py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] transition-all"
                    >
                        BUSCAR USUARIOS
                    </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myFriends.map((friend) => (
                        <div
                        key={friend.id}
                        className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-orange transition-all shadow-md hover:shadow-xl"
                        >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                src={friend.avatar_url}
                                alt={friend.full_name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-vcf-orange"
                                />
                            </div>
                            <div>
                                <h3 className="font-black text-foreground">
                                {friend.full_name}
                                </h3>
                                
                                <div className="flex items-center gap-1 mt-1">
                                    <MapPin size={12} className="text-vcf-orange" />
                                    <span className="text-xs text-muted-foreground">
                                        {friend.location || "No mostrando ubicación"}
                                    </span>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-muted rounded-lg p-3 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Trophy size={16} className="text-vcf-orange" />
                                    <span className="text-xl font-black text-foreground">
                                    {friend.puntos}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground font-bold">
                                    Puntos
                                </div>
                            </div>
                            <div className="bg-muted rounded-lg p-3 text-center">
                            <div className="flex flex-col items-center gap-2 mb-1">
                                
                                <div className="flex items-center gap-1">
                                <Gamepad2
                                    size={16}
                                    className="text-vcf-orange"
                                />

                                <span className="text-sm font-black text-foreground">
                                    Juego
                                </span>
                                </div>

                                <button
                                onClick={() =>
                                    setSelectedPin(friend.friend_pin || "N/A")
                                }
                                className="
                                    w-full
                                    px-3 py-2
                                    border-2 border-vcf-orange
                                    text-vcf-orange
                                    bg-card
                                    rounded-lg
                                    font-bold
                                    hover:bg-vcf-orange
                                    hover:text-white
                                    hover:shadow-md
                                    transition-all duration-200
                                    text-sm
                                "
                            >
                            Mostrar PIN
                            </button>
                            </div>

                            <div className="text-xs text-muted-foreground font-bold">
                                PIN de Juego
                            </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                            <Link to={`/album/${friend.id}`} 
                            className="
                            flex-1
                            px-3 py-2
                            border-2 border-vcf-orange
                            text-vcf-orange
                            bg-card
                            rounded-lg
                            font-bold
                            hover:bg-vcf-orange
                            hover:text-white
                            hover:shadow-md
                            transition-all duration-200
                            flex items-center justify-center gap-2
                            text-sm
                            ">
                                <BookOpen size={16} />
                                Ver Álbum 
                            </Link>
                            <Link to="/match-rooms" 
                            className="
                                flex-1
                                px-3
                                py-2
                                border-2
                                border-vcf-orange
                                text-vcf-orange
                                bg-card
                                rounded-lg
                                font-bold
                                hover:bg-vcf-orange
                                hover:text-white
                                hover:shadow-md
                                transition-all
                                duration-200
                                flex
                                items-center
                                justify-center
                                gap-2
                                text-sm
                            ">
                                <Video size={16} />
                                Match Room
                            </Link>
                            </div>
                            <button
                            onClick={() => removeFriend(friend.friendship_id!)}
                            className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                            >
                            <X size={16} />
                            Eliminar Amigo
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            )}

            {/* Modal Show Pin */}
            {selectedPin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                
                <div className="bg-card border-2 border-vcf-orange rounded-2xl p-8 w-[90%] max-w-md shadow-2xl relative">
                
                <button
                    onClick={() => setSelectedPin(null)}
                    className="
                    absolute
                    top-4
                    right-4
                    text-muted-foreground
                    hover:text-white
                    transition-colors
                    "
                >
                    <X size={22} />
                </button>

                <div className="flex flex-col items-center text-center">
                    
                    <div className="w-20 h-20 rounded-full bg-vcf-orange flex items-center justify-center mb-4">
                    <Gamepad2 size={36} className="text-white" />
                    </div>

                    <h2 className="text-2xl font-black text-foreground mb-2">
                    PIN DE JUEGO
                    </h2>

                    <p className="text-muted-foreground mb-6">
                    Utiliza este PIN con tu amigo para entrar juntos a la sala.
                    </p>

                    <div
                    className="
                        bg-muted
                        border-2
                        border-vcf-orange
                        rounded-xl
                        px-8
                        py-6
                        text-5xl
                        tracking-[0.4em]
                        font-black
                        text-vcf-orange
                        mb-6
                    "
                    >
                    {selectedPin}
                    </div>

                    <button
                    onClick={async () => {
                        try {
                        await navigator.clipboard.writeText(selectedPin);

                        setToast({
                            message: "PIN copiado al portapapeles",
                            type: "success",
                        });

                        setSelectedPin(null);
                        } catch {
                        setToast({
                            message: "No se pudo copiar el PIN",
                            type: "error",
                        });
                        }
                    }}
                    className="
                        w-full
                        py-3
                        rounded-lg
                        bg-vcf-orange
                        text-white
                        font-bold
                        hover:scale-105
                        transition-all
                    "
                    >
                    COPIAR PIN
                    </button>

                    <p className="text-xs text-muted-foreground mt-4">
                    El PIN cambia automáticamente cada 24 horas
                    </p>
                </div>
                </div>
            </div>
            )}

            {/* Pending Requests */}
            {activeTab === "requests" && (
                <div>
                {pendingRequests.length === 0 ? (
                    <div className="text-center py-16">
                    <UserPlus
                        size={64}
                        className="mx-auto mb-4 text-muted-foreground"
                    />
                    <h3 className="text-2xl font-black mb-2 text-foreground">
                        No tienes solicitudes pendientes
                    </h3>
                    <p className="text-muted-foreground">
                        Cuando alguien te envíe una solicitud de amistad aparecerá aquí
                    </p>
                    </div>
                ) : (
                    <div>
                    <div className="mb-4 p-4 bg-vcf-orange/10 border-2 border-vcf-orange rounded-lg">
                        <p className="text-sm font-bold text-foreground">
                        Tienes <span className="text-vcf-orange">{pendingRequests.length}</span>{" "}
                        {pendingRequests.length === 1 ? "solicitud pendiente" : "solicitudes pendientes"}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingRequests.map((user) => (
                        <div
                            key={user.id}
                            className="bg-card border-2 border-vcf-orange rounded-lg p-6 shadow-md hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                <img
                                    src={user.avatar_url}
                                    alt={user.full_name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-vcf-orange"
                                />
                                
                                </div>
                                <div>
                                    <h3 className="font-black text-foreground">
                                        {user.full_name}
                                    </h3>

                                    <div className="flex items-center gap-1 mt-1">
                                        <MapPin size={12} className="text-vcf-orange" />
                                        <span className="text-xs text-muted-foreground">
                                            {user.location || "No mostrando ubicación"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            </div>

                            <div className="flex justify-center mb-4">
                            <div className="bg-muted rounded-lg p-3 text-center min-w-[140px]">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Trophy
                                size={16}
                                className="text-vcf-orange"
                                />
                                <span className="text-xl font-black text-foreground">
                                {user.puntos}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground font-bold">
                                Puntos
                            </div>
                            </div>
                            
                            </div>

                            <div className="flex gap-2">
                            <button
                                onClick={() => acceptRequest(user.friendship_id!)}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={18} />
                                ACEPTAR
                            </button>
                            <button
                                onClick={() => rejectRequest(user.friendship_id!)}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                RECHAZAR
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                )}
                </div>
            )}

            {/* Search Results */}
            {activeTab === "search" && (
                <div className="mb-8">
                <div className="relative">
                    <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                    />
                    <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre o usuario..."
                    className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none transition-colors"
                    />
                </div>
                </div>
            )}
                
            {activeTab === "search" && (
                <div>
                {searchQuery.trim() === "" ? (
                    <div className="text-center py-16">
                    <Search
                        size={64}
                        className="mx-auto mb-4 text-muted-foreground"
                    />
                    <h3 className="text-2xl font-black mb-2 text-foreground">
                        Busca usuarios
                    </h3>
                    <p className="text-muted-foreground">
                        Escribe un nombre o usuario para buscar
                    </p>
                    </div>
                ) : searchResults.length === 0 ? (
                    <div className="text-center py-16">
                    <Users size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-black mb-2 text-foreground">
                        No se encontraron resultados
                    </h3>
                    <p className="text-muted-foreground">
                        Intenta con otro término de búsqueda
                    </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((user) => (
                        <div
                        key={user.id}
                        className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-orange transition-all shadow-md hover:shadow-xl"
                        >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-border"
                                />
                            </div>
                            <div>
                                <h3 className="font-black text-foreground">
                                {user.full_name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <MapPin size={12} className="text-vcf-orange" />
                                    <span className="text-xs text-muted-foreground">
                                    {user.location || "No mostrando ubicación"}
                                    </span>
                                </div>     
                            </div>
                            </div>
                        </div>

                        <div className="flex justify-center mb-4">
                            <div className="bg-muted rounded-lg p-3 text-center min-w-[140px]">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Trophy
                                size={16}
                                className="text-vcf-orange"
                                />
                                <span className="text-xl font-black text-foreground">
                                {user.puntos}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground font-bold">
                                Puntos
                            </div>
                            </div>
                        </div>

                        {user.friendship_status === "PENDING_SENT" || user.friendship_status === "PENDING_RECEIVED" ? (
                            <button
                            disabled
                            className="
                                w-full
                                px-4
                                py-3
                                border-2
                                border-vcf-orange
                                text-vcf-orange
                                bg-white
                                rounded-lg
                                font-bold
                                cursor-not-allowed
                                flex
                                items-center
                                justify-center
                                gap-2
                            "
                            >
                            <UserPlus size={18} />
                            SOLICITUD ENVIADA
                            </button>
                        ) : (
                            <button
                                onClick={() => sendRequest(user.id)}
                                className="w-full px-4 py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] transition-all flex items-center justify-center gap-2"
                            >
                                <UserPlus size={18} />
                                AGREGAR AMIGO
                            </button>
                        )}
                        </div>
                    ))}
                    </div>
                )}
                </div>
            )}

            {/* Toast Notifications */}
            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}