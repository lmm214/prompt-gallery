<template>
  <div class="relative">
    <!-- 悬浮按钮 -->
    <button
      v-if="!isOpen"
      @click="toggleOpen"
      class="fixed right-4 top-24 z-40 bg-blue-100 text-blue-500 p-2 rounded-lg shadow-md hover:bg-blue-200 transition-colors"
      title="公告"
    >
      <span>🎉</span>
    </button>

    <!-- 公告内容 - 定位在按钮位置 -->
    <div 
      v-if="isOpen"
      class="fixed right-4 top-24 z-50 bg-white rounded-lg shadow-lg w-[300px]"
    >
      <!-- 公告头部 -->
      <div class="flex justify-between items-center bg-blue-100 p-3 rounded-t-lg">
        <span class="text-blue-500 font-medium">🪧 公告</span>
        <button 
          @click="toggleOpen"
          class="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <!-- 公告内容 -->
      <div class="p-4">
        <div class="text-center mb-4">
          <p class="text-sm text-gray-600">👋 公众号 --- 👋 微信 👋</p>
        </div>
        
        <div class="flex justify-center space-x-4">
          <div class="text-center">
            <img src="https://inshub.oss-cn-beijing.aliyuncs.com/inshub/images/qrcode1.jpeg" alt="公众号" class="w-32 h-32 mb-1">
            <span class="text-xs text-gray-500">👉公众号👈</span>
          </div>
          <div class="text-center">
            <img src="https://inshub.oss-cn-beijing.aliyuncs.com/inshub/images/qrcode2.jpeg" alt="微信" class="w-32 h-32 mb-1">
            <span class="text-xs text-gray-500">👉微信👈</span>
          </div>
        </div>

        <p class="mt-4 text-xs text-gray-500 text-center">欢迎大家私信&加群交流</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
/* 添加淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 