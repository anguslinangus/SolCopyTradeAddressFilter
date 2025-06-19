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
    <h1>測試頁面 - 功能已恢復</h1>
    <p>如果您能看到下面的完整功能，說明部署成功！</p>
    <hr>
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

#app-container > h1 {
  color: #0ef6cc;
  font-size: 1.5rem;
  margin-bottom: 10px;
  text-align: center;
}

#app-container > p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: center;
}

#app-container > hr {
  border: none;
  border-top: 1px solid #3a3b4d;
  margin: 20px 0;
}
</style>