import React, { useState } from "react";
import {
  Gamepad2,
  Clock,
  Users,
  Trophy,
  Star,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import avatar1 from "../../assets/Avatar1.png";
import avatar2 from "../../assets/Avatar2.png";
import avatar3 from "../../assets/Avatar3.png";
import avatar4 from "../../assets/Avatar4.png";
import avatar5 from "../../assets/Avatar5.png";
import avatar6 from "../../assets/Avatar6.png";

interface Trivia {
  id: string;
  title: string;
  description: string;
  questions: number;
  timeLimit: string;
  reward: number;
  participants: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  completed: boolean;
  score?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function TriviasQuizzes() {
}