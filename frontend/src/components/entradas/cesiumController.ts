import type { WorldCoords, Zone } from './data/seat';

// Cesium is loaded from CDN — use window.Cesium at runtime
declare const window: Window & { Cesium: any; _cesiumViewer: any };

let cesiumViewer: any = null;
let pitchListener: (() => void) | null = null;
let onSeatViewChange: ((active: boolean) => void) | null = null;

export function registerSeatViewCallback(fn: (active: boolean) => void): void {
  onSeatViewChange = fn;
}

const PITCH_CENTER = { lat: 39.47450, lng: -0.35819 };

interface SeatBase {
  lng: number;
  lat?: number;
  heading?: number;
  height: number;
  pitch: number;
}

// Posiciones base por zona. lng y height fijos; lat varía con el asiento
// para simular desplazamiento lateral a lo largo de la tribuna.
const SEAT_BASES: Record<Zone, SeatBase> = {
  General:    { lng: -0.35762,                              height: 81, pitch: -22 },
  Preferente: { lng: -0.35806, lat: 39.47527, heading: 191, height: 82, pitch:  -9 },
  Gol:        { lng: -0.35876, lat: 39.47405, heading:  43, height: 80, pitch: -20 },
  VIP:        { lng: -0.35863, lat: 39.47527, heading: 144, height: 79, pitch: -17 },
};

export function setCesiumViewer(viewer: any): void {
  cesiumViewer = viewer;
}

// Controles para la vista de inicio: Shift = girar en sitio, Ctrl = mover posición
export function initHomeControls(): void {
  const Cesium = window.Cesium;
  if (!cesiumViewer || !Cesium) return;
  const C    = Cesium.CameraEventType;
  const M    = Cesium.KeyboardEventModifier;
  const ctrl = cesiumViewer.scene.screenSpaceCameraController;

  ctrl.rotateEventTypes    = [C.LEFT_DRAG, { eventType: C.LEFT_DRAG, modifier: M.CTRL }];
  ctrl.lookEventTypes      = [{ eventType: C.LEFT_DRAG, modifier: M.SHIFT }];
  ctrl.tiltEventTypes      = [C.MIDDLE_DRAG, C.PINCH, { eventType: C.RIGHT_DRAG, modifier: M.CTRL }];
  ctrl.zoomEventTypes      = [C.RIGHT_DRAG, C.WHEEL, C.PINCH];
  ctrl.translateEventTypes = [];
  ctrl.enableRotate    = true;
  ctrl.enableTilt      = true;
  ctrl.enableZoom      = true;
  ctrl.enableTranslate = true;
  ctrl.enableLook      = true;
  ctrl.lookFactor      = 0.1;
  ctrl.minimumZoomDistance = 8;
}

export function setSeatViewMode(active: boolean, minPitchDeg = -30): void {
  const Cesium = window.Cesium;
  if (!cesiumViewer || !Cesium) return;

  const ctrl = cesiumViewer.scene.screenSpaceCameraController;
  if (pitchListener) { pitchListener(); pitchListener = null; }

  if (active) {
    ctrl.lookEventTypes      = [Cesium.CameraEventType.LEFT_DRAG];
    ctrl.rotateEventTypes    = [];
    ctrl.tiltEventTypes      = [];
    ctrl.zoomEventTypes      = [];
    ctrl.translateEventTypes = [];

    ctrl.enableLook      = true;
    ctrl.enableRotate    = false;
    ctrl.enableTilt      = false;
    ctrl.enableZoom      = false;
    ctrl.enableTranslate = false;
    ctrl.lookFactor      = -0.1;

    const MIN = Cesium.Math.toRadians(minPitchDeg);
    const MAX = Cesium.Math.toRadians(25);

    pitchListener = cesiumViewer.scene.postUpdate.addEventListener(() => {
      const cam = cesiumViewer.camera;
      if (cam.pitch < MIN) {
        cam.setView({ orientation: { heading: cam.heading, pitch: MIN, roll: 0 } });
      } else if (cam.pitch > MAX) {
        cam.setView({ orientation: { heading: cam.heading, pitch: MAX, roll: 0 } });
      }
    });
  } else {
    initHomeControls();
  }
}

export function flyToZone(camera: { lng: number; lat: number; height: number; heading: number; pitch: number }): void {
  setSeatViewMode(false);
  const Cesium = window.Cesium;
  if (!cesiumViewer || !Cesium) return;
  cesiumViewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(camera.lng, camera.lat, camera.height),
    orientation: {
      heading: Cesium.Math.toRadians(camera.heading),
      pitch:   Cesium.Math.toRadians(camera.pitch),
      roll: 0,
    },
    duration: 2,
    complete: () => {
      setSeatViewMode(true, camera.pitch);
      onSeatViewChange?.(true);
    },
  });
}

export function flyToSeat(coords: WorldCoords, zone: Zone): void {
  setSeatViewMode(false);
  const Cesium = window.Cesium;
  if (!cesiumViewer || !Cesium) return;

  let camLng: number, camLat: number, camHeight: number, pitchDeg: number, heading: number;

  const zoneBase = SEAT_BASES[zone];
  if (zoneBase) {
    camLng    = zoneBase.lng;
    camLat    = zoneBase.lat !== undefined ? zoneBase.lat : coords.lat;
    camHeight = zoneBase.height;
    pitchDeg  = zoneBase.pitch;

    if (zoneBase.heading !== undefined) {
      heading = Cesium.Math.toRadians(zoneBase.heading);
    } else {
      const dN = PITCH_CENTER.lat - camLat;
      const dE = PITCH_CENTER.lng - camLng;
      heading  = Math.atan2(dE, dN);
    }
  } else {
    const dNorth = coords.lat - PITCH_CENTER.lat;
    const dEast  = coords.lng - PITCH_CENTER.lng;
    const mag    = Math.sqrt(dNorth ** 2 + dEast ** 2) || 0.0001;
    const OFFSET = 0.00063;
    camLat    = PITCH_CENTER.lat + (dNorth / mag) * OFFSET;
    camLng    = PITCH_CENTER.lng + (dEast  / mag) * OFFSET;
    camHeight = 42;
    pitchDeg  = -12;
    heading   = Math.atan2(PITCH_CENTER.lng - camLng, PITCH_CENTER.lat - camLat);
  }

  cesiumViewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(camLng, camLat, camHeight),
    orientation: {
      heading,
      pitch: Cesium.Math.toRadians(pitchDeg),
      roll: 0,
    },
    duration: 2,
    maximumHeight: 320,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    complete: () => {
      setSeatViewMode(true, pitchDeg);
      onSeatViewChange?.(true);
    },
  });
}

export function flyToDefault(): void {
  setSeatViewMode(false);
  onSeatViewChange?.(false);
  const Cesium = window.Cesium;
  if (!cesiumViewer || !Cesium) return;
  cesiumViewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-0.36102, 39.47487, 431),
    orientation: {
      heading: Cesium.Math.toRadians(99),
      pitch:   Cesium.Math.toRadians(-56),
      roll: 0,
    },
    duration: 1.5,
  });
}
