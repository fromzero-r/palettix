import type { COLOR_TYPES } from "@/const/const"

/* -------------------------------------------------------------------------- */
/*                                   COLORS                                   */
/* -------------------------------------------------------------------------- */

export type RGB = [number, number, number, number?]

export interface HSL {
  h: number
  s: number
  l: number
}

export type ColorFormatName = "hex" | "rgba" | "hsl" | "oklch"

export type ColorTypes = (typeof COLOR_TYPES)[number]

export type ColorCategory =
  | "near-white"
  | "near-black"
  | "neutral"
  | "vibrant"
  | "pastel"
  | "deep"

export interface ColorProps {
  code: string
  color: string
}

export type ColorFormatsMap = Record<ColorFormatName, ColorProps>

export type ShadeFormats = Record<number, ColorFormatsMap>

export type ColorCache = {
  primaryShades: ShadeFormats
  extendedShades: ShadeFormats
}

export type ColorCodes = {
  hex: { code: string; color: string }
  rgba: { code: string; color: string }
  hsl: { code: string; color: string }
  oklch: { code: string; color: string }
}

export interface AnalyzedColor {
  rgb: RGB
  hsl: HSL
  category: ColorCategory
  warmth: "warm" | "cool" | "neutral"
  vibrancy: number
}

export interface RoleAssignment {
  neutral: RGB
  brand: RGB
  accent: RGB
  extras: RGB[]
}

/* -------------------------------------------------------------------------- */
/*                                THEME TOKENS                                */
/* -------------------------------------------------------------------------- */

export type ThemeVars =
  // Core
  | "--background"
  | "--foreground"
  | "--card"
  | "--card-foreground"
  | "--popover"
  | "--popover-foreground"
  | "--primary"
  | "--primary-foreground"
  | "--secondary"
  | "--secondary-foreground"
  | "--muted"
  | "--muted-foreground"
  | "--accent"
  | "--accent-foreground"
  | "--destructive"
  | "--destructive-foreground"
  | "--border"
  | "--input"
  | "--ring"

  // Charts (shadcn)
  | "--chart-1"
  | "--chart-2"
  | "--chart-3"
  | "--chart-4"
  | "--chart-5"

  // Sidebar
  | "--sidebar"
  | "--sidebar-foreground"
  | "--sidebar-border"
  | "--sidebar-accent"
  | "--sidebar-accent-foreground"
  | "--sidebar-primary"
  | "--sidebar-primary-foreground"
  | "--sidebar-ring"

  // Surfaces
  | "--surface-1"
  | "--surface-2"
  | "--surface-3"
  | "--surface-4"
  | "--surface-5"
  | "--surface-6"
  | "--surface-7"
  | "--surface-8"
  | "--surface-9"
  | "--surface-10"
  | "--surface-foreground"
  | "--surface-foreground-muted"

  // Semantic
  | "--success"
  | "--success-foreground"
  | "--success-muted"
  | "--warning"
  | "--warning-foreground"
  | "--warning-muted"
  | "--info"
  | "--info-foreground"
  | "--info-muted"
  | "--error"
  | "--error-foreground"
  | "--error-muted"

  // Text
  | "--text-primary"
  | "--text-secondary"
  | "--text-tertiary"
  | "--text-placeholder"
  | "--text-disabled"
  | "--text-link"
  | "--text-link-hover"

  // Borders
  | "--border-subtle"
  | "--border-strong"
  | "--border-focus"

  // Shadows
  | "--shadow-sm"
  | "--shadow-md"
  | "--shadow-lg"
  | "--shadow-color"

  // Extended Charts
  | "--chart-6"
  | "--chart-positive"
  | "--chart-negative"
  | "--chart-neutral"
  | "--chart-grid"
  | "--chart-label"

  // Skeleton
  | "--skeleton-base"
  | "--skeleton-highlight"

/* -------------------------------------------------------------------------- */
/*                               APPLICATION DATA                             */
/* -------------------------------------------------------------------------- */

export interface ShuffleSeed {
  baseStrategy: number
  chartStrategy: number
  themeStrategy: number
  accentStrategy: number
}

export interface ThemeState {
  cssVars: Record<"root" | "dark", Record<ThemeVars, string>>

  selections: {
    base: { livePreview: boolean; color: string }
    theme: { livePreview: boolean; color: string }
    chart: { livePreview: boolean; color: string }
  }

  locks: {
    base: boolean
    theme: boolean
    chart: boolean
  }

  mode: "classic" | "smart" | "funky" | "manual"

  activeColor: RGB
  dominantColors: ColorCodes[]

  shades: {
    primary: ShadeFormats
    extended: ShadeFormats
  }

  colorFormats: {
    hex: Record<string, string>
    rgba: Record<string, string>
    hsl: Record<string, string>
    oklch: Record<string, string>
  }
}

export type NewThemeProps = {
  cssVars: ThemeState["cssVars"]
  selections: ThemeState["selections"]
}

export type UserPreferedThemeTokens = {
  [x in ColorTypes]: ThemeState["cssVars"]
}

export interface ColorList {
  dominantColors: {
    title: "Image colors"
    data: RGB[]
  }

  tailwindColors: {
    title: "Tailwind colors"
    data: {
      name?: string
      color: string
    }[]
  }

  customColor: {
    title: "Custom color"
    data: { color: string }
  }
}

/* -------------------------------------------------------------------------- */
/*                             COLOR ROLE SYSTEM                              */
/* -------------------------------------------------------------------------- */

export type ColorRole = "base" | "theme" | "chart"

export interface HSLRange {
  satMin: number
  satMax: number
  lightMin: number
  lightMax: number
}

export interface RoleDefinition {
  fitness: HSLRange
  target: {
    sat: number
    light: number
  }
}

export const ROLE_DEFINITIONS: Record<ColorRole, RoleDefinition> = {
  base: {
    fitness: {
      satMin: 0,
      satMax: 14,
      lightMin: 20,
      lightMax: 80,
    },
    target: {
      sat: 6,
      light: 50,
    },
  },

  theme: {
    fitness: {
      satMin: 45,
      satMax: 82,
      lightMin: 36,
      lightMax: 60,
    },
    target: {
      sat: 62,
      light: 48,
    },
  },

  chart: {
    fitness: {
      satMin: 55,
      satMax: 90,
      lightMin: 43,
      lightMax: 57,
    },
    target: {
      sat: 65,
      light: 50,
    },
  },
}

/* -------------------------------------------------------------------------- */
/*                           COLOR VARIATION SYSTEM                           */
/* -------------------------------------------------------------------------- */

export const VARIANT_AXES = {
  base: {
    hueShifts: [-8, 0, 8],
    satSteps: [4, 6, 9, 12],
    lightSteps: [48, 50, 52],
  },

  theme: {
    hueShifts: [-12, -6, 0, 6, 12],
    satSteps: [48, 55, 62, 70, 78],
    lightSteps: [40, 45, 50, 55],
  },

  chart: {
    hueShifts: [-8, 0, 8],
    satSteps: [58, 65, 72],
    lightSteps: [47, 50, 53],
  },
} satisfies Record<
  ColorRole,
  {
    hueShifts: number[]
    satSteps: number[]
    lightSteps: number[]
  }
>
