// components/features/AlbumProgressBar.tsx
// Usage: <AlbumProgressBar obtained={42} total={100} missing={58} />

interface AlbumProgressBarProps {
  obtained: number;
  total: number;
  missing: number;
  progress: number;
  duplicated?: number;
}

export function AlbumProgressBar({
  obtained,
  total,
  missing,
  progress,
  duplicated = 0,
}: AlbumProgressBarProps) {
  return (
    <div className="mb-4 bg-card border-2 border-vcf-orange dark:border-border backdrop-blur-sm rounded-lg px-6 py-4 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-lg text-foreground">Progreso del Álbum</p>
        <p className="text-2xl font-black text-vcf-orange">{progress}%</p>
      </div>

      <div className="w-full h-8 bg-gray-300 dark:bg-muted rounded-full overflow-hidden mb-4 shadow-md border border-gray-400 dark:border-border">
        <div
          className="h-full rounded-full bg-vcf-orange shadow-inner transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
          <p className="text-2xl md:text-3xl font-black text-vcf-orange">
            {obtained}
          </p>
          <p className="text-xs text-gray-600 font-medium">Obtenidas</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
          <p className="text-2xl md:text-3xl font-black text-black">
            {missing}
          </p>
          <p className="text-xs text-gray-600 font-medium">Faltantes</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
          <p className="text-2xl md:text-3xl font-black text-vcf-orange">{duplicated}</p>
          <p className="text-xs text-gray-600 font-medium">Duplicadas</p>
        </div>
        <div className="bg-gray-50 dark:bg-muted rounded-lg px-3 py-2 text-center">
          <p className="text-2xl md:text-3xl font-black text-foreground">0</p>
          <p className="text-xs text-muted-foreground font-medium">
            Legendarias
          </p>
        </div>
      </div>
    </div>
  );
}