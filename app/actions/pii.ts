'use server'

import { detectPiiSpans } from '@/lib/pii'
export type { PiiSpan } from '@/lib/types'

export async function scanPii(text: string) {
  return detectPiiSpans(text)
}
