/**
 * 解析持有時間（秒）到分鐘
 * @param {number | null} durationSeconds - 持有時間（秒）
 * @returns {number | null} 持有時間（分鐘），或 null
 */
export function parseDurationToMinutes(durationSeconds) {
  if (durationSeconds === null || typeof durationSeconds !== 'number' || durationSeconds < 0) {
    return null;
  }
  return Math.floor(durationSeconds / 60);
}

// 你可以加入更多工具函式，例如：
/**
 * 安全地格式化數字到指定小數位
 * @param {number | string | null | undefined} num - 數字
 * @param {number} digits - 小數位數
 * @param {string} fallback - 如果無法格式化時的回傳值
 * @returns {string}
 */
export function toFixedSafe(num, digits = 3, fallback = 'N/A') {
  const val = parseFloat(num);
  if (isNaN(val) || !isFinite(val)) {
    return fallback;
  }
  return val.toFixed(digits);
}

/**
 * 格式化百分比
 * @param {number | null | undefined} num - 數字 (例如 50.5 代表 50.5%)
 * @param {number} digits - 小數位數
 * @param {string} fallback - 如果無法格式化時的回傳值
 * @returns {string}
 */
export function formatPercent(num, digits = 2, fallback = 'N/A') {
  if (num === null || typeof num === 'undefined' || isNaN(num) || !isFinite(num)) {
    return fallback;
  }
  return `${num.toFixed(digits)}%`;
}