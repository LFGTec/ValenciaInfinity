import { useState } from "react";
import { Send } from "lucide-react";
import type { Message } from "./types";

const initialMessages: Message[] = [
  { id: "1", user: "Juan", message: "Vamos Valencia!", timestamp: new Date() },
  { id: "2", user: "Maria", message: "Amunt!", timestamp: new Date() },
  { id: "3", user: "Carlos", message: "Gran partido!", timestamp: new Date() },
  { id: "4", user: "Ana", message: "Vamos equipo!", timestamp: new Date() },
  { id: "5", user: "Pedro", message: "A por ellos!", timestamp: new Date() },
  { id: "6", user: "Laura", message: "Forca Valencia!", timestamp: new Date() },
  { id: "7", user: "Miguel", message: "Increible!", timestamp: new Date() },
  { id: "8", user: "Sofia", message: "Gran jugada!", timestamp: new Date() },
];

interface RoomChatProps {
  participants: number;
}

export function RoomChat({ participants }: RoomChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: "Tu",
        message: newMessage,
        timestamp: new Date(),
      },
    ]);
    setNewMessage("");
  };

  return (
    <div
      className="bg-card border-2 border-border rounded-lg flex flex-col shadow-lg"
      style={{ height: "calc(100vh - 180px)", minHeight: "700px" }}
    >
      <div className="p-3 border-b-2 border-border bg-vcf-orange/10">
        <h3 className="font-black text-foreground text-sm">CHAT DEL ROOM</h3>
        <p className="text-xs text-muted-foreground">{participants} participantes</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-foreground text-sm">{msg.user}</span>
                <span className="text-xs text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t-2 border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg border-2 border-border focus:border-vcf-orange outline-none"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
