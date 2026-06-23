import {
  type RGB,
  type ShadeFormats,
  type ShuffleSeed,
  type NewThemeProps,
  type ThemeState,
  type AnalyzedColor,
  type RoleAssignment,
  VARIANT_AXES,
  type ColorRole,
  type HSLRange,
  ROLE_DEFINITIONS,
  type HSL,
} from "@/global_types/types"
import {
  generateShadeFormats,
  transformRgbaCodeToRgbaNumberArray,
  hslToRgb,
  rgbToHsl,
  rgbToRgbaString,
  transformRgbaToHsl,
  hslToRgbColor,
  rgbToHslColor,
} from "@/utils/transform-colors"
import {
  BASE_STRATEGIES,
  THEME_STRATEGIES,
  ACCENT_STRATEGIES,
  CHART_STRATEGIES,
  generateShuffleSeedOnStrategies,
  generateShuffleSeedOnDominantColors,
} from "./startegies"

// Contextual initialization within module scope
const getShades = generateShadeFormats()

/* ============================================================================
   DOM THEME APPLICATION ENGINE
   ============================================================================ */

/**
 * Batch-applies computed theme design tokens directly to the document root.
 * Maximizes performance via an atomic, single-reflow inline style injection.
 * * NOTE: `cssText` intentionally overwrites all existing inline assignments
 * on the <html> node to cleanly reset the runtime token configuration.
 */
export function applyThemeToDOM(cssVars: ThemeState["cssVars"]): void {
  const rootElement = document.documentElement
  const isDarkMode = rootElement.classList.contains("dark")

  // Pivot to the target viewport palette layer
  const activeVars = isDarkMode ? cssVars.dark : cssVars.root

  // Compile active variables into a unified token matrix string
  const cssString = Object.entries(activeVars)
    .map(([property, value]) => `${property}: ${value};`)
    .join(" ")

  // Atomic pipeline commit
  rootElement.style.cssText = cssString
}

/* ==================================================================
      Main Functions For Different Theme Geneartion Strategies
   ================================================================= */

/* ============================================================================
   CLASSIC THEME GENERATION ENGINE
   ============================================================================ */

/**
 * Procedurally computes theme tokens using direct dominant color extractions
 * and structured weight scales.
 */
export function generateClassicTheme(
  dominantColors: RGB[],
  userSelections: ThemeState["selections"],
  locks: ThemeState["locks"],
  shuffleTheme: boolean,
  seed?: ShuffleSeed
): NewThemeProps {
  // ── 1. CORE COLOR RESOLUTION ROUTINE ───────────────────────────────────────
  // Abstracts nested ternaries into a clean localized evaluation check.

  const resolveColor = (
    isLocked: boolean,
    selectionColor: string,
    strategy: any
  ): RGB => {
    return isLocked || !shuffleTheme
      ? transformRgbaCodeToRgbaNumberArray(selectionColor)
      : getRandomDominant(strategy, dominantColors)
  }

  const base = resolveColor(
    locks.base,
    userSelections.base.color,
    seed?.baseStrategy
  )
  const theme = resolveColor(
    locks.theme,
    userSelections.theme.color,
    seed?.themeStrategy
  )
  const chart = resolveColor(
    locks.chart,
    userSelections.chart.color,
    seed?.chartStrategy
  )

  // NOTE: Accent intentionally maps to theme selections/locks per legacy criteria
  const accent = resolveColor(
    locks.theme,
    userSelections.theme.color,
    seed?.accentStrategy
  )

  // Fallback structural semantic red base
  const destructive = findRedish(dominantColors) ?? hslToRgb(0, 72, 50)

  // ── 2. TONAL MATRIX GENERATION ─────────────────────────────────────────────
  // Compiles full tonal scales for the layout token calculations.

  const baseShades = getShades({ type: "extendedShades", colorInput: base })
  const themeShades = getShades({ type: "extendedShades", colorInput: theme })
  const accentShades = getShades({ type: "extendedShades", colorInput: accent })
  const chartShades = getShades({ type: "extendedShades", colorInput: chart })
  const destructiveShades = getShades({
    type: "extendedShades",
    colorInput: destructive,
  })

  // ── 3. TOKENS GENERATION MAP (RETURN) ─────────────────────────────────────

  return {
    cssVars: {
      root: {
        // Core Layout Foundations (Base Structural)
        "--background": shade(baseShades, 50),
        "--foreground": shade(baseShades, 950),
        "--card": shade(baseShades, 100),
        "--card-foreground": shade(baseShades, 950),
        "--popover": shade(baseShades, 50),
        "--popover-foreground": shade(baseShades, 950),
        "--muted": shade(baseShades, 100),
        "--muted-foreground": shade(baseShades, 500),
        "--border": shade(baseShades, 200),
        "--input": shade(baseShades, 200),
        "--ring": shade(themeShades, 600),

        // Brand & Interaction
        "--primary": shade(themeShades, 600),
        "--primary-foreground": shade(themeShades, 50),
        "--secondary": shade(baseShades, 100),
        "--secondary-foreground": shade(baseShades, 900),
        "--accent": shade(accentShades, 100),
        "--accent-foreground": shade(accentShades, 800),
        "--destructive": shade(destructiveShades, 600),
        "--destructive-foreground": shade(destructiveShades, 50),

        // App Sidebar Navigation Layout
        "--sidebar": shade(baseShades, 50),
        "--sidebar-foreground": shade(baseShades, 900),
        "--sidebar-border": shade(baseShades, 200),
        "--sidebar-accent": shade(accentShades, 100),
        "--sidebar-accent-foreground": shade(accentShades, 900),
        "--sidebar-primary": shade(themeShades, 600),
        "--sidebar-primary-foreground": shade(themeShades, 50),
        "--sidebar-ring": shade(themeShades, 600),

        // Progressive Surface Elevations (Strict Theme Shades)
        "--surface-1": shade(themeShades, 50),
        "--surface-2": shade(themeShades, 100),
        "--surface-3": shade(themeShades, 200),
        "--surface-4": shade(themeShades, 300),
        "--surface-5": shade(themeShades, 400),
        "--surface-6": shade(themeShades, 500),
        "--surface-7": shade(themeShades, 600),
        "--surface-8": shade(themeShades, 700),
        "--surface-9": shade(themeShades, 800),
        "--surface-10": shade(themeShades, 950),
        "--surface-foreground": shade(themeShades, 950),
        "--surface-foreground-muted": shade(themeShades, 600),

        // Functional UX Notification States
        "--success": shade(themeShades, 600),
        "--success-foreground": shade(themeShades, 50),
        "--success-muted": shade(themeShades, 100),
        "--warning": shade(accentShades, 600),
        "--warning-foreground": shade(accentShades, 50),
        "--warning-muted": shade(accentShades, 100),
        "--info": shade(themeShades, 500),
        "--info-foreground": shade(themeShades, 50),
        "--info-muted": shade(themeShades, 100),
        "--error": shade(destructiveShades, 600),
        "--error-foreground": shade(destructiveShades, 50),
        "--error-muted": shade(destructiveShades, 100),

        // Typography Hierarchy
        "--text-primary": shade(baseShades, 950),
        "--text-secondary": shade(baseShades, 700),
        "--text-tertiary": shade(baseShades, 500),
        "--text-placeholder": shade(baseShades, 400),
        "--text-disabled": shade(baseShades, 300),
        "--text-link": shade(themeShades, 600),
        "--text-link-hover": shade(themeShades, 700),

        // Specialized Border Variants
        "--border-subtle": shade(baseShades, 100),
        "--border-strong": shade(baseShades, 400),
        "--border-focus": shade(themeShades, 600),

        // Depth Shadows
        "--shadow-color": shade(baseShades, 950),
        "--shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "--shadow-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "--shadow-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",

        // Analytical Spectrum Visualization
        "--chart-1": shade(chartShades, 400),
        "--chart-2": shade(chartShades, 500),
        "--chart-3": shade(chartShades, 600),
        "--chart-4": shade(chartShades, 700),
        "--chart-5": shade(chartShades, 800),
        "--chart-6": shade(chartShades, 900),
        "--chart-positive": shade(themeShades, 600),
        "--chart-negative": shade(destructiveShades, 600),
        "--chart-neutral": shade(baseShades, 500),
        "--chart-grid": shade(baseShades, 200),
        "--chart-label": shade(baseShades, 500),

        // Content Loading Framework
        "--skeleton-base": shade(baseShades, 200),
        "--skeleton-highlight": shade(baseShades, 100),
      },

      dark: {
        // Inverted Core Foundations (Dark Base Structural)
        "--background": shade(baseShades, 950),
        "--foreground": shade(baseShades, 50),
        "--card": shade(baseShades, 900),
        "--card-foreground": shade(baseShades, 50),
        "--popover": shade(baseShades, 900),
        "--popover-foreground": shade(baseShades, 50),
        "--muted": shade(baseShades, 800),
        "--muted-foreground": shade(baseShades, 300),
        "--border": shade(baseShades, 700),
        "--input": shade(baseShades, 700),
        "--ring": shade(themeShades, 300),

        // Inverted Brand Components
        "--primary": shade(themeShades, 300),
        "--primary-foreground": shade(themeShades, 950),
        "--secondary": shade(baseShades, 800),
        "--secondary-foreground": shade(baseShades, 50),
        "--accent": shade(accentShades, 700),
        "--accent-foreground": shade(accentShades, 50),
        "--destructive": shade(destructiveShades, 400),
        "--destructive-foreground": shade(destructiveShades, 950),

        // Inverted App Sidebar Navigation
        "--sidebar": shade(baseShades, 950),
        "--sidebar-foreground": shade(baseShades, 50),
        "--sidebar-border": shade(baseShades, 700),
        "--sidebar-accent": shade(accentShades, 700),
        "--sidebar-accent-foreground": shade(accentShades, 50),
        "--sidebar-primary": shade(themeShades, 300),
        "--sidebar-primary-foreground": shade(themeShades, 950),
        "--sidebar-ring": shade(themeShades, 300),

        // Inverted Progressive Surfaces (Theme Shades Inverted)
        "--surface-1": shade(themeShades, 950),
        "--surface-2": shade(themeShades, 900),
        "--surface-3": shade(themeShades, 800),
        "--surface-4": shade(themeShades, 700),
        "--surface-5": shade(themeShades, 600),
        "--surface-6": shade(themeShades, 500),
        "--surface-7": shade(themeShades, 400),
        "--surface-8": shade(themeShades, 300),
        "--surface-9": shade(themeShades, 200),
        "--surface-10": shade(themeShades, 50),
        "--surface-foreground": shade(themeShades, 50),
        "--surface-foreground-muted": shade(themeShades, 300),

        // Inverted Semantic Status Layout Channels
        "--success": shade(themeShades, 300),
        "--success-foreground": shade(themeShades, 950),
        "--success-muted": shade(themeShades, 900),
        "--warning": shade(accentShades, 300),
        "--warning-foreground": shade(accentShades, 950),
        "--warning-muted": shade(accentShades, 900),
        "--info": shade(themeShades, 300),
        "--info-foreground": shade(themeShades, 950),
        "--info-muted": shade(themeShades, 900),
        "--error": shade(destructiveShades, 400),
        "--error-foreground": shade(destructiveShades, 950),
        "--error-muted": shade(destructiveShades, 900),

        // Dark Typography Token Framework
        "--text-primary": shade(baseShades, 50),
        "--text-secondary": shade(baseShades, 200),
        "--text-tertiary": shade(baseShades, 400),
        "--text-placeholder": shade(baseShades, 600),
        "--text-disabled": shade(baseShades, 700),
        "--text-link": shade(themeShades, 300),
        "--text-link-hover": shade(themeShades, 200),

        // Borders Framework Inverted
        "--border-subtle": shade(baseShades, 800),
        "--border-strong": shade(baseShades, 500),
        "--border-focus": shade(themeShades, 300),

        // High Contrast Deep Shadows
        "--shadow-color": shade(baseShades, 950),
        "--shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
        "--shadow-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.5)",
        "--shadow-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)",

        // Analytics Inverted Baseline
        "--chart-1": shade(chartShades, 400),
        "--chart-2": shade(chartShades, 500),
        "--chart-3": shade(chartShades, 600),
        "--chart-4": shade(chartShades, 700),
        "--chart-5": shade(chartShades, 800),
        "--chart-6": shade(chartShades, 900),
        "--chart-positive": shade(themeShades, 300),
        "--chart-negative": shade(destructiveShades, 400),
        "--chart-neutral": shade(baseShades, 500),
        "--chart-grid": shade(baseShades, 700),
        "--chart-label": shade(baseShades, 300),

        // Inverted Loading Mask Framework
        "--skeleton-base": shade(baseShades, 800),
        "--skeleton-highlight": shade(baseShades, 700),
      },
    },

    selections: {
      base: {
        livePreview: userSelections.base.livePreview,
        color: rgbToRgbaString(base),
      },
      theme: {
        livePreview: userSelections.theme.livePreview,
        color: rgbToRgbaString(theme),
      },
      chart: {
        livePreview: userSelections.chart.livePreview,
        color: shade(chartShades, 400), // Preserves strict layout target requirement
      },
    },
  }
}

