import { SOLANA_TRACKER_API_KEY, REST_API_BASE_URL, MAX_PAGES_TO_FETCH, TARGET_TRADES_TO_FETCH, API_REQUEST_DELAY_MS } from '../constants';

/**
 * 從 Solana Tracker API 獲取指定代幣的交易資料
 * @param {string} tokenAddress - 目標代幣地址
 * @param {Function} onProgress - 回調函數，用於報告進度 (message: string) => void
 * @returns {Promise<{trades: Array, isIncomplete: boolean, error?: string, oldestTradeTime?: Date}>}
 */
export async function fetchTrades(tokenAddress, onProgress) {
  if (!tokenAddress) {
    return { trades: [], isIncomplete: false, error: '請輸入目標代幣地址' };
  }
  if (!SOLANA_TRACKER_API_KEY || SOLANA_TRACKER_API_KEY === 'YOUR_API_KEY' || SOLANA_TRACKER_API_KEY.length < 10) {
    return { trades: [], isIncomplete: false, error: '請在程式碼中設定有效的 Solana Tracker API Key' };
  }

  const allTrades = [];
  let cursor = undefined;
  let page = 1;
  let rateLimitHit = false;
  let hitMaxPages = false;
  let oldestTradeTime = null;

  onProgress(`正在獲取第一頁交易數據 (REST) for ${tokenAddress}...`);

  try {
    while (page <= MAX_PAGES_TO_FETCH && allTrades.length < TARGET_TRADES_TO_FETCH) {
      onProgress(`正在獲取第 ${page}/${MAX_PAGES_TO_FETCH} 頁交易數據... (已獲取 ${allTrades.length}/${TARGET_TRADES_TO_FETCH} 筆)`);
      console.log(`[API Service] 正在請求第 ${page} 頁, cursor: ${cursor}`);

      const url = new URL(`${REST_API_BASE_URL}/trades/${tokenAddress}`);
      const params = new URLSearchParams();
      params.append('sortDirection', 'ASC');
      if (cursor) {
        params.append('cursor', cursor);
      }
      url.search = params.toString();
      const headers = new Headers({
        'accept': 'application/json',
        'x-api-key': SOLANA_TRACKER_API_KEY
      });

      const response = await fetch(url.toString(), { method: 'GET', headers: headers });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`[API Service] 在請求第 ${page} 頁時達到速率限制。`);
          rateLimitHit = true;
          break;
        }
        let errorBody = `Status: ${response.status} ${response.statusText}`;
        try {
          const errJson = await response.json();
          errorBody += ` - ${errJson.message || JSON.stringify(errJson)}`;
        } catch (e) { /* Do nothing */ }
        throw new Error(`API 請求失敗: ${errorBody}`);
      }

      const result = await response.json();
      const tradesBatch = result?.trades;
      const hasNextPage = result?.hasNextPage;
      const nextCursor = result?.nextCursor;

      if (tradesBatch && tradesBatch.length > 0) {
        allTrades.push(...tradesBatch); // 使用 spread operator 更高效
        if (!oldestTradeTime && allTrades[0]?.time) {
            oldestTradeTime = new Date(allTrades[0].time);
        }
        console.log(`[API Service] Page ${page}: Fetched ${tradesBatch.length} trades. Total: ${allTrades.length}`);
      } else {
        console.log(`[API Service] Page ${page}: No trades returned in this batch.`);
        break;
      }

      if (page === MAX_PAGES_TO_FETCH) {
        hitMaxPages = true;
        console.log(`[API Service] 已達到設定的最大頁數 ${MAX_PAGES_TO_FETCH}。`);
        break;
      }

      if (hasNextPage && nextCursor && allTrades.length < TARGET_TRADES_TO_FETCH) {
        cursor = nextCursor;
        page++;
        if (API_REQUEST_DELAY_MS > 0) {
            await new Promise(resolve => setTimeout(resolve, API_REQUEST_DELAY_MS));
        }
      } else {
        if (!hasNextPage || !nextCursor) console.log("[API Service] API indicated no more pages.");
        if (allTrades.length >= TARGET_TRADES_TO_FETCH) console.log(`[API Service] 已達到目標獲取筆數 ${TARGET_TRADES_TO_FETCH}。`);
        break;
      }
    }
    const isIncomplete = rateLimitHit || hitMaxPages;
    return { trades: allTrades, isIncomplete, oldestTradeTime };

  } catch (err) {
    console.error("[API Service] REST API 請求錯誤:", err);
    return { trades: [], isIncomplete: false, error: `請求錯誤: ${err.message || err}` };
  }
}

