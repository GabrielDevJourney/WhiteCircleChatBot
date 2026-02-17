import { anthropic } from '@ai-sdk/anthropic'

export const MODEL_ID = 'claude-haiku-4-5' as const

export const chatModel = anthropic(MODEL_ID)
