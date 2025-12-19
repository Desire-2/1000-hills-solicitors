/**
 * Date formatting utilities to prevent hydration errors
 * Uses consistent ISO formatting that works on both server and client
 */

/**
 * Format date to consistent format: "Dec 19, 2025"
 * Avoids hydration issues by not using locale-specific formatting
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Format datetime to consistent format: "Dec 19, 2025, 2:30 PM"
 * Avoids hydration issues by not using locale-specific formatting
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const datePart = formatDate(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${datePart}, ${displayHours}:${minutes} ${ampm}`;
}

/**
 * Format relative time: "2 hours ago", "3 days ago"
 * Safe for hydration as it uses the provided date string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
}