/* ============================================================================
   SMART THEME GENERATION ENGINE
   ============================================================================ */

/**
 * Procedurally computes contextual design tokens by balancing raw source values,
 * dynamic constraints, harmonic shifts, and rigorous saturation caps.
 */
export function generateSmartTheme(
  dominantColors: RGB[],
  userSelections: ThemeState["selections"],
  locks: ThemeState["locks"],
  shuffle: boolean
): NewThemeProps {
  // ── 1. CORE ROLE RESOLUTION ROUTINE ───────────────────────────────────────
  // Combines Picking, Fitting, and Variant Picking loops into a single multi-stage pipeline.

  const resolveRoleColor = (
    role: "base" | "theme" | "chart",
    isLocked: boolean
  ): HSL => {
    const raw = pickRawColor(
      role,
      dominantColors,
      userSelections,
      locks,
      shuffle
    )
    const fitted = transformForRole(rgbToHslColor(raw), role)

    return shuffle && !isLocked
      ? pickVariant(generateVariants(fitted, role))
      : fitted
  }

  const finalBase = resolveRoleColor("base", locks.base)
  const finalTheme = resolveRoleColor("theme", locks.theme)
  const finalChart = resolveRoleColor("chart", locks.chart)

  // ── 2. COLOR THEORY DERIVATIONS ───────────────────────────────────────────
  // Calculates harmonic balances and relational spectrum boundaries off raw inputs.

  const finalAccent = deriveAccent(finalTheme, shuffle)
  const chartColorSet = buildChartColors(finalChart)

  // ── 3. EXTENDED TONAL MATRIX SCALES ───────────────────────────────────────
  // Compiles high-fidelity weight distributions for palette and static systems.

  const N = getShades({
    type: "extendedShades",
    colorInput: hslToRgbColor(finalBase),
  })
  const B = getShades({
    type: "extendedShades",
    colorInput: hslToRgbColor(finalTheme),
  })
  const A = getShades({
    type: "extendedShades",
    colorInput: hslToRgbColor(finalAccent),
  })

  const D = getShades({
    type: "extendedShades",
    colorInput: findRedish(dominantColors) ?? hslToRgb(0, 72, 50),
  })
  const S = getShades({
    type: "extendedShades",
    colorInput: hslToRgb(142, 71, 45),
  })
  const W = getShades({
    type: "extendedShades",
    colorInput: hslToRgb(38, 92, 50),
  })
  const I = getShades({
    type: "extendedShades",
    colorInput: hslToRgb(214, 89, 52),
  })

  // ── 4. GEOMETRIC DESIGN HELPERS ───────────────────────────────────────────
  // Pre-calculates specific base offsets, depth patterns, and visualization mapping loops.

  const baseHue = finalBase.h
  const shadowHsl = transformRgbaToHsl(shade(N, 900))
  const shadowBase = `${shadowHsl.h} ${shadowHsl.s}% ${shadowHsl.l}%`

  const chartColor = (i: number): string =>
    rgbToRgbaString(hslToRgbColor(chartColorSet[i] ?? chartColorSet[0]))

  // ── 5. TOKENS GENERATION MAP (RETURN) ─────────────────────────────────────
  // Encapsulates CSS layout variables structured for light and dark viewport rules.

  return {
    cssVars: {
      root: {
        // Core Layout Foundations (Brand Hinted Surfaces)
        "--background": brandTint(baseHue, 5, 98),
        "--foreground": shade(N, 950),
        "--card": brandTint(baseHue, 4, 96),
        "--card-foreground": shade(N, 950),
        "--popover": brandTint(baseHue, 5, 98),
        "--popover-foreground": shade(N, 950),
        "--muted": brandTint(baseHue, 4, 93),
        "--muted-foreground": capSat(shade(N, 500), 25),
        "--border": brandTint(baseHue, 6, 89),
        "--input": brandTint(baseHue, 6, 89),
        "--secondary": brandTint(baseHue, 4, 94),
        "--secondary-foreground": shade(N, 900),

        // Brand Components (Full-Strength Intentional Pops)
        "--primary": shade(B, 500),
        "--primary-foreground": fg(hslToRgbColor(finalTheme)),
        "--ring": shade(B, 500),

        // Accents & Destructive Containers
        "--accent": shade(A, 100),
        "--accent-foreground": capSat(shade(A, 700), 55),
        "--destructive": shade(D, 500),
        "--destructive-foreground": fg([255, 255, 255] as RGB),

        // Core App Sidebar Navigation Layout
        "--sidebar": brandTint(baseHue, 5, 96),
        "--sidebar-foreground": shade(N, 900),
        "--sidebar-border": brandTint(baseHue, 6, 89),
        "--sidebar-accent": shade(A, 100),
        "--sidebar-accent-foreground": capSat(shade(A, 700), 55),
        "--sidebar-primary": shade(B, 500),
        "--sidebar-primary-foreground": fg(hslToRgbColor(finalTheme)),
        "--sidebar-ring": shade(B, 400),

        // Mathematical Chart Visualizer Series
        "--chart-1": chartColor(0),
        "--chart-2": chartColor(1),
        "--chart-3": chartColor(2),
        "--chart-4": chartColor(3),
        "--chart-5": chartColor(4),
        "--chart-6": chartColor(5),
        "--chart-positive": shade(S, 500),
        "--chart-negative": shade(D, 500),
        "--chart-neutral": capSat(shade(N, 400), 15),
        "--chart-grid": brandTint(baseHue, 4, 90),
        "--chart-label": capSat(shade(N, 400), 20),

        // Layered System Surfaces Hierarchy
        "--surface-1": shade(B, 100),
        "--surface-2": shade(B, 200),
        "--surface-3": shade(B, 300),
        "--surface-4": shade(B, 400),
        "--surface-5": shade(A, 200),
        "--surface-6": shade(A, 200),
        "--surface-7": shade(S, 100),
        "--surface-8": shade(W, 100),
        "--surface-9": shade(D, 100),
        "--surface-10": shade(N, 800),
        "--surface-foreground": shade(N, 950),
        "--surface-foreground-muted": capSat(shade(N, 500), 25),

        // Functional UX Notification States
        "--success": shade(S, 600),
        "--success-foreground": fg(hslToRgb(142, 71, 45)),
        "--success-muted": shade(S, 50),
        "--warning": shade(W, 600),
        "--warning-foreground": fg(hslToRgb(38, 92, 50)),
        "--warning-muted": shade(W, 50),
        "--info": shade(I, 600),
        "--info-foreground": fg(hslToRgb(214, 89, 52)),
        "--info-muted": shade(I, 50),
        "--error": shade(D, 600),
        "--error-foreground": fg([255, 255, 255] as RGB),
        "--error-muted": shade(D, 50),

        // Typography Hierarchy Tokens (Saturation Capped to Prevent Bleed)
        "--text-primary": shade(N, 950),
        "--text-secondary": capSat(shade(N, 700), 28),
        "--text-tertiary": capSat(shade(N, 450), 20),
        "--text-placeholder": capSat(shade(N, 350), 15),
        "--text-disabled": capSat(shade(N, 300), 10),
        "--text-link": capSat(shade(B, 700), 65),
        "--text-link-hover": capSat(shade(B, 800), 65),

        // Specialized Borders
        "--border-subtle": brandTint(baseHue, 5, 91),
        "--border-strong": capSat(shade(N, 400), 18),
        "--border-focus": shade(B, 500),

        // Layout Depth Shadow Mapping
        "--shadow-color": shade(N, 900),
        "--shadow-sm": `0 1px 2px 0 hsl(${shadowBase} / 0.06)`,
        "--shadow-md": `0 4px 6px -1px hsl(${shadowBase} / 0.10), 0 2px 4px -1px hsl(${shadowBase} / 0.06)`,
        "--shadow-lg": `0 10px 15px -3px hsl(${shadowBase} / 0.12), 0 4px 6px -2px hsl(${shadowBase} / 0.07)`,

        // Content Loading Masks
        "--skeleton-base": brandTint(baseHue, 5, 90),
        "--skeleton-highlight": brandTint(baseHue, 4, 95),
      },

      dark: {
        // Dark Mode Core Canvas Elements (Low Saturation Depth Bases)
        "--background": brandTint(baseHue, 12, 8),
        "--foreground": shade(N, 50),
        "--card": brandTint(baseHue, 10, 11),
        "--card-foreground": shade(N, 50),
        "--popover": brandTint(baseHue, 10, 11),
        "--popover-foreground": shade(N, 50),
        "--muted": brandTint(baseHue, 10, 16),
        "--muted-foreground": capSat(shade(N, 400), 25),
        "--border": brandTint(baseHue, 10, 22),
        "--input": brandTint(baseHue, 10, 22),
        "--secondary": brandTint(baseHue, 10, 16),
        "--secondary-foreground": shade(N, 200),

        // Dark Mode Interaction Elements (Contrast Balanced Primary)
        "--primary": shade(B, 400),
        "--primary-foreground": fg(hslToRgbColor(finalTheme)),
        "--ring": shade(B, 400),

        // Dark Accents & Destructive Containers
        "--accent": shade(A, 900),
        "--accent-foreground": capSat(shade(A, 200), 55),
        "--destructive": shade(D, 400),
        "--destructive-foreground": fg([255, 255, 255] as RGB),

        // Dark Mode App Navigation Framework
        "--sidebar": brandTint(baseHue, 13, 7),
        "--sidebar-foreground": shade(N, 100),
        "--sidebar-border": brandTint(baseHue, 10, 20),
        "--sidebar-accent": shade(A, 900),
        "--sidebar-accent-foreground": capSat(shade(A, 200), 55),
        "--sidebar-primary": shade(B, 400),
        "--sidebar-primary-foreground": fg(hslToRgbColor(finalTheme)),
        "--sidebar-ring": shade(B, 400),

        // Dark Background Compatible Analytical Spectrum
        "--chart-1": chartColor(0),
        "--chart-2": chartColor(1),
        "--chart-3": chartColor(2),
        "--chart-4": chartColor(3),
        "--chart-5": chartColor(4),
        "--chart-6": chartColor(5),
        "--chart-positive": shade(S, 400),
        "--chart-negative": shade(D, 400),
        "--chart-neutral": capSat(shade(N, 500), 15),
        "--chart-grid": brandTint(baseHue, 10, 20),
        "--chart-label": capSat(shade(N, 500), 20),

        // Inverted Progressive Surface Elevations
        "--surface-1": shade(B, 950),
        "--surface-2": shade(B, 900),
        "--surface-3": shade(B, 850),
        "--surface-4": shade(B, 800),
        "--surface-5": shade(A, 750),
        "--surface-6": shade(A, 900),
        "--surface-7": shade(S, 950),
        "--surface-8": shade(W, 950),
        "--surface-9": shade(D, 950),
        "--surface-10": shade(N, 200),
        "--surface-foreground": shade(N, 50),
        "--surface-foreground-muted": capSat(shade(N, 400), 25),

        // Inverted Semantic Status Layout Channels
        "--success": shade(S, 400),
        "--success-foreground": fg(hslToRgb(142, 71, 45)),
        "--success-muted": shade(S, 950),
        "--warning": shade(W, 400),
        "--warning-foreground": fg(hslToRgb(38, 92, 50)),
        "--warning-muted": shade(W, 950),
        "--info": shade(I, 400),
        "--info-foreground": fg(hslToRgb(214, 89, 52)),
        "--info-muted": shade(I, 950),
        "--error": shade(D, 400),
        "--error-foreground": fg([255, 255, 255] as RGB),
        "--error-muted": shade(D, 950),

        // Dark Typography Token Variations
        "--text-primary": shade(N, 50),
        "--text-secondary": capSat(shade(N, 200), 22),
        "--text-tertiary": capSat(shade(N, 400), 18),
        "--text-placeholder": capSat(shade(N, 600), 14),
        "--text-disabled": capSat(shade(N, 700), 10),
        "--text-link": capSat(shade(B, 300), 65),
        "--text-link-hover": capSat(shade(B, 200), 65),

        // Borders Inverted Framework
        "--border-subtle": brandTint(baseHue, 10, 20),
        "--border-strong": capSat(shade(N, 600), 18),
        "--border-focus": shade(B, 400),

        // High-Contrast Heavy Dark Shadows Mapping
        "--shadow-color": shade(N, 950),
        "--shadow-sm": `0 1px 2px 0 hsl(${shadowBase} / 0.50)`,
        "--shadow-md": `0 4px 6px -1px hsl(${shadowBase} / 0.60), 0 2px 4px -1px hsl(${shadowBase} / 0.50)`,
        "--shadow-lg": `0 10px 15px -3px hsl(${shadowBase} / 0.60), 0 4px 6px -2px hsl(${shadowBase} / 0.50)`,

        // Loading Masks Framework
        "--skeleton-base": brandTint(baseHue, 10, 15),
        "--skeleton-highlight": brandTint(baseHue, 8, 20),
      },
    },

    selections: {
      base: {
        livePreview: userSelections.base.livePreview,
        color: rgbToRgbaString(hslToRgbColor(finalBase)),
      },
      theme: {
        livePreview: userSelections.theme.livePreview,
        color: rgbToRgbaString(hslToRgbColor(finalTheme)),
      },
      chart: {
        livePreview: userSelections.chart.livePreview,
        color: rgbToRgbaString(hslToRgbColor(finalChart)),
      },
    },
  }
}

