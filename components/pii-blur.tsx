'use client'

import { useState, useRef, useCallback } from 'react'
import type { PiiSpan } from '@/lib/types'

export function PiiText({ text, spans }: { text: string; spans: PiiSpan[] }) {
  if (spans.length === 0) return <span>{text}</span>

  const sorted = [...spans].sort((a, b) => a.start - b.start)

  const segments: React.ReactNode[] = []
  let lastEnd = 0

  for (const span of sorted) {
    if (span.start > lastEnd) {
      segments.push(
        <span key={`t-${lastEnd}`}>{text.slice(lastEnd, span.start)}</span>
      )
    }
    segments.push(
      <PiiBlurToken
        key={`p-${span.start}`}
        text={text.slice(span.start, span.end)}
        type={span.type}
      />
    )
    lastEnd = span.end
  }

  if (lastEnd < text.length) {
    segments.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd)}</span>)
  }

  return <>{segments}</>
}

const SPARKLE_CHARS = ['\u2728', '\u2726', '\u2727', '\u2735', '\u00B7']

type Sparkle = {
  id: number
  x: number
  y: number
  char: string
  delay: number
  size: number
}

function PiiBlurToken({ text, type }: { text: string; type: string }) {
  const [revealed, setRevealed] = useState(false)
  const containerRef = useRef<HTMLButtonElement>(null)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  const emitSparkles = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const count = 10 + Math.floor(Math.random() * 6)

    const newSparkles: Sparkle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: -4 + Math.random() * (rect.width + 8),
      y: Math.random() * rect.height,
      char: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      delay: Math.random() * 0.25,
      size: 12 + Math.random() * 10,
    }))

    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 1000)
  }, [])

  function handleClick() {
    emitSparkles()
    setRevealed((r) => !r)
  }

  return (
    <button
      ref={containerRef}
      onClick={handleClick}
      className={`relative inline-block cursor-pointer rounded-md px-1 py-0.5 transition-all duration-300 ${
        revealed
          ? 'bg-linear-to-r from-violet-200/70 to-indigo-200/70 dark:from-violet-800/40 dark:to-indigo-800/40'
          : 'bg-linear-to-r from-violet-300/30 to-indigo-300/30 text-transparent blur-[6px] select-none dark:from-violet-700/20 dark:to-indigo-700/20'
      }`}
      title={
        revealed
          ? `${type} — click to hide`
          : `PII detected: ${type} — click to reveal`
      }
      type="button"
    >
      {text}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-drift pointer-events-none absolute"
          style={{
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.char}
        </span>
      ))}
    </button>
  )
}
