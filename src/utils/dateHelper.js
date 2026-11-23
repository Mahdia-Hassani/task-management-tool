export function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function isOverdue(dueDate, status) {
  if (status === "done") return false;
  return dueDate < getToday();
}

export function getDaysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
