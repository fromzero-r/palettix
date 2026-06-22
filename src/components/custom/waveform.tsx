"use client"

import { motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type WaveformProps = {
  data?: number[]
  progress?: number
  height?: number
  width?: number
  barCount?: number
  barWidth?: number
  gap?: number

  playedColor?: string
  unplayedColor?: string

  animated?: boolean
  className?: string
}

export function Waveform({
  data,
  progress = 0,
  height = 80,
  width = 600,
  barCount = 48,
  gap = 3,
  playedColor = "hsl(var(--primary))",
  unplayedColor = "hsl(var(--muted-foreground) / 0.25)",
  animated = true,
  className,
}: WaveformProps) {
  const [idleData, setIdleData] = useState<number[]>(
    Array.from({ length: barCount }, () => Math.random())
  )

  useEffect(() => {
    if (!animated || data?.length) return

    const interval = setInterval(() => {
      setIdleData((prev) =>
        prev.map((_, index) => {
          const phase = Date.now() / 500 + index * 0.4

          return Math.max(
            0.1,
            (Math.sin(phase) + Math.sin(phase * 0.7) + Math.sin(phase * 1.3)) /
              6 +
              0.5
          )
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [animated, data])

  const waveformData = useMemo(() => {
    if (data?.length) {
      const normalized = [...data]

      if (normalized.length > barCount) {
        const step = normalized.length / barCount

        return Array.from({ length: barCount }, (_, i) => {
          const idx = Math.floor(i * step)
          return normalized[idx]
        })
      }

      return normalized
    }

    return idleData
  }, [data, idleData, barCount])

  const actualBarWidth = (width - gap * (barCount - 1)) / barCount

  const playedBars = Math.floor(waveformData.length * progress)

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {waveformData.map((value, index) => {
          const normalized = Math.max(0.05, Math.min(1, value))

          const barHeight = normalized * height * 0.9

          const x = index * (actualBarWidth + gap)

          const y = (height - barHeight) / 2

          const isPlayed = index < playedBars

          return (
            <motion.rect
              key={index}
              rx={999}
              fill={isPlayed ? playedColor : unplayedColor}
              initial={false}
              animate={{
                height: barHeight,
                y,
              }}
              transition={{
                duration: 0.12,
                ease: "easeOut",
              }}
              x={x}
              width={actualBarWidth}
            />
          )
        })}
      </svg>
    </div>
  )
}
