<script setup>
// 引入背景圖片
import heroBackground from '../assets/hero-background.png'
// 引入 Vue Router
import { useRouter } from 'vue-router'
// 引入 Core Features 圖標
import SmartFilteringIcon from '../assets/feature-icon-1.svg'
import RealTimeDataIcon from '../assets/feature-icon-2.svg'
import PerformanceTrackingIcon from '../assets/feature-icon-3.svg'
import SecureReliableIcon from '../assets/feature-icon-4.svg'
// 引入 How It Works 步驟圖標
import ConnectWalletIcon from '../assets/how-it-works-icon-1.svg'
import FilterTradersIcon from '../assets/how-it-works-icon-2.svg'
import CopyTradesIcon from '../assets/how-it-works-icon-3.svg'
// 引入社交媒體圖標
import TwitterIcon from '../assets/footer-social-icon-1.svg'
import DiscordIcon from '../assets/footer-social-icon-2.svg'

// 初始化路由器
const router = useRouter()

// 導航到分析器頁面
const navigateToAnalyzer = () => {
  router.push('/analyzer')
}
</script>

<template>
  <!-- 主要內容區域 - 統一寬度 -->
  <div class="landing-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>追蹤分析 <span class="highlight">Solana 頂級交易者</span> 的獲利策略</h1>
        <p>發掘 Solana 鏈上高收益交易者，透過地址篩選與盈虧分析，掌握致勝投資策略</p>
        <button @click="navigateToAnalyzer" class="cta-button">
          免費分析你的第一個地址
        </button>
      </div>
    </div>
    
    <div class="hero-note">
      <p>無需註冊 • 即時數據來源 Solana Tracker API</p>
    </div>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="features-header">
          <h2 class="features-title">核心功能</h2>
          <p class="features-subtitle">
            探索我們平台的強大功能，成為您 Solana 鏈上交易分析的最佳選擇
          </p>
        </div>
        <div class="features-grid">
          
          <!-- Smart Filtering Feature -->
          <div class="feature-card">
            <div class="feature-icon smart-filtering-icon">
              <img :src="SmartFilteringIcon" alt="Smart Filtering" class="feature-icon-svg" />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">智能篩選系統，精準鎖定高收益地址</h3>
              <p class="feature-description">
                透過地址、績效指標等多維度篩選，快速找出最符合您策略的交易者。支援 ROI > 200%、交易量等多種篩選條件。
              </p>
            </div>
          </div>

          <!-- Real-Time Data Feature -->
          <div class="feature-card">
            <div class="feature-icon real-time-data-icon">
              <img :src="RealTimeDataIcon" alt="Real-Time Data" class="feature-icon-svg" />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">即時數據分析</h3>
              <p class="feature-description">
                獲取即時交易數據與深度洞察，讓您的投資決策更加精準明智。
              </p>
            </div>
          </div>

          <!-- Performance Tracking Feature -->
          <div class="feature-card">
            <div class="feature-icon performance-tracking-icon">
              <img :src="PerformanceTrackingIcon" alt="Performance Tracking" class="feature-icon-svg" />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">績效追蹤分析</h3>
              <p class="feature-description">
                追蹤頂級交易者的績效表現，深入分析他們的投資策略與盈虧模式。
              </p>
            </div>
          </div>

          <!-- Secure & Reliable Feature -->
          <div class="feature-card">
            <div class="feature-icon secure-reliable-icon">
              <img :src="SecureReliableIcon" alt="Secure & Reliable" class="feature-icon-svg" />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">安全可靠</h3>
              <p class="feature-description">
                我們的平台確保安全可靠地存取 Solana 交易數據，保護您的隱私與資訊安全。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section - 按照 Figma 設計 -->
    <section class="how-it-works-section">
      <div class="container">
        <div class="how-it-works-header">
          <h2 class="how-it-works-title">使用方式</h2>
        </div>
        <div class="process-steps-container">
          
          <!-- Connect Wallet Step -->
          <div class="process-step">
            <div class="process-icon-container">
              <div class="process-icon">
                <img :src="ConnectWalletIcon" alt="Connect Your Wallet" class="process-icon-svg" />
              </div>
            </div>
            <div class="process-content">
              <h3 class="process-title">輸入分析地址</h3>
              <p class="process-description">輸入您想要分析的 Solana 地址，開始深度分析之旅。</p>
            </div>
          </div>

          <!-- Filter Traders Step -->
          <div class="process-step">
            <div class="process-icon-container">
              <div class="process-icon">
                <img :src="FilterTradersIcon" alt="Filter Top Traders" class="process-icon-svg" />
              </div>
            </div>
            <div class="process-content">
              <h3 class="process-title">篩選頂級交易者</h3>
              <p class="process-description">使用我們的進階篩選功能，按地址找出最具獲利能力的交易者。</p>
            </div>
          </div>

          <!-- Copy Trades Step -->
          <div class="process-step">
            <div class="process-icon-container">
              <div class="process-icon">
                <img :src="CopyTradesIcon" alt="Copy Trades" class="process-icon-svg" />
              </div>
            </div>
            <div class="process-content">
              <h3 class="process-title">查看分析結果</h3>
              <p class="process-description">獲得詳細的盈虧分析、交易記錄與績效指標，制定您的投資策略。</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Data Display Section - 按照 Figma 設計 -->
    <section class="data-display-section">
      <div class="container">
        <div class="data-display-header">
          <h2 class="data-display-title">平台數據</h2>
        </div>
        <div class="statistics-grid">
          
          <!-- Total Traders Statistics -->
          <div class="statistics-card">
            <div class="statistics-label">已分析地址</div>
            <div class="statistics-value">1,500+</div>
          </div>

          <!-- Active Users Statistics -->
          <div class="statistics-card">
            <div class="statistics-label">活躍用戶</div>
            <div class="statistics-value">500+</div>
          </div>

          <!-- Average Success Rate Statistics -->
          <div class="statistics-card">
            <div class="statistics-label">平均獲利率</div>
            <div class="statistics-value">15%</div>
          </div>

        </div>
      </div>
    </section>

    <!-- API Data Source Disclaimer -->
    <div class="api-data-source">
      <p>數據來源：Solana Tracker API</p>
    </div>

    <!-- Main Footer - 按照 Figma 設計 -->
    <footer class="main-footer">
      <div class="container">
        
        <!-- Legal & Navigation Links -->
        <div class="footer-navigation">
          <div class="footer-navigation-item">
            <a href="#" class="footer-navigation-link">服務條款</a>
          </div>
          <div class="footer-navigation-item">
            <a href="#" class="footer-navigation-link">隱私政策</a>
          </div>
          <div class="footer-navigation-item">
            <a href="#" class="footer-navigation-link">聯絡我們</a>
          </div>
        </div>

        <!-- Social Media Links -->
        <div class="social-media-links">
          <a href="#" class="social-media-link">
            <img :src="TwitterIcon" alt="Follow us on Twitter" class="social-media-icon" />
          </a>
          <a href="#" class="social-media-link">
            <img :src="DiscordIcon" alt="Join our Discord" class="social-media-icon" />
          </a>
        </div>

        <!-- Copyright Information -->
        <div class="copyright-notice">
          <p>© 2024 MadBurger. All rights reserved.</p>
        </div>

      </div>
    </footer>
  </div>
