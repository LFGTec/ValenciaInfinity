import { useEffect, useRef, useState } from "react";
import { Check, Download, Smartphone, ChevronRight } from "lucide-react";
import type { Match, Sector, Seat } from "@/pages/TicketsPage";
import vcfShield from "../../assets/EscudoValenciaCF.png";
import { StepIndicator } from "./StepIndicator";

// ─── QR Code generator (canvas-based, no external deps) ──────────────────────

function drawFinder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cell: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, 7 * cell, 7 * cell);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + cell, y + cell, 5 * cell, 5 * cell);
  ctx.fillStyle = "#000";
  ctx.fillRect(x + 2 * cell, y + 2 * cell, 3 * cell, 3 * cell);
}

function drawAlignment(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cell: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, 5 * cell, 5 * cell);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + cell, y + cell, 3 * cell, 3 * cell);
  ctx.fillStyle = "#000";
  ctx.fillRect(x + 2 * cell, y + 2 * cell, cell, cell);
}

function generateQR(canvas: HTMLCanvasElement, data: string) {
  const MODULES = 25;
  const CELL = 9;
  const QUIET = 3;
  const TOTAL = (MODULES + QUIET * 2) * CELL;

  canvas.width = TOTAL;
  canvas.height = TOTAL;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, TOTAL, TOTAL);

  // Deterministic hash of data
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }

  // Reserved zones
  const reserved = (r: number, c: number) =>
    (r < 9 && c < 9) ||
    (r < 9 && c >= MODULES - 8) ||
    (r >= MODULES - 8 && c < 9) ||
    (r === 6 && c >= 8 && c <= MODULES - 9) ||
    (c === 6 && r >= 8 && r <= MODULES - 9) ||
    (r >= MODULES - 9 &&
      r <= MODULES - 5 &&
      c >= MODULES - 9 &&
      c <= MODULES - 5) ||
    (r === 8 && (c <= 8 || c >= MODULES - 8)) ||
    (c === 8 && (r <= 8 || r >= MODULES - 8));

  const fill = (c: number, r: number) => {
    ctx.fillStyle = "#000";
    ctx.fillRect((QUIET + c) * CELL, (QUIET + r) * CELL, CELL - 1, CELL - 1);
  };

  // Data modules — deterministic based on hash
  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      if (!reserved(r, c)) {
        const idx = r * MODULES + c;
        const bit =
          (Math.imul(
            h ^ (idx * 0x9e3779b9 + (idx << 6) + (idx >> 2)),
            0x45d9f3b,
          ) >>>
            0) %
          2;
        if (bit === 0) fill(c, r);
      }
    }
  }

  // Finder patterns
  const Q = QUIET * CELL;
  drawFinder(ctx, Q, Q, CELL);
  drawFinder(ctx, (QUIET + MODULES - 7) * CELL, Q, CELL);
  drawFinder(ctx, Q, (QUIET + MODULES - 7) * CELL, CELL);

  // Separators (white strips around finders)
  ctx.fillStyle = "#fff";
  [0, 7].forEach((o) => {
    ctx.fillRect(Q + o * CELL, Q + 7 * CELL, CELL, CELL);
    ctx.fillRect(Q + 7 * CELL, Q + o * CELL, CELL, CELL);
    ctx.fillRect((QUIET + MODULES - 8 + o) * CELL, Q + 7 * CELL, CELL, CELL);
    ctx.fillRect((QUIET + MODULES - 8) * CELL, Q + o * CELL, CELL, CELL);
    ctx.fillRect(Q + o * CELL, (QUIET + MODULES - 8) * CELL, CELL, CELL);
    ctx.fillRect(Q + 7 * CELL, (QUIET + MODULES - 8 + o) * CELL, CELL, CELL);
  });

  // Timing patterns
  for (let i = 8; i <= MODULES - 9; i++) {
    if (i % 2 === 0) {
      fill(i, 6);
      fill(6, i);
    }
  }

  // Alignment pattern
  drawAlignment(
    ctx,
    (QUIET + MODULES - 9) * CELL,
    (QUIET + MODULES - 9) * CELL,
    CELL,
  );

  // Dark module
  fill(8, MODULES - 8);

  // Format info strips (simplified realistic pattern)
  const fmt = [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0];
  fmt.forEach((bit, i) => {
    if (!bit) return;
    if (i < 6) {
      fill(i, 8);
      fill(8, i);
    } else if (i === 6) {
      fill(7, 8);
      fill(8, 7);
    } else if (i === 7) {
      fill(8, 8);
      fill(8, 8);
    } else {
      fill(8, MODULES - 15 + i);
      fill(MODULES - 15 + i, 8);
    }
  });
}

