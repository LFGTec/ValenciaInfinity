import { useState, useEffect, useMemo } from "react";
import { MatchSelection } from "@/components/entradas/MatchSelection";
import { CesiumStadiumExperience } from "@/components/entradas/CesiumStadiumExperience";
import { Checkout } from "@/components/entradas/Checkout";
import { TicketSuccess } from "@/components/entradas/TicketSuccess";
import { useTicketStore } from "@/components/entradas/store/useTicketStore";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  awayCrest: string;
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
    awayCrest: "https://crests.football-data.org/86.svg",
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
    awayCrest: "https://crests.football-data.org/81.svg",
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
    awayCrest: "https://crests.football-data.org/78.svg",
    competition: "Copa del Rey",
    date: "2026-06-29",
    time: "21:30",
    stadium: "Mestalla",
    startingPrice: 35,
    availability: "available",
  },
];

type Step = "matches" | "stadium3d" | "checkout" | "success";

const STEP_NUMBER: Record<Step, number> = {
  matches:   1,
  stadium3d: 2,
  checkout:  3,
  success:   4,
};

// ── Session persistence ────────────────────────────────────────────────────────

const SESSION_KEY = "vcf-ticket-flow";

interface SessionData {
  step: Step;
  match: Match | null;
  sector: Sector | null;
  seat: Seat | null;
}

function readSession(): SessionData {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { step: "matches", match: null, sector: null, seat: null };

    const data = JSON.parse(raw) as SessionData;

    // Si el paso requiere un partido pero no hay ninguno → inicio
    if (
      (data.step === "stadium3d" ||
        data.step === "checkout" ||
        data.step === "success") &&
      !data.match
    ) {
      return { step: "matches", match: null, sector: null, seat: null };
    }

    // Si el paso requiere sector/asiento pero no hay → estadio
    if (
      (data.step === "checkout" || data.step === "success") &&
      (!data.sector || !data.seat)
    ) {
      return { step: "stadium3d", match: data.match, sector: null, seat: null };
    }

    return data;
  } catch {
    return { step: "matches", match: null, sector: null, seat: null };
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

export function TicketPurchase() {
  const initial = useMemo(() => readSession(), []);

  const [step, setStep] = useState<Step>(initial.step);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(initial.match);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(initial.sector);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(initial.seat);

  // Persiste cada cambio de estado en sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ step, match: selectedMatch, sector: selectedSector, seat: selectedSeat }),
    );
  }, [step, selectedMatch, selectedSector, selectedSeat]);

  const currentStep = STEP_NUMBER[step];

  function handleDone() {
    useTicketStore.getState().goHome();
    sessionStorage.removeItem(SESSION_KEY);
    setStep("matches");
    setSelectedMatch(null);
    setSelectedSector(null);
    setSelectedSeat(null);
  }

  return (
    <div>
      {step === "matches" && (
        <MatchSelection
          matches={MATCHES}
          stepNumber={currentStep}
          onSelectMatch={(match) => {
            setSelectedMatch(match);
            setStep("stadium3d");
          }}
        />
      )}

      {step === "stadium3d" && selectedMatch && (
        <CesiumStadiumExperience
          match={selectedMatch}
          stepNumber={currentStep}
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
          stepNumber={currentStep}
          onBack={() => setStep("stadium3d")}
          onConfirm={() => setStep("success")}
        />
      )}

      {step === "success" && selectedMatch && selectedSector && selectedSeat && (
        <TicketSuccess
          match={selectedMatch}
          sector={selectedSector}
          seat={selectedSeat}
          stepNumber={currentStep}
          onDone={handleDone}
        />
      )}
    </div>
  );
}
