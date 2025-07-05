<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '輸入代幣地址...'
  }
})

const emit = defineEmits(['update:modelValue', 'analyze'])

// 本地輸入值
const inputValue = ref(props.modelValue)

// 監聽輸入變化
const handleInput = (event) => {
  inputValue.value = event.target.value
  emit('update:modelValue', inputValue.value)
}

// 處理分析按鈕點擊
const handleAnalyze = () => {
  emit('analyze')
}

// 處理 Enter 鍵
const handleKeyup = (event) => {
  if (event.key === 'Enter') {
    handleAnalyze()
  }
}
</script>

<template>
  <div class="input-section">
    <label for="tokenAddressInput" class="input-label">
      目標代幣地址:
    </label>
    
    <input
      id="tokenAddressInput"
      type="text"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleInput"
      @keyup="handleKeyup"
      class="token-input"
    />
    
    <button
      @click="handleAnalyze"
      :disabled="isLoading"
      class="analyze-button"
    >
      <span v-if="isLoading">載入中...</span>
      <span v-else>開始分析</span>
    </button>
  </div>
</template>

<style scoped>
.input-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
  flex-wrap: wrap;
}

.input-label {
  font-weight: 500;
  color: var(--text-secondary, #a1a1aa);
  flex-shrink: 0;
}

.token-input {
  flex-grow: 1;
  min-width: 250px;
  padding: 10px 14px;
  border: 1px solid var(--border-color, #374151);
  border-radius: 6px;
  background-color: #2a2b3d;
  color: var(--text-color, #e8eaed);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.token-input:focus {
  outline: none;
  border-color: var(--primary-color, #0ef6cc);
  background-color: #3a3b4d;
  box-shadow: 0 0 0 2px rgba(14, 246, 204, 0.1);
}

.token-input::placeholder {
  color: var(--text-secondary, #a1a1aa);
}

.analyze-button {
  padding: 10px 20px;
  background: var(--primary-color, #0ef6cc);
  color: #1a1b26;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.analyze-button:hover:not(:disabled) {
  background: var(--primary-hover, #0bd9b3);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(14, 246, 204, 0.3);
}

.analyze-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 25px;
    gap: 10px;
  }
  
  .input-label {
    align-self: flex-start;
  }
  
  .token-input {
    min-width: unset;
    width: 100%;
  }
  
  .analyze-button {
    width: 100%;
    padding: 12px 20px;
  }
}
</style> 