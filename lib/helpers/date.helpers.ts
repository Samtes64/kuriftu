export function getStartOfWeek() {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getEndOfWeek() {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? 0 : 7);
  date.setDate(diff);
  date.setHours(23, 59, 59, 999);

  return date;
}

export function getStartOfMonth() {
  const date = new Date();
  date.setDate(1); // Set the date to the first day of the month
  date.setHours(0, 0, 0, 0); // Set to the beginning of the day (midnight)
  return date;
}

export function getEndOfMonth() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1); // Move to the next month
  date.setDate(0); // Set to the last day of the previous month (which is the last day of the original month)
  date.setHours(23, 59, 59, 999); // Set to the end of the day (just before midnight)
  return date;
}