/**
 * 處理和聚合 Solana Tracker 交易數據
 * @param {Array} trades - 原始交易數據
 * @returns {Array} 處理後的用戶統計結果
 */
export function processTradesData(trades) {
  console.log(`[Processor] 開始處理 ${trades.length} 筆交易...`);
  const userStats = {};

  trades.forEach(trade => {
    const userAddress = trade.wallet;
    const timestamp = Math.floor(trade.time / 1000); // 確保是秒
    const type = trade.type;
    const tokenAmount = parseFloat(trade.amount);
    const solAmount = parseFloat(trade.volumeSol);

    if (!userAddress || !timestamp || !type || isNaN(tokenAmount) || isNaN(solAmount) || !isFinite(solAmount) || !isFinite(tokenAmount)) {
      console.warn(`[Processor] 跳過不完整交易:`, trade.tx, trade);
      return;
    }

    if (!userStats[userAddress]) {
      userStats[userAddress] = {
        buys: [],
        sells: [],
        totalSolSpent: 0,
        totalSolReceived: 0,
        totalTokenBought: 0,
        totalTokenSold: 0,
        firstTxTime: timestamp, // 初始化為當前交易時間
        lastTxTime: timestamp
      };
    } else {
        // 確保 firstTxTime 是最早的
        userStats[userAddress].firstTxTime = Math.min(userStats[userAddress].firstTxTime, timestamp);
    }


    const stats = userStats[userAddress];

    if (type === 'buy') {
      stats.buys.push({ solAmount, tokenAmount, time: timestamp });
      stats.totalSolSpent += solAmount;
      stats.totalTokenBought += tokenAmount;
    } else if (type === 'sell') {
      stats.sells.push({ tokenAmount, solAmount, time: timestamp });
      stats.totalSolReceived += solAmount;
      stats.totalTokenSold += tokenAmount;
    }
    stats.lastTxTime = Math.max(stats.lastTxTime, timestamp); // 總是以較晚的交易更新 lastTxTime
  });

  console.log(`[Processor] 聚合完成 ${Object.keys(userStats).length} 個地址。`);
  const finalResults = [];
  const nowSeconds = Math.floor(Date.now() / 1000);

  for (const address in userStats) {
    const stats = userStats[address];
    const currentSolSpent = stats.totalSolSpent;
    const currentSolReceived = stats.totalSolReceived;
    const realizedProfit = currentSolReceived - currentSolSpent;
    const profitPercent = (currentSolSpent > 0) ? (currentSolReceived / currentSolSpent) * 100 : null;

    let holdingDurationStr = 'N/A';
    let holdingDurationSeconds = null;

    if (stats.firstTxTime !== Infinity) { // 確保 firstTxTime 被正確初始化
        const holdingAmount = stats.totalTokenBought - stats.totalTokenSold;
        const isStillHolding = holdingAmount > 1e-9; // 考慮浮點數精度
        // 如果仍在持有，結束時間是現在；如果已清倉，結束時間是最後一次交易時間
        const endTime = isStillHolding ? nowSeconds : stats.lastTxTime;
        const durationSeconds = endTime - stats.firstTxTime;

        if (durationSeconds >= 0) {
            holdingDurationSeconds = durationSeconds;
            const days = Math.floor(durationSeconds / 86400);
            const hours = Math.floor((durationSeconds % 86400) / 3600);
            const minutes = Math.floor((durationSeconds % 3600) / 60);
            if (durationSeconds < 60) holdingDurationStr = '< 1m';
            else holdingDurationStr = `${days}d ${hours}h ${minutes}m`;
        }
    }

    if (stats.buys.length > 0 || stats.sells.length > 0) {
      finalResults.push({
        address: address,
        solSpent: currentSolSpent,
        solReceived: currentSolReceived,
        realizedProfit: realizedProfit,
        profitPercent: (profitPercent !== null && isFinite(profitPercent)) ? profitPercent : null,
        holdingDuration: holdingDurationStr,
        holdingDurationSeconds: holdingDurationSeconds,
      });
    }
  }

  finalResults.sort((a, b) => b.realizedProfit - a.realizedProfit);
  console.log(`[Processor] 最終分析結果 (objects): ${finalResults.length}`);
  return finalResults;
}