</template>

<style scoped>
/* =============================================================================
 * 統一寬度容器
 * ============================================================================= */

.landing-page {
  background-color: var(--secondary-color);
  min-height: 100vh;
}

/* 統一容器樣式 */
.hero-section,
.features-section .container,
.how-it-works-section .container,
.data-display-section .container {
  max-width: 1300px; /* 與TokenAnalyzerPage一致 */
  margin: 0 auto;
  padding: 0 30px; /* 與TokenAnalyzerPage一致 */
}

/* 統一容器內部類別 */
.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
}

/* =============================================================================
 * Hero Section 樣式 - 寬度統一
 * ============================================================================= */

.hero-section {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
    url('../assets/hero-background.png');
  background-size: cover;
  background-position: center;
  padding: 100px 40px; /* 保持內部 padding */
  color: var(--text-color);
  min-height: 480px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.highlight {
  color: var(--primary-color);
}

.hero-content {
  max-width: 800px;
  text-align: center;
}

.hero-content h1 {
  margin-bottom: 1.5rem;
}

.hero-content p {
  margin: 1rem 0;
}

.hero-content button {
  margin: 2rem 0 1rem 0;
}

.hero-note {
  text-align: center;
  padding: 12px 16px;
  max-width: 1300px; /* 統一寬度 */
  margin: 0 auto;
}

.hero-note p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 按鈕基礎樣式 */
button, .cta-button {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 16px 32px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 按鈕 hover 效果 */
.cta-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 按鈕 active 效果 */
.cta-button:active {
  transform: translateY(0);
}

/* =============================================================================
 * Features Section 樣式 - 寬度統一 + Figma 圖標
 * ============================================================================= */

.features-section {
  background-color: var(--secondary-color); /* 與項目一致的深色背景 */
  padding: 40px 0;
}

.features-header {
  text-align: left; /* Figma 設計是左對齊 */
  padding: 20px 16px 24px; /* 與其他 section 標題對齊 */
}

.features-title {
  font-family: var(--font-family); /* 使用項目字體變數 */
  font-size: 36px; /* Figma: 36px */
  font-weight: 700; /* Figma: 700 */
  line-height: 1.25; /* Figma: 1.25em */
  letter-spacing: -0.027em; /* Figma: -2.78% */
  color: var(--text-color); /* 使用項目文字色彩變數 */
  margin-bottom: 16px; /* Figma gap: 16px */
  max-width: 720px; /* Figma width: 720px */
}

.features-subtitle {
  font-family: var(--font-family); /* 使用項目字體變數 */
  font-size: 16px; /* Figma: 16px */
  font-weight: 400; /* Figma: 400 */
  line-height: 1.5; /* Figma: 1.5em */
  color: var(--text-color); /* 使用項目文字色彩變數 */
  margin: 0;
  max-width: 720px; /* Figma width: 720px */
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4個卡片並排，等寬 */
  gap: 12px; /* Figma gap: 12px */
  margin: 0;
  padding: 0 16px; /* 與標題對齊 */
}

/* 功能卡片樣式 - 完全按照 Figma + 色調一致 */
.feature-card {
  background-color: var(--surface-color); /* 與項目一致的卡片背景 */
  border: 1px solid var(--border-color); /* 使用項目邊框色彩變數 */
  border-radius: var(--border-radius); /* 使用項目圓角變數 */
  padding: 16px; /* Figma: 16px */
  display: flex;
  flex-direction: column;
  gap: 12px; /* Figma gap: 12px */
  transition: all 0.3s ease;
  box-shadow: var(--card-shadow); /* 使用項目陰影變數 */
}

.feature-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 246, 204, 0.1); /* 主色調的淡陰影 */
}

