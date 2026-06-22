import type { ColorCache, ColorCodes, RGB } from "@/global_types/types"
import {
  generateShadeFormats,
  transformRgbaCodeToRgbaNumberArray,
} from "@/utils/transform-colors"
import { useRef, useCallback } from "react"

export function useShades() {
  const cache = useRef<ColorCache>({
    primaryShades: {}, 
    extendedShades: {}, 
  })

  const getShades = useCallback(
    (
      mode: "primaryShades" | "extendedShades",
      colorInput: ColorCodes | RGB
    ) => {
      let input: RGB
      if (
        Array.isArray(colorInput) &&
        colorInput.every((i) => Number.isFinite(i))
      )
        input = colorInput as RGB
      else
        input = transformRgbaCodeToRgbaNumberArray(
          (colorInput as ColorCodes).rgba.code
        )

      const s = generateShadeFormats()

      if (mode === "primaryShades") {
        const primaryShadesArray = s({ type: mode, colorInput: input })
        cache.current.primaryShades = primaryShadesArray
        return cache.current.primaryShades
      } else {
        const extendedShadesArray  = s({
          type: mode,
          colorInput: input,
        })
        cache.current.extendedShades = extendedShadesArray
        return cache.current.extendedShades
      }
    },
    []
  )
  return getShades
}
