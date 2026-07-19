export function score100ToDecimal(value: number | null): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return Number((value / 100).toFixed(2));
}

export function decimalToScore100(value: number): number {
  return Math.round(value * 100);
}

export function formatDecimalScore(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }

  return value.toFixed(2);
}

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Math.round(value)}%`;
}
