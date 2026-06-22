import { useState, useEffect, useMemo } from "react"

interface UseSlidingTrackProps {
  totalPages: number
  currentPage: number // 1-indexed
  itemWidth?: number // Default: 40px (36px item + 4px gap)
  desktopW: number 
}

export function useSlidingTrack({
  totalPages,
  currentPage,
  itemWidth = 40,
  desktopW,
}: UseSlidingTrackProps) {
  const [viewportWidth, setViewportWidth] = useState(desktopW) // Default to desktop width

  useEffect(() => {
    const handleResize = () => {
      // Synchronize viewport widths with your Tailwind breakpoints
      if (window.innerWidth < 640) {
        setViewportWidth(150) // Mobile: 3 visible items ((3 * 40) - 4)
      } else {
        setViewportWidth(desktopW) // Desktop: 6 visible items ((6 * 40) - 4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const translateX = useMemo(() => {
    const totalTrackWidth = totalPages * itemWidth - 4 // Subtract trailing gap
    const activeIndex = currentPage - 1

    // Center point math
    const targetOffset =
      viewportWidth / 2 - activeIndex * itemWidth - itemWidth / 2

    // Clamp bounds so the track never over-scrolls into blank space
    const maxOffset = 0
    const minOffset = Math.min(0, viewportWidth - totalTrackWidth)

    return Math.max(minOffset, Math.min(maxOffset, targetOffset))
  }, [currentPage, totalPages, viewportWidth, itemWidth])

  return { translateX }
}
