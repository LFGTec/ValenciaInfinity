import React, { useEffect, useState } from "react";
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
import {
  getAdminStatsSummary,
  getMostActiveUsers,
  getPopularTrivias,
  getFeatureUsageStats,
  getComparisonStats,
  type AdminStatsSummary,
  type ActiveUserStat,
  type PopularTriviaStat,
  type FeatureUsageStat,
  type ComparisonStat,
  type TimeRange,
} from "@/services/adminStatisticsService";

type IconProps = {
  size?: number;
  className?: string;
};

type FeatureUsageView = FeatureUsageStat & {
  icon: React.ComponentType<IconProps>;
  color: string;
};

type ComparisonStatView = ComparisonStat & {
  icon: React.ComponentType<IconProps>;
  color: string;
};

const featureConfig: Record<
  FeatureUsageStat["key"],
  {
    icon: React.ComponentType<IconProps>;
    color: string;
  }
> = {
  matchRooms: {
    icon: MessageSquare,
    color: "bg-blue-500",
  },
  trivias: {
    icon: Gamepad2,
    color: "bg-purple-500",
  },
  album: {
    icon: BookOpen,
    color: "bg-green-500",
  },
  rankings: {
    icon: Trophy,
    color: "bg-yellow-500",
  },
  trades: {
    icon: Star,
    color: "bg-pink-500",
  },
  virtualWorld: {
    icon: Award,
    color: "bg-red-500",
  },
};

const comparisonConfig: Record<
  ComparisonStat["key"],
  {
    icon: React.ComponentType<IconProps>;
    color: string;
  }
> = {
  trades: {
    icon: BookOpen,
    color: "bg-blue-600",
  },
  trivias: {
    icon: Gamepad2,
    color: "bg-purple-600",
  },
};

