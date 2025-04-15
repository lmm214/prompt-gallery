<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <header class="border-b">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-xl font-medium hover:text-blue-600 transition-colors duration-200"
          >
            「一对」提示词 Prompts Library
          </router-link>
        </div>
        <div class="flex items-center space-x-4">
        </div>
      </div>
    </header>

    <!-- 添加公告组件 -->
    <Announcement />

    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- 分类标签页 -->
      <div class="mb-8 border-b">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="category in store.categories"
            :key="category.id"
            @click="store.setCategory(category.id as PromptCategory)"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            :class="[
              store.currentCategory === category.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ category.name }}
            <span
              class="ml-2 py-0.5 px-2 rounded-full text-xs"
              :class="[
                store.currentCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ category.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- 搜索框 -->
      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索高质量提示词..."
            v-model="searchInput"
            @input="handleSearch"
            class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 标签过滤 -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="tag in store.tags"
          :key="tag"
          class="px-3 py-1 rounded-md text-sm"
          :class="[
            store.selectedTags.includes(tag)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="store.toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- 已选标签展示 -->
      <div v-if="store.selectedTags.length > 0" class="mb-4 flex flex-wrap gap-2">
        <div class="text-sm text-gray-500">已选标签：</div>
        <div
          v-for="tag in store.selectedTags"
          :key="tag"
          class="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
        >
          {{ tag }}
          <button
            class="ml-1 hover:text-blue-900"
            @click="store.toggleTag(tag)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- 提示词列表 - 改用卡片布局 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="prompt in store.prompts" 
          :key="prompt.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <!-- 卡片头部 -->
          <div class="p-6 border-b">
            <div class="flex justify-between items-start">
              <div class="space-y-3 flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ prompt.title }}</h3>
                <div class="flex items-center space-x-2">
                  <span 
                    class="px-2.5 py-1 text-xs rounded-full font-medium"
                    :class="{
                      'bg-purple-100 text-purple-700': prompt.category === '评价',
                      'bg-green-100 text-green-700': prompt.category === '图片',
                      'bg-blue-100 text-blue-700': prompt.category === 'Midjourney'
                    }"
                  >
                    {{ prompt.category }}
                  </span>
                  <span class="text-sm text-gray-500">{{ prompt.author }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="p-4">
            <div class="relative">
              <div 
                class="prose max-w-none text-sm"
                :class="{ 'line-clamp-4': !expandedPrompts[prompt.id] }"
              >
                <pre><code 
                  :class="{
                    'language-lisp': prompt.category === '评价',
                    'language-markdown': prompt.category === '图片',
                    'language-json': prompt.category === 'Midjourney'
                  }"
                >{{ !expandedPrompts[prompt.id] ? prompt.prompt.slice(0, 150) + '...' : prompt.prompt }}</code></pre>
              </div>
              
              <button
                v-if="prompt.prompt.length > 150"
                @click="toggleExpand(prompt.id)"
                class="absolute bottom-0 right-0 px-3 py-1 text-xs text-blue-500 hover:text-blue-600 bg-white bg-opacity-90"
              >
                {{ expandedPrompts[prompt.id] ? '收起' : '展开' }}
              </button>
            </div>
          </div>

          <!-- 卡片底部 -->
          <div class="p-4 border-t bg-gray-50 rounded-b-lg">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ prompt.publish }}</span>
              <div class="flex items-center space-x-2">
                <button 
                  class="p-2 text-sm text-gray-500 hover:text-blue-500"
                  :data-clipboard-text="prompt.prompt"
                  title="复制提示词"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
                <button 
                  class="p-2 text-sm text-gray-500 hover:text-blue-500"
                  @click="openPreview(prompt)"
                  title="预览效果"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          :disabled="store.currentPage === 1"
          @click="store.setPage(store.currentPage - 1)"
        >
          上一页
        </button>
        
        <div class="flex space-x-1">
          <button
            v-for="page in store.totalPages"
            :key="page"
            class="px-3 py-1 rounded-md"
            :class="page === store.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
            @click="store.setPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          :disabled="store.currentPage === store.totalPages"
          @click="store.setPage(store.currentPage + 1)"
        >
          下一页
        </button>

        <span class="text-gray-500 text-sm">
          第 {{ store.currentPage }} 页，共 {{ store.totalPages }} 页
        </span>
      </div>
    </main>
  </div>

  <!-- 预览模态框 -->
  <div 
    v-if="previewPrompt"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closePreview"
  >
    <div 
      class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium">预览效果</h3>
        <button 
          class="text-gray-400 hover:text-gray-600"
          @click="closePreview"
        >
          ✕
        </button>
      </div>

      <!-- 预览内容 -->
      <div class="space-y-4">
        <!-- 提示词内容 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <pre><code>{{ previewPrompt?.prompt }}</code></pre>
        </div>

        <!-- 生成的图片效果 -->
        <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <div class="w-full h-full flex items-center justify-center">
            <div v-if="isGenerating" class="text-gray-500">
              生成中...
            </div>
            <img 
              v-else-if="previewImage || previewPrompt?.preview"
              :src="previewImage || previewPrompt?.preview" 
              alt="预览效果"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-gray-500">
              <div class="animate-pulse flex space-x-4">
                <div class="flex-1 space-y-4 py-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 消息提示组件 -->
  <div 
    v-if="showMessage"
    class="fixed inset-x-0 top-20 flex items-center justify-center z-50"
  >
    <div class="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ copyMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { usePromptStore } from '../stores/prompt'
