import { generateText, Output } from 'ai'
import { z } from 'zod'
import { chatModel } from '@/lib/ai'
import { PII_DETECTION_SYSTEM_PROMPT } from '@/lib/prompts'
import type { PiiSpan } from '@/lib/types'

const piiSchema = z.object({
  items: z.array(
    z.object({
      text: z.string(),
      type: z.string(),
    }),
  ),
})

export async function detectPiiSpans(text: string): Promise<PiiSpan[]> {
  try {
    const { output } = await generateText({
      model: chatModel,
      output: Output.object({ schema: piiSchema }),
      system: PII_DETECTION_SYSTEM_PROMPT,
      prompt: text,
    })

    const spans: PiiSpan[] = []
    if (!output) return []

    for (const item of output.items) {
      if (!item.text || !item.type) continue
      let searchFrom = 0
      let idx: number
      while ((idx = text.indexOf(item.text, searchFrom)) !== -1) {
        spans.push({
          start: idx,
          end: idx + item.text.length,
          type: item.type,
          text: item.text,
        })
        searchFrom = idx + 1
      }
    }

    return spans
  } catch {
    return []
  }
}
