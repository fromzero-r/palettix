import type { RGB, ShuffleSeed, ThemeState } from "@/global_types/types"
import { rgbToHsl, hslToRgb } from "@/utils/transform-colors"
import {
  findBestTheme,
  pickDiverseColors,
  findComplementary,
} from "./update-theme"

// ============================================================
// strategies.ts
// ============================================================

// Helper: pick a random item from array
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// Helper: pick random dominant that satisfies a condition
const randDominant = (
  colors: RGB[],
  condition: (hsl: { h: number; s: number; l: number; a?: number }) => boolean,
  fallback: RGB
): RGB => {
  const filtered = colors.filter((c) => condition(rgbToHsl(c)))
  return filtered.length > 0 ? rand(filtered) : fallback
}

// ============================================================
// BASE STRATEGIES
// ============================================================
export const BASE_STRATEGIES: Array<(colors: RGB[]) => RGB> = [
  // 0. Lightest dominant as-is (pure, no math stripping)
  (colors) => {
    return colors.reduce((best, c) =>
      rgbToHsl(c).l > rgbToHsl(best).l ? c : best
    )
  },

  // 1. Most saturated dominant, lightness pulled to 80-85 (rich light base)
  (colors) => {
    const vibrant = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(vibrant)
    return hslToRgb(hsl.h, hsl.s * 0.7, 82) // keeps color identity, just lightened
  },

  // 2. Most saturated dominant, pushed to 88 lightness (softer)
  (colors) => {
    const vibrant = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(vibrant)
    return hslToRgb(hsl.h, hsl.s * 0.6, 88)
  },

  // 3. Random dominant, lightness normalized to 78-85 range
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s * 0.65, 82)
  },

  // 4. Dominant closest to mid-lightness (50-65), used directly
  (colors) => {
    return randDominant(colors, (hsl) => hsl.l >= 50 && hsl.l <= 65, colors[0])
  },

  // 5. Most saturated, dark version (l: 18-25) — deep tinted dark base
  (colors) => {
    const vibrant = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(vibrant)
    return hslToRgb(hsl.h, hsl.s * 0.8, 20) // dark but clearly colored
  },

  // 6. Random dominant dark version (l: 15-22)
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s * 0.75, 18)
  },

  // 7. Least saturated dominant used as-is (natural muted base)
  (colors) => {
    return colors.reduce((best, c) =>
      rgbToHsl(c).s < rgbToHsl(best).s ? c : best
    )
  },

  // 8. Least saturated dominant, lightness normalized to 85
  (colors) => {
    const muted = colors.reduce((best, c) =>
      rgbToHsl(c).s < rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(muted)
    return hslToRgb(hsl.h, hsl.s, 85)
  },

  // 9. Average hue of all dominants → single blended base
  (colors) => {
    const avg = colors.reduce(
      (acc, c) => {
        const hsl = rgbToHsl(c)
        return { h: acc.h + hsl.h, s: acc.s + hsl.s, l: acc.l + hsl.l }
      },
      { h: 0, s: 0, l: 0 }
    )
    const n = colors.length
    return hslToRgb(avg.h / n, (avg.s / n) * 0.5, 85) // blended hue, lightened
  },

  // 10. Dominant with hue closest to 30° (warm earth tones) used directly
  (colors) => {
    return colors.reduce((best, c) => {
      const diffC = Math.abs(rgbToHsl(c).h - 30)
      const diffB = Math.abs(rgbToHsl(best).h - 30)
      return diffC < diffB ? c : best
    })
  },

  // 11. Dominant with hue closest to 200° (cool blue-teal) used directly
  (colors) => {
    return colors.reduce((best, c) => {
      const diffC = Math.abs(rgbToHsl(c).h - 200)
      const diffB = Math.abs(rgbToHsl(best).h - 200)
      return diffC < diffB ? c : best
    })
  },

  // 12. Second lightest dominant as-is
  (colors) => {
    const sorted = [...colors].sort((a, b) => rgbToHsl(b).l - rgbToHsl(a).l)
    return sorted[1] ?? sorted[0]
  },

  // 13. Most vibrant dominant, medium lightness (50-55) — bold base
  (colors) => {
    const vibrant = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(vibrant)
    return hslToRgb(hsl.h, hsl.s, 52) // full color, just normalize lightness
  },

  // 14. Random dominant used directly with no modification at all
  (colors) => rand(colors),
  // ============================================================
  // SAME AS GIVEN: Dominant colors with minimal/no modification
  // ============================================================

  // 15. Third lightest dominant as-is
  (colors) => {
    const sorted = [...colors].sort((a, b) => rgbToHsl(b).l - rgbToHsl(a).l)
    return sorted[2] ?? sorted[0]
  },

  // 16. Most saturated dominant as-is (bold/colorful base)
  (colors) =>
    colors.reduce((best, c) => (rgbToHsl(c).s > rgbToHsl(best).s ? c : best)),

  // 17. Dominant with highest vibrancy score as-is
  (colors) =>
    colors.reduce((best, c) => {
      const hslC = rgbToHsl(c)
      const hslB = rgbToHsl(best)
      const scoreC = hslC.s * (1 - Math.abs(hslC.l - 50) / 50)
      const scoreB = hslB.s * (1 - Math.abs(hslB.l - 50) / 50)
      return scoreC > scoreB ? c : best
    }),

  // 18. Second most saturated dominant as-is
  (colors) => {
    const sorted = [...colors].sort((a, b) => rgbToHsl(b).s - rgbToHsl(a).s)
    return sorted[1] ?? sorted[0]
  },

  // 19. Dominant closest to l:70 as-is (naturally light-medium)
  (colors) =>
    colors.reduce((best, c) => {
      const diffC = Math.abs(rgbToHsl(c).l - 70)
      const diffB = Math.abs(rgbToHsl(best).l - 70)
      return diffC < diffB ? c : best
    }),

  // 20. Dominant closest to l:30 as-is (naturally dark-medium)
  (colors) =>
    colors.reduce((best, c) => {
      const diffC = Math.abs(rgbToHsl(c).l - 30)
      const diffB = Math.abs(rgbToHsl(best).l - 30)
      return diffC < diffB ? c : best
    }),

  // 21. Random from top 3 diverse dominants as-is
  (colors) => rand(pickDiverseColors(colors, 3)),

  // 22. Random from top 5 diverse dominants as-is
  (colors) => rand(pickDiverseColors(colors, 5)),

  // ============================================================
  // CLOSE TO GIVEN: Same hue, slight modifications
  // ============================================================

  // 23. Lightest dominant, lightness pushed up to 92
  (colors) => {
    const lightest = colors.reduce((best, c) =>
      rgbToHsl(c).l > rgbToHsl(best).l ? c : best
    )
    const hsl = rgbToHsl(lightest)
    return hslToRgb(hsl.h, hsl.s * 0.5, 92)
  },

  // 24. Most vibrant dominant, lightness to 75 (rich mid-light)
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, hsl.s * 0.75, 75)
  },

  // 25. Most vibrant dominant, lightness to 65 (mid tone)
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, hsl.s * 0.8, 65)
  },

  // 26. Random dominant, lightness to 70, saturation kept
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, 70)
  },

  // 27. Random dominant, lightness to 55, saturation kept (bold mid)
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, 55)
  },

  // 28. Random dominant, lightness to 40, saturation kept (dark mid)
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, 40)
  },

  // 29. Random dominant, lightness to 30, saturation kept (deep)
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, 30)
  },

  // 30. Most vibrant, saturation halved, lightness to 90 (very subtle tint)
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, hsl.s * 0.5, 90)
  },

  // 31. Least saturated dominant, lightness to 78
  (colors) => {
    const muted = colors.reduce((best, c) =>
      rgbToHsl(c).s < rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(muted)
    return hslToRgb(hsl.h, hsl.s, 78)
  },

  // 32. Least saturated dominant, lightness to 25 (muted dark)
  (colors) => {
    const muted = colors.reduce((best, c) =>
      rgbToHsl(c).s < rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(muted)
    return hslToRgb(hsl.h, hsl.s, 25)
  },

  // 33. Average hue, full average saturation, lightness to 78
  (colors) => {
    const avg = colors.reduce(
      (acc, c) => {
        const hsl = rgbToHsl(c)
        return { h: acc.h + hsl.h, s: acc.s + hsl.s }
      },
      { h: 0, s: 0 }
    )
    const n = colors.length
    return hslToRgb(avg.h / n, avg.s / n, 78)
  },

  // 34. Average hue, full average saturation, lightness to 22 (dark blend)
  (colors) => {
    const avg = colors.reduce(
      (acc, c) => {
        const hsl = rgbToHsl(c)
        return { h: acc.h + hsl.h, s: acc.s + hsl.s }
      },
      { h: 0, s: 0 }
    )
    const n = colors.length
    return hslToRgb(avg.h / n, avg.s / n, 22)
  },

  // 35. Random dominant hue ± small nudge (±5-15°), lightness normalized
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    const nudge =
      (Math.random() > 0.5 ? 1 : -1) * (5 + Math.floor(Math.random() * 10))
    return hslToRgb((hsl.h + nudge + 360) % 360, hsl.s * 0.7, 82)
  },

  // 36. Two random dominants blended (average hue/s/l)
  (colors) => {
    const a = rand(colors)
    const b = rand(colors)
    const hslA = rgbToHsl(a)
    const hslB = rgbToHsl(b)
    return hslToRgb(
      (hslA.h + hslB.h) / 2,
      ((hslA.s + hslB.s) / 2) * 0.6,
      (hslA.l + hslB.l) / 2
    )
  },

  // 37. Most vibrant hue, random lightness in 75-92 range
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    const l = 75 + Math.floor(Math.random() * 17)
    return hslToRgb(hsl.h, hsl.s * 0.65, l)
  },

  // 38. Most vibrant hue, random lightness in 15-35 range (dark variants)
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    const l = 15 + Math.floor(Math.random() * 20)
    return hslToRgb(hsl.h, hsl.s * 0.8, l)
  },

  // 39. Random dominant hue, random saturation 20-50 (muted range)
  (colors) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    const s = 20 + Math.floor(Math.random() * 30)
    return hslToRgb(hsl.h, s, 80)
  },

  // ============================================================
  // COMPLETELY DIFFERENT: Unrelated to given dominant colors
  // ============================================================

  // 40. Complementary of most vibrant, lightened to 85
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 180) % 360, hsl.s * 0.6, 85)
  },

  // 41. Complementary of most vibrant, darkened to 20
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 180) % 360, hsl.s * 0.7, 20)
  },

  // 42. Triadic of most vibrant (+120°), lightened to 85
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 120) % 360, hsl.s * 0.6, 85)
  },

  // 43. Triadic of most vibrant (+240°), darkened to 20
  (colors) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 240) % 360, hsl.s * 0.7, 20)
  },

  // 44. Farthest hue from all dominants, lightened to 88
  (colors) => {
    const hues = colors.map((c) => rgbToHsl(c).h)
    let maxMinDist = -1
    let bestHue = 0
    for (let h = 0; h < 360; h += 5) {
      const minDist = Math.min(
        ...hues.map((dh) => {
          const diff = Math.abs(h - dh)
          return Math.min(diff, 360 - diff)
        })
      )
      if (minDist > maxMinDist) {
        maxMinDist = minDist
        bestHue = h
      }
    }
    return hslToRgb(bestHue, 30, 88)
  },

  // 45. Farthest hue from all dominants, darkened to 18
  (colors) => {
    const hues = colors.map((c) => rgbToHsl(c).h)
    let maxMinDist = -1
    let bestHue = 0
    for (let h = 0; h < 360; h += 5) {
      const minDist = Math.min(
        ...hues.map((dh) => {
          const diff = Math.abs(h - dh)
          return Math.min(diff, 360 - diff)
        })
      )
      if (minDist > maxMinDist) {
        maxMinDist = minDist
        bestHue = h
      }
    }
    return hslToRgb(bestHue, 40, 18)
  },

  // 46. Warm base if dominants are mostly cool
  (colors) => {
    const avgH =
      colors.reduce((sum, c) => sum + rgbToHsl(c).h, 0) / colors.length
    const isCool = avgH >= 150 && avgH <= 300
    return isCool
      ? hslToRgb(25 + Math.floor(Math.random() * 20), 35, 88) // warm light
      : hslToRgb(210 + Math.floor(Math.random() * 30), 25, 88) // cool light
  },

  // 47. Dark warm base if dominants are mostly cool (and vice versa)
  (colors) => {
    const avgH =
      colors.reduce((sum, c) => sum + rgbToHsl(c).h, 0) / colors.length
    const isCool = avgH >= 150 && avgH <= 300
    return isCool
      ? hslToRgb(25 + Math.floor(Math.random() * 20), 50, 18) // dark warm
      : hslToRgb(210 + Math.floor(Math.random() * 30), 40, 18) // dark cool
  },

  // 48. Absent hue zone, light version
  (colors) => {
    const zones = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    const hues = colors.map((c) => rgbToHsl(c).h)
    const absent =
      zones.find((z) => !hues.some((h) => Math.abs(h - z) < 30)) ??
      zones[Math.floor(Math.random() * zones.length)]
    return hslToRgb(absent, 25, 88)
  },

  // 49. Absent hue zone, dark version
  (colors) => {
    const zones = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    const hues = colors.map((c) => rgbToHsl(c).h)
    const absent =
      zones.find((z) => !hues.some((h) => Math.abs(h - z) < 30)) ??
      zones[Math.floor(Math.random() * zones.length)]
    return hslToRgb(absent, 40, 18)
  },

  // 50. Purely synthetic light: random hue, fixed muted light
  () => hslToRgb(Math.floor(Math.random() * 360), 20, 90),

  // 51. Purely synthetic dark: random hue, fixed muted dark
  () => hslToRgb(Math.floor(Math.random() * 360), 35, 15),

  // 52. Purely synthetic mid: random hue, fixed mid saturation/lightness
  () => hslToRgb(Math.floor(Math.random() * 360), 30, 60),
]
// ============================================================
// THEME STRATEGIES
// ============================================================
// ============================================================
// THEME STRATEGIES: All normalized to usable lightness range
// ============================================================
export const THEME_STRATEGIES: Array<(colors: RGB[], base: RGB) => RGB> = [
  // 0. Most vibrant → normalize lightness to 45-58
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, hsl.s, clampL(hsl.l, 45, 58))
  },

  // 1. Most vibrant different from base → normalize
  (colors, base) => {
    const best = findBestTheme(colors, base)
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, hsl.s, clampL(hsl.l, 45, 58))
  },

  // 2. Most saturated cool (180-270°) → normalize
  (colors, base) => {
    const cool = colors.filter((c) => {
      const h = rgbToHsl(c).h
      return h >= 180 && h <= 270
    })
    const best =
      cool.length > 0
        ? cool.reduce((b, c) => (rgbToHsl(c).s > rgbToHsl(b).s ? c : b))
        : findBestTheme(colors, base)
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, Math.max(hsl.s, 55), clampL(hsl.l, 45, 60))
  },

  // 3. Most saturated warm (0-60°, 300-360°) → normalize
  (colors, base) => {
    const warm = colors.filter((c) => {
      const h = rgbToHsl(c).h
      return (h >= 0 && h <= 60) || h >= 300
    })
    const best =
      warm.length > 0
        ? warm.reduce((b, c) => (rgbToHsl(c).s > rgbToHsl(b).s ? c : b))
        : findBestTheme(colors, base)
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, Math.max(hsl.s, 55), clampL(hsl.l, 45, 60))
  },

  // 4. Random vibrant (s > 50) → normalize lightness
  (colors, base) => {
    const picked = randDominant(
      colors,
      (hsl) => hsl.s > 50, // ← removed l constraint, we normalize after
      findBestTheme(colors, base)
    )
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, clampL(hsl.l, 45, 58))
  },

  // 5. Contrasts base hue (>60° apart) → normalize
  (colors, base) => {
    const baseHue = rgbToHsl(base).h
    const picked = randDominant(
      colors,
      (hsl) => {
        const diff = Math.abs(hsl.h - baseHue)
        return Math.min(diff, 360 - diff) > 60 && hsl.s > 35 // ← lower s threshold
      },
      findBestTheme(colors, base)
    )
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, Math.max(hsl.s, 55), clampL(hsl.l, 45, 60))
  },

  // 6. Random dominant, boost saturation + normalize lightness
  (colors, base) => {
    const baseHue = rgbToHsl(base).h
    const filtered = colors.filter((c) => {
      const diff = Math.abs(rgbToHsl(c).h - baseHue)
      return Math.min(diff, 360 - diff) > 30
    })
    const picked = rand(filtered.length > 0 ? filtered : colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, Math.max(hsl.s, 60), clampL(hsl.l, 45, 58))
  },

  // 7. REMOVED dark strategy → replaced with mid-light vibrant
  // (was causing dark outputs)
  (colors, base) => {
    const picked = randDominant(
      colors,
      (hsl) => hsl.s > 40 && hsl.l >= 45 && hsl.l <= 65, // ← mid-light range
      findBestTheme(colors, base)
    )
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, Math.max(hsl.s, 55), clampL(hsl.l, 48, 60))
  },

  // 8. Random from diverse top 3 → normalize
  (colors, _) => {
    const picked = rand(pickDiverseColors(colors, 3))
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, Math.max(hsl.s, 50), clampL(hsl.l, 45, 58))
  },

  // 9. NEW: Mid-saturation range (40-65) for softer themes
  (colors, base) => {
    const picked = randDominant(
      colors,
      (hsl) => hsl.s >= 40 && hsl.s <= 65,
      findBestTheme(colors, base)
    )
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, clampL(hsl.l, 45, 60))
  },

  // 10. NEW: Highest lightness saturated color (bright/vivid theme)
  (colors, _) => {
    const bright =
      colors
        .filter((c) => rgbToHsl(c).s > 40)
        .sort((a, b) => rgbToHsl(b).l - rgbToHsl(a).l)[0] ?? colors[0]
    const hsl = rgbToHsl(bright)
    return hslToRgb(hsl.h, Math.max(hsl.s, 55), clampL(hsl.l, 50, 65))
  },

  // 11. NEW: Purely synthetic from dominant hue pool
  // picks random hue from dominants, builds fresh vibrant color
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(
      hsl.h,
      70, // fixed vibrant saturation
      52 // fixed mid lightness
    )
  },

  // ============================================================
  // SAME AS GIVEN: Uses dominant colors directly with minimal modification
  // ============================================================

  // 12. Exact most vibrant dominant - no modification at all
  (colors, _) => {
    return colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
  },

  // 13. Exact random dominant - pure as-is
  (colors, _) => rand(colors),

  // 14. Exact lightest dominant - no modification
  (colors, _) => {
    return colors.reduce((best, c) =>
      rgbToHsl(c).l > rgbToHsl(best).l ? c : best
    )
  },

  // 15. Exact darkest saturated dominant
  (colors, _) => {
    const saturated = colors.filter((c) => rgbToHsl(c).s > 40)
    return saturated.length > 0
      ? saturated.reduce((best, c) =>
          rgbToHsl(c).l < rgbToHsl(best).l ? c : best
        )
      : colors[0]
  },

  // 16. Exact second most vibrant dominant
  (colors, _) => {
    const sorted = [...colors].sort((a, b) => rgbToHsl(b).s - rgbToHsl(a).s)
    return sorted[1] ?? sorted[0]
  },

  // 17. Exact most saturated from diverse top 4
  (colors, _) => {
    const diverse = pickDiverseColors(colors, 4)
    return diverse.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
  },

  // 18. Exact dominant closest to mid lightness (l nearest 50)
  (colors, _) => {
    return colors.reduce((best, c) => {
      const diffC = Math.abs(rgbToHsl(c).l - 50)
      const diffB = Math.abs(rgbToHsl(best).l - 50)
      return diffC < diffB ? c : best
    })
  },

  // 19. Exact random from top 3 diverse
  (colors, _) => rand(pickDiverseColors(colors, 3)),

  // 20. Exact dominant with highest vibrancy score (s * (1 - |l-50|/50))
  (colors, _) => {
    return colors.reduce((best, c) => {
      const hslC = rgbToHsl(c)
      const hslB = rgbToHsl(best)
      const scoreC = hslC.s * (1 - Math.abs(hslC.l - 50) / 50)
      const scoreB = hslB.s * (1 - Math.abs(hslB.l - 50) / 50)
      return scoreC > scoreB ? c : best
    })
  },

  // ============================================================
  // CLOSE TO GIVEN: Same hue, slight modifications
  // ============================================================

  // 21. Most vibrant dominant + slight hue nudge (+10°)
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 10) % 360, hsl.s, clampL(hsl.l, 45, 60))
  },

  // 22. Most vibrant dominant + slight hue nudge (-10°)
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h - 10 + 360) % 360, hsl.s, clampL(hsl.l, 45, 60))
  },

  // 23. Random dominant, same hue, boosted saturation
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, Math.min(hsl.s + 20, 95), clampL(hsl.l, 45, 58))
  },

  // 24. Random dominant, same hue, lightened (+15)
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, clampL(hsl.l + 15, 50, 70))
  },

  // 25. Random dominant, same hue, darkened (-10)
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(hsl.h, hsl.s, clampL(hsl.l - 10, 30, 50))
  },

  // 26. Most vibrant, same hue, saturation reduced slightly
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb(hsl.h, Math.max(hsl.s - 15, 40), clampL(hsl.l, 45, 60))
  },

  // 27. Dominant closest to mid, hue ±15° random nudge
  (colors, _) => {
    const mid = colors.reduce((best, c) => {
      const diffC = Math.abs(rgbToHsl(c).l - 50)
      const diffB = Math.abs(rgbToHsl(best).l - 50)
      return diffC < diffB ? c : best
    })
    const hsl = rgbToHsl(mid)
    const nudge =
      (Math.random() > 0.5 ? 1 : -1) * (10 + Math.floor(Math.random() * 10))
    return hslToRgb((hsl.h + nudge + 360) % 360, hsl.s, clampL(hsl.l, 45, 60))
  },

  // 28. Random dominant hue, saturation interpolated toward 70%
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    const s = hsl.s + (70 - hsl.s) * 0.5 // halfway toward 70
    return hslToRgb(hsl.h, s, clampL(hsl.l, 45, 58))
  },

  // 29. Random dominant hue, lightness interpolated toward 52%
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    const l = hsl.l + (52 - hsl.l) * 0.5 // halfway toward 52
    return hslToRgb(hsl.h, hsl.s, l)
  },

  // 30. Two random dominants → average their hue (blend)
  (colors, _) => {
    const a = rand(colors)
    const b = rand(colors)
    const hslA = rgbToHsl(a)
    const hslB = rgbToHsl(b)
    const h = (hslA.h + hslB.h) / 2
    const s = (hslA.s + hslB.s) / 2
    const l = clampL((hslA.l + hslB.l) / 2, 45, 60)
    return hslToRgb(h, s, l)
  },

  // 31. All dominants → average hue, boosted saturation
  (colors, _) => {
    const avg = colors.reduce(
      (acc, c) => {
        const hsl = rgbToHsl(c)
        return { h: acc.h + hsl.h, s: acc.s + hsl.s }
      },
      { h: 0, s: 0 }
    )
    const n = colors.length
    return hslToRgb(avg.h / n, Math.max(avg.s / n, 55), 52)
  },

  // 32. Most vibrant hue + random lightness in 45-65 range
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    const l = 45 + Math.floor(Math.random() * 20)
    return hslToRgb(hsl.h, hsl.s, l)
  },

  // 33. Random dominant hue + random saturation 55-85
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    const s = 55 + Math.floor(Math.random() * 30)
    return hslToRgb(hsl.h, s, clampL(hsl.l, 45, 58))
  },

  // ============================================================
  // COMPLETELY DIFFERENT: Opposite/unrelated to given colors
  // ============================================================

  // 34. Complementary of most vibrant (+180°)
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 180) % 360, hsl.s, clampL(hsl.l, 45, 58))
  },

  // 35. Complementary of random dominant (+180°)
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(
      (hsl.h + 180) % 360,
      Math.max(hsl.s, 55),
      clampL(hsl.l, 45, 58)
    )
  },

  // 36. Triadic of most vibrant (+120°)
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 120) % 360, hsl.s, clampL(hsl.l, 45, 58))
  },

  // 37. Triadic of most vibrant (+240°)
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb((hsl.h + 240) % 360, hsl.s, clampL(hsl.l, 45, 58))
  },

  // 38. Split complementary of most vibrant (+150°)
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb(
      (hsl.h + 150) % 360,
      Math.max(hsl.s, 55),
      clampL(hsl.l, 45, 58)
    )
  },

  // 39. Split complementary of most vibrant (+210°)
  (colors, _) => {
    const best = colors.reduce((best, c) =>
      rgbToHsl(c).s > rgbToHsl(best).s ? c : best
    )
    const hsl = rgbToHsl(best)
    return hslToRgb(
      (hsl.h + 210) % 360,
      Math.max(hsl.s, 55),
      clampL(hsl.l, 45, 58)
    )
  },

  // 40. Complementary of random dominant, boosted saturation
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb((hsl.h + 180) % 360, Math.min(hsl.s + 25, 90), 52)
  },

  // 41. Hue zone NOT in dominants (most absent hue zone)
  (colors, _) => {
    const zones = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    const hues = colors.map((c) => rgbToHsl(c).h)
    const absent =
      zones.find((z) => !hues.some((h) => Math.abs(h - z) < 30)) ??
      zones[Math.floor(Math.random() * zones.length)]
    return hslToRgb(absent, 70, 52)
  },

  // 42. Purely synthetic: random hue (0-360), fixed vibrant
  (_colors, _) => {
    const h = Math.floor(Math.random() * 360)
    return hslToRgb(h, 72, 52)
  },

  // 43. Purely synthetic: random hue, random saturation 60-85
  (_colors, _) => {
    const h = Math.floor(Math.random() * 360)
    const s = 60 + Math.floor(Math.random() * 25)
    return hslToRgb(h, s, 52)
  },

  // 44. Farthest hue from all dominants combined
  (colors, _) => {
    const hues = colors.map((c) => rgbToHsl(c).h)
    let maxMinDist = -1
    let bestHue = 0

    for (let h = 0; h < 360; h += 5) {
      const minDist = Math.min(
        ...hues.map((dh) => {
          const diff = Math.abs(h - dh)
          return Math.min(diff, 360 - diff)
        })
      )
      if (minDist > maxMinDist) {
        maxMinDist = minDist
        bestHue = h
      }
    }

    return hslToRgb(bestHue, 70, 52)
  },

  // 45. Complementary of average dominant hue
  (colors, _) => {
    const avgH =
      colors.reduce((sum, c) => sum + rgbToHsl(c).h, 0) / colors.length
    return hslToRgb((avgH + 180) % 360, 70, 52)
  },

  // 46. Triadic of average dominant hue (+120°)
  (colors, _) => {
    const avgH =
      colors.reduce((sum, c) => sum + rgbToHsl(c).h, 0) / colors.length
    return hslToRgb((avgH + 120) % 360, 70, 52)
  },

  // 47. Warm synthetic if dominants are mostly cool (and vice versa)
  (colors, _) => {
    const avgH =
      colors.reduce((sum, c) => sum + rgbToHsl(c).h, 0) / colors.length
    const isCool = avgH >= 150 && avgH <= 300
    const targetH = isCool
      ? 20 + Math.floor(Math.random() * 40) // warm: 20-60°
      : 200 + Math.floor(Math.random() * 60) // cool: 200-260°
    return hslToRgb(targetH, 72, 52)
  },

  // 48. Random hue from evenly spaced wheel, avoiding dominant hues
  (colors, _) => {
    const hues = colors.map((c) => rgbToHsl(c).h)
    const wheel = [0, 45, 90, 135, 180, 225, 270, 315]
    const filtered = wheel.filter((h) =>
      hues.every((dh) => Math.abs(h - dh) > 25)
    )
    const h =
      filtered.length > 0 ? rand(filtered) : Math.floor(Math.random() * 8) * 45
    return hslToRgb(h, 68, 52)
  },
]

