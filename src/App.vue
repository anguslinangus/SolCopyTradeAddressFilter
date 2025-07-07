<script setup>
import NavigationBar from './components/ui/NavigationBar.vue'
</script>

<template>
  <!-- 全局導航欄 -->
  <NavigationBar />
  
  <div id="app-container">
    <router-view /> 
  </div>
</template>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #1a1b26;
  color: #e8eaed;
  margin: 0;
  padding: 0; /* 移除 padding，讓導航欄覆蓋全寬 */
}

#app-container {
  width: 100%;
  margin: 0;
}
</style>