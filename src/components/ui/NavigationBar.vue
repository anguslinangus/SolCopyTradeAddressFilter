<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logoImage from '../../assets/madburger-logo-full.png'

const router = useRouter()
const route = useRoute()

// 導航狀態
const isMenuOpen = ref(false)
const isScrolled = ref(false)

// 導航選項
const navItems = [
  { name: '首頁', path: '/', id: 'home' },
  { name: '篩選器', path: '/analyzer', id: 'analyzer' }
]

// 處理滾動效果
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// 切換手機選單
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 導航到指定頁面
const navigateTo = (path) => {
  router.push(path)
  isMenuOpen.value = false // 關閉手機選單
}



// 生命週期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始檢查
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navigation-bar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      
      <!-- Logo/品牌區域 -->
      <div class="nav-brand" @click="navigateTo('/')">
        <img :src="logoImage" alt="MadBurger Logo" class="brand-logo-image" />
      </div>

      <!-- 桌面版導航選單 - 居中 -->
      <div class="nav-menu desktop-menu">
        <router-link 
          v-for="item in navItems" 
          :key="item.id"
          :to="item.path"
          class="nav-link"
          :class="{ 'active': route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- 手機選單按鈕 -->
      <div class="nav-actions">
        <!-- 手機版選單按鈕 -->
        <button @click="toggleMenu" class="mobile-menu-button" :class="{ 'active': isMenuOpen }">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

    </div>

    <!-- 手機版選單 -->
    <div class="mobile-menu" :class="{ 'open': isMenuOpen }">
      <div class="mobile-menu-content">
        <router-link 
          v-for="item in navItems" 
          :key="item.id"
          :to="item.path"
          @click="toggleMenu"
          class="mobile-nav-link"
          :class="{ 'active': route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* =============================================================================
 * Navigation Bar 樣式
 * ============================================================================= */

.navigation-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(26, 27, 38, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(58, 59, 77, 0.3);
  transition: all 0.3s ease;
}

.navigation-bar.scrolled {
  background-color: rgba(26, 27, 38, 0.95);
  border-bottom-color: rgba(58, 59, 77, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1300px; /* 與頁面內容對齊 */
  margin: 0 auto;
  padding: 0 30px;
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* 三等分：左-中-右 */
  align-items: center;
  height: 80px;
}

/* =============================================================================
 * 品牌 Logo 區域
 * ============================================================================= */

.nav-brand {
  grid-column: 1; /* 第一列：左邊 */
  justify-self: start; /* 左對齊 */
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-brand:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(14, 246, 204, 0.2);
}

.brand-logo-image {
  height: 56px;
  width: auto;
  object-fit: contain;
}

/* =============================================================================
 * 桌面版導航選單
 * ============================================================================= */

.desktop-menu {
  grid-column: 2; /* 第二列：中間 */
  justify-self: center; /* 居中對齊 */
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  position: relative;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--text-color);
}

.nav-link.active {
  color: var(--primary-color);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
}

/* =============================================================================
 * 操作按鈕區域
 * ============================================================================= */

.nav-actions {
  grid-column: 3; /* 第三列：右邊 */
  justify-self: end; /* 右對齊 */
  display: flex;
  align-items: center;
  gap: 16px;
}



/* =============================================================================
 * 手機版選單按鈕
 * ============================================================================= */

.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  gap: 4px;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background-color: var(--text-color);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.mobile-menu-button.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-button.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* =============================================================================
 * 手機版選單
 * ============================================================================= */

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: rgba(26, 27, 38, 0.98);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(58, 59, 77, 0.3);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-menu.open {
  max-height: 300px;
}

.mobile-menu-content {
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-link {
  font-family: var(--font-family);
  font-size: 18px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid rgba(58, 59, 77, 0.2);
  transition: color 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  color: var(--primary-color);
}



/* =============================================================================
 * 響應式設計
 * ============================================================================= */

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px; /* 與頁面內容對齊 */
    height: 70px;
    grid-template-columns: 1fr auto; /* 手機版：左-右兩列 */
  }
  
  .nav-brand {
    grid-column: 1; /* 保持在第一列 */
    padding: 4px 8px; /* 手機版更緊湊 */
  }
  
  .desktop-menu {
    display: none;
  }
  
  .nav-actions {
    grid-column: 2; /* 移到第二列 */
  }
  
  .mobile-menu-button {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .brand-logo-image {
    height: 44px;
  }
}
</style> 