/* SVG 圖標樣式 */
.feature-icon {
  width: 40px; /* 與原設計一致 */
  height: 40px;
  flex-shrink: 0;
  background-color: rgba(14, 246, 204, 0.1); /* 主色調的淡背景 */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(14, 246, 204, 0.3);
}

.feature-card:hover .feature-icon {
  background-color: rgba(14, 246, 204, 0.2);
  transform: scale(1.05);
}

/* Feature Icons Styling */
.feature-icon-svg {
  width: 24px; /* Figma: 24x24px */
  height: 24px;
  filter: brightness(0) saturate(100%) invert(74%) sepia(38%) saturate(3138%) hue-rotate(126deg) brightness(101%) contrast(102%);
  /* 這個 filter 會將白色 SVG 轉換為項目主色調 #0ef6cc */
}

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Figma gap: 4px */
}

.feature-title {
  font-family: var(--font-family); /* 使用項目字體變數 */
  font-size: 16px; /* Figma: 16px */
  font-weight: 700; /* Figma: 700 */
  line-height: 1.25; /* Figma: 1.25em */
  color: var(--text-color); /* 使用項目文字色彩變數 */
  margin: 0;
}

.feature-description {
  font-family: var(--font-family); /* 使用項目字體變數 */
  font-size: 14px; /* Figma: 14px */
  font-weight: 400; /* Figma: 400 */
  line-height: 1.5; /* Figma: 1.5em */
  color: var(--text-secondary); /* 使用項目次要文字色彩變數 */
  margin: 0;
}

/* =============================================================================
 * How It Works Section 樣式 - 完全按照 Figma 設計
 * ============================================================================= */

.how-it-works-section {
  background-color: var(--bg-color);
  padding: 40px 0;
}

