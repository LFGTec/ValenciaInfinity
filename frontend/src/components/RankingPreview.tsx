import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatNumber } from "@/utils/formatNumbers";

type RankingUser = {
  id: string;
  full_name: string;
  avatar_url?: string;
  puntos: number;

};

type RankingTableProps = {
  ranking: RankingUser[];
  loading: boolean;
  preview?: boolean;
};

export function RankingPreview({
  ranking,
  loading,
  preview = false,
}: RankingTableProps) {

  const usersToShow = preview
    ? ranking.slice(3, 10)
    : ranking.slice(3);

  return (
    <div className="bg-card border-2 border-vcf-orange rounded-lg overflow-hidden">

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-bold">
          Cargando ranking...
        </div>
      ) : ranking.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground font-bold">
          No hay usuarios en el ranking.
        </div>
      ) : (
        <>
          {/* TOP 3 */}
          <div className="grid grid-cols-3 gap-4 px-6 pt-6 pb-2 bg-gradient-to-b from-vcf-yellow/20 to-transparent border-b-2 border-vcf-orange items-end">
            {[1, 0, 2].map((rankIndex) => {
              const user = ranking[rankIndex];

              if (!user) return null;

              const place = rankIndex + 1;

              const colors = [
                "bg-vcf-yellow",
                "bg-gray-300",
                "bg-amber-600",
              ];

              const podiumMb = [
                "mb-8",
                "mb-4",
                "mb-0",
              ];

              const badgeSize =
                rankIndex === 0
                  ? "w-20 h-20 text-2xl"
                  : "w-16 h-16 text-xl";

              const imgSize =
                rankIndex === 0
                  ? "w-16 h-16"
                  : "w-12 h-12";

              return (
                <div
                  key={user.id}
                  className={`text-center ${podiumMb[rankIndex]}`}
                >
                  <div
                    className={`${badgeSize} mx-auto rounded-full mb-3 flex items-center justify-center shadow-lg ${colors[rankIndex]} text-white`}
                  >
                    <span className="font-black">
                      {place}
                    </span>
                  </div>

                  <img
                    src={
                      user.avatar_url ||
                      "/default-avatar.png"
                    }
                    alt={user.full_name}
                    className={`${imgSize} rounded-full mx-auto mb-2 object-cover shadow-md`}
                  />

                  <div className="font-black text-sm text-foreground">
                    {user.full_name}
                  </div>

                  <div className="text-sm text-vcf-orange font-bold">
                    {formatNumber(user.puntos)} pts
                  </div>
                </div>
              );
            })}
          </div>

          {/* RESTO DEL RANKING */}
          <div className="divide-y divide-border">
            {usersToShow.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 hover:bg-vcf-yellow/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-vcf-orange/20 rounded-full flex items-center justify-center font-black text-vcf-orange">
                    {index + 4}
                  </div>

                  <img
                    src={
                      user.avatar_url ||
                      "/default-avatar.png"
                    }
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-vcf-orange"
                  />

                  <div>
                    <div className="font-black text-foreground">
                      {user.full_name}
                    </div>
                  </div>
                </div>

                <div className="font-black text-foreground">
                  {formatNumber(user.puntos)} pts
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}