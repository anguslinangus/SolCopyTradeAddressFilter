import { createRouter, createWebHistory } from 'vue-router'
import TokenAnalyzerPage from '../pages/TokenAnalyzerPage.vue'
import AddressPnlPage from '../pages/AddressPnlPage.vue'

const routes = [
  {
    path: '/',
    name: 'TokenAnalyzer',
    component: TokenAnalyzerPage,
    meta: {
      title: 'Token Analyzer'
    }
  },
  {
    path: '/address/:address',
    name: 'AddressPnl',
    component: AddressPnlPage,
    props: true,
    meta: {
      title: 'Address PNL Analysis'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/SolCopyTradeAddressFilter/'),
  routes
})

// 設置頁面標題
router.afterEach((to) => {
  document.title = to.meta.title || 'Solana Address Filter'
})

export default router 