// ============================================================
// ACCENT STRATEGIES
// ============================================================
export const ACCENT_STRATEGIES: Array<(colors: RGB[], theme: RGB) => RGB> = [
  // 0. Math: analogous +30°
  (_, theme) => {
    const hsl = rgbToHsl(theme)
    return hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l)
  },

  // 1. Math: complementary +180°
  (_, theme) => findComplementary(theme),

  // 2. Math: triadic +120°
  (_, theme) => {
    const hsl = rgbToHsl(theme)
    return hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l)
  },

  // 3. Math: split complementary +150°
  (_, theme) => {
    const hsl = rgbToHsl(theme)
    return hslToRgb((hsl.h + 150) % 360, hsl.s, hsl.l)
  },

  // 4. ✅ DOMINANT: dominant most different from theme hue
  (colors, theme) => {
    const themeHue = rgbToHsl(theme).h
    return colors.reduce((best, c) => {
      const hue = rgbToHsl(c).h
      const bestHue = rgbToHsl(best).h
      const diffC = Math.min(
        Math.abs(hue - themeHue),
        360 - Math.abs(hue - themeHue)
      )
      const diffB = Math.min(
        Math.abs(bestHue - themeHue),
        360 - Math.abs(bestHue - themeHue)
      )
      return diffC > diffB ? c : best
    })
  },

  // 5. ✅ DOMINANT: random dominant >45° from theme
  (colors, theme) => {
    const themeHue = rgbToHsl(theme).h
    return randDominant(
      colors,
      (hsl) => {
        const diff = Math.abs(hsl.h - themeHue)
        return Math.min(diff, 360 - diff) > 45
      },
      findComplementary(theme)
    )
  },

  // 6. ✅ DOMINANT: second most vibrant dominant
  (colors, theme) => {
    const sorted = [...colors].sort((a, b) => rgbToHsl(b).s - rgbToHsl(a).s)
    const themeHue = rgbToHsl(theme).h
    return (
      sorted.find((c) => {
        const diff = Math.abs(rgbToHsl(c).h - themeHue)
        return Math.min(diff, 360 - diff) > 30
      }) ??
      sorted[1] ??
      sorted[0]
    )
  },

  // 7. ✅ DOMINANT: random dominant boosted to mid-saturation
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return hslToRgb(
      hsl.h,
      Math.max(hsl.s, 55),
      Math.min(Math.max(hsl.l, 40), 65)
    )
  },
]

