import { ref, watch } from 'vue';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../services/cacheService';

/**
 * 創建一個持久化的 Set，其狀態會自動與 localStorage 同步
 * @param {string} storageKey - localStorage 的 Key
 * @returns {{ dataSet: import('vue').Ref<Set<string>>, addItem: (item: string) => void, removeItem: (item: string) => void, hasItem: (item: string) => boolean, load: () => void, save: () => void }}
 */
export function usePersistentSet(storageKey) {
  const dataSet = ref(new Set());

  const load = () => {
    try {
      const stored = getLocalStorageItem(storageKey);
      if (stored && Array.isArray(stored)) {
        dataSet.value = new Set(stored);
        console.log(`[PersistentSet ${storageKey}] 已載入 ${dataSet.value.size} 個項目`);
      } else if (stored) {
        console.warn(`[PersistentSet ${storageKey}] localStorage 中的數據格式錯誤，已忽略。`);
        removeLocalStorageItem(storageKey);
      }
    } catch (e) {
      console.error(`[PersistentSet ${storageKey}] 載入失敗:`, e);
      removeLocalStorageItem(storageKey);
    }
  };

  const save = () => {
    try {
      const arrayToStore = Array.from(dataSet.value);
      setLocalStorageItem(storageKey, arrayToStore);
    } catch (e) {
      console.error(`[PersistentSet ${storageKey}] 儲存失敗:`, e);
    }
  };

  // 當 Set 變化時自動儲存
  watch(dataSet, save, { deep: true }); // deep true 可能不是必須的，因為 Set 的變化是直接修改引用

  const addItem = (item) => {
    if (item && !dataSet.value.has(item)) {
      dataSet.value.add(item);
      // watch 會觸發 save()
      console.log(`[PersistentSet ${storageKey}] 已添加項目:`, item);
    }
  };

  const removeItem = (item) => {
    if (dataSet.value.has(item)) {
        dataSet.value.delete(item);
        // watch 會觸發 save()
        console.log(`[PersistentSet ${storageKey}] 已移除項目:`, item);
    }
  };

  const hasItem = (item) => {
    return dataSet.value.has(item);
  };

  // 初始載入
  // load(); // 可以選擇在這裡自動載入，或讓使用者手動調用

  return {
    dataSet,
    addItem,
    removeItem,
    hasItem,
    load,
    save // 暴露 save 函式，以備不時之需
  };
}