/* ============================================================================
   FUNKY THEME GENERATION ENGINE
   ============================================================================ */

/**
 * Builds dynamic workspace palette tokens based on strategic hue shifting rules,
 * generating contrast scales for both light and dark display contexts.
 */
export function generateFunkyTheme(
  dominantColors: RGB[],
  userSelections: ThemeState["selections"],
  locks: ThemeState["locks"],
  shuffleTheme: boolean,
  seed?: ShuffleSeed
): NewThemeProps {
  const transformColor = transformRgbaCodeToRgbaNumberArray

  // ── 1. PRIMARY COLOR RESOLUTION ───────────────────────────────────────────
  // Determines base anchors by reconciling current locking configurations against
  // algorithmic seed shufflers.

  const base =
    locks.base || !shuffleTheme
      ? transformColor(userSelections.base.color)
      : BASE_STRATEGIES[seed?.baseStrategy ?? 0](dominantColors)

  const theme =
    locks.theme || !shuffleTheme
      ? transformColor(userSelections.theme.color)
      : THEME_STRATEGIES[seed?.themeStrategy ?? 0](dominantColors, base)

  // Note: Accent matches the original architecture tracking the theme lock profile explicitly.
  const accent =
    locks.theme || !shuffleTheme
      ? transformColor(userSelections.theme.color)
      : ACCENT_STRATEGIES[seed?.accentStrategy ?? 0](dominantColors, base)

  const destructive = findRedish(dominantColors)

  // ── 2. DATA VISUALIZATION SYSTEMS (CHARTS) ────────────────────────────────
  // Extracts custom target arrays or falls back onto procedural color spectrum distributions.

  const getExtendedUserChartShades = (): string[] => {
    const shades = getShades({
      type: "extendedShades",
      colorInput: transformColor(userSelections.chart.color),
    })
    return [300, 400, 500, 600, 700, 800].map((weight) => shade(shades, weight))
  }

  const chartColors =
    shuffleTheme && !locks.chart
      ? CHART_STRATEGIES[seed?.chartStrategy ?? 0](dominantColors, theme).map(
          rgbToRgbaString
        )
      : getExtendedUserChartShades()

  // ── 3. SEMANTIC SYSTEM STANDARDS ──────────────────────────────────────────
  // Assigns static core status anchors unimpacted by external canvas generation strategies.

  const success = hslToRgb(142, 71, 45)
  const warning = hslToRgb(38, 92, 50)
  const info = hslToRgb(214, 89, 52)

  // ── 4. EXTENDED SHADE RANGE MATRIX GENERATION ─────────────────────────────
  // Compiles discrete contrast distributions required by active presentation boundaries.

  const baseShades = getShades({ type: "extendedShades", colorInput: base })
  const themeShades = getShades({ type: "extendedShades", colorInput: theme })
  const accentShades = getShades({ type: "extendedShades", colorInput: accent })
  const destructiveShades = getShades({
    type: "extendedShades",
    colorInput: destructive,
  })

  const successShades = getShades({
    type: "extendedShades",
    colorInput: success,
  })
  const warningShades = getShades({
    type: "extendedShades",
    colorInput: warning,
  })
  const infoShades = getShades({ type: "extendedShades", colorInput: info })

  // ── 5. DEPTH CALCULATIONS (SHADOW DESIGN MATRIX) ──────────────────────────
  // Resolves contextual backdrop drop shading coordinates using terminal tone weights.

  const shadowHsl = rgbToHsl(transformColor(shade(baseShades, 900)))
  const shadowBase = `${shadowHsl.h} ${shadowHsl.s}% ${shadowHsl.l}%`

  // ── 6. TOKENS GENERATION MAP (RETURN) ─────────────────────────────────────
  // Translates extracted coordinate channels into structured user canvas style systems.

  return {
    cssVars: {
      root: {
        // Core Layout Foundations
        "--background": shade(baseShades, 50),
        "--foreground": shade(baseShades, 950),
        "--card": shade(baseShades, 50),
        "--card-foreground": shade(baseShades, 950),
        "--popover": shade(baseShades, 50),
        "--popover-foreground": shade(baseShades, 950),
        "--muted": shade(baseShades, 100),
        "--muted-foreground": shade(baseShades, 400),
        "--border": shade(baseShades, 200),
        "--input": shade(baseShades, 200),

        // Brand Components
        "--primary": shade(themeShades, 500),
        "--primary-foreground": fg(theme),
        "--secondary": shade(baseShades, 100),
        "--secondary-foreground": shade(baseShades, 900),
        "--ring": shade(themeShades, 500),

        // Accents & Destructive Alert Containers
        "--accent": shade(accentShades, 100),
        "--accent-foreground": shade(accentShades, 700),
        "--destructive": shade(destructiveShades, 500),
        "--destructive-foreground": fg(destructive),

        // Core App Sidebar Navigation Layout
        "--sidebar": shade(baseShades, 100),
        "--sidebar-foreground": shade(baseShades, 900),
        "--sidebar-border": shade(baseShades, 200),
        "--sidebar-accent": shade(themeShades, 100),
        "--sidebar-accent-foreground": shade(themeShades, 700),
        "--sidebar-primary": shade(themeShades, 500),
        "--sidebar-primary-foreground": fg(theme),
        "--sidebar-ring": shade(themeShades, 500),

        // Mathematical Chart Visualizer Series
        "--chart-1": chartColors[0],
        "--chart-2": chartColors[1],
        "--chart-3": chartColors[2],
        "--chart-4": chartColors[3],
        "--chart-5": chartColors[4],
        "--chart-6": chartColors[5],
        "--chart-positive": shade(successShades, 500),
        "--chart-negative": shade(destructiveShades, 500),
        "--chart-neutral": shade(baseShades, 400),
        "--chart-grid": shade(baseShades, 200),
        "--chart-label": shade(baseShades, 400),

        // Thematic Dynamic Light Surface Steps
        "--surface-1": shade(themeShades, 50),
        "--surface-2": shade(themeShades, 100),
        "--surface-3": shade(themeShades, 250),
        "--surface-4": shade(themeShades, 300),
        "--surface-5": shade(themeShades, 400),
        "--surface-6": shade(themeShades, 500),
        "--surface-7": shade(successShades, 50),
        "--surface-8": shade(warningShades, 50),
        "--surface-9": shade(destructiveShades, 50),
        "--surface-10": shade(themeShades, 900),
        "--surface-foreground": shade(themeShades, 900),
        "--surface-foreground-muted": shade(themeShades, 500),

        // Functional UX Notification States
        "--success": shade(successShades, 500),
        "--success-foreground": fg(success),
        "--success-muted": shade(successShades, 50),
        "--warning": shade(warningShades, 500),
        "--warning-foreground": fg(warning),
        "--warning-muted": shade(warningShades, 50),
        "--info": shade(infoShades, 500),
        "--info-foreground": fg(info),
        "--info-muted": shade(infoShades, 50),
        "--error": shade(destructiveShades, 500),
        "--error-foreground": fg(destructive),
        "--error-muted": shade(destructiveShades, 50),

        // Typography Hierarchy Tokens
        "--text-primary": shade(baseShades, 950),
        "--text-secondary": shade(baseShades, 700),
        "--text-tertiary": shade(baseShades, 400),
        "--text-placeholder": shade(baseShades, 300),
        "--text-disabled": shade(baseShades, 300),
        "--text-link": shade(themeShades, 600),
        "--text-link-hover": shade(themeShades, 700),

        // Specialized Borders
        "--border-subtle": shade(baseShades, 100),
        "--border-strong": shade(baseShades, 400),
        "--border-focus": shade(themeShades, 500),

        // Layout Depth Shadow Mapping
        "--shadow-color": shade(baseShades, 900),
        "--shadow-sm": `0 1px 2px 0 hsl(${shadowBase} / 0.05)`,
        "--shadow-md": `0 4px 6px -1px hsl(${shadowBase} / 0.1), 0 2px 4px -1px hsl(${shadowBase} / 0.06)`,
        "--shadow-lg": `0 10px 15px -3px hsl(${shadowBase} / 0.1), 0 4px 6px -2px hsl(${shadowBase} / 0.05)`,

        // Content Loading Masks
        "--skeleton-base": shade(baseShades, 200),
        "--skeleton-highlight": shade(baseShades, 100),
      },

      dark: {
        // Dark Mode Core Canvas Elements
        "--background": shade(baseShades, 950),
        "--foreground": shade(baseShades, 50),
        "--card": shade(baseShades, 900),
        "--card-foreground": shade(baseShades, 50),
        "--popover": shade(baseShades, 900),
        "--popover-foreground": shade(baseShades, 50),
        "--muted": shade(baseShades, 800),
        "--muted-foreground": shade(baseShades, 400),
        "--border": shade(baseShades, 800),
        "--input": shade(baseShades, 800),

        // Dark Mode Interaction Elements
        "--primary": shade(themeShades, 400),
        "--primary-foreground": fg(theme),
        "--secondary": shade(baseShades, 800),
        "--secondary-foreground": shade(baseShades, 100),
        "--ring": shade(themeShades, 400),

        // Dark Accents & Destructive Containers
        "--accent": shade(accentShades, 800),
        "--accent-foreground": shade(accentShades, 200),
        "--destructive": shade(destructiveShades, 400),
        "--destructive-foreground": fg(destructive),

        // Dark Mode App Navigation Framework
        "--sidebar": shade(baseShades, 900),
        "--sidebar-foreground": shade(baseShades, 100),
        "--sidebar-border": shade(baseShades, 800),
        "--sidebar-accent": shade(themeShades, 800),
        "--sidebar-accent-foreground": shade(themeShades, 200),
        "--sidebar-primary": shade(themeShades, 400),
        "--sidebar-primary-foreground": fg(theme),
        "--sidebar-ring": shade(themeShades, 400),

        // Inverted Chart Visualizer Targets
        "--chart-1": chartColors[0],
        "--chart-2": chartColors[1],
        "--chart-3": chartColors[2],
        "--chart-4": chartColors[3],
        "--chart-5": chartColors[4],
        "--chart-6": chartColors[5],
        "--chart-positive": shade(successShades, 400),
        "--chart-negative": shade(destructiveShades, 400),
        "--chart-neutral": shade(baseShades, 600),
        "--chart-grid": shade(baseShades, 800),
        "--chart-label": shade(baseShades, 500),

        // Inverted Thematic Progressive Surfaces
        "--surface-1": shade(themeShades, 950),
        "--surface-2": shade(themeShades, 900),
        "--surface-3": shade(themeShades, 800),
        "--surface-4": shade(themeShades, 700),
        "--surface-5": shade(themeShades, 600),
        "--surface-6": shade(themeShades, 500),
        "--surface-7": shade(successShades, 950),
        "--surface-8": shade(warningShades, 950),
        "--surface-9": shade(destructiveShades, 950),
        "--surface-10": shade(themeShades, 100),
        "--surface-foreground": shade(themeShades, 100),
        "--surface-foreground-muted": shade(themeShades, 500),

        // Inverted Semantic Messaging Channels
        "--success": shade(successShades, 400),
        "--success-foreground": fg(success),
        "--success-muted": shade(successShades, 950),
        "--warning": shade(warningShades, 400),
        "--warning-foreground": fg(warning),
        "--warning-muted": shade(warningShades, 950),
        "--info": shade(infoShades, 400),
        "--info-foreground": fg(info),
        "--info-muted": shade(infoShades, 950),
        "--error": shade(destructiveShades, 400),
        "--error-foreground": fg(destructive),
        "--error-muted": shade(destructiveShades, 950),

        // Dark Typography Token Variations
        "--text-primary": shade(baseShades, 50),
        "--text-secondary": shade(baseShades, 300),
        "--text-tertiary": shade(baseShades, 500),
        "--text-placeholder": shade(baseShades, 600),
        "--text-disabled": shade(baseShades, 600),
        "--text-link": shade(themeShades, 400),
        "--text-link-hover": shade(themeShades, 300),

        // Borders Inverted Framework
        "--border-subtle": shade(baseShades, 600),
        "--border-strong": shade(baseShades, 500),
        "--border-focus": shade(baseShades, 400),

        // Depth Shadows High-Contrast Inversion
        "--shadow-color": shade(baseShades, 950),
        "--shadow-sm": `0 1px 2px 0 hsl(${shadowBase} / 0.3)`,
        "--shadow-md": `0 4px 6px -1px hsl(${shadowBase} / 0.4), 0 2px 4px -1px hsl(${shadowBase} / 0.3)`,
        "--shadow-lg": `0 10px 15px -3px hsl(${shadowBase} / 0.4), 0 4px 6px -2px hsl(${shadowBase} / 0.3)`,

        // Loading Masks Framework
        "--skeleton-base": shade(baseShades, 800),
        "--skeleton-highlight": shade(baseShades, 700),
      },
    },

    selections: {
      base: {
        livePreview: userSelections.base.livePreview,
        color: rgbToRgbaString(base),
      },
      theme: {
        livePreview: userSelections.theme.livePreview,
        color: rgbToRgbaString(theme),
      },
      chart: {
        livePreview: userSelections.chart.livePreview,
        color: chartColors[0],
      },
    },
  }
}

