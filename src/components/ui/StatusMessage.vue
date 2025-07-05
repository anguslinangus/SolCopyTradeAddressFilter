<script setup>
const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info', // 'info', 'error', 'success', 'warning'
    validator: (value) => ['info', 'error', 'success', 'warning'].includes(value)
  },
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="show && message" class="status-message" :class="type">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.status-message {
  padding: 15px 20px;
  border-radius: 6px;
  margin: 20px 0;
  border-left: 4px solid;
  background-color: var(--card-bg, #252640);
  border: 1px solid var(--border-color, #374151);
}

.status-message p {
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

/* Info 樣式 */
.status-message.info {
  border-left-color: #58a6ff;
  color: #58a6ff;
  background-color: rgba(88, 166, 255, 0.05);
}

/* Error 樣式 */
.status-message.error {
  border-left-color: #f85149;
  color: #f85149;
  background-color: rgba(248, 81, 73, 0.05);
}

/* Success 樣式 */
.status-message.success {
  border-left-color: #56d364;
  color: #56d364;
  background-color: rgba(86, 211, 100, 0.05);
}

/* Warning 樣式 */
.status-message.warning {
  border-left-color: #e3b341;
  color: #e3b341;
  background-color: rgba(227, 179, 65, 0.05);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .status-message {
    padding: 12px 15px;
    margin: 15px 0;
  }
}
</style> 