<script setup>
import { ref, computed, watch } from 'vue'

/**
 * ===================================
 * 配置常數
 * ===================================
 */
const SOLANA_TRACKER_API_KEY = 'f904db77-2734-4ac2-9b07-67f83b8ee833'
const REST_API_BASE_URL = 'https://data.solanatracker.io'
const SOL_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111112'
const CACHE_DURATION_MS = 60 * 60 * 1000 // 快取有效時間：1 小時
const CACHE_KEY = 'tokenAnalysisCache'

/**
 * ===================================
 * 響應式狀態管理
 * ===================================
 */
// 基礎狀態
const targetTokenAddress = ref('')
const isLoading = ref(false)
const loadingMessage = ref('')
const error = ref(null)
const analysisResults = ref([])

// 篩選條件
const filterRangeSolSpentMin = ref(null)
const filterRangeSolSpentMax = ref(null)
const filterMinProfitSol = ref(null)
const filterMinProfitPercent = ref(null)
const filterRangeHoldingMinutesMin = ref(null)
const filterRangeHoldingMinutesMax = ref(null)

// 分頁控制
const currentPage = ref(1)
const itemsPerPage = ref(75)

/**
 * ===================================
 * 工具函式
 * ===================================
 */

/**
 * 清除所有篩選條件
 */
function clearFilters() {
  filterRangeSolSpentMin.value = null
  filterRangeSolSpentMax.value = null
  filterMinProfitSol.value = null
  filterMinProfitPercent.value = null
  filterRangeHoldingMinutesMin.value = null
  filterRangeHoldingMinutesMax.value = null
  currentPage.value = 1
}

/**
 * 取得快取資料
 * @returns {Object} 快取物件
 */
function getCache() {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY)
    return cachedData ? JSON.parse(cachedData) : {}
  } catch (e) {
    console.error('讀取快取失敗:', e)
    return {}
  }
}

/**
 * 設定快取資料
 * @param {Object} cacheData - 要快取的資料
 */
function setCache(cacheData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
  } catch (e) {
    console.error('儲存快取失敗:', e)
  }
}

/**
 * ===================================
 * API 請求與資料處理
 * ===================================
 */

/**
 * 從 Solana Tracker API 獲取交易資料
 */