// ============================================================
// CHART STRATEGIES
// ============================================================
export const CHART_STRATEGIES: Array<(colors: RGB[], theme: RGB) => RGB[]> = [
  // 0. Math: evenly spaced from theme hue
  (_, theme) => {
    const hsl = rgbToHsl(theme)
    return [0, 60, 120, 180, 240, 300].map((offset) =>
      hslToRgb((hsl.h + offset) % 360, Math.max(hsl.s, 60), 50)
    )
  },

  // 1. Math: spaced shifted by 30°
  (_, theme) => {
    const hsl = rgbToHsl(theme)
    return [30, 90, 150, 210, 270, 330].map((offset) =>
      hslToRgb((hsl.h + offset) % 360, Math.max(hsl.s, 65), 50)
    )
  },

  // 2. Math: analogous cluster + complements
  (_, theme) => {
    const hsl = rgbToHsl(theme)
    return [0, 20, 40, 180, 200, 220].map((offset) =>
      hslToRgb((hsl.h + offset) % 360, Math.max(hsl.s, 65), 50)
    )
  },

  // 3. ✅ DOMINANT: all 6 from diverse dominants directly
  (colors, _) => {
    const diverse = pickDiverseColors(colors, 6)
    // Boost saturation for chart visibility
    return diverse.map((c) => {
      const hsl = rgbToHsl(c)
      return hslToRgb(
        hsl.h,
        Math.max(hsl.s, 55),
        Math.min(Math.max(hsl.l, 40), 65)
      )
    })
  },

  // 4. ✅ DOMINANT: 3 dominants + 3 math fill
  (colors, theme) => {
    const fromDom = pickDiverseColors(colors, 3).map((c) => {
      const hsl = rgbToHsl(c)
      return hslToRgb(
        hsl.h,
        Math.max(hsl.s, 60),
        Math.min(Math.max(hsl.l, 40), 60)
      )
    })
    const hsl = rgbToHsl(theme)
    const synthetic = [90, 180, 270].map((offset) =>
      hslToRgb((hsl.h + offset) % 360, 65, 50)
    )
    return [...fromDom, ...synthetic]
  },

  // 5. ✅ DOMINANT: random 6 from dominants, lightness normalized
  (colors, _) => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 6)
    return shuffled.map((c) => {
      const hsl = rgbToHsl(c)
      return hslToRgb(hsl.h, Math.max(hsl.s, 55), 50) // normalize lightness to 50
    })
  },

  // 6. ✅ DOMINANT: pick dominant per hue zone (red, yellow, green, cyan, blue, purple)
  (colors, _) => {
    const zones = [
      { min: 330, max: 30 }, // red
      { min: 30, max: 90 }, // yellow/orange
      { min: 90, max: 150 }, // green
      { min: 150, max: 210 }, // cyan
      { min: 210, max: 270 }, // blue
      { min: 270, max: 330 }, // purple
    ]

    return zones.map((zone) => {
      const inZone = colors.filter((c) => {
        const h = rgbToHsl(c).h
        return zone.min > zone.max
          ? h >= zone.min || h < zone.max // wraps around 0°
          : h >= zone.min && h < zone.max
      })

      if (inZone.length > 0) {
        // Pick most saturated in this zone
        const best = inZone.reduce((b, c) =>
          rgbToHsl(c).s > rgbToHsl(b).s ? c : b
        )
        const hsl = rgbToHsl(best)
        return hslToRgb(hsl.h, Math.max(hsl.s, 55), 50)
      }

      // No dominant in this zone → synthesize from zone center
      const centerHue = ((zone.min + zone.max) / 2) % 360
      return hslToRgb(centerHue, 65, 50)
    })
  },

  // 7. ✅ DOMINANT: random dominant hue + math lightness variation
  (colors, _) => {
    const picked = rand(colors)
    const hsl = rgbToHsl(picked)
    return [35, 45, 50, 55, 60, 65].map((l) =>
      hslToRgb(hsl.h, Math.max(hsl.s, 60), l)
    )
  },
]
// ============================================================
// HELPER: Clamp lightness to a visible range
// ============================================================
function clampL(l: number, min: number, max: number): number {
  return Math.min(Math.max(l, min), max)
}

