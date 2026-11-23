export function generateId(prefix, records) {
  if (!records || records.length === 0) {
    return `${prefix}-0001`;
  }
  const maxNum = records.reduce((max, item) => {
    const parts = item.id.split("-");
    const num = parseInt(parts[1], 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);

  return `${prefix}-${String(maxNum + 1).padStart(4, "0")}`;
}
