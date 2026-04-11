import React, { useState } from 'react';
import { Trophy, TrendingUp, Star, Award, Medal, Crown, ChevronUp, ChevronDown, User } from 'lucide-react';

interface RankingUser {
  rank: number;
  prevRank: number;
  name: string;
  level: number;
  points: number;
  streak: number;
  cards: number;
  trivias: number;
  matches: number;
  avatar?: string;
}

export function Rankings() {
}