/* ============================================================================
   MANUAL THEME GENERATION ENGINE
   ============================================================================ */

/**
 * Builds user-customized palette tokens by calculating distinct variable distributions
 * across both light and dark display modes.
 */
export function generateManualTheme(
  dominantColors: RGB[],
  userSelections: ThemeState["selections"],
  locks: ThemeState["locks"],
  shuffleTheme: boolean,
  seed?: ShuffleSeed
): NewThemeProps {
  // ── 1. PRIMARY COLOR RESOLUTION ───────────────────────────────────────────
  // Resolves the core anchor color channels by blending user selections, locking configurations,
  // and shuffle strategy arrays.

  const getFallbackOrShuffle = (
    isLocked: boolean,
    userColor: string,
    strategyId?: number
  ): string => {
    if (isLocked || !shuffleTheme) {
      return rgbToRgbaString(parseColor(userColor))
    }
    return rgbToRgbaString(getRandomDominant(strategyId, dominantColors))
  }

  const base = getFallbackOrShuffle(
    locks.base,
    userSelections.base.color,
    seed?.baseStrategy
  )
  const theme = getFallbackOrShuffle(
    locks.theme,
    userSelections.theme.color,
    seed?.themeStrategy
  )
  const chart = getFallbackOrShuffle(
    locks.chart,
    userSelections.chart.color,
    seed?.chartStrategy
  )

  // Note: Accent references the core theme locking matrix parameters directly per original engine design.
  const accent = getFallbackOrShuffle(
    locks.theme,
    userSelections.theme.color,
    seed?.accentStrategy
  )

  const destructive =
    rgbToRgbaString(findRedish(dominantColors)) ??
    rgbToRgbaString([180, 30, 30])

  // ── 2. LIGHT MODE BASE VARIATION COMPUTATION ──────────────────────────────
  // Generates light-canvas surface structural levels alongside corresponding typography layers.

  const baseBg = toLight(base, 97, 5) // Near-white background canvas frame
  const baseCard = toLight(base, 95, 4) // Slightly darker card container backdrop
  const baseMuted = toLight(base, 93, 5) // Muted component background fills
  const baseBorder = toCoord(base, 8, 87) // Clean boundaries contrast lines
  const baseFg = toForeground(base, 12, 30) // High contrast title text hierarchy
  const baseFgMuted = toCoord(base, 20, 35) // Muted layout descriptions
  const baseFgSubtle = toCoord(base, 12, 50) // Placeholders and non-interactive text

  // ── 3. DARK MODE BASE VARIATION COMPUTATION ───────────────────────────────
  // Mirrors structural variables directly across a dark slate layout arrangement.

  const baseBgDark = toDark(base, 9, 12)
  const baseCardDark = toDark(base, 11, 10)
  const baseMutedDark = toDark(base, 15, 10)
  const baseBorderDark = toCoord(base, 12, 22)
  const baseFgDark = toForegroundDark(base, 93, 12)
  const baseFgMutedDk = toCoord(base, 18, 65)
  const baseFgSubtleDk = toCoord(base, 12, 50)

  // ── 4. BRAND & ACCENT BRANDING SCALES ─────────────────────────────────────
  // Calculates high-strength interaction variants alongside a progressive 10-step surface ramp.

  const themeFg = autoForeground(theme)
  const themeLight = toLight(theme, 95, 12)
  const themeLinkDark = shift(theme, 0, -12)
  const themeDark = shift(theme, 5, 8)

  const { h: tH, s: tS, l: tL } = toHsl(theme)
  const themeSurfaces = Array.from({ length: 10 }, (_, i) =>
    build(tH, clamp(tS - 25 + i * 3, 5, tS), clamp(tL + 40 - i * 6, 20, 97))
  )

  const accentFg = autoForeground(accent)
  const accentLight = toLight(accent, 94, 10)

  // ── 5. SEMANTIC & CHART ARRAYS ────────────────────────────────────────────
  // Assembles status blocks along with an evenly distribution-spaced chart spectrum.

  const { h: cH, s: cS, l: cL } = toHsl(chart)
  const chartColors = Array.from({ length: 6 }, (_, i) =>
    build((cH + i * 55) % 360, Math.max(cS, 58), clamp(cL, 44, 56))
  )

  const destructiveFg = toForegroundDark(destructive, 96, 5)
  const destructiveMuted = toLight(destructive, 96, 8)

  // ── 6. TOKENS GENERATION MAP (RETURN) ─────────────────────────────────────
  // Encapsulates CSS layout properties cleanly grouped into structured DOM node injections.

  return {
    cssVars: {
      root: {
        // Core Layout Foundations
        "--background": baseBg,
        "--foreground": baseFg,
        "--card": baseCard,
        "--card-foreground": baseFg,
        "--popover": baseBg,
        "--popover-foreground": baseFg,
        "--muted": baseMuted,
        "--muted-foreground": baseFgMuted,
        "--border": baseBorder,
        "--input": baseBorder,
        "--ring": theme,

        // Brand Components
        "--primary": theme,
        "--primary-foreground": themeFg,
        "--secondary": baseCard,
        "--secondary-foreground": baseFg,
        "--accent": accentLight,
        "--accent-foreground": shift(accent, 0, -20),
        "--destructive": destructive,
        "--destructive-foreground": destructiveFg,

        // Core App Sidebar Navigation Layout
        "--sidebar": toLight(base, 95, 4),
        "--sidebar-foreground": baseFg,
        "--sidebar-border": baseBorder,
        "--sidebar-accent": accentLight,
        "--sidebar-accent-foreground": shift(accent, 0, -20),
        "--sidebar-primary": theme,
        "--sidebar-primary-foreground": themeFg,
        "--sidebar-ring": theme,

        // Thematic Dynamic Light Surface Steps
        "--surface-1": themeSurfaces[0],
        "--surface-2": themeSurfaces[1],
        "--surface-3": themeSurfaces[2],
        "--surface-4": themeSurfaces[3],
        "--surface-5": themeSurfaces[4],
        "--surface-6": themeSurfaces[5],
        "--surface-7": themeSurfaces[6],
        "--surface-8": themeSurfaces[7],
        "--surface-9": themeSurfaces[8],
        "--surface-10": themeSurfaces[9],
        "--surface-foreground": baseFg,
        "--surface-foreground-muted": baseFgMuted,

        // Functional UX Notification States
        "--success": theme,
        "--success-foreground": themeFg,
        "--success-muted": themeLight,
        "--warning": accent,
        "--warning-foreground": accentFg,
        "--warning-muted": accentLight,
        "--info": shift(theme, -5, 8),
        "--info-foreground": themeFg,
        "--info-muted": toLight(theme, 94, 10),
        "--error": destructive,
        "--error-foreground": destructiveFg,
        "--error-muted": destructiveMuted,

        // Typography Hierarchy Tokens
        "--text-primary": baseFg,
        "--text-secondary": baseFgMuted,
        "--text-tertiary": baseFgSubtle,
        "--text-placeholder": toCoord(base, 10, 60),
        "--text-disabled": toCoord(base, 6, 70),
        "--text-link": shift(theme, 5, -10),
        "--text-link-hover": shift(theme, 5, -18),

        // Specialized Borders
        "--border-subtle": toLight(base, 92, 5),
        "--border-strong": toCoord(base, 12, 70),
        "--border-focus": theme,

        // Layout Depth Shadow Mapping
        "--shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "--shadow-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "--shadow-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.07)",
        "--shadow-color": toForeground(base, 15, 20),

        // Mathematical Chart Visualizer Series
        "--chart-1": chartColors[0],
        "--chart-2": chartColors[1],
        "--chart-3": chartColors[2],
        "--chart-4": chartColors[3],
        "--chart-5": chartColors[4],
        "--chart-6": chartColors[5],
        "--chart-positive": theme,
        "--chart-negative": destructive,
        "--chart-neutral": baseFgSubtle,
        "--chart-grid": baseBorder,
        "--chart-label": baseFgMuted,

        // Content Loading Masks
        "--skeleton-base": toLight(base, 90, 5),
        "--skeleton-highlight": toLight(base, 95, 3),
      },

      dark: {
        // Dark Mode Core Canvas Elements
        "--background": baseBgDark,
        "--foreground": baseFgDark,
        "--card": baseCardDark,
        "--card-foreground": baseFgDark,
        "--popover": baseCardDark,
        "--popover-foreground": baseFgDark,
        "--muted": baseMutedDark,
        "--muted-foreground": baseFgMutedDk,
        "--border": baseBorderDark,
        "--input": baseBorderDark,
        "--ring": themeDark,

        // Dark Mode Interactions Elements
        "--primary": themeDark,
        "--primary-foreground": themeFg,
        "--secondary": baseCardDark,
        "--secondary-foreground": baseFgDark,
        "--accent": shift(accent, 0, -30),
        "--accent-foreground": toForegroundDark(accent, 88, 15),
        "--destructive": shift(destructive, -5, 8),
        "--destructive-foreground": destructiveFg,

        // Dark Mode App Navigation Framework
        "--sidebar": toDark(base, 8, 12),
        "--sidebar-foreground": baseFgDark,
        "--sidebar-border": baseBorderDark,
        "--sidebar-accent": shift(accent, 0, -30),
        "--sidebar-accent-foreground": toForegroundDark(accent, 88, 15),
        "--sidebar-primary": themeDark,
        "--sidebar-primary-foreground": themeFg,
        "--sidebar-ring": themeDark,

        // Inverted Thematic Progressive Surfaces
        "--surface-1": toDark(theme, 8, 12),
        "--surface-2": toDark(theme, 10, 10),
        "--surface-3": toDark(theme, 13, 10),
        "--surface-4": toDark(theme, 16, 10),
        "--surface-5": toDark(theme, 19, 10),
        "--surface-6": toDark(theme, 22, 9),
        "--surface-7": toDark(theme, 26, 8),
        "--surface-8": toDark(theme, 30, 8),
        "--surface-9": toDark(theme, 34, 7),
        "--surface-10": toDark(theme, 38, 7),
        "--surface-foreground": baseFgDark,
        "--surface-foreground-muted": baseFgMutedDk,

        // Inverted Semantic Messaging Channels
        "--success": themeDark,
        "--success-foreground": themeFg,
        "--success-muted": toDark(theme, 18, 10),
        "--warning": shift(accent, 0, 10),
        "--warning-foreground": accentFg,
        "--warning-muted": toDark(accent, 18, 10),
        "--info": shift(theme, -5, 12),
        "--info-foreground": themeFg,
        "--info-muted": toDark(theme, 18, 10),
        "--error": shift(destructive, -5, 10),
        "--error-foreground": destructiveFg,
        "--error-muted": toDark(destructive, 18, 10),

        // Dark Typography Token Variations
        "--text-primary": baseFgDark,
        "--text-secondary": baseFgMutedDk,
        "--text-tertiary": baseFgSubtleDk,
        "--text-placeholder": toCoord(base, 12, 45),
        "--text-disabled": toCoord(base, 8, 35),
        "--text-link": shift(theme, 0, 15),
        "--text-link-hover": themeLinkDark,

        // Borders Inverted Framework
        "--border-subtle": toDark(base, 18, 10),
        "--border-strong": toCoord(base, 14, 38),
        "--border-focus": themeDark,

        // Depth Shadows High-Contrast Inversion
        "--shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.50)",
        "--shadow-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.60), 0 2px 4px -1px rgba(0, 0, 0, 0.50)",
        "--shadow-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.60), 0 4px 6px -2px rgba(0, 0, 0, 0.50)",
        "--shadow-color": toDark(base, 5, 12),

        // Inverted Chart Visualizer Targets
        "--chart-1": chartColors[0],
        "--chart-2": chartColors[1],
        "--chart-3": chartColors[2],
        "--chart-4": chartColors[3],
        "--chart-5": chartColors[4],
        "--chart-6": chartColors[5],
        "--chart-positive": themeDark,
        "--chart-negative": shift(destructive, -5, 10),
        "--chart-neutral": baseFgSubtleDk,
        "--chart-grid": baseBorderDark,
        "--chart-label": baseFgMutedDk,

        // Loading Masks Framework
        "--skeleton-base": toDark(base, 15, 10),
        "--skeleton-highlight": toDark(base, 12, 14),
      },
    },

    selections: {
      base: {
        livePreview: userSelections.base.livePreview,
        color: base,
      },
      theme: {
        livePreview: userSelections.theme.livePreview,
        color: theme,
      },
      chart: {
        livePreview: userSelections.chart.livePreview,
        color: chart,
      },
    },
  }
}

