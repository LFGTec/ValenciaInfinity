export interface MatchRoom {
  id: string;
  name: string;
  host: string;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  match: string;
  isPrivate: boolean;
}

export interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
}

export interface Player {
  num: number;
  name: string;
  pos: string;
  scored?: boolean;
  hasCard?: boolean;
  subbed?: boolean;
}

export interface UpcomingMatch {
  id: string;
  teams: string;
  date: string;
  competition: string;
}
