<script setup>
// -----------------------------------------------------------------------------
// 這裡會是您之前 App.vue <script setup> 的所有內容
// 包括所有 import (constants, composables, utils 等)
// 以及所有響應式狀態 (refs), computed 屬性, watch 監聽器, onMounted 等生命週期鉤子
// -----------------------------------------------------------------------------
import { ref, computed, watch, onMounted } from 'vue';

// 使用相對路徑
import * as constants from '../constants';
import { useTokenAnalysis } from '../composables/useTokenAnalysis';
import { useFilters } from '../composables/useFilters';
import { usePagination } from '../composables/usePagination';
import { usePersistentSet } from '../composables/usePersistentStorage';

import '../assets/main.css'

// --- 核心分析邏輯 ---
const {
  targetTokenAddress,
  isLoading,
  loadingMessage,
  error,
  analysisResults,
  performAnalysis,
  lastFetchedToken
} = useTokenAnalysis();

// --- 已點擊地址邏輯 ---
const {
  dataSet: clickedAddresses,
  addItem: markAddressClicked,
  load: loadClickedAddresses,
  // hasItem: isAddressClicked // 如果模板直接用 .has() 則不需要
} = usePersistentSet(constants.CLICKED_ADDRESSES_KEY);

// --- 篩選邏輯 ---
const {
  filterRangeSolSpentMin,
  filterRangeSolSpentMax,
  filterMinProfitSol,
  filterMinProfitPercent,
  filterRangeHoldingMinutesMin,
  filterRangeHoldingMinutesMax,
  clearFilters: clearFilterInputs,
  filteredResults
} = useFilters(analysisResults);

// --- 分頁邏輯 ---
const {
  currentPage,
  itemsPerPage,
  totalPages,
  paginatedResults,
  nextPage,
  prevPage,
  goToPage
} = usePagination(filteredResults);

// --- 生命週期 & 監聽器 ---
onMounted(() => {
  loadClickedAddresses();
});

watch([
  filterRangeSolSpentMin,
  filterRangeSolSpentMax,
  filterMinProfitSol,
  filterMinProfitPercent,
  filterRangeHoldingMinutesMin,
  filterRangeHoldingMinutesMax,
  analysisResults
], () => {
  currentPage.value = 1;
});

const handleClearFilters = () => {
  clearFilterInputs();
};

</script>

<template>
  <div class="container">
    <h1>Solana 跟單地址篩選器 (Solana Copy Address Filter)</h1>

    <div class="input-area">
      <label for="tokenAddressInput">目標代幣地址:</label>
      <input
        type="text"
        id="tokenAddressInput"
        v-model="targetTokenAddress"
        placeholder="輸入代幣地址..."
        @keyup.enter="performAnalysis"
      />
      <button
        @click="performAnalysis"
        :disabled="isLoading"
        class="analyze-button"
      >
        <span v-if="isLoading">載入中...</span>
        <span v-else>開始分析</span>
      </button>
    </div>

    <div class="filters card">
      <h3>篩選條件</h3>
      <div class="filter-grid">
        <div class="filter-item">
          <label>買入 SOL:</label>
          <div class="filter-inputs">
            <input type="number" min="0" v-model.number="filterRangeSolSpentMin" placeholder="最少"/>
            <span>-</span>
            <input type="number" min="0" v-model.number="filterRangeSolSpentMax" placeholder="最多"/>
            <span>SOL</span>
          </div>
        </div>
        <div class="filter-item">
          <label>利潤 (SOL):</label>
          <div class="filter-inputs">
            <input type="number" v-model.number="filterMinProfitSol" placeholder="至少"/>
            <span>SOL</span>
          </div>
        </div>
        <div class="filter-item">
          <label>回報率 (%):</label>
          <div class="filter-inputs">
            <input type="number" min="0" v-model.number="filterMinProfitPercent" placeholder="至少"/>
            <span>%</span>
          </div>
        </div>
        <div class="filter-item">
          <label>持有時間:</label>
          <div class="filter-inputs">
            <input type="number" min="0" v-model.number="filterRangeHoldingMinutesMin" placeholder="最少"/>
            <span>-</span>
            <input type="number" min="0" v-model.number="filterRangeHoldingMinutesMax" placeholder="最多"/>
            <span>分鐘</span>
          </div>
        </div>
      </div>
      <button @click="handleClearFilters" class="clear-button">清除篩選</button>
    </div>

    <div v-if="loadingMessage" class="status-message info">
      <p>{{ loadingMessage }}</p>
    </div>
    <div v-if="error" class="status-message error">
      <p>錯誤：{{ error }}</p>
    </div>

    <div v-if="!isLoading && analysisResults.length > 0 && lastFetchedToken" class="results-area card">
      <h2>
        篩選結果 ({{ filteredResults.length }} / {{ analysisResults.length }} 符合條件)
        <span v-if="totalPages > 1"> 第 {{ currentPage }} / {{ totalPages }} 頁</span>
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
            <tr v-for="item in paginatedResults" :key="item.address" :class="{ 'clicked-row': clickedAddresses.has(item.address) }">
              <td>
                <a
                  @click="markAddressClicked(item.address)"
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

      <div v-if="totalPages > 1" class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
        <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
      </div>
    </div>
    <div v-else-if="!isLoading && !error && !lastFetchedToken && !loadingMessage" class="status-message">
      <p>請輸入代幣地址並點擊分析按鈕。如果已分析但無結果，可能是該代幣沒有交易記錄或 API 未返回數據。</p>
    </div>
  </div>
</template>

<style scoped>
/* 這裡會是您之前 App.vue <style> 的所有內容 */

.container {
  max-width: 1300px;
  margin: 20px auto;
  padding: 30px;
  background-color: var(--surface-color); /* 確保 var(--surface-color) 已定義 */
  border-radius: var(--border-radius); /* 確保 var(--border-radius) 已定義 */
  box-shadow: var(--card-shadow); /* 確保 var(--card-shadow) 已定義 */
}

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

tr.clicked-row {
  background-color: var(--clicked-row-bg) !important;
  opacity: var(--clicked-row-opacity);
}

tr.clicked-row:hover {
  background-color: var(--clicked-row-hover-bg) !important;
  opacity: 0.85;
}

tbody tr:nth-child(even).clicked-row {
  background-color: rgba(88, 166, 255, 0.12) !important;
}
tbody tr:nth-child(even).clicked-row:hover {
  background-color: rgba(88, 166, 255, 0.17) !important;
}

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
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    justify-content: flex-start;
  }
  .filter-item input[type="number"] {
    flex: 1 1 70px;
    min-width: 60px;
    max-width: 100%;
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