/* ============================================================================
   1. GLOBAL SYSTEM ORCHESTRATION
   ============================================================================ */

/**
 * Main orchestrator: evaluates user configurations, chooses a strategy generator,
 * builds target variables, and mounts them cleanly to the document DOM tree.
 */
export function shuffleAndApplyTheme(
  dominantColors: RGB[],
  mode: ThemeState["mode"],
  userSelections: ThemeState["selections"],
  locks: ThemeState["locks"]
): NewThemeProps {
  let themeProps = {} as NewThemeProps

  if (mode === "classic") {
    themeProps = generateClassicTheme(
      dominantColors,
      userSelections,
      locks,
      true,
      generateShuffleSeedOnDominantColors(locks, dominantColors)
    )
  } else if (mode === "smart") {
    themeProps = generateSmartTheme(dominantColors, userSelections, locks, true)
  } else if (mode === "funky") {
    themeProps = generateFunkyTheme(
      dominantColors,
      userSelections,
      locks,
      true,
      generateShuffleSeedOnStrategies(locks)
    )
  } else if (mode === "manual") {
    themeProps = generateManualTheme(
      dominantColors,
      userSelections,
      locks,
      true,
      generateShuffleSeedOnDominantColors(locks, dominantColors)
    )
  }

  applyThemeToDOM(themeProps.cssVars)
  return themeProps
}

