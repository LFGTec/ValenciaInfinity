export function countdownSeason(targetDate?: string) {
  if (!targetDate) {
    return {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
      finished: true,
    };
  }

  const target = new Date(targetDate).getTime();
  const now = Date.now();

  const diff = target - now;

  if (diff <= 0) {
    return {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
      finished: true,
    };
  }

  return {
    dias: Math.floor(diff / 86_400_000),
    horas: Math.floor((diff % 86_400_000) / 3_600_000),
    minutos: Math.floor((diff % 3_600_000) / 60_000),
    segundos: Math.floor((diff % 60_000) / 1_000),
    finished: false,
  };
}