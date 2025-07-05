<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 元件引入
import StatusMessage from '../components/ui/StatusMessage.vue'
import PaginationControls from '../components/ui/PaginationControls.vue'
import InputSection from '../components/forms/InputSection.vue'
import FilterSection from '../components/forms/FilterSection.vue'
import ResultsTable from '../components/tables/ResultsTable.vue'

// 使用相對路徑
import * as constants from '../constants';
import { useTokenAnalysis } from '../composables/useTokenAnalysis';
import { useFilters } from '../composables/useFilters';
import { usePagination } from '../composables/usePagination';
import { usePersistentSet } from '../composables/usePersistentStorage';

import '../assets/main.css'

// 路由功能
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

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

// --- 事件處理 ---
const handleClearFilters = () => {
  clearFilterInputs();
};

const handleGoToAddressPnl = (address) => {
  console.log("跳轉到地址分析", address);
  router.push({
    name: "AddressPnl", 
    params: { address: address },
    query: { token: targetTokenAddress.value }
  });
};

const handleMarkAddressClicked = (address) => {
  markAddressClicked(address);
};

// --- 計算屬性 ---
const showResults = computed(() => 
  !isLoading.value && analysisResults.value.length > 0 && lastFetchedToken.value
);

const showEmptyState = computed(() => 
  !isLoading.value && !error.value && !lastFetchedToken.value && !loadingMessage.value
);

// --- 生命週期 & 監聽器 ---
onMounted(() => {
  loadClickedAddresses();
  
  // 檢查 URL 中是否有代幣地址參數
  const tokenFromUrl = route.query.token;
  if (tokenFromUrl) {
    targetTokenAddress.value = tokenFromUrl;
    performAnalysis();
  }
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
</script>

<template>
  <div class="container">
    <h1>Solana 跟單地址篩選器 (Solana Copy Address Filter)</h1>

    <!-- 代幣地址輸入區域 -->
    <InputSection
      v-model="targetTokenAddress"
      :isLoading="isLoading"
      @analyze="performAnalysis"
    />

    <!-- 篩選條件區域 -->
    <FilterSection
      v-model:filterRangeSolSpentMin="filterRangeSolSpentMin"
      v-model:filterRangeSolSpentMax="filterRangeSolSpentMax"
      v-model:filterMinProfitSol="filterMinProfitSol"
      v-model:filterMinProfitPercent="filterMinProfitPercent"
      v-model:filterRangeHoldingMinutesMin="filterRangeHoldingMinutesMin"
      v-model:filterRangeHoldingMinutesMax="filterRangeHoldingMinutesMax"
      @clear-filters="handleClearFilters"
    />

    <!-- 載入訊息 -->
    <StatusMessage
      :message="loadingMessage"
      type="info"
      :show="!!loadingMessage"
    />

    <!-- 錯誤訊息 -->
    <StatusMessage
      :message="error"
      type="error"
      :show="!!error"
    />

    <!-- 結果表格 -->
    <ResultsTable
      v-if="showResults"
      :results="paginatedResults"
      :totalResults="analysisResults.length"
      :clickedAddresses="clickedAddresses"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @go-to-pnl="handleGoToAddressPnl"
      @mark-address-clicked="handleMarkAddressClicked"
    />

    <!-- 分頁控制 -->
    <PaginationControls
      v-if="showResults"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prev-page="prevPage"
      @next-page="nextPage"
      @go-to-page="goToPage"
    />

    <!-- 空狀態訊息 -->
    <StatusMessage
      v-if="showEmptyState"
      message="請輸入代幣地址並點擊分析按鈕。如果已分析但無結果，可能是該代幣沒有交易記錄或 API 未返回數據。"
      type="info"
      :show="true"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 1300px;
  margin: 20px auto;
  padding: 30px;
  background-color: var(--surface-color, #1e1f2e);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--card-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
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
  border-bottom: 1px solid var(--border-color, #374151);
  font-weight: 600;
  color: var(--text-color, #e8eaed);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
    margin: 10px;
  }
  
  h1 {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }
}
</style>