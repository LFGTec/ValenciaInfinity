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
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'monthly' | 'season' | 'alltime'>('weekly');
  const [activeCategory, setActiveCategory] = useState<'general' | 'trivias' | 'cards' | 'matches'>('general');

  const rankings: RankingUser[] = Array.from({ length: 50 }, (_, i) => ({
    rank: i + 1,
    prevRank: i + 1 + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 5)),
    name: `Usuario${i + 1}`,
    level: 20 - Math.floor(i / 5),
    points: 5000 - (i * 100) + Math.floor(Math.random() * 50),
    streak: Math.floor(Math.random() * 30) + 1,
    cards: 200 - Math.floor(Math.random() * 150),
    trivias: 50 - Math.floor(Math.random() * 40),
    matches: 45 - Math.floor(Math.random() * 35),
  }));

  const myPosition: RankingUser = {
    rank: 24,
    prevRank: 28,
    name: 'Tú',
    level: 15,
    points: 2340,
    streak: 12,
    cards: 145,
    trivias: 28,
    matches: 34,
  };

  const periods = [
    { id: 'weekly', label: 'SEMANAL' },
    { id: 'monthly', label: 'MENSUAL' },
    { id: 'season', label: 'TEMPORADA' },
    { id: 'alltime', label: 'HISTÓRICO' },
  ];

  const categories = [
    { id: 'general', label: 'GENERAL', icon: Trophy },
    { id: 'trivias', label: 'TRIVIAS', icon: Star },
    { id: 'cards', label: 'CARTAS', icon: Award },
    { id: 'matches', label: 'PARTIDOS', icon: Medal },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="text-vcf-orange" size={24} />;
    if (rank === 2) return <Medal className="text-white" size={24} />;
    if (rank === 3) return <Medal className="text-vcf-orange" size={24} />;
    return null;
  };

  const getRankChange = (rank: number, prevRank: number) => {
    const change = prevRank - rank;
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-vcf-orange text-sm font-bold">
          <ChevronUp size={16} />
          <span>{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-black text-sm font-bold">
          <ChevronDown size={16} />
          <span>{Math.abs(change)}</span>
        </div>
      );
    }
    return <div className="text-muted-foreground text-sm font-bold">—</div>;
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <h1 className="text-5xl font-black mb-4 text-foreground">RANKINGS <span className="text-vcf-orange">VCF</span></h1>
        <p className="text-xl text-muted-foreground">Compite con otros fans del Valencia CF</p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => setActivePeriod(period.id as any)}
            className={`px-6 py-3 font-bold transition-all ${
              activePeriod === period.id
                ? 'border-b-4 border-vcf-orange text-vcf-orange'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`p-4 rounded-lg border-2 transition-all shadow-md ${
              activeCategory === category.id
                ? 'border-vcf-orange bg-vcf-orange text-white'
                : 'border-border bg-card hover:border-vcf-orange text-foreground'
            }`}
          >
            <category.icon size={24} className="mx-auto mb-2" />
            <div className="font-bold text-sm">{category.label}</div>
          </button>
        ))}
      </div>

      {/* My Position */}
      <div className="bg-gradient-to-r from-black via-vcf-orange to-black text-white rounded-xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-6xl font-black mb-2 text-white">#{myPosition.rank}</div>
              {getRankChange(myPosition.rank, myPosition.prevRank)}
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">TU <span className="text-white">POSICIÓN</span></h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-black">{myPosition.points}</div>
                  <div className="text-sm opacity-90">Puntos</div>
                </div>
                <div>
                  <div className="text-2xl font-black">{myPosition.streak}</div>
                  <div className="text-sm opacity-90">Racha</div>
                </div>
                <div>
                  <div className="text-2xl font-black">{myPosition.cards}</div>
                  <div className="text-sm opacity-90">Cartas</div>
                </div>
                <div>
                  <div className="text-2xl font-black">{myPosition.trivias}</div>
                  <div className="text-sm opacity-90">Trivias</div>
                </div>
              </div>
            </div>
          </div>
          <TrendingUp size={64} className="opacity-30" />
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { position: 2, user: rankings[1] },
          { position: 1, user: rankings[0] },
          { position: 3, user: rankings[2] },
        ].map(({ position, user }) => (
          <div
            key={position}
            className={`text-center ${position === 1 ? 'transform scale-110 -mt-4' : 'mt-4'}`}
          >
            <div className="relative inline-block mb-4">
              <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                position === 1 ? 'bg-gradient-to-br from-vcf-orange to-black' :
                position === 2 ? 'bg-gradient-to-br from-white to-black' :
                'bg-gradient-to-br from-vcf-orange to-black'
              } shadow-2xl`}>
                <span className="text-4xl font-black text-white">{position}</span>
              </div>
              {position === 1 && (
                <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-vcf-orange" size={32} />
              )}
            </div>
            
            <div className="w-20 h-20 bg-gradient-to-br from-vcf-orange to-black rounded-full mx-auto mb-3 border-4 border-white shadow-lg flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            
            <div className="bg-card border-2 border-border rounded-lg p-4 shadow-md hover:border-vcf-orange transition-all">
              <div className="font-black text-xl mb-1 text-foreground">{user.name}</div>
              <div className="text-sm text-muted-foreground mb-3">Nivel {user.level}</div>
              <div className="text-3xl font-black mb-1 text-vcf-orange">{user.points}</div>
              <div className="text-sm text-muted-foreground">puntos</div>
              
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="bg-muted rounded p-2">
                  <div className="font-bold text-foreground">{user.streak}</div>
                  <div className="text-muted-foreground">Racha</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="font-bold text-foreground">{user.cards}</div>
                  <div className="text-muted-foreground">Cartas</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="font-bold text-foreground">{user.trivias}</div>
                  <div className="text-muted-foreground">Trivias</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Rankings Table */}
      <div className="bg-card border-2 border-vcf-orange rounded-lg overflow-hidden shadow-lg">
        <div className="p-4 border-b-2 border-border bg-vcf-orange/10">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-foreground">CLASIFICACIÓN <span className="text-vcf-orange">COMPLETA</span></h3>
            <div className="text-sm text-muted-foreground">
              Mostrando top 50 de {rankings.length}
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-7 gap-4 p-4 bg-muted border-b-2 border-border font-bold text-sm text-foreground">
          <div>POSICIÓN</div>
          <div className="col-span-2">USUARIO</div>
          <div className="text-center">NIVEL</div>
          <div className="text-center">RACHA</div>
          <div className="text-center">TRIVIAS</div>
          <div className="text-right">PUNTOS</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {rankings.slice(0, 50).map((user) => (
            <div
              key={user.rank}
              className={`p-4 hover:bg-muted transition-colors ${
                user.rank === myPosition.rank ? 'bg-vcf-orange/20 border-l-4 border-vcf-orange' : ''
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                {/* Rank */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black shadow-md ${
                    user.rank <= 3 ? 'bg-vcf-orange text-white' : 'bg-muted text-foreground'
                  }`}>
                    {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                  </div>
                  {getRankChange(user.rank, user.prevRank)}
                </div>

                {/* User */}
                <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-vcf-orange to-black rounded-full shadow-md flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-foreground">
                      {user.rank === myPosition.rank ? 'Tú' : user.name}
                    </div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      Nivel {user.level} - {user.points} pts
                    </div>
                  </div>
                </div>

                {/* Stats - Hidden on mobile */}
                <div className="hidden md:block text-center">
                  <div className="font-bold text-foreground">{user.level}</div>
                </div>
                <div className="hidden md:block text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={14} className="text-vcf-orange" />
                    <span className="font-bold text-foreground">{user.streak}</span>
                  </div>
                </div>
                <div className="hidden md:block text-center">
                  <div className="font-bold text-foreground">{user.trivias}</div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-2xl font-black text-foreground">{user.points}</div>
                  <div className="text-xs text-muted-foreground">puntos</div>
                </div>

                {/* Mobile Stats */}
                <div className="md:hidden grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-muted rounded p-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Racha</div>
                    <div className="font-bold text-foreground">{user.streak}</div>
                  </div>
                  <div className="bg-muted rounded p-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Trivias</div>
                    <div className="font-bold text-foreground">{user.trivias}</div>
                  </div>
                  <div className="bg-muted rounded p-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Cartas</div>
                    <div className="font-bold text-foreground">{user.cards}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="mt-12 bg-gradient-to-br from-black via-vcf-orange to-black text-white rounded-xl p-8 shadow-2xl">
        <h3 className="text-3xl font-black mb-6">RECOMPENSAS <span className="text-white">SEMANALES</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { place: 'Top 1', reward: '1,000 pts + Carta Legendaria', icon: Crown, color: 'from-vcf-orange to-black' },
            { place: 'Top 2-10', reward: '500 pts + Carta Épica', icon: Medal, color: 'from-white to-black' },
            { place: 'Top 11-50', reward: '200 pts + Carta Rara', icon: Trophy, color: 'from-vcf-orange to-black' },
          ].map((reward, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border-2 border-white/20 hover:border-vcf-orange transition-all shadow-lg">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${reward.color} shadow-xl`}>
                <reward.icon size={32} className="text-white" />
              </div>
              <div className="font-black text-xl mb-2">{reward.place}</div>
              <div className="opacity-90">{reward.reward}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}