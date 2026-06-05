import { useState, useRef } from "react";
import {
  ChevronLeft,
  Lock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Shield,
  Wifi,
} from "lucide-react";
import type { Match, Sector, Seat } from "@/pages/TicketsPage";
import { StepIndicator } from "./StepIndicator";
import { useTicketStore } from "./store/useTicketStore";
import { ZONE_PRICES, ZONE_COLORS } from "./data/seat";

// ─── Card helpers ─────────────────────────────────────────────────────────────

type CardType = "visa" | "mastercard" | "amex" | "";

function detectCard(num: string): CardType {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "";
}

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function isValidExpiry(val: string): boolean {
  const m = val.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1]);
  const year = 2000 + parseInt(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return (
    new Date(year, month - 1) >= new Date(now.getFullYear(), now.getMonth())
  );
}

// ─── Animated credit card visual ─────────────────────────────────────────────

function CardVisual({
  number,
  name,
  expiry,
  cvv,
  flipped,
  cardType,
}: {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  flipped: boolean;
  cardType: CardType;
}) {
  const gradients: Record<string, string> = {
    visa: "from-[#1a1f71] via-[#1a3a8f] to-[#2d5be3]",
    mastercard: "from-[#1a1a2e] via-[#b5451b] to-[#eb5f1a]",
    amex: "from-[#2c7a4b] via-[#1a5c38] to-[#0e3d25]",
    "": "from-[#1e1e2e] via-[#2d2d4a] to-[#3d3d6b]",
  };
  const gradient = gradients[cardType] || gradients[""];

  // Pad / mask card display
  const raw = number.replace(/\s/g, "");
  const groups = [
    raw.slice(0, 4).padEnd(4, "•"),
    raw.slice(4, 8).padEnd(4, "•"),
    raw.slice(8, 12).padEnd(4, "•"),
    raw.slice(12, 16).padEnd(4, "•"),
  ];

  return (
    <div
      className="relative h-48 w-full max-w-sm mx-auto"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-2xl`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* NFC + Brand */}
          <div className="flex items-start justify-between mb-4">
            <Wifi size={22} className="text-white/60 rotate-90" />
            <CardBrand type={cardType} />
          </div>
          {/* Chip */}
          <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md mb-4 grid grid-cols-3 grid-rows-3 p-0.5 gap-px">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-[1px] ${[1, 3, 4, 5, 7].includes(i) ? "bg-yellow-400" : "bg-yellow-600"}`}
              />
            ))}
          </div>
          {/* Number */}
          <div className="flex gap-3 mb-4">
            {groups.map((g, i) => (
              <span
                key={i}
                className="font-mono font-bold text-white text-lg tracking-widest"
              >
                {g}
              </span>
            ))}
          </div>
          {/* Name & Expiry */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">
                Titular
              </div>
              <div className="text-white font-bold text-sm uppercase tracking-wide truncate max-w-32">
                {name || "NOMBRE APELLIDO"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">
                Caduca
              </div>
              <div className="text-white font-bold text-sm font-mono">
                {expiry || "MM/AA"}
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl overflow-hidden`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Magnetic strip */}
          <div className="w-full h-10 bg-black/80 mt-8 mb-6" />
          {/* Signature + CVV */}
          <div className="px-6 flex items-center gap-3">
            <div className="flex-1 h-9 bg-white/90 rounded flex items-center px-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-3 bg-gray-300 rounded-full"
                    style={{
                      transform: `rotate(${Math.random() * 20 - 10}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="w-14 h-9 bg-white rounded flex items-center justify-center">
              <span className="font-mono font-bold text-gray-900 text-base tracking-widest">
                {cvv ? cvv.padEnd(3, "•") : "•••"}
              </span>
            </div>
          </div>
          <div className="px-6 mt-1">
            <span className="text-white/40 text-[10px]">CVV</span>
          </div>
          <div className="px-6 mt-4">
            <CardBrand type={cardType} small />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardBrand({ type, small }: { type: CardType; small?: boolean }) {
  const size = small ? "text-sm" : "text-xl";
  if (type === "visa") {
    return (
      <span
        className={`font-black italic text-white tracking-tight ${size}`}
        style={{ fontFamily: "serif" }}
      >
        VISA
      </span>
    );
  }
  if (type === "mastercard") {
    return (
      <div className="flex items-center">
        <div
          className={`${small ? "w-5 h-5" : "w-7 h-7"} bg-red-500 rounded-full opacity-90`}
        />
        <div
          className={`${small ? "w-5 h-5" : "w-7 h-7"} bg-orange-400 rounded-full -ml-2 opacity-90`}
        />
      </div>
    );
  }
  if (type === "amex") {
    return (
      <span
        className={`font-black text-white tracking-widest ${small ? "text-xs" : "text-sm"}`}
      >
        AMEX
      </span>
    );
  }
  return (
    <div
      className={`${small ? "w-5 h-5" : "w-8 h-8"} rounded border-2 border-white/30`}
    />
  );
}

// ─── Processing overlay ───────────────────────────────────────────────────────

const STEPS = [
  "Verificando datos de la tarjeta...",
  "Conectando con el banco...",
  "Procesando el pago...",
  "¡Pago confirmado!",
];

function ProcessingOverlay({ step }: { step: number }) {
  const done = step === 3;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 max-w-sm w-full mx-4 shadow-2xl text-center">
        <div
          className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 ${done ? "bg-green-100" : "bg-[#EE3224]/10"}`}
        >
          {done ? (
            <CheckCircle size={48} className="text-green-500" />
          ) : (
            <Loader2 size={40} className="text-[#EE3224] animate-spin" />
          )}
        </div>
        <div className="text-xl font-black text-gray-900 mb-3">
          {done ? "¡Pago realizado!" : "Procesando pago"}
        </div>
        <div className="text-gray-600 text-sm min-h-[1.5rem] transition-all">
          {STEPS[step]}
        </div>
        {!done && (
          <div className="mt-6 space-y-1.5">
            {STEPS.slice(0, 3).map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-left"
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i < step ? "bg-green-500" : i === step ? "bg-[#EE3224]" : "bg-gray-200"}`}
                >
                  {i < step && <CheckCircle size={10} className="text-white" />}
                </div>
                <span className={i <= step ? "text-gray-900" : "text-gray-400"}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Checkout ────────────────────────────────────────────────────────────

export function Checkout({
  match,
  sector,
  seat,
  stepNumber,
  onBack,
  onConfirm,
}: {
  match: Match;
  sector: Sector;
  seat: Seat;
  stepNumber: number;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvFocused, setCvvFocused] = useState(false);
  const [touched, setTouched] = useState({
    number: false,
    name: false,
    expiry: false,
    cvv: false,
  });
  const [processing, setProcessing] = useState(false);
  const [procStep, setProcStep] = useState(0);

  const prevExpiryLen = useRef(0);

  const { selectedSeats } = useTicketStore();

  const cardType = detectCard(number);
  const rawDigits = number.replace(/\s/g, "");

  // Usa todos los asientos del store; si está vacío cae al sector individual
  const ticketItems = selectedSeats.length > 0
    ? selectedSeats.map((s) => ({
        id: s.id,
        label: `${s.zone} · Fila ${s.row} · Asiento ${s.col}`,
        price: ZONE_PRICES[s.zone],
        color: ZONE_COLORS[s.zone],
      }))
    : [{ id: "single", label: `${sector.name} · Fila ${seat.row} · Asiento #${seat.number}`, price: sector.price, color: "#EE3224" }];

  const subtotal = ticketItems.reduce((sum, t) => sum + t.price, 0);
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + serviceFee;

  // ── Validation ──────────────────────────────────────────────────────────────
  const errors = {
    number:
      touched.number && rawDigits.length !== 16
        ? "Introduce los 16 dígitos de tu tarjeta"
        : "",
    name:
      touched.name && name.trim().length < 3
        ? "Introduce el nombre que aparece en la tarjeta"
        : "",
    expiry:
      touched.expiry && !isValidExpiry(expiry)
        ? "Fecha inválida o tarjeta caducada"
        : "",
    cvv: touched.cvv && cvv.length < 3 ? "El CVV debe tener 3 dígitos" : "",
  };

  const isValid =
    rawDigits.length === 16 &&
    name.trim().length >= 3 &&
    isValidExpiry(expiry) &&
    cvv.length === 3;

  // ── Input handlers ──────────────────────────────────────────────────────────

  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(formatCardNumber(e.target.value));
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only letters, spaces, accented chars, hyphens
    const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, "").toUpperCase();
    setName(val);
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
    // Auto-advance: if user just typed 2nd month digit and wasn't deleting
    if (digits.length === 2 && prevExpiryLen.current === 1) {
      setExpiry(formatted + "/");
    } else {
      setExpiry(formatted);
    }
    prevExpiryLen.current = digits.length;
  };

  const handleExpiryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace to eat the slash cleanly
    if (e.key === "Backspace" && expiry.endsWith("/")) {
      e.preventDefault();
      setExpiry(expiry.slice(0, -1));
      prevExpiryLen.current = expiry.length - 1;
    }
  };

  const handleCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setTouched({ number: true, name: true, expiry: true, cvv: true });
    if (!isValid) return;

    setProcessing(true);
    setProcStep(0);
    await delay(700);
    setProcStep(1);
    await delay(700);
    setProcStep(2);
    await delay(700);
    setProcStep(3);
    await delay(900);
    onConfirm();
  };

  return (
    <>
      {processing && <ProcessingOverlay step={procStep} />}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-vcf-orange/5 transition-colors font-bold flex-shrink-0 cursor-pointer hover:-translate-y-1"
            >
              <ChevronLeft size={20} />
              Volver
            </button>
            <div className="text-center">
              <div className="text-sm font-black text-gray-900">
                Pago seguro
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                <Lock size={10} />
                Conexión SSL cifrada
              </div>
            </div>
            <StepIndicator current={stepNumber} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Finalizar compra
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Introduce los datos de tu tarjeta para completar la simulación
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Left: Card form ── */}
            <div className="lg:col-span-3 space-y-6">
              {/* Card visual */}
              <CardVisual
                number={number}
                name={name}
                expiry={expiry}
                cvv={cvv}
                flipped={cvvFocused}
                cardType={cardType}
              />

              {/* Form card */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#EE3224]/10 rounded-lg flex items-center justify-center">
                    <span className="text-[#EE3224] font-black text-sm">1</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900">
                    Datos de la tarjeta
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Card number */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={number}
                        onChange={handleNumber}
                        onBlur={() =>
                          setTouched((t) => ({ ...t, number: true }))
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 pr-14 bg-gray-50 border-2 rounded-xl text-gray-900 font-mono placeholder-gray-400 focus:outline-none transition-colors text-lg tracking-widest ${
                          errors.number
                            ? "border-red-400 focus:border-red-500"
                            : rawDigits.length === 16
                              ? "border-green-400 focus:border-green-500"
                              : "border-gray-200 focus:border-[#EE3224]"
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {cardType ? (
                          <CardBrand type={cardType} />
                        ) : (
                          <div className="w-8 h-6 border-2 border-gray-200 rounded" />
                        )}
                      </div>
                    </div>
                    {errors.number && <FieldError msg={errors.number} />}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Fecha de caducidad
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiry}
                        onChange={handleExpiry}
                        onKeyDown={handleExpiryKeyDown}
                        onBlur={() =>
                          setTouched((t) => ({ ...t, expiry: true }))
                        }
                        placeholder="MM/AA"
                        maxLength={5}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 font-mono placeholder-gray-400 focus:outline-none transition-colors text-lg tracking-widest ${
                          errors.expiry
                            ? "border-red-400 focus:border-red-500"
                            : isValidExpiry(expiry)
                              ? "border-green-400 focus:border-green-500"
                              : "border-gray-200 focus:border-[#EE3224]"
                        }`}
                      />
                      {errors.expiry && <FieldError msg={errors.expiry} />}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        CVV{" "}
                        <span className="font-normal text-gray-400 text-xs">
                          (3 dígitos al dorso)
                        </span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cvv}
                        onChange={handleCvv}
                        onFocus={() => setCvvFocused(true)}
                        onBlur={() => {
                          setCvvFocused(false);
                          setTouched((t) => ({ ...t, cvv: true }));
                        }}
                        placeholder="•••"
                        maxLength={3}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 font-mono placeholder-gray-400 focus:outline-none transition-colors text-lg tracking-widest ${
                          errors.cvv
                            ? "border-red-400 focus:border-red-500"
                            : cvv.length === 3
                              ? "border-green-400 focus:border-green-500"
                              : cvvFocused
                                ? "border-[#EE3224]"
                                : "border-gray-200 focus:border-[#EE3224]"
                        }`}
                      />
                      {errors.cvv && <FieldError msg={errors.cvv} />}
                    </div>
                  </div>

                  {/* Cardholder name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nombre del titular
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={handleName}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      placeholder="NOMBRE APELLIDO"
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 font-bold placeholder-gray-400 focus:outline-none transition-colors uppercase tracking-wide ${
                        errors.name
                          ? "border-red-400 focus:border-red-500"
                          : name.trim().length >= 3
                            ? "border-green-400 focus:border-green-500"
                            : "border-gray-200 focus:border-[#EE3224]"
                      }`}
                    />
                    {errors.name && <FieldError msg={errors.name} />}
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Lock size={12} className="text-green-500" />
                  Cifrado SSL 256-bit
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield size={12} className="text-green-500" />
                  Pago simulado — sin cargos reales
                </div>
              </div>
            </div>

            {/* ── Right: Order summary ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  Resumen del pedido
                </h3>

                {/* Match */}
                <div className="mb-4">
                  <div className="text-sm font-black text-gray-900">
                    {match.homeTeam} vs {match.awayTeam}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(match.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    · {match.time}h
                  </div>
                  <div className="text-xs text-gray-500">{match.stadium}</div>
                </div>

                {/* Desglose de entradas */}
                <div className="border-t border-gray-100 pt-4 pb-2 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wide">
                      Entradas
                    </span>
                    <span className="text-xs bg-[#EE3224]/10 text-[#EE3224] font-bold px-2 py-0.5 rounded-full border border-[#EE3224]/20">
                      {ticketItems.length} {ticketItems.length === 1 ? "entrada" : "entradas"}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {ticketItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: item.color }}
                          />
                          <span className="text-xs font-medium text-gray-700 truncate">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-black text-gray-900 ml-2 shrink-0">
                          €{item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-100 py-3 space-y-2">
                  <SummaryRow
                    label="Subtotal"
                    value={`€${subtotal.toFixed(2)}`}
                  />
                  <SummaryRow
                    label="Cargo de gestión (10%)"
                    value={`€${serviceFee.toFixed(2)}`}
                    muted
                  />
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="text-3xl font-black text-[#EE3224]">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={processing}
                  className={`w-full py-4 rounded-xl  cursor-pointer font-black text-white flex items-center justify-center gap-2 transition-all shadow-lg text-base ${
                    isValid
                      ? "bg-gray-600 hover:-translate-y-1 hover:shadow-xl active:scale-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Lock size={18} />
                  Confirmar y pagar
                </button>

                {!isValid && Object.values(touched).some(Boolean) && (
                  <p className="text-xs text-red-500 text-center mt-2 flex items-center justify-center gap-1">
                    <AlertCircle size={12} />
                    Completa todos los campos correctamente
                  </p>
                )}

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  Simulación — no se realizará ningún cargo real
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      <AlertCircle size={11} />
      {msg}
    </p>
  );
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-bold ${muted ? "text-gray-400" : "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
