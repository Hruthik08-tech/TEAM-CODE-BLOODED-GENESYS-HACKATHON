/**
 * Centralized date/time formatting utilities.
 * Single Responsibility: display formatting for dates across the app.
 */

/** @param {string|Date} iso - ISO date string or Date object */
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** @param {string|Date} iso - ISO date string or Date object */
export function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  if (diffMs < 60000) return 'Just now';
  if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`;
  return formatDate(iso);
}

/** Clock time (e.g. "10:30 AM") */
export function formatTimeClock(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/** Date with time (e.g. "12 Mar 2025, 10:30 AM") */
export function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Relative time (e.g. "2h ago", "3 days ago") */
export function timeAgo(date) {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (day > 0) return `${day}d ago`;
  if (hour > 0) return `${hour}h ago`;
  if (min > 0) return `${min}m ago`;
  return 'Just now';
}
