import { CanvasTexture, SRGBColorSpace } from "three";
import type { Card } from "../services/cardsService";

const W = 512;
const H = 683;

const RAREZA_COLORS: Record<string, { bg: string }> = {
  Legendaria: { bg: "#FF6600" },
  Épica:      { bg: "#7C3AED" },
  Rara:       { bg: "#1D4ED8" },
  Común:      { bg: "#4B5563" },
};
const DEFAULT_COLOR = { bg: "#374151" };

export const COLS = 4;
export const ROWS = 4;
export const CARDS_PER_FACE = COLS * ROWS;

const PAD_X = 10;
const PAD_Y = 8;
const GAP = 8;
const TITLE_H = 40;
const CARD_W = Math.floor((W - PAD_X * 2 - GAP * (COLS - 1)) / COLS);
const CARD_H = Math.floor((H - TITLE_H - PAD_Y * 2 - GAP * (ROWS - 1)) / ROWS);

function drawCard(ctx: CanvasRenderingContext2D, card: Card, x: number, y: number) {
  const colors = RAREZA_COLORS[card.rareza] ?? DEFAULT_COLOR;
  const topH = Math.round(CARD_H * 0.45);

  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(x, y, CARD_W, CARD_H, 5);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Colored top band (rareza color)
  ctx.fillStyle = colors.bg;
  ctx.beginPath();
  ctx.roundRect(x, y, CARD_W, topH, [5, 5, 0, 0]);
  ctx.fill();

  // Number — large, centered in top
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `bold ${Math.round(CARD_H * 0.28)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(card.numero), x + CARD_W / 2, y + topH / 2);

  // Rareza abbreviation top-left
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = `bold ${Math.round(CARD_H * 0.09)}px Arial`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(card.rareza.slice(0, 3).toUpperCase(), x + 4, y + 3);

  // Separator line
  ctx.strokeStyle = colors.bg;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + topH);
  ctx.lineTo(x + CARD_W - 4, y + topH);
  ctx.stroke();

  // Player name (last word)
  const fullName = card.nombre.trim().toUpperCase();
  ctx.fillStyle = "#111111";
  ctx.font = `bold ${Math.round(CARD_H * 0.11)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const nameY = y + topH + (CARD_H - topH) * 0.35;
  ctx.fillText(fullName, x + CARD_W / 2, nameY, CARD_W - 6);

  // Tipo
  ctx.fillStyle = colors.bg;
  ctx.font = `${Math.round(CARD_H * 0.085)}px Arial`;
  ctx.fillText(card.tipo.toUpperCase(), x + CARD_W / 2, nameY + Math.round(CARD_H * 0.15), CARD_W - 6);

  // Temporada
  ctx.fillStyle = "#888";
  ctx.font = `${Math.round(CARD_H * 0.075)}px Arial`;
  ctx.fillText(card.temporada, x + CARD_W / 2, nameY + Math.round(CARD_H * 0.28), CARD_W - 6);

  // Border
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.roundRect(x, y, CARD_W, CARD_H, 5);
  ctx.stroke();
}

function makeTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createCardTexture(cards: Card[], title = "VALENCIA CF"): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Cream album background
  ctx.fillStyle = "#f4efe6";
  ctx.fillRect(0, 0, W, H);

  // Title bar — Valencia black
  ctx.fillStyle = "#1e1c1c";
  ctx.fillRect(0, 0, W, TITLE_H);

  // Orange accent line
  ctx.fillStyle = "#FF6600";
  ctx.fillRect(0, TITLE_H - 3, W, 3);

  // Title text
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(TITLE_H * 0.45)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title.toUpperCase(), W / 2, TITLE_H / 2 - 1);

  cards.slice(0, CARDS_PER_FACE).forEach((card, idx) => {
    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    const x = PAD_X + col * (CARD_W + GAP);
    const y = TITLE_H + PAD_Y + row * (CARD_H + GAP);
    drawCard(ctx, card, x, y);
  });

  return makeTexture(canvas);
}

export function createCoverTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#1e1c1c");
  gradient.addColorStop(1, "#2d2929");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Orange accent stripes
  ctx.fillStyle = "#FF6600";
  ctx.fillRect(0, 0, W, 8);
  ctx.fillRect(0, H - 8, W, 8);

  // Big translucent VCF watermark
  ctx.fillStyle = "#FF6600";
  ctx.font = `900 220px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.12;
  ctx.fillText("VCF", W / 2, H / 2);
  ctx.globalAlpha = 1;

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 52px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VALENCIA CF", W / 2, H * 0.35);

  // Subtitle
  ctx.fillStyle = "#FF6600";
  ctx.font = `bold 30px Arial`;
  ctx.fillText("ÁLBUM OFICIAL", W / 2, H * 0.47);

  // Caption
  ctx.fillStyle = "#aaaaaa";
  ctx.font = `20px Arial`;
  ctx.fillText("Colección de Jugadores", W / 2, H * 0.57);

  return makeTexture(canvas);
}

export function createBackTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#2d2929");
  gradient.addColorStop(1, "#1e1c1c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#FF6600";
  ctx.fillRect(0, 0, W, 8);
  ctx.fillRect(0, H - 8, W, 8);

  ctx.fillStyle = "#FF6600";
  ctx.font = `bold 28px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VALENCIA CF", W / 2, H * 0.45);

  ctx.fillStyle = "#555";
  ctx.font = `16px Arial`;
  ctx.fillText("Todos los derechos reservados", W / 2, H * 0.54);

  return makeTexture(canvas);
}
