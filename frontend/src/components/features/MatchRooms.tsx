import React, { useState } from "react";
import {
  Video,
  Users,
  Share2,
  Settings,
  Lock,
  Send,
  TrendingUp,
  Check,
  Clock,
} from "lucide-react";

interface MatchRoom {
  id: string;
  name: string;
  host: string;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  match: string;
  isPrivate: boolean;
}

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

export function MatchRooms() {
}