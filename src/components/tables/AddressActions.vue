<script setup>
import { computed } from 'vue'

const props = defineProps({
  address: {
    type: String,
    required: true
  },
  isClicked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['go-to-pnl', 'mark-clicked'])

// 格式化地址顯示
const displayAddress = computed(() => {
  return `${props.address.substring(0, 6)}...${props.address.substring(props.address.length - 4)}`
})

const handlePnlClick = () => {
  emit('go-to-pnl', props.address)
}

const handleGmgnClick = () => {
  emit('mark-clicked', props.address)
}
</script>

<template>
  <div class="address-actions">
    <span class="address-display">
      {{ displayAddress }}
    </span>
    
    <button 
      @click="handlePnlClick"
      class="pnl-button"
      title="查看地址 PNL 分析"
    >
      PNL
    </button>
    
    <a
      @click="handleGmgnClick"
      :href="`https://gmgn.ai/sol/address/${address}`"
      target="_blank"
      class="gmgn-link"
      :title="`在 GmGn 上查看 ${address}`"
    >
      GmGn↗
    </a>
  </div>
</template>

<style scoped>
.address-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.address-display {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-color, #e8eaed);
  flex-shrink: 0;
}

.pnl-button {
  background-color: var(--primary-color, #0ef6cc);
  color: #1a1b26;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.pnl-button:hover {
  background-color: var(--primary-hover, #0bd9b3);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(14, 246, 204, 0.2);
}

.gmgn-link {
  color: #58a6ff !important;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 6px;
  border: 1px solid #58a6ff;
  border-radius: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.gmgn-link:hover {
  background-color: #58a6ff;
  color: #1a1b26 !important;
  text-decoration: none !important;
  transform: translateY(-1px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .address-actions {
    gap: 6px;
  }
  
  .address-display {
    font-size: 0.85rem;
  }
  
  .pnl-button,
  .gmgn-link {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}
</style> 