async function fetchSolanaTrackerTradesREST() {
  const tokenAddress = targetTokenAddress.value
  
  // 輸入驗證
  if (!tokenAddress) {
    error.value = '請輸入目標代幣地址'
    return
  }
  
  if (!SOLANA_TRACKER_API_KEY || 
      SOLANA_TRACKER_API_KEY === 'YOUR_API_KEY' || 
      SOLANA_TRACKER_API_KEY.length < 10) {
    error.value = '請在程式碼中設定有效的 Solana Tracker API Key'
    return
  }

  // 重置狀態
  isLoading.value = true
  error.value = null
  analysisResults.value = []
  currentPage.value = 1
  loadingMessage.value = '檢查快取中...'
  
  // 加入短暫延遲，讓 UI 可以更新
  await new Promise(resolve => setTimeout(resolve, 50))

  // 檢查快取
  const cache = getCache()
  const cachedEntry = cache[tokenAddress]
  const now = Date.now()
  
  if (cachedEntry && (now - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    console.log(`[快取] 找到 ${tokenAddress} 的有效快取。`)
    loadingMessage.value = `從快取載入數據 (上次更新於 ${new Date(cachedEntry.timestamp).toLocaleTimeString()})...`
    analysisResults.value = cachedEntry.results
    
    await new Promise(resolve => setTimeout(resolve, 200))
    loadingMessage.value = '快取載入完成！'
    isLoading.value = false
    
    setTimeout(() => {
      if (!error.value) loadingMessage.value = ''
    }, 3000)
    
    return
  }
  
  console.log(`[快取] ${tokenAddress} 無有效快取，需要呼叫 API。`)

  // 從 API 獲取數據
  const allTrades = []
  let cursor = undefined
  let page = 1
  const MAX_PAGES = 234
  const TARGET_TRADES = 17500
  let rateLimitHit = false
  let hitMaxPages = false

  loadingMessage.value = '正在獲取第一頁交易數據 (REST)...'

  try {
    while (page <= MAX_PAGES && allTrades.length < TARGET_TRADES) {
      loadingMessage.value = `正在獲取第 ${page}/${MAX_PAGES} 頁交易數據... (已獲取 ${allTrades.length}/${TARGET_TRADES} 筆)`
      console.log(`[抓取] 正在請求第 ${page} 頁, cursor: ${cursor}`)
      
      // 建構 API 請求
      const url = new URL(`${REST_API_BASE_URL}/trades/${tokenAddress}`)
      const params = new URLSearchParams()
      params.append('sortDirection', 'ASC')
      
      if (cursor) {
        params.append('cursor', cursor)
      }
      
      url.search = params.toString()
      
      const headers = new Headers({
        'accept': 'application/json',
        'x-api-key': SOLANA_TRACKER_API_KEY
      })
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
      })

      // 處理 API 回應
      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`[速率限制] 在請求第 ${page} 頁時達到速率限制。`)
          loadingMessage.value = `已達 API 速率限制 (獲取了 ${page-1} 頁，共 ${allTrades.length} 筆)。數據可能不完整。`
          rateLimitHit = true
          break
        }
        
        let errorBody = `Status: ${response.status} ${response.statusText}`
        try {
          const errJson = await response.json()
          errorBody += ` - ${errJson.message || JSON.stringify(errJson)}`
        } catch (e) {}
        
        throw new Error(`API 請求失敗: ${errorBody}`)
      }

      const result = await response.json()
      const tradesBatch = result?.trades
      const hasNextPage = result?.hasNextPage
      const nextCursor = result?.nextCursor

      if (tradesBatch && tradesBatch.length > 0) {
        tradesBatch.forEach(trade => allTrades.push(trade))
        console.log(`Page ${page}: Fetched ${tradesBatch.length} trades. Total: ${allTrades.length}`)
      } else {
        console.log(`Page ${page}: No trades returned in this batch.`)
        break
      }

      // 檢查是否達到最大頁數
      if (page === MAX_PAGES) {
        hitMaxPages = true
        console.log(`已達到設定的最大頁數 ${MAX_PAGES}。`)
        loadingMessage.value = `已獲取前 ${MAX_PAGES} 頁共 ${allTrades.length} 筆交易(可能還有更多)。`
        break
      }

      // 判斷是否繼續獲取下一頁
      if (hasNextPage && nextCursor && allTrades.length < TARGET_TRADES) {
        cursor = nextCursor
        page++
        await new Promise(resolve => setTimeout(resolve, 250))
      } else {
        if (!hasNextPage || !nextCursor) {
          console.log("API indicated no more pages.")
        }
        if (allTrades.length >= TARGET_TRADES) {
          console.log(`已達到目標獲取筆數 ${TARGET_TRADES}。`)
        }
        break
      }
    }

    console.log(`總共獲取 ${allTrades.length} 筆交易記錄`)

    // 處理獲取到的交易資料
    if (allTrades.length > 0) {
      const oldestTrade = allTrades[0]
      const oldestTime = oldestTrade?.time ? new Date(oldestTrade.time) : null
      const oldestTimeString = oldestTime ? oldestTime.toLocaleString() : '無法確定'
      
      console.log(`[數據範圍檢查] 返回的最早交易時間: ${oldestTimeString}`)
      
      // 調整完成訊息
      if (!rateLimitHit && !hitMaxPages) {
        loadingMessage.value = `數據獲取完成 (${allTrades.length} 筆)。最早記錄: ${oldestTimeString}. 開始處理...`
      } else if (hitMaxPages) {
        loadingMessage.value = `已獲取 ${MAX_PAGES} 頁(${allTrades.length} 筆)。最早記錄: ${oldestTimeString}. 開始處理...`
      } else {
        loadingMessage.value = `因速率限制停止(${allTrades.length} 筆)。最早記錄: ${oldestTimeString}. 開始處理...`
      }

      await new Promise(resolve => setTimeout(resolve, 50))
      
      // 處理數據
      processSolanaTrackerTrades(allTrades, tokenAddress, rateLimitHit)
    } else {
      if (!error.value) {
        loadingMessage.value = '未找到相關交易記錄。'
      }
      analysisResults.value = []
      
      // 清除無效快取
      const currentCache = getCache()
      if (currentCache[tokenAddress]) {
        delete currentCache[tokenAddress]
        setCache(currentCache)
      }
    }

  } catch (err) {
    console.error("REST API 請求或處理錯誤:", err)
    error.value = `請求錯誤: ${err.message || err}`
    loadingMessage.value = ''
    analysisResults.value = []
  } finally {
    isLoading.value = false
    
    // 5秒後清除訊息
    setTimeout(() => {
      if (!error.value && 
          !loadingMessage.value.includes('限制') && 
          !loadingMessage.value.includes('最大頁數')) {
        loadingMessage.value = ''
      }
    }, 5000)
  }
}