.how-it-works-header {
  padding: 20px 16px 24px;
  text-align: left;
}

.how-it-works-title {
  font-family: var(--font-family);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2727272727272727;
  color: var(--text-color);
  margin: 0;
  letter-spacing: 1.5px;
}

.process-steps-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 16px; /* 與標題對齊 */
}

.process-step {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
}

.process-step:last-child {
  margin-bottom: 0;
}

.process-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  flex-shrink: 0;
  padding: 12px 0 0 0;
  margin-right: 20px;
}

.process-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.process-icon-svg {
  width: 24px;
  height: 24px;
  /* 白色 SVG，不需要 filter */
}

.process-content {
  flex: 1;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.process-title {
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--text-color);
  margin: 0;
  letter-spacing: 1px;
}

.process-description {
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #A3B2AD;
  margin: 0;
  letter-spacing: 1px;
}
  
  /* =============================================================================
   * Data Display Section 樣式 - 完全按照 Figma 設計
   * ============================================================================= */
  
  .data-display-section {
    background-color: var(--bg-color);
    padding: 40px 0;
  }
  
  .data-display-header {
    padding: 20px 16px 24px;
    text-align: left;
  }
  
  .data-display-title {
    font-family: var(--font-family);
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2727272727272727;
    color: #FFFFFF;
    margin: 0;
  }
  
  .statistics-grid {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px; /* 與標題對齊 */
  }
  
  .statistics-card {
    background-color: #2B3633;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }
  
  .statistics-label {
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    color: #FFFFFF;
    text-align: left;
    margin: 0;
  }
  
  .statistics-value {
    font-family: var(--font-family);
    font-size: 24px;
    font-weight: 700;
    line-height: 1.25;
    color: #FFFFFF;
    text-align: left;
    margin: 0;
  }
  
    /* =============================================================================
   * API Data Source Disclaimer 樣式 - 完全按照 Figma 設計
   * ============================================================================= */
  
  .api-data-source {
    background-color: var(--bg-color);
    padding: 4px 16px 12px;
    text-align: center;
    max-width: 1300px;
    margin: 0 auto;
  }
  
  .api-data-source p {
    font-family: var(--font-family);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #A3B2AD;
    text-align: center;
    margin: 0;
    letter-spacing: 1.25px;
  }
  
  /* =============================================================================
   * Main Footer 樣式 - 完全按照 Figma 設計
   * ============================================================================= */
  
  .main-footer {
    background-color: var(--bg-color);
    padding: 40px 20px;
    max-width: 1300px;
    margin: 0 auto;
  }
  
  .main-footer .container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: stretch;
    padding: 0; /* 重置 padding，因為 main-footer 已經設定了 */
  }
  
  /* Legal & Navigation Links */
  .footer-navigation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }
  
  .footer-navigation-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 160px;
  }
  
  .footer-navigation-link {
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #A3B2AD;
    text-align: center;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-navigation-link:hover {
    color: var(--primary-color);
  }
  
  /* Social Media Links */
  .social-media-links {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .social-media-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
  }
  
  .social-media-link:hover {
    transform: scale(1.1);
  }
  
  .social-media-icon {
    width: 24px;
    height: 24px;
    /* 圖標已經是灰色，不需要 filter */
  }
  
  /* Copyright Information */
  .copyright-notice {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .copyright-notice p {
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #A3B2AD;
    text-align: center;
    margin: 0;
    letter-spacing: 1.25px;
  }
  
  /* 響應式設計：小螢幕時改為堆疊 */
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr; /* 小螢幕時改為單列 */
      gap: 16px;
    }
    
    .statistics-grid {
      flex-direction: column; /* 小螢幕時改為垂直排列 */
    }
    
    .footer-navigation {
      flex-direction: column; /* 小螢幕時改為垂直排列 */
      gap: 16px;
    }
    
    .footer-navigation-item {
      width: 100%; /* 小螢幕時佔滿寬度 */
    }
    
    .hero-section,
    .features-section .container,
    .how-it-works-section .container,
    .data-display-section .container,
    .hero-note,
    .container {
      padding: 0 16px;
    }
    
    .main-footer {
      padding: 40px 16px;
    }
  }
  
  @media (max-width: 1200px) and (min-width: 769px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr); /* 中型螢幕時2x2 */
    }
  }
</style>