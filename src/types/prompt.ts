export interface Prompt {
  id: string
  title: string
  prompt: string
  author: string
  publish: string
  starred?: boolean
  category: '评价' | '图片'
  preview?: string
}

export type PromptCategory = '评价' | '图片'
