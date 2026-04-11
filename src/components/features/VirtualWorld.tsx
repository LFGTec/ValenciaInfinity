import React, { useState } from "react";
import {
  Globe,
  Map,
  Users,
  Camera,
  User,
  MapPin,
  Video,
  Wifi,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Locate,
} from "lucide-react";
import valenciaMapBg from "../../assets/Mapa.png";

interface FanOnMap {
  id: string;
  name: string;
  city: string;
  country: string;
  x: number; // Position on map (percentage)
  y: number; // Position on map (percentage)
  avatar: {
    skinTone: number;
    hairStyle: string;
    hairColor: number;
    jersey: string;
  };
  status: string;
  lastActive: string;
  level: number;
}

export function VirtualWorld() {

}