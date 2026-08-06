/**
 * Pure date + recurrence helpers for the Treatment Reminders dashboard.
 *
 * The remedy_schedules data model stores recurrence as 'daily' | 'weekly' | 'once'
 * with an optional days_of_week array (0=Sun..6=Sat) for weekly schedules. This
 * module expands a schedule into concrete occurrence dates so the weekly overview,
 * calendar, and "today" views can reason across a range instead of a single
 * "next occurrence".
 *
 * Known limitation: 'once' schedules carry no scheduled date in the data model
 * (the New Remedy Schedule modal has no date field), so they cannot be placed on
 * a specific calendar date. They are excluded from date-based views.
 */

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function addDays(date, count) {
  const d = new Date(date);
  d.setDate(d.getDate() + count);
  return d;
}

export function toDateKey(date) {
  const d = startOfDay(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatDayShort(date) {
  return DAY_LABELS[date.getDay()];
}

export function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getRecurrenceLabel(schedule) {
  if (schedule?.recurrence === 'once') return 'One-time';
  if (schedule?.recurrence === 'daily') return 'Daily';
  if (schedule?.recurrence === 'weekly' && schedule.days_of_week?.length) {
    return `Weekly (${schedule.days_of_week.map((d) => DAY_LABELS[d]).join(', ')})`;
  }
  return 'Weekly';
}

export function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/**
 * Whether a schedule has an occurrence on the given date.
 * Paused schedules never occur; 'once' schedules cannot be dated.
 */
export function hasOccurrenceOnDate(schedule, date) {
  if (!schedule || schedule.active === false) return false;

  if (schedule.recurrence === 'daily') return true;

  if (schedule.recurrence === 'weekly') {
    const days = schedule.days_of_week || [];
    if (days.length === 0) return true;
    return days.includes(date.getDay());
  }

  return false;
}

/**
 * The next occurrence datetime (Date) for a schedule strictly after `from`.
 * Returns null for paused schedules and undatable 'once' schedules.
 */
export function getNextOccurrence(schedule, from = new Date()) {
  if (!schedule || schedule.active === false || schedule.recurrence === 'once') {
    return null;
  }

  const [h, m] = (schedule.scheduled_time || '08:00').split(':').map(Number);
  const base = startOfDay(from);

  for (let offset = 0; offset <= 60; offset += 1) {
    const candidate = addDays(base, offset);
    if (hasOccurrenceOnDate(schedule, candidate)) {
      const dt = new Date(candidate);
      dt.setHours(h, m, 0, 0);
      if (dt.getTime() > from.getTime()) {
        return dt;
      }
    }
  }

  return null;
}

/**
 * Expand active schedules across [start, end] (inclusive).
 * Returns a Map keyed by `YYYY-MM-DD` -> array of schedules occurring that day.
 */
export function getOccurrencesInRange(schedules, start, end) {
  const result = new Map();
  const first = startOfDay(start);
  const last = startOfDay(end);
  const cursor = new Date(first);

  while (cursor.getTime() <= last.getTime()) {
    const key = toDateKey(cursor);
    const daySchedules = schedules.filter((s) => hasOccurrenceOnDate(s, cursor));
    if (daySchedules.length > 0) {
      result.set(key, daySchedules);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

/**
 * Build a flat, time-sorted list of the next occurrences across schedules.
 * Each entry: { schedule, date }.
 */
export function getUpcomingOccurrences(schedules, from = new Date(), limit = 8) {
  const occurrences = [];

  for (const schedule of schedules) {
    if (!schedule || schedule.active === false) continue;
    const next = getNextOccurrence(schedule, from);
    if (next) occurrences.push({ schedule, date: next });
  }

  occurrences.sort((a, b) => a.date.getTime() - b.date.getTime());
  return occurrences.slice(0, limit);
}

/**
 * A grid of cells (Mon-first) for the given month. Leading cells are padded
 * with null so the grid always fills complete weeks (up to 6 rows).
 */
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = (firstDay.getDay() + 6) % 7; // 0 = Monday

  const cells = [];
  for (let i = 0; i < lead; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
