export const USD_TO_KES_RATE = 132;

export function toKes(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    throw new TypeError('Price must be a finite number.');
  }

  return Math.round(value * USD_TO_KES_RATE);
}

export function formatKsh(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    throw new TypeError('Price must be a finite number.');
  }

  return `KSh ${Math.round(value).toLocaleString('en-KE')}`;
}