/* ============================================================================
   2. HIGH-LEVEL AUTOMATED THEME ALLOCATION
   ============================================================================ */

/**
 * Assesses extracted image graphics to dynamically assign balanced UI roles,
 * filling empty spots gracefully with split-complementary mathematics.
 */
export function selectRoles(
  analyzed: AnalyzedColor[],
  locks: ThemeState["locks"],
  selections: ThemeState["selections"],
  shuffle: boolean
): RoleAssignment {
  if (analyzed.length === 0) {
    const fallback: RGB = [80, 130, 100]
    return {
      neutral: fallback,
      brand: hslToRgb(150, 60, 45),
      accent: hslToRgb(300, 60, 45),
      extras: buildSyntheticExtras(150, 6),
    }
  }

  // --- Step 1: Assign Neutral Canvas Base ---
  let neutral: RGB
  if (locks.base) {
    neutral = transformRgbaCodeToRgbaNumberArray(selections.base.color)
  } else {
    const scored = [...analyzed]
      .map((c) => ({ ...c, _score: scoreNeutral(c.hsl) }))
      .sort((a, b) => b._score - a._score)
    neutral = shuffle ? weightedPick(scored).rgb : scored[0].rgb
  }

  const neutralHsl = rgbToHsl(neutral)
  const neutralHue = neutralHsl.h

  // --- Step 2: Assign Core Brand Identity ---
  let brand: RGB
  if (locks.theme) {
    brand = transformRgbaCodeToRgbaNumberArray(selections.theme.color)
  } else {
    const pool = analyzed.filter((c) => !rgbEqual(c.rgb, neutral))
    if (pool.length === 0) {
      brand = hslToRgb((neutralHue + 120) % 360, 70, 45)
    } else {
      const scored = pool
        .map((c) => ({ ...c, _score: scoreBrand(c.hsl, neutralHue, hueDiff) }))
        .sort((a, b) => b._score - a._score)
      brand = shuffle ? weightedPick(scored).rgb : scored[0].rgb
    }
  }

  const brandHue = rgbToHsl(brand).h

  // --- Step 3: Assign Contrast Accent ---
  let accent: RGB
  const accentPool = analyzed.filter(
    (c) => !rgbEqual(c.rgb, neutral) && !rgbEqual(c.rgb, brand)
  )
  if (accentPool.length === 0) {
    accent = hslToRgb((brandHue + 150) % 360, 65, 48)
  } else {
    const scored = accentPool
      .map((c) => ({
        ...c,
        _score: scoreAccent(c.hsl, neutralHue, brandHue, hueDiff),
      }))
      .sort((a, b) => b._score - a._score)
    accent = shuffle ? weightedPick(scored).rgb : scored[0].rgb
  }

  // --- Step 4: Construct Supplementary Chart Sequences ---
  const usedHues = [neutralHue, brandHue, rgbToHsl(accent).h]
  const fromDominants: RGB[] = analyzed
    .filter(
      (c) =>
        usedHues.every((used) => hueDiff(c.hsl.h, used) > 20) &&
        c.category !== "near-white" &&
        c.category !== "near-black"
    )
    .sort((a, b) => b.vibrancy - a.vibrancy)
    .map((c) => hslToRgb(c.hsl.h, Math.max(c.hsl.s, 55), 50))

  const extras = [
    ...fromDominants,
    ...buildSyntheticExtras(brandHue, 6 - fromDominants.length),
  ].slice(0, 6)

  return { neutral, brand, accent, extras }
}

