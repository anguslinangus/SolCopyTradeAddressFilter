<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 從路由參數取得地址
const currentAddress = computed(() => route.params.address)

// 格式化地址顯示
const displayAddress = computed(() => {
  const addr = currentAddress.value
  return addr ? `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}` : ''
})

// 返回按鈕
const goBack = () => {
  const tokenAddress = route.query.token  // 讀取查詢參數中的代幣地址
  if (tokenAddress) {
    // 如果有代幣地址，帶著它返回首頁
    router.push({ path: '/', query: { token: tokenAddress } })
  } else {
    // 沒有的話就正常返回
    router.push('/')
  }
}
</script>

<template>
  <div class="address-pnl-page">
    <div class="page-header">
      <button @click="goBack" class="back-button">
        ← 返回篩選器
      </button>
      <h1>地址 PNL 分析</h1>
    </div>
    
    <div class="address-info">
      <h2>分析地址：{{ displayAddress }}</h2>
      <p>完整地址：{{ currentAddress }}</p>
    </div>
    
    <div class="placeholder">
      <p>🚧 PNL 分析功能建構中...</p>
      <p>我們將在這裡顯示過去 14 天的累積 PNL 資料</p>
    </div>
  </div>
</template>

<style scoped>
.address-pnl-page {
  max-width: 1300px;
  margin: 100px auto 20px; /* 頂部留出導航欄空間 */
  padding: 30px;
  background-color: var(--surface-color, #1e1f2e);
  border-radius: 8px;
  color: var(--text-color, #e8eaed);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .address-pnl-page {
    margin: 90px 10px 10px; /* 手機版調整 */
    padding: 20px;
  }
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color, #374151);
}

.back-button {
  background-color: var(--secondary-color, #2a2b3d);
  color: var(--text-color, #e8eaed);
  border: 1px solid var(--border-color, #374151);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #3a3b4d;
  transform: translateY(-1px);
}

h1 {
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(45deg, #0ef6cc, #58a6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.address-info {
  background-color: var(--card-bg, #252640);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color, #374151);
}

.address-info h2 {
  margin-top: 0;
  color: var(--text-color, #e8eaed);
}

.address-info p {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-secondary, #a1a1aa);
  word-break: break-all;
}

.placeholder {
  background-color: var(--card-bg, #252640);
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--border-color, #374151);
}

.placeholder p {
  margin: 10px 0;
  color: var(--text-secondary, #a1a1aa);
}

.placeholder p:first-child {
  font-size: 1.2rem;
  color: var(--text-color, #e8eaed);
}
</style> 