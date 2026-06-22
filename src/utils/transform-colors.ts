import type { ColorCodes, HSL, RGB, ShadeFormats } from "@/global_types/types"

// ============================================================================
// 1. PARSERS & INPUT TRANSFORMERS (String -> Array/Object Structures)
// ============================================================================

/**
 * Converts a HEX or HEXA string into an RGB/RGBA number array.
 */
export function hexToRgbArray(hex: string): RGB {
  const clean = hex.replace("#", "")
  const hasAlpha = clean.length === 8

  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)

  if (hasAlpha) {
    const a = parseFloat((parseInt(clean.substring(6, 8), 16) / 255).toFixed(2))
    return [r, g, b, a]
  }

  return [r, g, b]
}

/**
 * Extracts numeric values from an RGBA functional string into a number array.
 */
export function transformRgbaCodeToRgbaNumberArray(colorString: string): RGB {
  const matches = String(colorString).match(/\d+(?:\.\d+)?/g)

  if (!matches || matches.length < 3 || matches.length > 4) {
    return [0, 0, 0, 1] // Safe fallback array
  }

  return matches.map((numStr, index) => {
    return index === 3 ? parseFloat(numStr) : parseInt(numStr, 10)
  }) as RGB
}

/**
 * Parses any standard or legacy CSS RGB/RGBA string directly into an HSL object.
 */
export function transformRgbaToHsl(colorStr: string): HSL {
  const match = colorStr.match(/\(([^)]+)\)/)
  if (!match) {
    throw new Error(`Invalid color string format: "${colorStr}"`)
  }

  const channels = match[1]
    .replace(/\//g, " ")
    .trim()
    .split(/[\s,]+/)

  if (channels.length < 3) {
    throw new Error(`Incomplete color channels found in string: "${colorStr}"`)
  }

  const r = Math.max(0, Math.min(255, parseInt(channels[0], 10)))
  const g = Math.max(0, Math.min(255, parseInt(channels[1], 10)))
  const b = Math.max(0, Math.min(255, parseInt(channels[2], 10)))

  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)
        break
      case gNorm:
        h = (bNorm - rNorm) / delta + 2
        break
      case bNorm:
        h = (rNorm - gNorm) / delta + 4
        break
    }
    h *= 60
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Parses an HSL string layout into structured numeric HSL coordinates.
 */
export function parseHsl(hslCode: string): { h: number; s: number; l: number } {
  const match = hslCode.match(/([\d.]+)°?,\s*([\d.]+)%,\s*([\d.]+)%/)
  return {
    h: parseFloat(match![1]),
    s: parseFloat(match![2]),
    l: parseFloat(match![3]),
  }
}

/**
 * Decodes an oklch() CSS string string into standard sRGB numerical space.
 */
export function oklchStringToRgb(oklchStr: string): RGB {
  const regex = /oklch\s*\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/i
  const match = oklchStr.match(regex)

  if (!match) {
    throw new Error(`Invalid OKLCH string format: "${oklchStr}"`)
  }

  const isPercent = oklchStr.includes("%")
  let L = parseFloat(match[1])
  if (isPercent || L > 1) {
    L /= 100
  }

  const C = parseFloat(match[2])
  const h = parseFloat(match[3])

  const hRad = (h * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  const rLinear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const transfer = (c: number): number => {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
  }

  const clampAndScale = (val: number): number => {
    const srgb = transfer(val)
    const clamped = Math.max(0, Math.min(1, srgb))
    return Math.round(clamped * 255)
  }

  return [
    clampAndScale(rLinear),
    clampAndScale(gLinear),
    clampAndScale(bLinear),
  ]
}

// ============================================================================
// 2. CORE MATHEMATICAL CONVERSIONS (Data Structure -> Data Structure)
// ============================================================================

/**
 * Transforms numerical RGB array bounds into standard HSL map values.
 */
export function rgbToHsl([r, g, b, a]: RGB): {
  h: number
  s: number
  l: number
  a?: number
} {
  const rN = r / 255,
    gN = g / 255,
    bN = b / 255
  const max = Math.max(rN, gN, bN),
    min = Math.min(rN, gN, bN)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rN:
        h = (gN - bN) / d + (gN < bN ? 6 : 0)
        break
      case gN:
        h = (bN - rN) / d + 2
        break
      case bN:
        h = (rN - gN) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    ...(a !== undefined && { a: Math.max(0, Math.min(1, a)) }),
  }
}

/**
 * Transforms individual HSL channels back into mathematical RGB components.
 */
export function hslToRgb(h: number, s: number, l: number, a?: number): RGB {
  const sNorm = s / 100
  const lNorm = l / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r = lNorm,
    g = lNorm,
    b = lNorm

  if (sNorm !== 0) {
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm
    const p = 2 * lNorm - q
    const hNorm = h / 360
    r = hue2rgb(p, q, hNorm + 1 / 3)
    g = hue2rgb(p, q, hNorm)
    b = hue2rgb(p, q, hNorm - 1 / 3)
  }

  const rByte = Math.round(r * 255)
  const gByte = Math.round(g * 255)
  const bByte = Math.round(b * 255)

  return a !== undefined ? [rByte, gByte, bByte, a] : [rByte, gByte, bByte]
}

