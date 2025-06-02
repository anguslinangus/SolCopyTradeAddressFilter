/**
 * 取得 localStorage 中的快取資料
 * @param {string} key - 快取的 Key
 * @returns {Object | null} 快取物件或 null
 */
export function getLocalStorageItem(key) {
  try {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (e) {
    console.error(`讀取 localStorage (key: ${key}) 失敗:`, e);
    return null;
  }
}

/**
 * 清理舊的快取數據
 * @param {string} currentKey - 當前要存儲的 key
 */
function cleanupOldCache(currentKey) {
  try {
    const cacheKeys = Object.keys(localStorage);
    const now = Date.now();
    
    // 按時間戳排序並清理最舊的數據
    const sortedKeys = cacheKeys
      .filter(key => key !== currentKey && key.startsWith('token_analysis_cache_'))
      .sort((a, b) => {
        const dataA = JSON.parse(localStorage.getItem(a));
        const dataB = JSON.parse(localStorage.getItem(b));
        return (dataA?.timestamp || 0) - (dataB?.timestamp || 0);
      });

    // 如果還有空間問題，繼續清理直到有足夠空間
    while (sortedKeys.length > 0) {
      const oldestKey = sortedKeys.shift();
      localStorage.removeItem(oldestKey);
      console.log(`已清理舊的快取: ${oldestKey}`);
      
      // 檢查是否還有空間
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        break; // 如果有空間了，就停止清理
      } catch (e) {
        // 如果還是沒有空間，繼續清理
        continue;
      }
    }
  } catch (e) {
    console.error('清理快取時發生錯誤:', e);
  }
}

/**
 * 設定快取資料到 localStorage
 * @param {string} key - 快取的 Key
 * @param {any} data - 要快取的資料
 */
export function setLocalStorageItem(key, data) {
  try {
    // 嘗試直接存儲
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.log('localStorage 空間不足，嘗試清理舊數據...');
      cleanupOldCache(key);
      
      // 再次嘗試存儲
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log('清理後成功存儲數據');
      } catch (e2) {
        console.error(`即使清理後仍無法存儲數據 (key: ${key}):`, e2);
      }
    } else {
      console.error(`儲存 localStorage (key: ${key}) 失敗:`, e);
    }
  }
}

/**
 * 移除 localStorage 中的項目
 * @param {string} key - 快取的 Key
 */
export function removeLocalStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`移除 localStorage (key: ${key}) 失敗:`, e);
  }
}