/**
 * 處理和聚合 Solana Tracker 交易數據
 * @param {Array} trades - 原始交易數據
 * @param {string} tokenAddress - 代幣地址
 * @param {boolean} isIncomplete - 數據是否不完整
 */
function processSolanaTrackerTrades(trades, tokenAddress, isIncomplete) {
  console.log(`[處理] 開始處理 ${trades.length} 筆交易...`)
  const userStats = {}

  // 按用戶地址聚合交易數據
  trades.forEach(trade => {
    const userAddress = trade.wallet
    const timestamp = Math.floor(trade.time / 1000)
    const type = trade.type
    const tokenAmount = parseFloat(trade.amount)
    const solAmount = parseFloat(trade.volumeSol)

    // 驗證交易數據完整性
    if (!userAddress || !timestamp || !type || 
        isNaN(tokenAmount) || isNaN(solAmount) || 
        !isFinite(solAmount) || !isFinite(tokenAmount)) {
      console.warn(`[Process] 跳過不完整交易:`, trade.tx, trade)
      return
    }

    // 初始化用戶統計資料
    if (!userStats[userAddress]) {
      userStats[userAddress] = {
        buys: [],
        sells: [],
        totalSolSpent: 0,
        totalSolReceived: 0,
        totalTokenBought: 0,
        totalTokenSold: 0,
        firstTxTime: timestamp,
        lastTxTime: timestamp
      }
    }

    const stats = userStats[userAddress]

    // 根據交易類型更新統計資料
    if (type === 'buy') {
      stats.buys.push({
        solAmount: solAmount,
        tokenAmount: tokenAmount,
        time: timestamp
      })
      stats.totalSolSpent += solAmount
      stats.totalTokenBought += tokenAmount
    } else if (type === 'sell') {
      stats.sells.push({
        tokenAmount: tokenAmount,
        solAmount: solAmount,
        time: timestamp
      })
      stats.totalSolReceived += solAmount
      stats.totalTokenSold += tokenAmount
    }

    stats.lastTxTime = timestamp
  })

  console.log(`[處理] 聚合完成 ${Object.keys(userStats).length} 個地址。`)

  // 計算每個用戶的最終統計結果
  const finalResults = []
  const now = Math.floor(Date.now() / 1000)

  for (const address in userStats) {
    const stats = userStats[address]
    
    // 再次檢查數據有效性
    const currentSolSpent = (typeof stats.totalSolSpent === 'number' && isFinite(stats.totalSolSpent)) 
      ? stats.totalSolSpent 
      : 0
    
    const currentSolReceived = (typeof stats.totalSolReceived === 'number' && isFinite(stats.totalSolReceived)) 
      ? stats.totalSolReceived 
      : 0

    const realizedProfit = currentSolReceived - currentSolSpent

    // 計算利潤百分比
    const profitPercent = (currentSolSpent > 0 && currentSolReceived >= 0)
      ? (currentSolReceived / currentSolSpent) * 100
      : null

    // 格式化顯示數據
    const displayProfitPercent = (typeof profitPercent === 'number' && isFinite(profitPercent)) 
      ? profitPercent 
      : null
    
    const displayRealizedProfit = (typeof realizedProfit === 'number' && isFinite(realizedProfit)) 
      ? realizedProfit 
      : 0
    
    // 計算持有時間
    let holdingDurationStr = 'N/A'
    let holdingDurationSeconds = null
    
    if (stats.firstTxTime !== Infinity) {
      const holdingAmount = stats.totalTokenBought - stats.totalTokenSold
      const isHolding = holdingAmount > 1e-9
      let endTime = stats.lastTxTime
      
      if (isHolding) {
        endTime = now
      }
      
      const durationSeconds = endTime - stats.firstTxTime
      
      if (durationSeconds >= 0) {
        holdingDurationSeconds = durationSeconds
        const days = Math.floor(durationSeconds / 86400)
        const hours = Math.floor((durationSeconds % 86400) / 3600)
        const minutes = Math.floor((durationSeconds % 3600) / 60)
        
        holdingDurationStr = durationSeconds < 60 
          ? '< 1m' 
          : `${days}d ${hours}h ${minutes}m`
      }
    }

    // 只添加有交易記錄的用戶
    if (stats.buys.length > 0 || stats.sells.length > 0) {
      finalResults.push({
        address: address,
        solSpent: currentSolSpent,
        solReceived: currentSolReceived,
        realizedProfit: displayRealizedProfit,
        holdingDuration: holdingDurationStr,
        holdingDurationSeconds: holdingDurationSeconds,
        profitPercent: displayProfitPercent
      })
    }
  }

  // 按利潤排序
  finalResults.sort((a, b) => b.realizedProfit - a.realizedProfit)
  analysisResults.value = finalResults
  console.log("最終分析結果 (objects):", finalResults.length)

  // 快取管理
  if (tokenAddress && finalResults.length > 0 && !isIncomplete) {
    const cache = getCache()
    cache[tokenAddress] = {
      timestamp: Date.now(),
      results: finalResults
    }
    setCache(cache)
    console.log(`[快取] 已將 ${tokenAddress} 的完整分析結果存入快取。`)
  } else if (isIncomplete) {
    console.log(`[快取] 因數據不完整，本次結果未存入快取。`)
  }

  // 更新訊息
  if (finalResults.length === 0 && trades.length > 0 && !error.value) {
    loadingMessage.value = "處理完畢，未解析出用戶數據。"
  } else if (finalResults.length === 0 && trades.length === 0 && !error.value) {
    loadingMessage.value = '未找到交易記錄。'
  } else if (!error.value) {
    loadingMessage.value = '分析完成！'
  }
}

