// Simple form validators

export const isEmail = (email) => {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(String(email).toLowerCase());
};

export const minLength = (value, n = 6) => {
  return typeof value === 'string' && value.trim().length >= n;
};

export const required = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const isValidYear = (year) => {
  const y = Number(year);
  const current = new Date().getFullYear();
  return Number.isInteger(y) && y >= 1000 && y <= current;
};