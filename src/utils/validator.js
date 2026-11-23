export function isNotEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function isValidPriority(priority) {
  return ["low", "medium", "high", "urgent"].includes(priority);
}

export function isValidStatus(status) {
  return ["todo", "in-progress", "review", "done"].includes(status);
}