/**
 * 解析持有時間到分鐘
 * @param {number} durationSeconds - 持有時間（秒）
 * @returns {number|null} 持有時間（分鐘）
 */
function parseDurationToMinutes(durationSeconds) {
  if (durationSeconds === null || durationSeconds < 0) return null
  return Math.floor(durationSeconds / 60)
}

/**
 * ===================================
 * 計算屬性
 * ===================================
 */

/**
 * 篩選後的結果
 */
  const filteredResults = computed(() => {
    if (!analysisResults.value || analysisResults.value.length === 0) return []
    
    return analysisResults.value.filter(item => {
      // SOL 花費範圍篩選
      const solSpentMin = filterRangeSolSpentMin.value
      const solSpentMax = filterRangeSolSpentMax.value
      
      if (solSpentMin !== null && typeof solSpentMin === 'number' && item.solSpent < solSpentMin) {
        return false
      }
      if (solSpentMax !== null && typeof solSpentMax === 'number' && item.solSpent > solSpentMax) {
        return false
      }
      
      // 利潤篩選
      if (filterMinProfitSol.value !== null && 
          typeof filterMinProfitSol.value === 'number' && 
          item.realizedProfit < filterMinProfitSol.value) {
        return false
      }
      
      // 回報率篩選
      if (filterMinProfitPercent.value !== null && 
          typeof filterMinProfitPercent.value === 'number' && 
          (item.profitPercent === null || item.profitPercent < filterMinProfitPercent.value)) {
        return false
      }
      
      // 持有時間篩選
      const holdingMinutes = parseDurationToMinutes(item.holdingDurationSeconds)
      const holdingMinutesMin = filterRangeHoldingMinutesMin.value
      const holdingMinutesMax = filterRangeHoldingMinutesMax.value
      
      if (holdingMinutes !== null) {
        if (holdingMinutesMin !== null && 
            typeof holdingMinutesMin === 'number' && 
            holdingMinutes < holdingMinutesMin) {
          return false
        }
        if (holdingMinutesMax !== null && 
            typeof holdingMinutesMax === 'number' && 
            holdingMinutes > holdingMinutesMax) {
          return false
        }
      } else {
        if (holdingMinutesMin !== null || holdingMinutesMax !== null) {
          return false
        }
      }
      
      return true
    })
  })

