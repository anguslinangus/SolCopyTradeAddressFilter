<script setup>
// 暫時註釋掉複雜的組件，用一個簡單的測試
import TokenAnalyzerPage from './pages/TokenAnalyzerPage.vue';

// 未來可以在這裡添加全局邏輯，例如:
// import { useTheme } from './composables/useTheme'; // 假設的主題管理
// const { initializeTheme } = useTheme();
// onMounted(() => {
//   initializeTheme();
// });
</script>

<template>
  <div id="app-container">
    <TokenAnalyzerPage /> 
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
  max-width: 1400px;
  margin: 0 auto;
}
</style>