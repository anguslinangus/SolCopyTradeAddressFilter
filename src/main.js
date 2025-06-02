//載入 createApp Function
import { createApp } from "vue";

//載入根組件
import App from "./App.vue";

// 全域 CSS
import './assets/main.css'

//建立 Vue App 物件
const app=createApp(App);

//掛載到 HTML 標籤底下
app.mount("#app");