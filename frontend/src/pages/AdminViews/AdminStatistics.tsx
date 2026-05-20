import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  Activity,
  Calendar,
  Gamepad2,
  Trophy,
  BookOpen,
  MessageSquare,
  Eye,
  Star,
  Award,
  BarChart3,
  PieChart,
} from "lucide-react";

type TimeRange = "day" | "week" | "month";

type UserActivity = {
  userId: string;
  username: string;
  triviasCompleted: number;
  points: number;
  lastActive: string;
};

type TriviaStat = {
  name: string;
  participants: number;
  avgScore: number;
};

type FeatureUsage = {
  name: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
};

export function AdminStatistics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  const topUsers: UserActivity[] = [
    {
      userId: "empty-1",
      username: "Sin datos registrados",
      triviasCompleted: 0,
      points: 0,
      lastActive: "No disponible",
    },
  ];

  const triviaStats: TriviaStat[] = [
    {
      name: "Sin trivias con participación registrada",
      participants: 0,
      avgScore: 0,
    },
  ];

  const engagementStats = {
    day: {
      activeUsers: 0,
      triviasPlayed: 0,
      cardsTraded: 0,
      matchRoomVisits: 0,
    },
    week: {
      activeUsers: 0,
      triviasPlayed: 0,
      cardsTraded: 0,
      matchRoomVisits: 0,
    },
    month: {
      activeUsers: 0,
      triviasPlayed: 0,
      cardsTraded: 0,
      matchRoomVisits: 0,
    },
  };

  const currentStats = engagementStats[timeRange];

  const featureUsage: FeatureUsage[] = [
    {
      name: "Match Rooms",
      value: 0,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      name: "Trivias",
      value: 0,
      icon: Gamepad2,
      color: "bg-purple-500",
    },
    {
      name: "Álbum",
      value: 0,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      name: "Rankings",
      value: 0,
      icon: Trophy,
      color: "bg-yellow-500",
    },
    {
      name: "Intercambios",
      value: 0,
      icon: Star,
      color: "bg-pink-500",
    },
    {
      name: "Mundo Virtual",
      value: 0,
      icon: Award,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black px-8 py-8 rounded-sm">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-black">
            ESTADÍSTICAS <span className="text-vcf-orange">Y MÉTRICAS</span>
          </h1>

          <p className="text-xl text-gray-600">
            Análisis de actividad y engagement de usuarios
          </p>

          
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "day", label: "ÚLTIMO DÍA" },
            { id: "week", label: "ÚLTIMA SEMANA" },
            { id: "month", label: "ÚLTIMO MES" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as TimeRange)}
              className={`px-6 py-3 rounded-lg font-black transition-all ${
                timeRange === range.id
                  ? "bg-vcf-orange text-white shadow-lg"
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-vcf-orange"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Users}
            title="Usuarios Activos"
            value={currentStats.activeUsers}
            color="bg-vcf-orange"
          />

          <StatCard
            icon={Gamepad2}
            title="Trivias Jugadas"
            value={currentStats.triviasPlayed}
            color="bg-purple-600"
          />

          <StatCard
            icon={BookOpen}
            title="Cartas Intercambiadas"
            value={currentStats.cardsTraded}
            color="bg-blue-600"
          />

          <StatCard
            icon={MessageSquare}
            title="Visitas a Match Rooms"
            value={currentStats.matchRoomVisits}
            color="bg-green-600"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Trophy size={24} className="text-vcf-orange" />
              <h2 className="text-2xl font-black text-black">
                USUARIOS MÁS <span className="text-vcf-orange">ACTIVOS</span>
              </h2>
            </div>

            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black bg-gray-500 text-white">
                      {index + 1}
                    </div>

                    <div>
                      <div className="font-black text-black">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-600">
                        {user.lastActive}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xl font-black text-vcf-orange">
                        {user.triviasCompleted}
                      </div>
                      <div className="text-xs text-gray-600">Trivias</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl font-black text-black">
                        {user.points}
                      </div>
                      <div className="text-xs text-gray-600">Puntos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 size={24} className="text-vcf-orange" />
              <h2 className="text-2xl font-black text-black">
                TRIVIAS MÁS <span className="text-vcf-orange">POPULARES</span>
              </h2>
            </div>

            <div className="space-y-3">
              {triviaStats.map((trivia, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-black text-black">{trivia.name}</div>

                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-vcf-orange" />
                      <span className="font-bold text-black">
                        {trivia.participants}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">
                        Promedio de Puntuación
                      </div>

                      <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-vcf-orange"
                          style={{ width: `${trivia.avgScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-xl font-black text-vcf-orange">
                      {trivia.avgScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md mb-12">
          <div className="flex items-center gap-3 mb-6">
            <PieChart size={24} className="text-vcf-orange" />
            <h2 className="text-2xl font-black text-black">
              USO DE <span className="text-vcf-orange">FUNCIONALIDADES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {featureUsage.map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-center"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                >
                  <feature.icon size={24} className="text-white" />
                </div>

                <div className="text-2xl font-black text-black mb-1">
                  {feature.value}
                </div>

                <div className="text-xs font-bold text-gray-600">
                  {feature.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            icon={Activity}
            title="Tasa de Retención"
            value="0%"
            description="Usuarios que regresan después de 7 días"
            color="bg-vcf-orange"
          />

          <MetricCard
            icon={Calendar}
            title="Sesiones Diarias"
            value="0"
            description="Promedio de sesiones por usuario"
            color="bg-purple-600"
          />

          <MetricCard
            icon={Eye}
            title="Tiempo Promedio"
            value="0m"
            description="Duración promedio de sesión"
            color="bg-green-600"
          />
        </div>
      </div>
    </div>
  );
}

type IconProps = {
  size?: number;
  className?: string;
};

type StatCardProps = {
  icon: React.ComponentType<IconProps>;
  title: string;
  value: number;
  color: string;
};

function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md hover:border-vcf-orange transition-all">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon size={24} className="text-white" />
        </div>

        <TrendingUp size={20} className="text-green-500" />
      </div>

      <div className="text-4xl font-black text-black mb-2">
        {value.toLocaleString()}
      </div>

      <div className="text-sm font-bold text-gray-600">{title}</div>

      <div className="mt-2 text-xs text-green-600 font-bold">
        Sin datos comparativos
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: React.ComponentType<IconProps>;
  title: string;
  value: string;
  description: string;
  color: string;
};

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
  color,
}: MetricCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon size={20} className="text-white" />
        </div>

        <h3 className="font-black text-black">{title}</h3>
      </div>

      <div className="text-5xl font-black text-vcf-orange mb-2">{value}</div>

      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
}