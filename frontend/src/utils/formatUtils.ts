/**
 * 將username格式化為首字母大寫的顯示格式
 * @param username - 原始username (小寫格式)
 * @returns 首字母大寫的username，用於UI顯示
 */
export const formatUsernameForDisplay = (username: string): string => {
  if (!username) return '';
  return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
};

/**
 * 將username轉換為存儲格式 (小寫)
 * @param username - 用戶輸入的username
 * @returns 小寫的username，用於存儲和API調用
 */
export const formatUsernameForStorage = (username: string): string => {
  if (!username) return '';
  return username.toLowerCase();
};