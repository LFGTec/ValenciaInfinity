export type Zone = 'VIP' | 'Preferente' | 'General' | 'Gol';

export interface CameraPosition {
    lng: number;
    lat: number;
    height: number;
    heading: number;
    pitch: number;
}

export interface SeatBlock {
    zone: Zone;
    rows: string[];
    cx: number;
    cy: number;
    cols: number;
}

export interface Seat {
    id: string;
    zone: Zone;
    row: string;
    col: number;
    section: Zone;
    occupied: boolean;
    selected: boolean;
    x: number;
    y: number;
}

export interface WorldCoords {
    lng: number;
    lat: number;
    height: number;
}

// Camera positions (lng/lat/height in metres above ellipsoid) for each zone overview
export const ZONE_CAMERAS: Record<Zone, CameraPosition> = {
    VIP: { lng: -0.35873, lat: 39.47582, height: 136, heading: 163, pitch: -25 },
    Preferente: { lng: -0.35700, lat: 39.47548, height: 140, heading: 228, pitch: -27 },
    General: { lng: -0.35674, lat: 39.47460, height: 145, heading: 275, pitch: -28 },
    Gol: { lng: -0.35814, lat: 39.47332, height: 141, heading: 5, pitch: -25 },
};

// Approximate scale: maps StadiumMap canvas pixels → world degrees
const STADIUM_CENTER = { lat: 39.47463, lng: -0.35819 };
const CANVAS_CENTER = { x: 300, y: 160 };
const DEG_PER_PX = 0.000005; // ~0.55 m/px

export function getSeatWorldCoords(seat: Seat): WorldCoords {
    const STEP = 8, SEAT_SIZE = 6;
    const parts = seat.id.split('-');
    const bi = parseInt(parts[1]);
    const block = SEAT_BLOCKS[bi];
    if (!block) return { lng: STADIUM_CENTER.lng, lat: STADIUM_CENTER.lat, height: 50 };
    const r = block.rows.indexOf(seat.row);
    const c = seat.col - 1;
    const sx = block.cx - (block.cols * STEP) / 2;
    const sy = block.cy - (block.rows.length * STEP) / 2;
    const cx = sx + c * STEP + SEAT_SIZE / 2;
    const cy = sy + r * STEP + SEAT_SIZE / 2;
    return {
        lng: STADIUM_CENTER.lng + (cx - CANVAS_CENTER.x) * DEG_PER_PX,
        lat: STADIUM_CENTER.lat - (cy - CANVAS_CENTER.y) * DEG_PER_PX,
        height: 50, // approximate mid-tier elevation above WGS84 ellipsoid
    };
}

export const ZONE_COLORS: Record<Zone, string> = {
    VIP: '#B87333',
    Preferente: '#378ADD',
    General: '#5F1D8F',
    Gol: '#D85A30',
};

export const ZONE_PRICES: Record<Zone, number> = {
    VIP: 85,
    Preferente: 55,
    General: 35,
    Gol: 20,
};

export const SEAT_BLOCKS: SeatBlock[] = [
    { zone: 'VIP', rows: ['A', 'B', 'C'], cx: 300, cy: 130, cols: 18 },
    { zone: 'Preferente', rows: ['D', 'E', 'F', 'G'], cx: 300, cy: 162, cols: 22 },
    { zone: 'Preferente', rows: ['D', 'E', 'F', 'G'], cx: 130, cy: 195, cols: 15 },
    { zone: 'Preferente', rows: ['D', 'E', 'F', 'G'], cx: 470, cy: 195, cols: 15 },
    { zone: 'General', rows: ['H', 'I', 'J', 'K', 'L'], cx: 108, cy: 230, cols: 13 },
    { zone: 'General', rows: ['H', 'I', 'J', 'K', 'L'], cx: 492, cy: 230, cols: 13 },
    { zone: 'General', rows: ['H', 'I', 'J', 'K', 'L'], cx: 300, cy: 272, cols: 18 },
    { zone: 'Gol', rows: ['M', 'N', 'O', 'P'], cx: 300, cy: 105, cols: 24 },
    { zone: 'Gol', rows: ['M', 'N', 'O', 'P'], cx: 300, cy: 296, cols: 24 },
];

export function generateSeats(): Seat[] {
    const seats: Seat[] = [];
    SEAT_BLOCKS.forEach((block, bi) => {
        block.rows.forEach((row) => {
            for (let col = 1; col <= block.cols; col++) {
                seats.push({
                    id: `${block.zone}-${bi}-${row}${col}`,
                    zone: block.zone,
                    row,
                    col,
                    section: block.zone,
                    occupied: Math.random() < 0.32,
                    selected: false,
                    x: 0,
                    y: 0,
                });
            }
        });
    });
    return seats;
}
