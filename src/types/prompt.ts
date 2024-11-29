export interface Prompt {
  id: string
  title: string
  prompt: string
  author: string
  publish: string
  starred?: boolean
  category: 'Claude' | 'ChatGPT' | 'Midjourney'
  preview?: string
}

export type PromptCategory = 'Claude' | 'ChatGPT' | 'Midjourney' 