/**
 * Filter and grab a subset of input vectors optimized to display a broad spectrum of contrasting hues.
 */
export function pickDiverseColors(colors: RGB[], count: number): RGB[] {
  const selected: RGB[] = []
  const available = [...colors]

  available.sort((a, b) => rgbToHsl(b).s - rgbToHsl(a).s)
  selected.push(available.shift()!)

  while (selected.length < count && available.length > 0) {
    let maxMinDiff = -1
    let bestIndex = 0

    for (let i = 0; i < available.length; i++) {
      const candidateHue = rgbToHsl(available[i]).h
      const minDiff = Math.min(
        ...selected.map((sel) => {
          const diff = Math.abs(rgbToHsl(sel).h - candidateHue)
          return Math.min(diff, 360 - diff)
        })
      )

      if (minDiff > maxMinDiff) {
        maxMinDiff = minDiff
        bestIndex = i
      }
    }
    selected.push(available.splice(bestIndex, 1)[0])
  }
  return selected
}

/**
 * Pulls fallback arrays out of raw extraction points based on fallback locking profiles.
 */
function pickRawColor(
  role: "base" | "theme" | "chart",
  dominantColors: RGB[],
  userSelections: ThemeState["selections"],
  locks: ThemeState["locks"],
  shuffle: boolean
): RGB {
  if (locks[role]) {
    return transformRgbaCodeToRgbaNumberArray(userSelections[role].color)
  }
  if (shuffle && dominantColors.length > 0) {
    return dominantColors[Math.floor(Math.random() * dominantColors.length)]
  }
  return transformRgbaCodeToRgbaNumberArray(userSelections[role].color)
}

/**
 * Evaluates spatial variance offsets based on strict programmatic guidelines to prevent broken contrasts.
 */
function transformForRole(hsl: HSL, role: ColorRole): HSL {
  const { fitness, target } = ROLE_DEFINITIONS[role]

  if (isFitForRole(hsl, fitness)) {
    return {
      h: hsl.h,
      s: clamp(hsl.s, fitness.satMin, fitness.satMax),
      l: clamp(hsl.l, fitness.lightMin, fitness.lightMax),
    }
  }

  const blendedSat =
    Math.abs(hsl.s - target.sat) < 15 ? (hsl.s + target.sat) / 2 : target.sat
  const blendedLight =
    Math.abs(hsl.l - target.light) < 15
      ? (hsl.l + target.light) / 2
      : target.light

  return {
    h: hsl.h,
    s: clamp(blendedSat, fitness.satMin, fitness.satMax),
    l: clamp(blendedLight, fitness.lightMin, fitness.lightMax),
  }
}

/**
 * Shifts channels along established axes matrices to find programmatic alternatives for design patterns.
 */
function generateVariants(fitted: HSL, role: ColorRole): HSL[] {
  const { fitness } = ROLE_DEFINITIONS[role]
  const { hueShifts, satSteps, lightSteps } = VARIANT_AXES[role]
  const variants: HSL[] = []

  for (const hShift of hueShifts) {
    for (const s of satSteps) {
      for (const l of lightSteps) {
        variants.push({
          h: (fitted.h + hShift + 360) % 360,
          s: clamp(s, fitness.satMin, fitness.satMax),
          l: clamp(l, fitness.lightMin, fitness.lightMax),
        })
      }
    }
  }
  return [fitted, ...variants]
}

/* ============================================================================
   3. ALGORITHMIC SCORERS & SELECTORS
   ============================================================================ */

/**
 * Higher mathematical profile matching optimized to detect excellent desaturated baseline canvases.
 */
function scoreNeutral(hsl: { h: number; s: number; l: number }): number {
  const satScore = 1 - hsl.s / 100
  const lightScore = hsl.l >= 30 && hsl.l <= 80 ? 1 : 0.5
  return satScore * 0.8 + lightScore * 0.2
}

/**
 * Grades vibrant anchor profiles with specialized structural tracking calculations.
 */
function scoreBrand(
  hsl: { h: number; s: number; l: number },
  neutralHue: number,
  hueDiffFn: (a: number, b: number) => number
): number {
  const satScore = hsl.s / 100
  const midLightScore = 1 - Math.abs(hsl.l - 50) / 50
  const hueDistScore = Math.min(hueDiffFn(hsl.h, neutralHue) / 90, 1)
  return satScore * 0.5 + hueDistScore * 0.3 + midLightScore * 0.2
}

/**
 * Scores structural harmony variables against existing baseline paths to locate non-clashing highlights.
 */
function scoreAccent(
  hsl: { h: number; s: number; l: number },
  neutralHue: number,
  brandHue: number,
  hueDiffFn: (a: number, b: number) => number
): number {
  const satScore = hsl.s / 100
  const distFromBrand = Math.min(hueDiffFn(hsl.h, brandHue) / 90, 1)
  const distFromNeutral = Math.min(hueDiffFn(hsl.h, neutralHue) / 90, 1)
  return satScore * 0.4 + distFromBrand * 0.35 + distFromNeutral * 0.25
}

/**
 * Probability picker implementing a logarithmic distribution decay curve over ranked datasets.
 */
function weightedPick<T extends { _score: number }>(ranked: T[]): T {
  if (ranked.length === 1) return ranked[0]

  const weights = ranked.map((_, i) => Math.pow(0.5, i))
  const total = weights.reduce((sum, w) => sum + w, 0)
  let cursor = Math.random() * total

  for (let i = 0; i < ranked.length; i++) {
    cursor -= weights[i]
    if (cursor <= 0) return ranked[i]
  }
  return ranked[ranked.length - 1]
}

/**
 * Randomizer matching system pulling variants utilizing a pure array fallback lookup index.
 */
function pickVariant(variants: HSL[]): HSL {
  return variants[Math.floor(Math.random() * variants.length)]
}

/* ============================================================================
   4. COLOR ANALYSIS & SEARCH UTILITIES
   ============================================================================ */

/**
 * Looks for specific red hues inside available data arrays, using fallback defaults when missing.
 */
function findRedish(colors: RGB[]): RGB {
  for (const color of colors) {
    const hsl = rgbToHsl(color)
    if ((hsl.h >= 0 && hsl.h <= 30) || (hsl.h >= 330 && hsl.h <= 360)) {
      if (hsl.s >= 50) return color
    }
  }
  return [220, 38, 38]
}

/**
 * Scans available options to determine clean background parameters between the light threshold ranges.
 */
export function findBestBase(dominantColors: RGB[]): RGB {
  let bestScore = -1
  let bestColor = dominantColors.at(0) ?? [248, 250, 252]

  for (const color of dominantColors) {
    const { s, l } = rgbToHsl(color)
    const lightnessScore = l >= 75 && l <= 92 ? 50 : 0
    const saturationScore = s <= 15 ? 50 : 0
    const score = lightnessScore + saturationScore

    if (score > bestScore) {
      bestScore = score
      bestColor = color
    }
  }

  if (bestScore < 50) {
    const fallbackColor = dominantColors.at(0) ?? [100, 100, 100]
    return hslToRgb(rgbToHsl(fallbackColor).h, 8, 88)
  }
  return bestColor
}

/**
 * Examines matching color points that sit far enough outside the base hue to avoid muddy collisions.
 */
