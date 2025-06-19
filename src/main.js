//載入 createApp Function
import { createApp } from "vue";

//載入根組件
import App from "./App.vue";

// 全域 CSS
import './assets/main.css'

// 添加全局錯誤處理和 storage 攔截
function setupGlobalErrorHandling() {
  // 處理未捕獲的 Promise 錯誤
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('Access to storage is not allowed')) {
      // 靜默處理 storage 訪問錯誤
      console.warn('Storage access blocked, using fallback methods');
      event.preventDefault();
    }
  });

  // 攔截 console.error 中的 storage 錯誤
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('Access to storage is not allowed')) {
      // 轉換為警告而不是錯誤
      console.warn('Storage access issue detected (converted from error):', ...args);
      return;
    }
    originalError.apply(console, args);
  };
}

// 在應用程式啟動前設置錯誤處理
setupGlobalErrorHandling();

//建立 Vue App 物件
const app=createApp(App);

//掛載到 HTML 標籤底下
app.mount("#app");