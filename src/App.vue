<script setup>
import TokenAnalyzerPage from './pages/TokenAnalyzerPage.vue'; // 導入新的頁面組件

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
/* 這裡可以放置真正全局的樣式，或者從外部 CSS 文件導入 */
/* 例如，如果你把 :root 和 body 樣式移到 src/style.css, 則在 main.js 中 import './style.css'; */
/* 或者: */
/*
:root {
  --primary-color: #0ef6cc;
  --secondary-color: #1a1b26;
  ... (其他 CSS 變數) ...
}

body {
  font-family: var(--font-family);
  color: var(--text-color);
  line-height: 1.6;
  margin: 0;
  padding: 0; // 通常 App 容器自己會處理 padding
  background-color: var(--secondary-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app-container {
  // 任何 App.vue 自身的佈局樣式
}
*/
</style>