/**
 * 總頁數
 */
const totalPages = computed(() => {
  return Math.ceil(filteredResults.value.length / itemsPerPage.value)
})

/**
 * 當前頁面的結果
 */
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredResults.value.slice(start, end)
})

/**
 * ===================================
 * 分頁方法
 * ===================================
 */

/**
 * 下一頁
 */
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

/**
 * 上一頁
 */
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 跳轉到指定頁面
 * @param {number} pageNumber - 頁碼
 */
function goToPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber
  }
}

/**
 * ===================================
 * 監聽器
 * ===================================
 */

// 當篩選條件改變時，重置頁碼
watch([
  filterRangeSolSpentMin,
  filterRangeSolSpentMax,
  filterMinProfitSol,
  filterMinProfitPercent,
  filterRangeHoldingMinutesMin,
  filterRangeHoldingMinutesMax
], () => {
  currentPage.value = 1
})

// 當分析結果改變時，重置頁碼
watch(analysisResults, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="container">
    <h1>Solana 跟單地址篩選器 (Solana Copy Address Filter)</h1>

    <!-- 輸入區域 -->
    <div class="input-area">
      <label for="tokenAddress">目標代幣地址:</label>
      <input 
        type="text" 
        id="tokenAddress" 
        v-model="targetTokenAddress" 
        placeholder="輸入代幣地址..."
      >
      <button 
        @click="fetchSolanaTrackerTradesREST" 
        :disabled="isLoading" 
        class="analyze-button"
      >
        <span v-if="isLoading">載入中...</span>
        <span v-else>開始分析</span>
      </button>
    </div>

    <!-- 篩選條件 -->
    <div class="filters card">
      <h3>篩選條件</h3>
      <div class="filter-grid">
        <!-- SOL 花費範圍 -->
        <div class="filter-item">
          <label>買入 SOL:</label>
          <div class="filter-inputs">
            <input 
              type="number" 
              min="0" 
              v-model.number="filterRangeSolSpentMin" 
              placeholder="最少"
            >
            <span>-</span>
            <input 
              type="number" 
              min="0" 
              v-model.number="filterRangeSolSpentMax" 
              placeholder="最多"
            >
            <span>SOL</span>
          </div>
        </div>
        
        <!-- 利潤篩選 -->
        <div class="filter-item">
          <label>利潤 (SOL):</label>
          <div class="filter-inputs">
            <input 
              type="number" 
              v-model.number="filterMinProfitSol" 
              placeholder="至少"
            >
            <span>SOL</span>
          </div>
        </div>
        
        <!-- 回報率篩選 -->
        <div class="filter-item">
          <label>回報率 (%):</label>
          <div class="filter-inputs">
            <input 
              type="number" 
              min="0" 
              v-model.number="filterMinProfitPercent" 
              placeholder="至少"
            >
            <span>%</span>
          </div>
        </div>
        
        <!-- 持有時間篩選 -->
        <div class="filter-item">
          <label>持有時間:</label>
          <div class="filter-inputs">
            <input 
              type="number" 
              min="0" 
              v-model.number="filterRangeHoldingMinutesMin" 
              placeholder="最少"
            >
            <span>-</span>
            <input 
              type="number" 
              min="0" 
              v-model.number="filterRangeHoldingMinutesMax" 
              placeholder="最多"
            >
            <span>分鐘</span>
          </div>
        </div>
      </div>
      <button @click="clearFilters" class="clear-button">清除篩選</button>
    </div>

    <!-- 狀態訊息 -->
    <div v-if="loadingMessage" class="status-message info">
      <p>{{ loadingMessage }}</p>
    </div>
    <div v-if="error" class="status-message error">
      <p>錯誤：{{ error }}</p>
    </div>

    <!-- 結果區域 -->
    <div v-if="!isLoading && analysisResults.length > 0" class="results-area card">
      <h2>
        篩選結果 ({{ filteredResults.length }} / {{ analysisResults.length }} 符合條件)
        <span v-if="totalPages > 1">  第 {{ currentPage }} / {{ totalPages }} 頁</span>
      </h2>
      
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>地址 (->GmGn)</th>
              <th>總買入 (SOL)</th>
              <th>總賣出 (SOL)</th>
              <th>實現利潤 (SOL)</th>
              <th>回報率 (%)</th>
              <th>持有時間</th>
            </tr>
          </thead>
          <tbody v-if="paginatedResults.length > 0">
            <tr v-for="item in paginatedResults" :key="item.address">
              <td>
                <a 
                  :href="`https://gmgn.ai/sol/address/${item.address}`" 
                  target="_blank" 
                  :title="`在 GmGn 上查看 ${item.address}`"
                >
                  {{ item.address.substring(0, 6) }}...{{ item.address.substring(item.address.length - 4) }}
                </a>
              </td>
              <td>{{ item.solSpent.toFixed(3) }}</td>
              <td>{{ item.solReceived.toFixed(3) }}</td>
              <td :style="{ color: item.realizedProfit >= 0 ? 'var(--profit-color)' : 'var(--loss-color)' }">
                {{ item.realizedProfit.toFixed(3) }}
              </td>
              <td :style="{ color: item.profitPercent === null || item.profitPercent >= 0 ? 'var(--profit-color)' : 'var(--loss-color)' }">
                {{ item.profitPercent !== null ? item.profitPercent.toFixed(2) + '%' : 'N/A' }}
              </td>
              <td>{{ item.holdingDuration }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" style="text-align: center;">
                沒有符合目前篩選條件的結果。
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分頁控制 -->
      <div v-if="totalPages > 1" class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">
          上一頁
        </button>
        <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          下一頁
        </button>
      </div>
    </div>
    
    <!-- 預設提示 -->
    <div v-else-if="!isLoading && !error && analysisResults.length === 0 && !loadingMessage" class="status-message">
      <p>請輸入代幣地址並點擊分析按鈕。如果已分析但無結果，可能是該代幣沒有交易記錄或 API 未返回數據。</p>
    </div>
  </div>
</template>

<style>
/* ===================================
   基礎樣式與變數
   =================================== */
:root {
  --primary-color: #0ef6cc;    /* 亮青色 */
  --primary-hover: #0dd4b1;
  --secondary-color: #1a1b26;  /* 深藍黑背景 */
  --surface-color: #1e1f2b;    /* 卡片/輸入框背景 */
  --border-color: #3a3b4d;     /* 邊框顏色 (稍亮) */
  --text-color: #e8eaed;       /* 主要文字 */
  --text-secondary: #a8a9b4;   /* 次要文字 */
  --error-color: #f85149;      /* 紅色 */
  --info-color: #58a6ff;       /* 藍色 */
  --profit-color: #3fb950;     /* 綠色 */
  --loss-color: #f85149;       /* 紅色 */
  --link-color: #0ef6cc;       /* 連結顏色 */
  --card-bg: var(--surface-color);
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  --border-radius: 10px;
  --font-family: -apple-system, BlinkMacSystemFont, Inter, "Segoe UI", Roboto, sans-serif;
}

body {
  font-family: var(--font-family);
  color: var(--text-color);
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  background-color: var(--secondary-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1300px;
  margin: 20px auto;
  padding: 30px;
  background-color: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

/* ===================================
   標題樣式
   =================================== */
h1,
h2,
h3 {
  color: var(--text-color);
  font-weight: 600;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
  background: linear-gradient(45deg, #0ef6cc, #58a6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

h2 {
  margin-top: 35px;
  margin-bottom: 15px;
  font-size: 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #d1d5db;
}

h2 span {
  font-size: 0.85em;
  color: var(--text-secondary);
  font-weight: normal;
  margin-left: 15px;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  font-size: 1.15rem;
  color: var(--text-secondary);
}

/* ===================================
   輸入區域
   =================================== */
.input-area {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
  flex-wrap: wrap;
}

.input-area label {
  font-weight: 500;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.input-area input[type="text"] {
  flex-grow: 1;
  min-width: 250px;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: #2a2b3d;
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.input-area input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: #3a3b4d;
  box-shadow: 0 0 0 2px rgba(14, 246, 204, 0.1);
}

.analyze-button {
  padding: 10px 20px;
  background: var(--primary-color);
  color: #1a1b26;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(14, 246, 204, 0.2);
}

.analyze-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(14, 246, 204, 0.3);
}

.analyze-button:disabled {
  background-color: #444;
  color: #888;
  cursor: not-allowed;
  box-shadow: none;
}

/* ===================================
   篩選器區域
   =================================== */
.filters {
  border: 1px solid var(--border-color);
  padding: 25px;
  margin-bottom: 35px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 18px;
  margin-bottom: 20px;
}

.filter-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 15px;
  align-items: center;
  background-color: var(--secondary-color);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.filter-item label {
  text-align: right;
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-inputs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  flex-grow: 1;
  min-width: 0;
}

.filter-item input[type="number"] {
  flex: 1 1 70px;
  max-width: 110px;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--surface-color);
  color: var(--text-color);
  font-size: 0.9rem;
  text-align: center;
}

.filter-item input[type="number"]::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.filter-item input[type="number"]:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: #2a2b3d;
}

.filter-item span {
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding: 0 5px;
  white-space: nowrap;
}

.clear-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #555;
  color: var(--text-color);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.clear-button:hover {
  background-color: #666;
}

/* ===================================
   狀態訊息
   =================================== */
.status-message {
  padding: 15px 20px;
  margin: 25px 0;
  border-radius: var(--border-radius);
  text-align: center;
  font-weight: 500;
  border: 1px solid transparent;
  animation: fadeIn 0.3s ease-out;
}

.status-message.info {
  background-color: rgba(88, 166, 255, 0.1);
  border-color: rgba(88, 166, 255, 0.3);
  color: var(--info-color);
}

.status-message.error {
  background-color: rgba(248, 81, 73, 0.1);
  border-color: rgba(248, 81, 73, 0.3);
  color: var(--error-color);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===================================
   結果表格
   =================================== */
.results-area {
  margin-top: 35px;
  padding: 25px;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th,
td {
  padding: 14px 18px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

th:nth-child(n + 2),
td:nth-child(n + 2) {
  text-align: right;
}

td:first-child,
th:first-child {
  white-space: normal;
  word-break: break-all;
  min-width: 160px;
}

th {
  background-color: #242533;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  position: sticky;
  top: 0;
  z-index: 1;
}

td {
  font-size: 0.9rem;
  color: var(--text-color);
}

td a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

td a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

tbody tr {
  transition: background-color 0.3s ease;
}

tbody tr:hover {
  background-color: rgba(14, 246, 204, 0.06);
}

/* ===================================
   分頁控制
   =================================== */
.pagination-controls {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.pagination-controls button {
  padding: 9px 18px;
  background-color: var(--surface-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.pagination-controls button:disabled {
  background-color: var(--surface-color);
  color: #6c757d;
  opacity: 0.6;
  cursor: not-allowed;
}

.pagination-controls span {
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding: 0 12px;
  font-weight: 500;
}

/* ===================================
   響應式設計 - 手機版優化
   =================================== */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  h1 {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }
  h2 {
    font-size: 1.3rem;
  }
  h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
  .input-area {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 25px;
  }
  .input-area input[type="text"] {
    min-width: unset;
  }
  .filters {
    padding: 15px;
    margin-bottom: 25px;
  }
  .filter-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .filter-item {
    display: block;
    padding: 12px;
    gap: 8px;
  }
  .filter-item label {
    display: block;
    width: 100%;
    text-align: left;
    margin-bottom: 8px;
    padding-right: 0;
    font-weight: 500;
  }
  .filter-inputs {
    display: flex;
    align-items: center;
    flex-wrap: wrap; /* 允許換行 */
    gap: 8px;
    width: 100%;
    justify-content: flex-start;
  }
  .filter-item input[type="number"] {
    flex: 1 1 70px; /* 調整基礎寬度 */
    min-width: 60px;
    max-width: 100%; /* 允許佔滿 */
  }
  .filter-item span {
    flex-shrink: 0;
    padding: 0 2px;
  }
  .results-area {
    padding: 15px;
  }
  .table-responsive {
    font-size: 0.85rem;
  }
  th,
  td {
    padding: 10px 8px;
  }
  td:first-child,
  th:first-child {
    min-width: 100px;
  }
  .pagination-controls {
    margin-top: 20px;
    gap: 8px;
  }
  .pagination-controls button {
    padding: 8px 12px;
  }
  .pagination-controls span {
    padding: 0 8px;
    font-size: 0.9rem;
  }
}

/* ===================================
   其他樣式
   =================================== */
.card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--secondary-color);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>