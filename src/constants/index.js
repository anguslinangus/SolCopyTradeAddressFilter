/**
 * ===================================
 * API 相關常數
 * ===================================
 */
export const SOLANA_TRACKER_API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

// 你可以加上一個檢查，確保 API Key 有被正確載入
if (!SOLANA_TRACKER_API_KEY) {
  console.warn('[API Key] Solana Tracker API Key 未在環境變數中設定 (VITE_SOLANA_TRACKER_API_KEY)');
  console.warn('[API Key] 應用程式將顯示 API Key 配置提示，而不是拋出錯誤');
  // 不拋出錯誤，讓應用程式正常運行但顯示配置提示
}

export const REST_API_BASE_URL = 'https://data.solanatracker.io';
export const SOL_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111112'; // 如果這個是固定的，可以保留，否則應作為參數傳入

/**
 * ===================================
 * 快取相關常數
 * ===================================
 */
export const CACHE_DURATION_MS = 60 * 60 * 1000; // 快取有效時間：1 小時
export const TOKEN_ANALYSIS_CACHE_KEY = 'tokenAnalysisCache'; // 更明確的快取 Key 名稱
export const CLICKED_ADDRESSES_KEY = 'gmgnClickedAddresses';

/**
 * ===================================
 * API 請求配置
 * ===================================
 */
export const MAX_PAGES_TO_FETCH = 234; // API 最大請求頁數
export const TARGET_TRADES_TO_FETCH = 20000; // 目標獲取交易筆數
export const API_REQUEST_DELAY_MS = 250; // API 請求間的延遲

/**
 * ===================================
 * 分頁設定
 * ===================================
 */
export const DEFAULT_ITEMS_PER_PAGE = 75;