export function findBestTheme(colors: RGB[], baseColor: RGB): RGB {
  const baseHue = rgbToHsl(baseColor).h
  let bestScore = -1
  let bestColor = colors[0]

  for (const color of colors) {
    const hsl = rgbToHsl(color)
    if (Math.abs(hsl.h - baseHue) < 30) continue

    const satScore = hsl.s >= 50 && hsl.s <= 80 ? 50 : 0
    const lightScore = hsl.l >= 40 && hsl.l <= 60 ? 50 : 0
    const score = satScore + lightScore

    if (score > bestScore) {
      bestScore = score
      bestColor = color
    }
  }
  return bestColor
}

/**
 * Identifies alternative vibrant points to ensure chart graphs are instantly recognizable.
 */
export function findBestChart(dominantColors: RGB[], selectedTheme: RGB): RGB {
  const themeHsl = rgbToHsl(selectedTheme)
  const themeStr = selectedTheme.toString()

  const candidates = dominantColors
    .map((color) => ({ color, hsl: rgbToHsl(color) }))
    .filter(({ color }) => color.toString() !== themeStr)

  const highlySeparated = candidates
    .filter(({ hsl }) => {
      const diff = Math.abs(hsl.h - themeHsl.h)
      return Math.min(diff, 360 - diff) >= 45
    })
    .sort((a, b) => b.hsl.s - a.hsl.s)

  if (highlySeparated.length > 0) {
    return highlySeparated.at(0)!.color
  }

  return (
    candidates.sort((a, b) => b.hsl.s - a.hsl.s).at(0)?.color ?? [16, 185, 129]
  )
}

/**
 * Shifts the input hue channel by 180 degrees to calculate a complementary contrast point.
 */
export function findComplementary(color: RGB): RGB {
  const hsl = rgbToHsl(color)
  return hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l)
}

/**
 * Direct fallback array indexing macro targeting the underlying shade dictionary layout.
 */
function shade(shades: ShadeFormats, number: number): string {
  return shades[number].rgba.color
}

/**
 * Accesses individual shades using a cap evaluator callback to avoid saturation clipping.
 */
export function shadeCapped(
  shadeScale: unknown,
  level: number,
  shadeFn: (scale: unknown, level: number) => string,
  maxSat: number
): string {
  return capSat(shadeFn(shadeScale, level), maxSat)
}

/* ============================================================================
   5. UI CONTRAST & RELATIVE COLOR GENERATION
   ============================================================================ */

/**
 * Combines channels with background layers to calculate luminance and guarantee readable contrast.
 */
function fg(rgba: string | RGB, baseRGB = [255, 255, 255]): string {
  let [r, g, b, a] =
    typeof rgba === "string" ? transformRgbaCodeToRgbaNumberArray(rgba) : rgba

  if (a !== undefined) {
    const alpha = a > 1 ? a / 255 : a
    const [baseR, baseG, baseB] = baseRGB

    r = Math.round((1 - alpha) * baseR + alpha * r)
    g = Math.round((1 - alpha) * baseG + alpha * g)
    b = Math.round((1 - alpha) * baseB + alpha * b)
  }

  const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255
  return luminance > 0.5 ? "rgba(33, 36, 39)" : "rgba(242, 245, 247)"
}

/**
 * Automates context mapping decisions based on the lightness of the background.
 */
function autoForeground(color: string): string {
  return toHsl(color).l > 55 ? toForeground(color) : toForegroundDark(color)
}

/**
 * Shifts a theme's hue path to build matching accent variations.
 */
function deriveAccent(themeHsl: HSL, shuffle: boolean): HSL {
  const relationships = [30, -30, 150, 120]
  const angleOffset = shuffle
    ? relationships[Math.floor(Math.random() * relationships.length)]
    : relationships[0]

  return {
    h: (themeHsl.h + angleOffset + 360) % 360,
    s: clamp(themeHsl.s - 8, 40, 80),
    l: clamp(themeHsl.l + 2, 38, 58),
  }
}

/**
 * Generates an automated light layout surface tone near the white color spectrum.
 */
function toLight(color: string, lightness = 97, sat = 5): string {
  return build(toHsl(color).h, sat, lightness)
}

/**
 * Generates dark-mode context variants that remain close to the pure black target scale.
 */
function toDark(color: string, lightness = 9, sat = 10): string {
  return build(toHsl(color).h, sat, lightness)
}

/**
 * Builds a dark, readable text color variant derived from the input base hue.
 */
function toForeground(color: string, lightness = 12, sat = 25): string {
  return build(toHsl(color).h, sat, lightness)
}

/**
 * Builds a bright, readable text color variant for dark-mode interfaces.
 */
function toForegroundDark(color: string, lightness = 92, sat = 15): string {
  return build(toHsl(color).h, sat, lightness)
}

/**
 * Offsets specific structural channels by custom values to build custom variants.
 */
function shift(color: string, satDelta: number, lightDelta: number): string {
  const { h, s, l } = toHsl(color)
  return build(h, s + satDelta, l + lightDelta)
}

/**
 * Re-maps structural properties directly to fixed color values.
 */
function toCoord(color: string, sat: number, lightness: number): string {
  return build(toHsl(color).h, sat, lightness)
}

/**
 * Restricts maximum color tracking constraints to preserve contrast levels.
 */
function capSat(shadeOutput: string, maxSat: number): string {
  const { h, s, l } = transformRgbaToHsl(shadeOutput)
  return buildHslToRgba(h, Math.min(s, maxSat), l)
}

/**
 * Converts clear color coordinates directly into raw CSS format outputs.
 */
function brandTint(hue: number, sat: number, lightness: number): string {
  return buildHslToRgba(hue, sat, lightness)
}

/* ============================================================================
   6. LOW-LEVEL MATH, ADAPTERS & PURE GENERATORS
   ============================================================================ */

/**
 * Safe conversion utility rendering exact space-separated CSS strings from arbitrary HSL inputs.
 */
function buildHslToRgba(h: number, s: number, l: number, alpha = 1): string {
  const safeH = isFinite(h) ? h : 0
  const safeS = isFinite(s) ? s : 0
  const safeL = isFinite(l) ? l : 0
  const safeA = isFinite(alpha) ? alpha : 1

  const sNorm = Math.max(0, Math.min(100, safeS)) / 100
  const lNorm = Math.max(0, Math.min(100, safeL)) / 100
  const finalAlpha = Math.max(0, Math.min(1, safeA))
  const hNorm = ((safeH % 360) + 360) % 360

  if (sNorm === 0) {
    const grayVal = Math.round(lNorm * 255)
    return `rgba(${grayVal}, ${grayVal}, ${grayVal}, ${finalAlpha})`
  }

  const k = (n: number) => (n + hNorm / 30) % 12
  const a = sNorm * Math.min(lNorm, 1 - lNorm)
  const f = (n: number) =>
    lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

  const r = Math.max(0, Math.min(255, Math.round(255 * f(0))))
  const g = Math.max(0, Math.min(255, Math.round(255 * f(8))))
  const b = Math.max(0, Math.min(255, Math.round(255 * f(4))))

  return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`
}

/**
 * Wraps functional conversion mechanisms inside a single string macro formatting loop.
 */
function build(h: number, s: number, l: number): string {
  return rgbToRgbaString(hslToRgb(h, clamp(s, 0, 100), clamp(l, 0, 100)))
}

/**
 * Maps step entries out into distinct array blocks to populate data chart visualization palettes.
 */
function buildChartColors(baseChartHsl: HSL): HSL[] {
  const s = Math.max(baseChartHsl.s, 60)
  return Array.from({ length: 6 }, (_, i) => ({
    h: (baseChartHsl.h + i * 60) % 360,
    s,
    l: 50,
  }))
}

/**
 * Iterates across sequential ranges to generate artificial color scales.
 */
function buildSyntheticExtras(brandHue: number, count: number): RGB[] {
  return Array.from({ length: count }, (_, i) =>
    hslToRgb((brandHue + 60 * (i + 1)) % 360, 65, 50)
  )
}

/**
 * Computes shortest distances along circular degree tracking paths.
 */
function hueDiff(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2)
  return Math.min(diff, 360 - diff)
}

/**
 * Strict evaluation checking if integers fall cleanly inside defined limits.
 */
function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validates if color components fit within the constraints required for their UI role.
 */
function isFitForRole(hsl: HSL, range: HSLRange): boolean {
  return (
    isInRange(hsl.s, range.satMin, range.satMax) &&
    isInRange(hsl.l, range.lightMin, range.lightMax)
  )
}

/**
 * Standard utility mapping arbitrary numeric points cleanly within fixed target parameters.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Performs explicit equivalence evaluations across all individual matrix values.
 */
function rgbEqual(a: RGB, b: RGB): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

/**
 * Fallback interface accessor to quickly decode structural text strings.
 */
function parseColor(color: string): RGB {
  return transformRgbaCodeToRgbaNumberArray(color)
}

/**
 * Decodes functional text properties directly to underlying structural variables.
 */
function toHsl(color: string): HSL {
  return rgbToHsl(parseColor(color))
}

/**
 * Pulls dominant color array segments using structural index parameters.
 */
function getRandomDominant(strategy: number = 0, dominantColors: RGB[]): RGB {
  return dominantColors[strategy ?? 0]
}
