import { createRouter, createWebHistory } from 'vue-router'

// =============================================================================
// 第六課：路由配置和延遲載入 (Lazy Loading)
// =============================================================================

// 為什麼使用 Lazy Loading？
// 1. 提升初始載入速度
// 2. 程式碼分割 (Code Splitting)
// 3. 按需載入資源
// 4. 更好的用戶體驗

// 延遲載入組件 - 只在需要時載入
const LandingPage = () => import('../pages/LandingPage.vue')
const TokenAnalyzerPage = () => import('../pages/TokenAnalyzerPage.vue')
const AddressPnlPage = () => import('../pages/AddressPnlPage.vue')

const routes = [
  {
    // 首頁：Landing Page
    path: '/',
    name: 'Home',
    component: LandingPage,
    meta: {
      title: 'Solana Copy Trading Platform - Find Top Traders',
      description: 'Discover and copy the best Solana traders with real-time data and advanced filtering.'
    }
  },
  {
    // 分析器頁面
    path: '/analyzer',
    name: 'TokenAnalyzer', 
    component: TokenAnalyzerPage,
    meta: {
      title: 'Token Analyzer - Solana Copy Trading',
      description: 'Analyze token holders and find profitable trading addresses on Solana.'
    }
  },
  {
    // 地址 PNL 分析頁面
    path: '/address/:address',
    name: 'AddressPnl',
    component: AddressPnlPage,
    props: true, // 將路由參數作為 props 傳遞給組件
    meta: {
      title: 'Address PNL Analysis - Solana Copy Trading',
      description: 'Detailed profit and loss analysis for Solana trading addresses.'
    }
  },
  {
    // 404 頁面重導向
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 路由配置
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory('/SolCopyTradeAddressFilter/'),
  routes,
  
  // 滾動行為：切換頁面時回到頂部
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（如使用瀏覽器返回按鈕）
    if (savedPosition) {
      return savedPosition
    }
    // 否則滾動到頂部
    return { top: 0 }
  }
})

// 全域路由守衛 (Navigation Guards)
// 在每次路由切換前執行
router.beforeEach((to, from, next) => {
  // 載入指示器 (可選)
  console.log(`Navigating from ${from.path} to ${to.path}`)
  
  // 繼續導航
  next()
})

// 設置頁面標題和 meta 標籤
router.afterEach((to) => {
  // 設置頁面標題
  document.title = to.meta.title || 'Solana Copy Trading Platform'
  
  // 設置 meta description (SEO 優化)
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description || 'Advanced Solana trading analysis platform')
  }
})

export default router 