export function AdminStatistics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<AdminStatsSummary>({
    activeUsers: 0,
    triviasPlayed: 0,
    averageScore: 0,
    completionRate: 0,
  });

  const [topUsers, setTopUsers] = useState<ActiveUserStat[]>([]);
  const [triviaStats, setTriviaStats] = useState<PopularTriviaStat[]>([]);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsageView[]>([]);
  const [comparisonStats, setComparisonStats] = useState<ComparisonStatView[]>(
    []
  );

  useEffect(() => {
    const loadStatistics = async () => {
      setLoading(true);

      const [
        summaryData,
        usersData,
        triviasData,
        featuresData,
        comparisonData,
      ] = await Promise.all([
        getAdminStatsSummary(timeRange),
        getMostActiveUsers(timeRange),
        getPopularTrivias(timeRange),
        getFeatureUsageStats(timeRange),
        getComparisonStats(timeRange),
      ]);

      setSummary(summaryData);
      setTopUsers(usersData);
      setTriviaStats(triviasData);

      setFeatureUsage(
        featuresData.map((feature) => ({
          ...feature,
          icon: featureConfig[feature.key].icon,
          color: featureConfig[feature.key].color,
        }))
      );

      setComparisonStats(
        comparisonData.map((item) => ({
          ...item,
          icon: comparisonConfig[item.key].icon,
          color: comparisonConfig[item.key].color,
        }))
      );

      setLoading(false);
    };

    loadStatistics();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black px-4 md:px-8 py-8 rounded-sm overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-black">
            ESTADÍSTICAS <span className="text-vcf-orange">Y MÉTRICAS</span>
          </h1>

          <p className="text-xl text-gray-600">
            Análisis de actividad y engagement de usuarios
          </p>

          {loading && (
            <p className="mt-4 text-sm font-bold text-vcf-orange">
              Cargando estadísticas...
            </p>
          )}
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

        <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md mb-12 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <PieChart size={24} className="text-vcf-orange" />
            <h2 className="text-2xl font-black text-black">
              USO DE <span className="text-vcf-orange">FUNCIONALIDADES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {featureUsage.map((feature) => (
              <div
                key={feature.key}
                className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-center"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                >
                  <feature.icon size={24} className="text-white" />
                </div>

                <div className="text-2xl font-black text-black mb-1">
                  {feature.value.toLocaleString()}
                </div>

                <div className="text-xs font-bold text-gray-600">
                  {feature.name}
                </div>

                <div className="text-[11px] text-gray-500 mt-1">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Users}
            title="Usuarios Activos"
            value={summary.activeUsers}
            color="bg-vcf-orange"
          />

          <StatCard
            icon={Gamepad2}
            title="Trivias Jugadas"
            value={summary.triviasPlayed}
            color="bg-purple-600"
          />

          {comparisonStats.map((item) => (
            <ComparisonStatCard
              key={item.key}
              icon={item.icon}
              title={item.title}
              value={item.value}
              changeLabel={item.changeLabel}
              color={item.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Trophy size={24} className="text-vcf-orange" />
              <h2 className="text-2xl font-black text-black">
                USUARIOS MÁS <span className="text-vcf-orange">ACTIVOS</span>
              </h2>
            </div>

            <div className="space-y-3">
              {topUsers.length > 0 ? (
                topUsers.map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black bg-gray-500 text-white flex-shrink-0">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="font-black text-black truncate">
                          {user.username}
                        </div>

                        <div className="text-xs text-gray-600">
                          Última actividad: {user.lastActive}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 justify-end">
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
                ))
              ) : (
                <EmptyBox
                  title="Sin usuarios activos"
                  description="No hay actividad registrada en este periodo."
                />
              )}
            </div>
          </section>

          <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 size={24} className="text-vcf-orange" />
              <h2 className="text-2xl font-black text-black">
                TRIVIAS MÁS <span className="text-vcf-orange">POPULARES</span>
              </h2>
            </div>

            <div className="space-y-3">
              {triviaStats.length > 0 ? (
                triviaStats.map((trivia) => (
                  <div
                    key={trivia.triviaId}
                    className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2 gap-4">
                      <div className="font-black text-black truncate">
                        {trivia.title}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Users size={16} className="text-vcf-orange" />
                        <span className="font-bold text-black">
                          {trivia.participants}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-600 mb-1">
                          Promedio de Puntuación
                        </div>

                        <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-vcf-orange"
                            style={{
                              width: `${Math.min(trivia.avgScore, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-xl font-black text-vcf-orange flex-shrink-0">
                        {trivia.avgScore}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyBox
                  title="Sin trivias con participación"
                  description="No hay intentos registrados en este periodo."
                />
              )}
            </div>
          </section>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 mb-8">
            <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 size={24} className="text-vcf-orange" />
                <h2 className="text-2xl font-black text-black">
                  USO GENERAL DE{" "}
                  <span className="text-vcf-orange">FUNCIONALIDADES</span>
                </h2>
              </div>

              <VerticalFeatureChart data={featureUsage} />
            </section>

            <section className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <PieChart size={24} className="text-vcf-orange" />
                <h2 className="text-2xl font-black text-black">
                  VALOR DE <span className="text-vcf-orange">ENGAGEMENT</span>
                </h2>
              </div>

              <EngagementValuePieChart data={featureUsage} />
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              icon={Activity}
              title="Tasa de Finalización"
              value={`${summary.completionRate}%`}
              description="Trivias terminadas por usuarios"
              color="bg-vcf-orange"
            />

            <MetricCard
              icon={Calendar}
              title="Promedio de Puntuación"
              value={`${summary.averageScore}%`}
              description="Promedio general de respuestas correctas"
              color="bg-purple-600"
            />

            <MetricCard
              icon={Eye}
              title="Participaciones"
              value={`${summary.triviasPlayed}`}
              description="Intentos registrados en trivias"
              color="bg-green-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: React.ComponentType<IconProps>;
  title: string;
  value: number | string;
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
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>

      <div className="text-sm font-bold text-gray-600">{title}</div>

      <div className="mt-2 text-xs text-green-600 font-bold">
        Datos actualizados automáticamente
      </div>
    </div>
  );
}

type ComparisonStatCardProps = {
  icon: React.ComponentType<IconProps>;
  title: string;
  value: number;
  changeLabel: string;
  color: string;
};

function ComparisonStatCard({
  icon: Icon,
  title,
  value,
  changeLabel,
  color,
}: ComparisonStatCardProps) {
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
        {changeLabel}
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
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md min-h-[220px] flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={24} className="text-white" />
        </div>

        <h3 className="font-black text-black text-xl">{title}</h3>
      </div>

      <div className="text-5xl font-black text-vcf-orange mb-3">{value}</div>

      <div className="text-base text-gray-600">{description}</div>
    </div>
  );
}

function EmptyBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="font-black text-black">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
}

function VerticalFeatureChart({ data }: { data: FeatureUsageView[] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  if (!data.length || data.every((item) => item.value === 0)) {
    return (
      <EmptyBox
        title="Sin datos de funcionalidades"
        description="No hay actividad registrada para graficar en este periodo."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[520px] h-[380px] flex items-end justify-between gap-4 pt-6 px-2">
        {data.map((item) => {
          const height = Math.max((item.value / maxValue) * 250, 24);

          return (
            <div key={item.key} className="flex-1 flex flex-col items-center">
              <div className="text-lg font-black text-vcf-orange mb-2">
                {item.value}
              </div>

              <div className="w-full flex justify-center items-end h-[260px]">
                <div
                  className="w-full max-w-[64px] bg-vcf-orange rounded-t-xl transition-all shadow-md"
                  style={{ height: `${height}px` }}
                />
              </div>

              <div className="text-xs font-black text-center text-black mt-3 leading-tight">
                {item.name}
              </div>

              <div className="text-[11px] text-gray-500 text-center leading-tight mt-1 max-w-[85px]">
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EngagementValuePieChart({ data }: { data: FeatureUsageView[] }) {
  const getFeatureValue = (key: FeatureUsageStat["key"]) => {
    return data.find((item) => item.key === key)?.value ?? 0;
  };

  const chartData = [
    {
      name: "Entretenimiento",
      value: getFeatureValue("trivias"),
      description: "Participación en trivias",
      color: "#ff5a1f",
    },
    {
      name: "Coleccionismo",
      value: getFeatureValue("album"),
      description: "Cartas guardadas",
      color: "#00b050",
    },
    {
      name: "Comunidad",
      value: getFeatureValue("matchRooms") + getFeatureValue("trades"),
      description: "Match Rooms e intercambios",
      color: "#2563eb",
    },
    {
      name: "Competitividad",
      value: getFeatureValue("rankings"),
      description: "Usuarios en ranking",
      color: "#f4b400",
    },
    {
      name: "Presencia Virtual",
      value: getFeatureValue("virtualWorld"),
      description: "Actividad en mundo virtual",
      color: "#ec4899",
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <EmptyBox
        title="Sin datos de engagement"
        description="No hay actividad suficiente para calcular el valor estratégico."
      />
    );
  }

  let currentAngle = 0;

  const gradientParts = chartData.map((item) => {
    const percentage = (item.value / total) * 100;
    const startAngle = currentAngle;
    const endAngle = currentAngle + percentage;

    currentAngle = endAngle;

    return `${item.color} ${startAngle}% ${endAngle}%`;
  });

  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-1 2xl:grid-cols-[240px_1fr] gap-6 items-center min-h-[380px]">
        <div className="flex justify-center">
          <div
            className="w-[220px] h-[220px] rounded-full shadow-lg border-8 border-white flex-shrink-0"
            style={{
              background: `conic-gradient(${gradientParts.join(", ")})`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-3 w-full min-w-0">
          {chartData.map((item) => {
            const percentage = Math.round((item.value / total) * 100);

            return (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 bg-gray-100 rounded-lg p-3 min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />

                  <div className="min-w-0">
                    <div className="font-black text-black text-sm truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight line-clamp-2">
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-black text-vcf-orange">
                    {percentage}%
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {item.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}