/**
 * Typed object adapter wrapping the functional `rgbToHsl` operation.
 */
export function rgbToHslColor(rgb: RGB): HSL {
  return rgbToHsl(rgb)
}

/**
 * Typed object adapter wrapping the functional `hslToRgb` operation.
 */
export function hslToRgbColor(hsl: HSL): RGB {
  return hslToRgb(hsl.h, hsl.s, hsl.l)
}

// ============================================================================
// 3. FORMATTERS & OUTPUT GENERATORS (Data -> Valid CSS Output Strings)
// ============================================================================

/**
 * Formats an RGB input tuple into an industrial 6-digit or 8-digit HEX string format.
 */
export function rgbToHex([r, g, b, a]: RGB): string {
  let hex =
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()

  if (a !== undefined && a < 1) {
    hex += Math.round(a * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase()
  }
  return hex
}

/**
 * Formats an RGB array into a standard CSS comma-separated functional string layout.
 */
export function rgbToRgbaString([r, g, b, a = 1]: RGB): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/**
 * Formats an RGB raw tuple into a modern space-separated functional CSS hsl() expression.
 */
export function rgbToHslString([r, g, b, a]: RGB): string {
  const { h: hDeg, s: sPct, l: lPct } = rgbToHsl([r, g, b, a])
  const alpha = a !== undefined && a < 1 ? ` / ${a}` : ""

  return `hsl(${hDeg} ${sPct}% ${lPct}%${alpha})`
}

/**
 * Converts a baseline RGB parameter block into a calibrated space-separated oklch() string.
 */
export function rgbToOklchString([r, g, b, a]: RGB): string {
  const linear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  const lR = linear(r / 255),
    gG = linear(g / 255),
    lB = linear(b / 255)

  const lSpace = 0.4122214708 * lR + 0.5363325363 * gG + 0.0514459929 * lB
  const mSpace = 0.2119034982 * lR + 0.6806995451 * gG + 0.1073969566 * lB
  const sSpace = 0.0883024619 * lR + 0.2817188376 * gG + 0.6299787005 * lB

  const l_ = Math.cbrt(lSpace),
    m_ = Math.cbrt(mSpace),
    s_ = Math.cbrt(sSpace)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const ak = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bO = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const c = Math.sqrt(ak * ak + bO * bO)
  let hue = Math.atan2(bO, ak) * (180 / Math.PI)
  if (hue < 0) hue += 360

  const alpha = a !== undefined && a < 1 ? ` / ${a}` : ""

  return `oklch(${L.toFixed(3)} ${c.toFixed(3)} ${hue.toFixed(1)}${alpha})`
}

// ============================================================================
// 4. COMPLEX ARCHITECTURES (Theme Matrix & Palette Generation Systems)
// ============================================================================

/**
 * Creates a higher-order engine to dynamically construct standard UI scaling tint and shade profiles.
 */
export function generateShadeFormats() {
  const PRIMARY_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  const EXTENDED_SHADES = [
    50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
    800, 850, 900, 950,
  ]

  const LIGHTNESS_MAP: Record<number, number> = {
    50: 97,
    100: 93,
    150: 90,
    200: 86,
    250: 82,
    300: 76,
    350: 70,
    400: 63,
    450: 57,
    500: 52,
    550: 47,
    600: 42,
    650: 37,
    700: 33,
    750: 28,
    800: 24,
    850: 19,
    900: 15,
    950: 9,
  }

  const SATURATION_MAP: Record<number, number> = {
    50: 0.25,
    100: 0.35,
    150: 0.42,
    200: 0.5,
    250: 0.6,
    300: 0.7,
    350: 0.78,
    400: 0.85,
    450: 0.93,
    500: 1.0,
    550: 1.03,
    600: 1.05,
    650: 1.03,
    700: 1.0,
    750: 0.95,
    800: 0.9,
    850: 0.82,
    900: 0.75,
    950: 0.65,
  }

  return function (op: {
    type: "primaryShades" | "extendedShades"
    colorInput: RGB
  }) {
    const { type, colorInput } = op
    const primaryShadesArray: ShadeFormats = {}
    const extendedShadesArray: ShadeFormats = {}

    const shadeStops =
      type === "primaryShades" ? PRIMARY_SHADES : EXTENDED_SHADES
    const [rBase, gBase, bBase, aInput] = colorInput
    const a =
      aInput !== undefined && aInput !== null
        ? Math.max(0, Math.min(1, aInput))
        : 1

    const { h: hDeg, s: sPct } = rgbToHsl([rBase, gBase, bBase])
    // const hNorm = hDeg / 360
    const targetArray =
      type === "primaryShades" ? primaryShadesArray : extendedShadesArray

    for (const shadeNumber of shadeStops) {
      const stepL = LIGHTNESS_MAP[shadeNumber]
      const stepS = Math.min(100, sPct * SATURATION_MAP[shadeNumber])

      const [rByte, gByte, bByte] = hslToRgb(hDeg, stepS, stepL)

      const toHexStr = (val: number) => val.toString(16).padStart(2, "0")
      let hexCode = "#" + toHexStr(rByte) + toHexStr(gByte) + toHexStr(bByte)
      if (a < 1) hexCode += toHexStr(Math.round(a * 255))
      hexCode = hexCode.toUpperCase()

      const linear = (c: number) =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      const lR = linear(rByte / 255),
        lG = linear(gByte / 255),
        lB = linear(bByte / 255)
      const lSpace = 0.4122214708 * lR + 0.5363325363 * lG + 0.0514459929 * lB
      const mSpace = 0.2119034982 * lR + 0.6806995451 * lG + 0.1073969566 * lB
      const sSpace = 0.0883024619 * lR + 0.2817188376 * lG + 0.6299787005 * lB

      const l_ = Math.cbrt(lSpace),
        m_ = Math.cbrt(mSpace),
        s_ = Math.cbrt(sSpace)
      const oklabL = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
      const oklabA = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
      const oklabB = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

      const chroma = Math.sqrt(oklabA * oklabA + oklabB * oklabB)
      let hueDeg = Math.atan2(oklabB, oklabA) * (180 / Math.PI)
      if (hueDeg < 0) hueDeg += 360

      const okL = parseFloat(oklabL.toFixed(3))
      const okC = parseFloat(chroma.toFixed(3))
      const okH = parseFloat(hueDeg.toFixed(1))

      targetArray[shadeNumber] = {
        hex: { code: hexCode, color: hexCode },
        rgba: {
          code: `(${rByte}, ${gByte}, ${bByte}${a < 1 ? `, ${a}` : ", 1"})`,
          color:
            a < 1
              ? `rgba(${rByte}, ${gByte}, ${bByte}, ${a})`
              : `rgba(${rByte}, ${gByte}, ${bByte})`,
        },
        hsl: {
          code: `(${hDeg}, ${Math.round(stepS)}%, ${Math.round(stepL)}%${a < 1 ? ` / ${a}` : ""})`,
          color: `hsl(${hDeg} ${Math.round(stepS)}% ${Math.round(stepL)}%${a < 1 ? ` / ${a}` : ""})`,
        },
        oklch: {
          code: `(${okL} ${okC} ${okH}${a < 1 ? ` / ${a}` : ""})`,
          color: `oklch(${okL} ${okC} ${okH}${a < 1 ? ` / ${a}` : ""})`,
        },
      }
    }
    return type === "primaryShades" ? primaryShadesArray : extendedShadesArray
  }
}

/**
 * Pre-instantiated shared variable reference utilizing the generated shades closure wrapper setup.
 */
export const getAccumulatedShadesFormats = generateShadeFormats()

/**
 * Builds a global metadata map outlining comprehensive alternate color code variations for an input.
 */
export function generateColorCodes(
  color: RGB | string | Uint8ClampedArray
): ColorCodes {
  let r = 0,
    g = 0,
    b = 0

  if (typeof color === "string") {
    ;[r, g, b] = hexToRgbArray(color)
  } else {
    r = color[0] ?? 0
    g = color[1] ?? 0
    b = color[2] ?? 0
  }

  const hex =
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")

  const { h: hDeg, s: sPct, l: lPct } = rgbToHsl([r, g, b])

  const linear = [r / 255, g / 255, b / 255].map((v) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  )

  const l_Oklab =
    0.4122214708 * linear[0] +
    0.5363325363 * linear[1] +
    0.0514459929 * linear[2]
  const m_Oklab =
    0.2119034982 * linear[0] +
    0.6806995451 * linear[1] +
    0.1073969566 * linear[2]
  const s_Oklab =
    0.0883024619 * linear[0] +
    0.2817188376 * linear[1] +
    0.6299787005 * linear[2]

  const lCbrt = Math.cbrt(l_Oklab)
  const mCbrt = Math.cbrt(m_Oklab)
  const sCbrt = Math.cbrt(s_Oklab)

  const L = 0.2104542553 * lCbrt + 0.793617785 * mCbrt - 0.0040717203 * sCbrt
  const A = 1.9779984951 * lCbrt - 2.428592205 * mCbrt + 0.4505937099 * sCbrt
  const B = 0.0259040371 * lCbrt + 0.7827717662 * mCbrt - 0.808675766 * sCbrt

  const OKLCH_C = Math.sqrt(A * A + B * B)
  let OKLCH_H = Math.atan2(B, A) * (180 / Math.PI)
  if (OKLCH_H < 0) OKLCH_H += 360

  const okL = L.toFixed(3)
  const okC = OKLCH_C.toFixed(3)
  const okH = Math.round(OKLCH_H)

  return {
    hex: { code: hex, color: hex },
    rgba: { code: `(${r}, ${g}, ${b}, 1)`, color: `rgba(${r}, ${g}, ${b}, 1)` },
    hsl: {
      code: `(${hDeg}deg ${sPct}% ${lPct}%)`,
      color: `hsl(${hDeg}deg ${sPct}% ${lPct}%)`,
    },
    oklch: {
      code: `(${okL} ${okC} ${okH})`,
      color: `oklch(${okL} ${okC} ${okH})`,
    },
  }
}
