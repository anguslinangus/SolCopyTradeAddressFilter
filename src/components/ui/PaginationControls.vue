<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['prev-page', 'next-page', 'go-to-page'])

const handlePrevPage = () => {
  if (props.currentPage > 1) {
    emit('prev-page')
  }
}

const handleNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('next-page')
  }
}

const handleGoToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('go-to-page', page)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-controls">
    <button 
      @click="handlePrevPage" 
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      上一頁
    </button>
    
    <span class="pagination-info">
      第 {{ currentPage }} / {{ totalPages }} 頁
    </span>
    
    <button 
      @click="handleNextPage" 
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      下一頁
    </button>
  </div>
</template>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 25px 0;
  padding: 15px 0;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: var(--card-bg, #252640);
  color: var(--text-color, #e8eaed);
  border: 1px solid var(--border-color, #374151);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--secondary-color, #2a2b3d);
  border-color: var(--primary-color, #0ef6cc);
  color: var(--primary-color, #0ef6cc);
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  background-color: var(--surface-color, #1e1f2e);
  color: #6c757d;
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--text-secondary, #a1a1aa);
  padding: 0 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .pagination-controls {
    margin: 20px 0;
    gap: 8px;
  }
  
  .pagination-btn {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
  
  .pagination-info {
    padding: 0 8px;
    font-size: 0.85rem;
  }
}
</style> 