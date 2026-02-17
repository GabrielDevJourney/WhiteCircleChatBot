export type MessageMetadata = {
  outputTokens?: number
}

export type PiiSpan = {
  start: number
  end: number
  type: string
  text: string
}

export type Conversation = {
  id: string
  title: string
  updatedAt: Date
}