import type { Prompt, PromptCategory } from '../types/prompt'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-lisp'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import ClipboardJS from 'clipboard'
import Announcement from '../components/Announcement.vue'

const store = usePromptStore()
const searchInput = ref('')
const expandedPrompts = ref<Record<string, boolean>>({})
const previewPrompt = ref<Prompt | null>(null)
const previewImage = ref<string | null>(null)
const isGenerating = ref(false)
const copyMessage = ref('')
const showMessage = ref(false)

// 初始化代码高亮和剪贴板
onMounted(() => {
  Prism.highlightAll()
  const clipboard = new ClipboardJS('[data-clipboard-text]')
  
  clipboard.on('success', (e) => {
    // 显示复制成功提示
    copyMessage.value = '复制成功！'
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 2000)
    e.clearSelection()
  })

  clipboard.on('error', () => {
    copyMessage.value = '复制失败，请手动复制'
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 2000)
  })
})

// 展开/收起提示词
const toggleExpand = (promptId: string) => {
  expandedPrompts.value[promptId] = !expandedPrompts.value[promptId]
  nextTick(() => {
    Prism.highlightAll()
  })
}

// 收藏提示词
const toggleStar = (prompt: Prompt) => {
  prompt.starred = !prompt.starred
}

// 打开预览
const openPreview = async (prompt: Prompt) => {
  previewPrompt.value = prompt
  previewImage.value = null
  isGenerating.value = true

  // 如果有预览图片，直接使用
  if (prompt.preview) {
    isGenerating.value = false
    return
  }

  // 否则模拟生成图片的过程
  setTimeout(() => {
    isGenerating.value = false
    // 根据不同类型显示不同的占位图
    if (prompt.category === 'Midjourney') {
      previewImage.value = 'https://placehold.co/600x400/png?text=Midjourney+Preview'
    } else if (prompt.category === 'ChatGPT') {
      previewImage.value = 'https://placehold.co/600x400/png?text=ChatGPT+Response'
    } else {
      previewImage.value = 'https://placehold.co/600x400/png?text=Claude+Response'
    }
  }, 2000)
}

// 关闭预览
const closePreview = () => {
  previewPrompt.value = null
  previewImage.value = null
}

// 处理搜索输入
const handleSearch = () => {
  store.setSearchQuery(searchInput.value)
}

// 监听标签变化
watch(() => store.selectedTags, () => {
  // 可以添加额外的处理逻辑
}, { deep: true })
</script>

<style>
.prose pre {
  margin: 0;
  padding: 1rem;
  background: #1e1e1e;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose code {
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 添加过渡动画 */
.prose {
  transition: all 0.3s ease;
}

/* 添加模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 
