// Formatting helpers

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const stars = (rating = 0) => {
  const r = Math.round(rating);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
};