// ─── QR Canvas component ──────────────────────────────────────────────────────

function QRCode({
  data,
  canvasRef,
}: {
  data: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  useEffect(() => {
    if (canvasRef.current) generateQR(canvasRef.current, data);
  }, [data, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

// ─── Download ticket as PNG ───────────────────────────────────────────────────

async function downloadTicket(
  ticketCode: string,
  match: Match,
  sector: Sector,
  seat: Seat,
  qrCanvas: HTMLCanvasElement | null,
  shieldUrl: string,
) {
  const W = 660,
    H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Shadow / outer glow
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  // Card background
  roundRect(ctx, 20, 20, W - 40, H - 40, 28);
  ctx.fillStyle = "#f9fafb";
  ctx.fill();
  ctx.shadowBlur = 0;

  // Red header
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, 20, 20, W - 40, 280, 28, true);
  ctx.clip();
  const grd = ctx.createLinearGradient(20, 20, W - 20, 300);
  grd.addColorStop(0, "#EE3224");
  grd.addColorStop(1, "#b71c1c");
  ctx.fillStyle = grd;
  ctx.fillRect(20, 20, W - 40, 280);
  ctx.restore();

  // VCF Shield
  try {
    const img = await loadImage(shieldUrl);
    ctx.drawImage(img, 48, 44, 60, 60);
  } catch {
    /* skip if fails */
  }

  // MESTALLA text
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "right";
  ctx.fillText("MESTALLA", W - 48, 68);
  ctx.font = "11px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fillText("ESTADIO", W - 48, 48);

  // Match title
  ctx.fillStyle = "#fff";
  ctx.font = "bold 26px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${match.homeTeam} vs ${match.awayTeam}`, W / 2, 160);

  // Date & competition
  ctx.font = "16px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  const dateStr = new Date(match.date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  ctx.fillText(dateStr, W / 2, 195);
  ctx.font = "bold 20px Arial";
  ctx.fillText(`${match.time}h`, W / 2, 230);

  // Competition badge
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  roundRect(ctx, W / 2 - 60, 248, 120, 28, 14);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px Arial";
  ctx.fillText(match.competition, W / 2, 266);

  // Perforated divider
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(60, 320);
  ctx.lineTo(W - 60, 320);
  ctx.stroke();
  ctx.setLineDash([]);

  // Circles on sides (ticket notch)
  [20, W - 20].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 320, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
  });

  // Seat info grid
  const cols = [W / 4, W / 2, (W * 3) / 4];
  const labels = ["SECTOR", "FILA", "ASIENTO"];
  const values = [
    sector.name.split(" ")[0].toUpperCase(),
    seat.row,
    String(seat.number),
  ];
  cols.forEach((cx, i) => {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], cx, 362);
    ctx.fillStyle = "#111827";
    ctx.font = "bold 28px Arial";
    ctx.fillText(values[i], cx, 400);
  });

  // Category badge
  ctx.fillStyle = "#fef3c7";
  roundRect(ctx, W / 2 - 50, 415, 100, 26, 13);
  ctx.fill();
  ctx.fillStyle = "#92400e";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Categoría ${sector.category} · €${sector.price}`, W / 2, 432);

  // QR Code
  if (qrCanvas) {
    const qrSize = 220;
    const qrX = W / 2 - qrSize / 2;
    const qrY = 462;
    ctx.fillStyle = "#fff";
    roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12);
    ctx.fill();
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
  }

  // Ticket code
  ctx.fillStyle = "#6b7280";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("CÓDIGO DE ENTRADA", W / 2, 714);
  ctx.fillStyle = "#111827";
  ctx.font = "bold 16px monospace";
  ctx.fillText(ticketCode, W / 2, 740);

  // Bottom divider
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(60, 760);
  ctx.lineTo(W - 60, 760);
  ctx.stroke();
  ctx.setLineDash([]);

  // Footer
  ctx.fillStyle = "#9ca3af";
  ctx.font = "11px Arial";
  ctx.fillText(
    "Valencia Infinity · Simulación de entrada digital · No válida para acceso real",
    W / 2,
    790,
  );

  // Decorative corner VCF badge
  ctx.fillStyle = "#EE3224";
  ctx.font = "bold 10px Arial";
  ctx.fillText("VCF", 50, 828);

  // Download
  const link = document.createElement("a");
  link.download = `entrada-vcf-${ticketCode}.png`;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  partial = false,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  if (!partial) {
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  } else {
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
  }
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TicketSuccess({
  match,
  sector,
  seat,
  stepNumber,
  onDone,
}: {
  match: Match;
  sector: Sector;
  seat: Seat;
  stepNumber: number;
  onDone: () => void;
}) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState(false);

  const ticketCode = `VCF-${match.id.toUpperCase()}-${sector.id.toUpperCase()}-${seat.row}${seat.number}`;

  const dateStr = new Date(match.date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadTicket(
        ticketCode,
        match,
        sector,
        seat,
        qrRef.current,
        vcfShield,
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header sticky ── */}
      <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"></div>
            <div className="text-center hidden sm:block "></div>
            <StepIndicator current={stepNumber} />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* ── Título ── */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-5 flex items-center justify-center shadow-xl animate-bounce">
            <Check size={44} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-foreground mb-2">
            ¡Entrada confirmada!
          </h1>
          <p className="text-muted-foreground">Tu entrada digital está lista</p>
        </div>

        {/* Digital ticket card */}
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden mb-6">
          {/* Red header */}
          <div className="bg-gradient-to-r from-[#EE3224] to-[#b71c1c] p-6 text-white">
            <div className="flex items-center justify-between mb-5">
              <img
                src={vcfShield}
                alt="VCF"
                className="w-12 h-12 drop-shadow-lg"
              />
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest opacity-70">
                  Valencia CF
                </div>
                <div className="font-black text-base tracking-wide">
                  MESTALLA
                </div>
                <div className="text-[10px] opacity-60">
                  {match.competition}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black mb-1">
                {match.homeTeam} vs {match.awayTeam}
              </div>
              <div className="text-sm opacity-85">{dateStr}</div>
              <div className="text-xl font-bold mt-1">{match.time}h</div>
            </div>
          </div>

          {/* Perforated edge */}
          <div className="relative h-5 bg-[#EE3224]">
            <div
              className="absolute inset-x-0 bottom-0 h-5 bg-card"
              style={{
                borderTopLeftRadius: "100%",
                borderTopRightRadius: "100%",
              }}
            />
            {/* Notch circles */}
            {[-1, 1].map((side) => (
              <div
                key={side}
                className="absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-background rounded-full border-2 border-border"
                style={{ [side === -1 ? "left" : "right"]: "-18px" }}
              />
            ))}
          </div>

          {/* Body */}
          <div className="px-6 pb-10 pt-4">
            {/* Seat info */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                ["SECTOR", sector.name],
                ["FILA", seat.row],
                ["ASIENTO", String(seat.number)],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="text-center bg-muted rounded-xl py-3"
                >
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    {label}
                  </div>
                  <div className="font-black text-foreground text-lg leading-tight">
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {/* Category */}
            <div className="flex items-center justify-center gap-3 mb-5 text-sm">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-bold text-xs">
                Cat. {sector.category}
              </span>
              <span className="text-gray-400">·</span>
              <span className="font-black text-[#EE3224]">€{sector.price}</span>
            </div>

            {/* QR Code */}
            <div className="bg-white border-4 border-border rounded-2xl p-4 mb-4">
              <div className="aspect-square w-full max-w-[220px] mx-auto">
                <QRCode data={ticketCode} canvasRef={qrRef} />
              </div>
            </div>

            {/* Ticket code */}
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                Código de entrada
              </div>
              <div className="font-mono font-black text-foreground text-lg tracking-widest">
                {ticketCode}
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3">
            <p className="text-gray-500 text-[10px] text-center uppercase tracking-wider">
              Valencia Infinity · Simulación — No válida para acceso real
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-card border-2 border-border rounded-2xl font-bold text-foreground hover:border-foreground/40 cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-60"
          >
            {downloading ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Descargando...
              </span>
            ) : (
              <>
                <Download size={18} />
                Descargar entrada
              </>
            )}
          </button>
        </div>

        {/* VR Banner */}
        <a
          href="https://horizon.meta.com/casting"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 mb-3 flex items-center justify-between shadow-xl hover:opacity-90 transition-opacity active:scale-95 hover:-translate-y-1"
        >
          <div className="flex items-center gap-4 hover:-translate-y-1">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone size={22} className="text-white" />
            </div>
            <div>
              <div className="font-black text-white text-sm">
                Ver Estadio en VR
              </div>
              <div className="text-xs text-white/70">
                Disponible en Meta Quest
              </div>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/70" />
        </a>

        <button
          onClick={onDone}
          className="w-full py-4 bg-gray-600 text-white rounded-2xl font-black text-base hover:-translate-y-1 transition-all shadow-lg active:scale-95 cursor-pointer "
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