// ============================================================
// SHUFFLE SEED: Guaranteed different from last seed
// ============================================================
let lastSeed: ShuffleSeed | null = null

export function generateShuffleSeedOnStrategies(
  locks: ThemeState["locks"]
): ShuffleSeed {
  let seed: ShuffleSeed
  let attempts = 0

  do { 
    seed = {
      baseStrategy: locks.base
        ? 0
        : Math.floor(Math.random() * BASE_STRATEGIES.length),
      themeStrategy: locks.theme
        ? 0
        : Math.floor(Math.random() * THEME_STRATEGIES.length),
      accentStrategy: Math.floor(Math.random() * ACCENT_STRATEGIES.length),
      chartStrategy: locks.chart
        ? 0
        : Math.floor(Math.random() * CHART_STRATEGIES.length),
    }
    attempts++
  } while (
    attempts < 10 && // safety cap
    lastSeed !== null &&
    seed.baseStrategy === lastSeed.baseStrategy &&
    seed.themeStrategy === lastSeed.themeStrategy &&
    seed.accentStrategy === lastSeed.accentStrategy &&
    seed.chartStrategy === lastSeed.chartStrategy
  )

  lastSeed = seed
  return seed
}

export function generateShuffleSeedOnDominantColors(
  locks: ThemeState["locks"], dominantColors:RGB[]
): ShuffleSeed {
  let seed: ShuffleSeed
  let attempts = 0

  do {
    seed = {
      baseStrategy: locks.base
        ? 0
        : Math.floor(Math.random() * dominantColors.length),
      themeStrategy: locks.theme
        ? 0
        : Math.floor(Math.random() * dominantColors.length),
      accentStrategy: Math.floor(Math.random() * dominantColors.length),
      chartStrategy: locks.chart
        ? 0
        : Math.floor(Math.random() * dominantColors.length),
    }
    attempts++
  } while (
    attempts < 10 && // safety cap
    lastSeed !== null &&
    seed.baseStrategy === lastSeed.baseStrategy &&
    seed.themeStrategy === lastSeed.themeStrategy &&
    seed.accentStrategy === lastSeed.accentStrategy &&
    seed.chartStrategy === lastSeed.chartStrategy
  )

  lastSeed = seed
  return seed
}
