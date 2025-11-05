/**
 * Format username to display format with first letter capitalized
 * @param username - Original username (lowercase format)
 * @returns Username with first letter capitalized for UI display
 */
export const formatUsernameForDisplay = (username: string): string => {
  if (!username) return '';
  return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
};

/**
 * Convert username to storage format (lowercase)
 * @param username - User input username
 * @returns Lowercase username for storage and API calls
 */
export const formatUsernameForStorage = (username: string): string => {
  if (!username) return '';
  return username.toLowerCase();
};