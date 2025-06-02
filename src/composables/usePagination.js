import { ref, computed, watch } from 'vue';
import { DEFAULT_ITEMS_PER_PAGE } from '../constants';

export function usePagination(resultsRef) { // resultsRef 應為篩選後的結果
  const currentPage = ref(1);
  const itemsPerPage = ref(DEFAULT_ITEMS_PER_PAGE);

  const totalPages = computed(() => {
    if (!resultsRef.value) return 1;
    return Math.ceil(resultsRef.value.length / itemsPerPage.value);
  });

  const paginatedResults = computed(() => {
    if (!resultsRef.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return resultsRef.value.slice(start, end);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
      currentPage.value = pageNumber;
    }
  };

  // 當總頁數變化 (例如篩選結果數量改變)，確保當前頁碼有效
  watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages && newTotalPages > 0) {
      currentPage.value = newTotalPages;
    } else if (newTotalPages === 0) {
        currentPage.value = 1; // 如果沒有結果，回到第一頁
    }
  });

  // 當 itemsPerPage 改變時，可能需要重置頁碼或調整
  watch(itemsPerPage, () => {
      currentPage.value = 1; // 或者更複雜的邏輯來保持用戶在相似的數據位置
  });


  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedResults,
    nextPage,
    prevPage,
    goToPage
  };
}