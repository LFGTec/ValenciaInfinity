import { useState } from "react";
import { MatchSelection } from "@/components/entradas/MatchSelection";
import { Stadium3DExperience } from "@/components/entradas/Stadium3DExperience";
import { Checkout } from "@/components/entradas/Checkout";
import { TicketSuccess } from "@/components/entradas/TicketSuccess";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  time: string;
  stadium: string;
  startingPrice: number;
  availability: "available" | "low" | "sold-out";
}

export interface Sector {
  id: string;
  name: string;
  category: "A" | "B" | "C" | "D";
  color: string;
  price: number;
  available: number;
}

export interface Seat {
  row: string;
  number: number;
  status: "available" | "taken" | "selected";
}

const MATCHES: Match[] = [
  {
    id: "1",
    homeTeam: "Valencia CF",
    awayTeam: "Real Madrid",
    competition: "La Liga",
    date: "2026-06-15",
    time: "21:00",
    stadium: "Mestalla",
    startingPrice: 45,
    availability: "available",
  },
  {
    id: "2",
    homeTeam: "Valencia CF",
    awayTeam: "FC Barcelona",
    competition: "La Liga",
    date: "2026-06-22",
    time: "18:30",
    stadium: "Mestalla",
    startingPrice: 65,
    availability: "low",
  },
  {
    id: "3",
    homeTeam: "Valencia CF",
    awayTeam: "Atlético Madrid",
    competition: "Copa del Rey",
    date: "2026-06-29",
    time: "21:30",
    stadium: "Mestalla",
    startingPrice: 35,
    availability: "available",
  },
];

const SECTORS: Sector[] = [
  { id: "tribuna",       name: "Tribuna Central", category: "A", color: "#3B82F6", price: 85,  available: 45  },
  { id: "preferencia",   name: "Preferencia",     category: "B", color: "#60A5FA", price: 65,  available: 120 },
  { id: "fondo-norte",   name: "Fondo Norte",     category: "C", color: "#10B981", price: 45,  available: 230 },
  { id: "fondo-sur",     name: "Fondo Sur",       category: "C", color: "#10B981", price: 45,  available: 180 },
  { id: "fondos-altos",  name: "Fondos Altos",    category: "D", color: "#F59E0B", price: 35,  available: 340 },
];

type Step = "matches" | "stadium3d" | "checkout" | "success";

export function TicketPurchase() {
  const [step, setStep] = useState<Step>("matches");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      {step === "matches" && (
        <MatchSelection
          matches={MATCHES}
          onSelectMatch={(match) => {
            setSelectedMatch(match);
            setStep("stadium3d");
          }}
        />
      )}

      {step === "stadium3d" && selectedMatch && (
        <Stadium3DExperience
          match={selectedMatch}
          sectors={SECTORS}
          onBack={() => setStep("matches")}
          onSelectSeat={(sector, seat) => {
            setSelectedSector(sector);
            setSelectedSeat(seat);
            setStep("checkout");
          }}
        />
      )}

      {step === "checkout" && selectedMatch && selectedSector && selectedSeat && (
        <Checkout
          match={selectedMatch}
          sector={selectedSector}
          seat={selectedSeat}
          onBack={() => setStep("stadium3d")}
          onConfirm={() => setStep("success")}
        />
      )}

      {step === "success" && selectedMatch && selectedSector && selectedSeat && (
        <TicketSuccess
          match={selectedMatch}
          sector={selectedSector}
          seat={selectedSeat}
          onDone={() => setStep("matches")}
        />
      )}
    </div>
  );
}
