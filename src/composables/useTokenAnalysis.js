import { ref, watch } from 'vue';
import { fetchTrades, processTradesData } from '../services/solanaTrackerAPI';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../services/cacheService';
import { TOKEN_ANALYSIS_CACHE_KEY, CACHE_DURATION_MS } from '../constants';

export function useTokenAnalysis() {
  const targetTokenAddress = ref('');
  const isLoading = ref(false);
  const loadingMessage = ref('');
  const error = ref(null);
  const analysisResults = ref([]); // 原始分析結果 (未篩選)
  const lastFetchedToken = ref(''); // 追蹤上次成功獲取數據的 token

  const performAnalysis = async () => {
    const tokenAddress = targetTokenAddress.value.trim();
    if (!tokenAddress) {
      error.value = '請輸入目標代幣地址';
      return;
    }

    isLoading.value = true;
    error.value = null;
    analysisResults.value = []; // 清空舊結果
    // currentPage.value = 1; // 分頁重置應由 usePagination 或主組件監聽 analysisResults 變化來處理

    loadingMessage.value = '檢查快取中...';
    await new Promise(resolve => setTimeout(resolve, 50)); // UI 更新延遲

    // 檢查快取
    const cache = getLocalStorageItem(TOKEN_ANALYSIS_CACHE_KEY) || {};
    const cachedEntry = cache[tokenAddress];
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp < CACHE_DURATION_MS)) {
      console.log(`[TokenAnalysis] 找到 ${tokenAddress} 的有效快取。`);
      loadingMessage.value = `從快取載入數據 (上次更新於 ${new Date(cachedEntry.timestamp).toLocaleTimeString()})...`;
      analysisResults.value = cachedEntry.results;
      lastFetchedToken.value = tokenAddress;
      await new Promise(resolve => setTimeout(resolve, 200));
      loadingMessage.value = '快取載入完成！';
      isLoading.value = false;
      setTimeout(() => { if (!error.value) loadingMessage.value = ''; }, 3000);
      return;
    }
    console.log(`[TokenAnalysis] ${tokenAddress} 無有效快取或快取已過期，需要呼叫 API。`);

    try {
      const { trades, isIncomplete, error: apiError, oldestTradeTime } = await fetchTrades(tokenAddress, (progressMsg) => {
        loadingMessage.value = progressMsg;
      });

      if (apiError) {
        throw new Error(apiError);
      }

      console.log(`[TokenAnalysis] 總共獲取 ${trades.length} 筆交易記錄`);
      const oldestTimeString = oldestTradeTime ? oldestTradeTime.toLocaleString() : '無法確定';

      let completionMessage = `數據獲取完成 (${trades.length} 筆)。最早記錄: ${oldestTimeString}.`;
      if (isIncomplete) {
         completionMessage = `數據可能不完整 (獲取了 ${trades.length} 筆)。最早記錄: ${oldestTimeString}.`;
         if (loadingMessage.value.includes("速率限制")) {
             completionMessage = `因速率限制停止(${trades.length} 筆)。最早記錄: ${oldestTimeString}.`;
         } else if (loadingMessage.value.includes("最大頁數")) {
             completionMessage = `已獲取最大頁數(${trades.length} 筆)。最早記錄: ${oldestTimeString}.`;
         }
      }
      loadingMessage.value = `${completionMessage} 開始處理...`;
      await new Promise(resolve => setTimeout(resolve, 50));


      if (trades.length > 0) {
        const processedData = processTradesData(trades);
        analysisResults.value = processedData;
        lastFetchedToken.value = tokenAddress;

        if (processedData.length > 0 && !isIncomplete) {
          const currentCache = getLocalStorageItem(TOKEN_ANALYSIS_CACHE_KEY) || {};
          currentCache[tokenAddress] = {
            timestamp: Date.now(),
            results: processedData
          };
          setLocalStorageItem(TOKEN_ANALYSIS_CACHE_KEY, currentCache);
          console.log(`[TokenAnalysis] 已將 ${tokenAddress} 的完整分析結果存入快取。`);
        } else if (isIncomplete) {
          console.log(`[TokenAnalysis] 因數據不完整，本次結果未存入快取。`);
        }

        if (processedData.length === 0){
            loadingMessage.value = "處理完畢，未解析出有效用戶數據。";
        } else {
            loadingMessage.value = '分析完成！';
        }

      } else {
        if (!error.value) loadingMessage.value = '未找到相關交易記錄。';
        analysisResults.value = [];
        const currentCache = getLocalStorageItem(TOKEN_ANALYSIS_CACHE_KEY) || {};
        if (currentCache[tokenAddress]) {
          delete currentCache[tokenAddress];
          setLocalStorageItem(TOKEN_ANALYSIS_CACHE_KEY, currentCache);
        }
      }
    } catch (err) {
      console.error("[TokenAnalysis] 分析過程中發生錯誤:", err);
      error.value = `分析錯誤: ${err.message || err}`;
      loadingMessage.value = '';
      analysisResults.value = [];
    } finally {
      isLoading.value = false;
      setTimeout(() => {
        if (!error.value && !loadingMessage.value.includes('限制') && !loadingMessage.value.includes('最大頁數') && !loadingMessage.value.includes('快取載入完成') && !loadingMessage.value.includes('分析完成')) {
          // 避免清除重要的最終狀態消息
        } else if (loadingMessage.value === '快取載入完成！' || loadingMessage.value === '分析完成！' || loadingMessage.value.includes('未解析出') || loadingMessage.value.includes('未找到')) {
             // 這些是最終消息，延遲清除
             setTimeout(() => { loadingMessage.value = ''; }, 5000);
        } else if (!error.value) {
             // 其他中間過程消息可以清除
             loadingMessage.value = '';
        }
      }, 5000); // 調整訊息清除邏輯
    }
  };

  return {
    targetTokenAddress,
    isLoading,
    loadingMessage,
    error,
    analysisResults,
    performAnalysis,
    lastFetchedToken
  };
}