export const roundCoord = (coord: number, precision = 1) => {
  const factor = Math.pow(10, precision)
  return Math.round(coord * factor) / factor
}