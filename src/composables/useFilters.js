import { ref, computed } from 'vue';
import { parseDurationToMinutes } from '../utils/helpers';

export function useFilters(analysisResultsRef) {
  const filterRangeSolSpentMin = ref(null);
  const filterRangeSolSpentMax = ref(null);
  const filterMinProfitSol = ref(null);
  const filterMinProfitPercent = ref(null);
  const filterRangeHoldingMinutesMin = ref(null);
  const filterRangeHoldingMinutesMax = ref(null);

  const clearFilters = () => {
    filterRangeSolSpentMin.value = null;
    filterRangeSolSpentMax.value = null;
    filterMinProfitSol.value = null;
    filterMinProfitPercent.value = null;
    filterRangeHoldingMinutesMin.value = null;
    filterRangeHoldingMinutesMax.value = null;
    // currentPage.value = 1; // currentPage 的重置應由 usePagination 或主邏輯處理
  };

  const filteredResults = computed(() => {
    if (!analysisResultsRef.value || analysisResultsRef.value.length === 0) return [];
    return analysisResultsRef.value.filter(item => {
      const solSpentMin = filterRangeSolSpentMin.value;
      const solSpentMax = filterRangeSolSpentMax.value;
      if (solSpentMin !== null && typeof solSpentMin === 'number' && item.solSpent < solSpentMin) return false;
      if (solSpentMax !== null && typeof solSpentMax === 'number' && item.solSpent > solSpentMax) return false;

      if (filterMinProfitSol.value !== null && typeof filterMinProfitSol.value === 'number' && item.realizedProfit < filterMinProfitSol.value) return false;

      if (filterMinProfitPercent.value !== null && typeof filterMinProfitPercent.value === 'number' && (item.profitPercent === null || item.profitPercent < filterMinProfitPercent.value)) return false;

      const holdingMinutes = parseDurationToMinutes(item.holdingDurationSeconds);
      const holdingMinutesMin = filterRangeHoldingMinutesMin.value;
      const holdingMinutesMax = filterRangeHoldingMinutesMax.value;

      if (holdingMinutes !== null) { // 有明確的持有時間
        if (holdingMinutesMin !== null && typeof holdingMinutesMin === 'number' && holdingMinutes < holdingMinutesMin) return false;
        if (holdingMinutesMax !== null && typeof holdingMinutesMax === 'number' && holdingMinutes > holdingMinutesMax) return false;
      } else { // holdingMinutes is null (e.g. N/A)
        // 如果篩選條件有設定持有時間上下限，但交易本身沒有持有時間數據，則不符合
        if ((holdingMinutesMin !== null && typeof holdingMinutesMin === 'number') || (holdingMinutesMax !== null && typeof holdingMinutesMax === 'number')) {
            return false;
        }
      }
      return true;
    });
  });

  return {
    filterRangeSolSpentMin,
    filterRangeSolSpentMax,
    filterMinProfitSol,
    filterMinProfitPercent,
    filterRangeHoldingMinutesMin,
    filterRangeHoldingMinutesMax,
    clearFilters,
    filteredResults
  };
}