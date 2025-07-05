<script setup>
import AddressActions from './AddressActions.vue'

const props = defineProps({
  results: {
    type: Array,
    required: true
  },
  totalResults: {
    type: Number,
    default: 0
  },
  clickedAddresses: {
    type: Set,
    default: () => new Set()
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['go-to-pnl', 'mark-address-clicked'])

const handleGoToPnl = (address) => {
  emit('go-to-pnl', address)
}

const handleMarkClicked = (address) => {
  emit('mark-address-clicked', address)
}

// 格式化利潤顏色
const getProfitColor = (value) => {
  return value >= 0 ? 'var(--profit-color, #56d364)' : 'var(--loss-color, #f85149)'
}

// 格式化百分比
const formatPercent = (value) => {
  return value !== null ? `${value.toFixed(2)}%` : 'N/A'
}
</script>

<template>
  <div v-if="results.length > 0" class="results-area card">
    <h2>
      篩選結果 ({{ results.length }} / {{ totalResults }} 符合條件)
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
        <tbody>
          <tr 
            v-for="item in results" 
            :key="item.address" 
            :class="{ 'clicked-row': clickedAddresses.has(item.address) }"
          >
            <td>
              <AddressActions
                :address="item.address"
                :isClicked="clickedAddresses.has(item.address)"
                @go-to-pnl="handleGoToPnl"
                @mark-clicked="handleMarkClicked"
              />
            </td>
            <td>{{ item.solSpent.toFixed(3) }}</td>
            <td>{{ item.solReceived.toFixed(3) }}</td>
            <td :style="{ color: getProfitColor(item.realizedProfit) }">
              {{ item.realizedProfit.toFixed(3) }}
            </td>
            <td :style="{ color: getProfitColor(item.profitPercent || 0) }">
              {{ formatPercent(item.profitPercent) }}
            </td>
            <td>{{ item.holdingDuration }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  <div v-else class="no-results">
    <p>沒有符合目前篩選條件的結果。</p>
  </div>
</template>

<style scoped>
.results-area {
  background-color: var(--card-bg, #252640);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--card-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
  padding: 25px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color, #374151);
}

h2 {
  margin-top: 0;
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
  color: var(--text-secondary, #a1a1aa);
  font-weight: normal;
  margin-left: 15px;
}

.table-responsive {
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 6px;
  border: 1px solid var(--border-color, #374151);
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--surface-color, #1e1f2e);
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color, #374151);
}

th {
  background-color: var(--secondary-color, #2a2b3d);
  color: var(--text-secondary, #a1a1aa);
  font-weight: 600;
  font-size: 0.9rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

td {
  color: var(--text-color, #e8eaed);
  font-size: 0.9rem;
}

tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.clicked-row {
  background-color: rgba(14, 246, 204, 0.05) !important;
  border-left: 3px solid var(--primary-color, #0ef6cc);
}

.clicked-row:hover {
  background-color: rgba(14, 246, 204, 0.08) !important;
}

.no-results {
  text-align: center;
  padding: 40px;
  background-color: var(--card-bg, #252640);
  border-radius: var(--border-radius, 8px);
  border: 1px solid var(--border-color, #374151);
  margin: 20px 0;
}

.no-results p {
  color: var(--text-secondary, #a1a1aa);
  font-size: 1rem;
  margin: 0;
}

/* 確保表格在小螢幕上可以捲動 */
@media (max-width: 768px) {
  .results-area {
    padding: 15px;
  }
  
  .table-responsive {
    font-size: 0.85rem;
    margin: 15px 0;
  }
  
  th,
  td {
    padding: 10px 8px;
  }
  
  td:first-child,
  th:first-child {
    min-width: 100px;
  }
  
  h2 {
    font-size: 1.3rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  h2 span {
    margin-left: 0;
    font-size: 0.9rem;
  }
}

/* 深色主題優化 */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--secondary-color, #2a2b3d);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color, #374151);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color, #0ef6cc);
}
</style> 