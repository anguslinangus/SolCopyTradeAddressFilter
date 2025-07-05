<script setup>
const props = defineProps({
  filterRangeSolSpentMin: {
    type: Number,
    default: null
  },
  filterRangeSolSpentMax: {
    type: Number,
    default: null
  },
  filterMinProfitSol: {
    type: Number,
    default: null
  },
  filterMinProfitPercent: {
    type: Number,
    default: null
  },
  filterRangeHoldingMinutesMin: {
    type: Number,
    default: null
  },
  filterRangeHoldingMinutesMax: {
    type: Number,
    default: null
  }
})

const emit = defineEmits([
  'update:filterRangeSolSpentMin',
  'update:filterRangeSolSpentMax',
  'update:filterMinProfitSol',
  'update:filterMinProfitPercent',
  'update:filterRangeHoldingMinutesMin',
  'update:filterRangeHoldingMinutesMax',
  'clear-filters'
])

const handleClearFilters = () => {
  emit('clear-filters')
}
</script>

<template>
  <div class="filters card">
    <h3>篩選條件</h3>
    
    <div class="filter-grid">
      <!-- 買入 SOL 範圍 -->
      <div class="filter-item">
        <label>買入 SOL:</label>
        <div class="filter-inputs">
          <input 
            type="number" 
            min="0" 
            :value="filterRangeSolSpentMin"
            @input="$emit('update:filterRangeSolSpentMin', $event.target.value ? Number($event.target.value) : null)"
            placeholder="最少"
          />
          <span>-</span>
          <input 
            type="number" 
            min="0" 
            :value="filterRangeSolSpentMax"
            @input="$emit('update:filterRangeSolSpentMax', $event.target.value ? Number($event.target.value) : null)"
            placeholder="最多"
          />
          <span>SOL</span>
        </div>
      </div>

      <!-- 利潤 SOL -->
      <div class="filter-item">
        <label>利潤 (SOL):</label>
        <div class="filter-inputs">
          <input 
            type="number" 
            :value="filterMinProfitSol"
            @input="$emit('update:filterMinProfitSol', $event.target.value ? Number($event.target.value) : null)"
            placeholder="至少"
          />
          <span>SOL</span>
        </div>
      </div>

      <!-- 回報率 -->
      <div class="filter-item">
        <label>回報率 (%):</label>
        <div class="filter-inputs">
          <input 
            type="number" 
            min="0" 
            :value="filterMinProfitPercent"
            @input="$emit('update:filterMinProfitPercent', $event.target.value ? Number($event.target.value) : null)"
            placeholder="至少"
          />
          <span>%</span>
        </div>
      </div>

      <!-- 持有時間 -->
      <div class="filter-item">
        <label>持有時間:</label>
        <div class="filter-inputs">
          <input 
            type="number" 
            min="0" 
            :value="filterRangeHoldingMinutesMin"
            @input="$emit('update:filterRangeHoldingMinutesMin', $event.target.value ? Number($event.target.value) : null)"
            placeholder="最少"
          />
          <span>-</span>
          <input 
            type="number" 
            min="0" 
            :value="filterRangeHoldingMinutesMax"
            @input="$emit('update:filterRangeHoldingMinutesMax', $event.target.value ? Number($event.target.value) : null)"
            placeholder="最多"
          />
          <span>分鐘</span>
        </div>
      </div>
    </div>

    <button @click="handleClearFilters" class="clear-button">
      清除篩選
    </button>
  </div>
</template>

<style scoped>
.filters {
  background-color: var(--card-bg, #252640);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--card-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
  padding: 25px;
  margin-bottom: 35px;
  border: 1px solid var(--border-color, #374151);
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color, #374151);
  padding-bottom: 10px;
  font-size: 1.15rem;
  color: var(--text-secondary, #a1a1aa);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--surface-color, #1e1f2e);
  padding: 15px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #374151);
  gap: 15px;
}

.filter-item label {
  font-weight: 500;
  color: var(--text-secondary, #a1a1aa);
  white-space: nowrap;
  min-width: fit-content;
  padding-right: 10px;
}

.filter-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.filter-item input[type="number"] {
  flex: 1;
  min-width: 70px;
  max-width: 100px;
  padding: 6px 8px;
  border: 1px solid var(--border-color, #374151);
  border-radius: 4px;
  background-color: #2a2b3d;
  color: var(--text-color, #e8eaed);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-item input[type="number"]:focus {
  outline: none;
  border-color: var(--primary-color, #0ef6cc);
  background-color: #3a3b4d;
  box-shadow: 0 0 0 1px rgba(14, 246, 204, 0.1);
}

.filter-item input[type="number"]::placeholder {
  color: var(--text-secondary, #a1a1aa);
  font-size: 0.85rem;
}

.filter-item span {
  color: var(--text-secondary, #a1a1aa);
  font-size: 0.9rem;
  font-weight: 500;
  flex-shrink: 0;
}

.clear-button {
  background-color: var(--secondary-color, #2a2b3d);
  color: var(--text-color, #e8eaed);
  border: 1px solid var(--border-color, #374151);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.clear-button:hover {
  background-color: #3a3b4d;
  border-color: var(--primary-color, #0ef6cc);
  color: var(--primary-color, #0ef6cc);
  transform: translateY(-1px);
}

/* 隱藏數字輸入的箭頭 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 響應式設計 */
/* 大螢幕：4 列布局 */
@media (min-width: 1400px) {
  .filter-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 中大螢幕：保持 2 列布局（預設） */
@media (min-width: 769px) and (max-width: 1399px) {
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 小螢幕：1 列布局 */
@media (max-width: 768px) {
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
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
}
</style> 