// 檢查是否支持 localStorage
let storageSupported = false;
try {
  const testKey = '__storage_test__';
  localStorage.setItem(testKey, 'test');
  localStorage.removeItem(testKey);
  storageSupported = true;
} catch (e) {
  console.warn('localStorage 不可用，將使用內存存儲作為備用方案');
  storageSupported = false;
}

// 內存存儲備用方案
const memoryStorage = new Map();

/**
 * 取得 localStorage 中的快取資料
 * @param {string} key - 快取的 Key
 * @returns {Object | null} 快取物件或 null
 */
export function getLocalStorageItem(key) {
  try {
    if (storageSupported) {
      const cachedData = localStorage.getItem(key);
      return cachedData ? JSON.parse(cachedData) : null;
    } else {
      // 使用內存存儲
      const cachedData = memoryStorage.get(key);
      return cachedData || null;
    }
  } catch (e) {
    console.error(`讀取存儲 (key: ${key}) 失敗:`, e);
    return null;
  }
}

/**
 * 清理舊的快取數據
 * @param {string} currentKey - 當前要存儲的 key
 */
function cleanupOldCache(currentKey) {
  try {
    if (!storageSupported) {
      // 內存存儲清理
      const entries = Array.from(memoryStorage.entries());
      entries
        .filter(([key]) => key !== currentKey && key.startsWith('token_analysis_cache_'))
        .sort((a, b) => (a[1]?.timestamp || 0) - (b[1]?.timestamp || 0))
        .slice(0, 5) // 清理最舊的 5 個
        .forEach(([key]) => {
          memoryStorage.delete(key);
          console.log(`已清理舊的內存快取: ${key}`);
        });
      return;
    }

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
    if (storageSupported) {
      // 嘗試直接存儲
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      // 使用內存存儲
      memoryStorage.set(key, data);
    }
  } catch (e) {
    if (e.name === 'QuotaExceededError' && storageSupported) {
      console.log('localStorage 空間不足，嘗試清理舊數據...');
      cleanupOldCache(key);
      
      // 再次嘗試存儲
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log('清理後成功存儲數據');
      } catch (e2) {
        console.error(`即使清理後仍無法存儲數據 (key: ${key}):`, e2);
        // 降級到內存存儲
        console.log('降級到內存存儲');
        memoryStorage.set(key, data);
        storageSupported = false;
      }
    } else {
      console.error(`儲存數據 (key: ${key}) 失敗:`, e);
      // 如果 localStorage 失敗，嘗試內存存儲
      if (storageSupported) {
        console.log('降級到內存存儲');
        memoryStorage.set(key, data);
        storageSupported = false;
      }
    }
  }
}

/**
 * 移除 localStorage 中的項目
 * @param {string} key - 快取的 Key
 */
export function removeLocalStorageItem(key) {
  try {
    if (storageSupported) {
      localStorage.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
  } catch (e) {
    console.error(`移除存儲 (key: ${key}) 失敗:`, e);
  }
}