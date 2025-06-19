<script setup>
// 暫時註釋掉複雜的組件，用一個簡單的測試
// import TokenAnalyzerPage from './pages/TokenAnalyzerPage.vue';

// 未來可以在這裡添加全局邏輯，例如:
// import { useTheme } from './composables/useTheme'; // 假設的主題管理
// const { initializeTheme } = useTheme();
// onMounted(() => {
//   initializeTheme();
// });
</script>

<template>
  <div id="app-container">
    <h1>測試頁面</h1>
    <p>如果您能看到這段文字，說明 GitHub Pages 部署成功！</p>
    <p>Solana 跟單地址篩選器正在載入中...</p>
    <!-- <TokenAnalyzerPage />  -->
  </div>
</template>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #1a1b26;
  color: #e8eaed;
  margin: 0;
  padding: 20px;
}

#app-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 40px 20px;
}

h1 {
  color: #0ef6cc;
  font-size: 2rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 15px;
}
</style>