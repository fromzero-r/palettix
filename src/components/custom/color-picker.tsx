import {
  Ban,
  Check,
  Copy,
  Lock,
  LockOpen,
  RefreshCcw,
  Unlock,
  X,
} from "lucide-react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import {
  hexToRgbArray,
  rgbToHex,
  rgbToHslString,
  rgbToOklchString,
  rgbToRgbaString,
  transformRgbaCodeToRgbaNumberArray,
} from "@/utils/transform-colors"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "@/components/ui/label"
import { useWorker } from "@/hooks/use-worker"
import { useShades } from "@/hooks/use-shades"
import {
  COLOR_TYPES,
  THEME_VARS_RGBA,
  RGBA_EXAMPLE,
  TAILWIND_COLOR_CODES,
  THEME_VARS_HEX,
  THEME_VARS_HSL,
  THEME_VARS_OKLCH,
} from "@/const/const"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import type {
  ColorList,
  ColorTypes,
  RGB,
  ThemeState,
  ThemeVars,
  UserPreferedThemeTokens,
} from "@/global_types/types"
import { cn, typedKeys } from "@/lib/utils"
import {
  applyThemeToDOM,
  generateFunkyTheme,
  generateSmartTheme,
  generateClassicTheme,
  shuffleAndApplyTheme,
  generateManualTheme,
} from "@/theme/update-theme"

const dpr = window.devicePixelRatio || 1
const COLOR_ROTATION = 3 // Times
const THEMEBUTTONS = 4 // 4 total color buttons
const TOTAL_COLORS = COLOR_ROTATION * THEMEBUTTONS

function ColorPicker({
  getCssVars,
}: {
  getCssVars: (v: ThemeState["cssVars"]) => void
}) {
  const [colorCodes, setColorCodes] = useState<RGB>([184, 184, 184, 1])
  const [currentColorType, setCurrentColorType] = useState<ColorTypes>("hex")
  const [themeColorsStartIndex, setThemeColorsStartIndex] = useState(0)
  const [showExtendedShades, setShowExtendedShades] = useState(false)
  const [isImageRendered, setIsImageRendered] = useState(false)
  const [activeColor, setActiveColor] = useState<RGB>([184, 184, 184])
  const [lockCanvas, setLockCanvas] = useState(false)
  const [isCanvasClicked, setIsCanvasClicked] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasParentRef = useRef<HTMLLabelElement | null>(null)
  const previewLensRef = useRef<HTMLCanvasElement | null>(null)
  const imageLinkRef = useRef<HTMLInputElement | null>(null)
  const cursorRef = useRef({
    x: 0,
    y: 0,
    physicalX: 0,
    physicalY: 0,
    sx: 0,
    sy: 0,
  })
  const [lens, setLens] = useState({ show: false, x: 0, y: 0 })
  const timeoutRef = useRef<number | null>(null)
  const [completeColorsList, setCompleteColorsList] = useState<ColorList>({
    dominantColors: {
      title: "Image colors",
      data: [[184, 184, 184]],
    },
    tailwindColors: { title: "Tailwind colors", data: TAILWIND_COLOR_CODES },
    customColor: {
      title: "Custom color",
      data: { color: "rgba(184,184,184)" },
    },
  })
  const [savedColors, setSavedColors] = useState<RGB[]>([])
  const [currentThemeState, setCurrentThemeState] = useState<ThemeState>({
    cssVars: THEME_VARS_RGBA,
    selections: {
      base: { color: RGBA_EXAMPLE, livePreview: false },
      theme: { color: RGBA_EXAMPLE, livePreview: false },
      chart: { color: RGBA_EXAMPLE, livePreview: false },
    },
    locks: {
      base: false,
      theme: false,
      chart: false,
    },
    mode: "classic",
    activeColor: [0, 0, 0],
    dominantColors: [],
    shades: { primary: [], extended: [] },
    colorFormats: {
      hex: {},
      rgba: {},
      hsl: {},
      oklch: {},
    },
  })
  const [userSelectedThemeTokens, setUserSelectedThemeTokens] =
    useState<UserPreferedThemeTokens>({
      rgba: THEME_VARS_RGBA,
      hex: THEME_VARS_HEX,
      hsl: THEME_VARS_HSL,
      oklch: THEME_VARS_OKLCH,
    })
  const [currentThemeTokensFormat, setCurrentThemeTokensFormat] =
    useState<ColorTypes>("hex")
  const [isThemeCopied, setIsThemeCopied] = useState(false)
  const { processImage, cancelProcess, isLoading, colors, error } =
    useWorker(TOTAL_COLORS)
  const generateShades = useShades()

  const primaryShades = generateShades("primaryShades", activeColor) || []
  const extendedShades = showExtendedShades
    ? generateShades("extendedShades", activeColor) || []
    : []
  const primaryShadesValues = Object.values(primaryShades)
  const extendedShadesValues = Object.values(extendedShades)

  const customConfigOptions = ["base", "theme", "chart"] as const

  const displayedThemeColors: RGB[] = useMemo(
    () =>
      Array.from({ length: THEMEBUTTONS }, (_, i) => {
        const targetIndex = (themeColorsStartIndex + i) % colors.length
        return colors[targetIndex]
      }),
    [colors, themeColorsStartIndex]
  )

  const handleColorsReset = () => {
    setThemeColorsStartIndex((prev) => (prev + THEMEBUTTONS) % colors.length)
  }

  const handleColorCopy = async (color: string | RGB, type?: ColorTypes) => {
    let v = ""
    if (typeof color !== "string") {
      if (type === "hex") {
        v = rgbToHex(color)
      } else if (type === "hsl") {
        v = rgbToHslString(color)
      } else if (type === "oklch") {
        v = rgbToOklchString(color)
      } else if (type === "rgba") {
        v = rgbToRgbaString(color)
      }
    } else {
      v = color
    }

    try {
      await navigator.clipboard.writeText(v)
      toast(() => (
        <div className="flex items-center gap-2.5 text-sm text-foreground">
          <div className="size-3" style={{ backgroundColor: v }} />
          <p>{v} copied!</p>
        </div>
      ))
    } catch (error) {
      console.error(error)
      toast.error(() => (
        <div className="flex items-center gap-2.5 text-sm text-foreground">
          <div className="size-3" style={{ backgroundColor: v }} />
          <p>Failed to copy!</p>
        </div>
      ))
    }
  }

  const generateCssString = (vars: ThemeState["cssVars"]): string => {
    let cssString = ":root {\n"
    Object.entries(vars.root).forEach(([key, value]) => {
      cssString += `  ${key}: ${value};\n`
    })
    cssString += "}\n\n.dark {\n"
    Object.entries(vars.dark).forEach(([key, value]) => {
      cssString += `  ${key}: ${value};\n`
    })
    cssString += "}"
    return cssString
  }

  const handleThemeVarsCopy = async () => {
    await navigator.clipboard.writeText(
      generateCssString(userSelectedThemeTokens[currentThemeTokensFormat])
    )
    setIsThemeCopied(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsThemeCopied(false)
      timeoutRef.current = null
    }, 2000)
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = (e) => {
      const img = new Image()
      const res = e.target?.result
      if (!res || res === null) return
      img.crossOrigin = "anonymous"
      img.src = res as string

      img.onload = () => {
        renderImage(img)
      }
      img.onerror = () => {
        toast.error(() => (
          <div className="flex items-center gap-2.5 text-sm text-foreground">
            <div className="size-3" />
            <p>Image failed to load!</p>
          </div>
        ))
      }
    }
    reader.onerror = () => {
      toast.error(() => (
        <div className="flex items-center gap-2.5 text-sm text-foreground">
          <div className="size-3" />
          <p>Image failed to load!</p>
        </div>
      ))
    }
  }

  const handleImageLink = (e: ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value
    const img = new Image()
    img.src = link
    img.crossOrigin = "anonymous"

    img.onload = () => {
      renderImage(img)
    }
  }

  const renderImage = (img: HTMLImageElement | null) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (!canvas || !ctx || !img) return

    const cssWidth = canvas.clientWidth
    const cssHeight = canvas.clientHeight
    const imgW = img.naturalWidth
    const imgH = img.naturalHeight
    const imgRatio = imgW / imgH
    const canvasRatio = cssWidth / cssHeight
    let drawW, drawH, offsetX, offsetY

    canvas.width = cssWidth * dpr
    canvas.height = cssHeight * dpr
    ctx.scale(dpr, dpr)

    if (imgRatio > canvasRatio) {
      // Image is wider relative to its height than the canvas. Fit by canvas width.
      drawW = cssWidth
      drawH = cssWidth / imgRatio
      offsetX = 0
      offsetY = (cssHeight - drawH) / 2
    } else {
      // Image is taller relative to its width than the canvas, or same aspect ratio. Fit by canvas height.
      drawH = cssHeight
      drawW = cssHeight * imgRatio
      offsetY = 0
      offsetX = (cssWidth - drawW) / 2
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)

    setIsImageRendered(true)

    const internalX = Math.floor(offsetX * dpr)
    const internalY = Math.floor(offsetY * dpr)
    const internalW = Math.floor(drawW * dpr)
    const internalH = Math.floor(drawH * dpr)

    const pixelArray = ctx.getImageData(
      internalX,
      internalY,
      internalW,
      internalH
    ).data

    processImage(pixelArray, THEMEBUTTONS * COLOR_ROTATION)
  }

  const handleCanvasPointer = (clientX: number, clientY: number) => {
    if (!isImageRendered) return

    const mainCanvas = canvasRef.current
    const lensCanvas = previewLensRef.current
    const cursor = cursorRef.current

    if (!mainCanvas || !lensCanvas) return

    const mainCtx = mainCanvas.getContext("2d", { willReadFrequently: true })
    const zoomCtx = lensCanvas.getContext("2d")

    if (!mainCtx || !zoomCtx) return

    const rect = mainCanvas.getBoundingClientRect()

    cursor.x = clientX - rect.left
    cursor.y = clientY - rect.top

    if (
      cursor.x < 0 ||
      cursor.x > rect.width ||
      cursor.y < 0 ||
      cursor.y > rect.height
    ) {
      setLens((prev) => ({ ...prev, show: false }))
      return
    }

    cursor.physicalX = Math.floor(cursor.x * dpr)
    cursor.physicalY = Math.floor(cursor.y * dpr)

    let pickedColor: Uint8ClampedArray | number[] | RGB

    try {
      pickedColor = mainCtx.getImageData(
        cursor.physicalX,
        cursor.physicalY,
        1,
        1
      ).data

      if (pickedColor[3] === 0) {
        setLens((prev) => ({ ...prev, show: false }))
        return
      }

      setActiveColor(Array.from(pickedColor.slice(0, 3)) as RGB)
    } catch (e) {
      console.error("Failed to pick color:", e)
      return
    }

    const lensSize = 21 // Figma uses larger sample for smoothness (21×21)
    const offset = Math.floor(lensSize / 2)
    // const zoomFactor = 8 // Moderate zoom (8×) - not too extreme

    try {
      cursor.sx = cursor.physicalX - offset
      cursor.sy = cursor.physicalY - offset

      // Boundary check
      cursor.sx = Math.max(0, Math.min(cursor.sx, mainCanvas.width - lensSize))
      cursor.sy = Math.max(0, Math.min(cursor.sy, mainCanvas.height - lensSize))

      // Clear and prepare canvas
      zoomCtx.clearRect(0, 0, lensCanvas.width, lensCanvas.height)

      // Figma uses slight smoothing for anti-aliasing
      zoomCtx.imageSmoothingEnabled = true
      zoomCtx.imageSmoothingQuality = "high"

      // Draw zoomed region
      zoomCtx.drawImage(
        mainCanvas,
        cursor.sx,
        cursor.sy,
        lensSize,
        lensSize,
        0,
        0,
        lensCanvas.width,
        lensCanvas.height
      )

      const centerX = lensCanvas.width / 2
      const centerY = lensCanvas.height / 2
      const pixelSize = lensCanvas.width / lensSize

      // Style 1: Single center pixel outline (Figma default)
      zoomCtx.strokeStyle = "rgba(255, 255, 255, 0.9)"
      zoomCtx.lineWidth = 1.5
      zoomCtx.strokeRect(
        centerX - pixelSize / 2,
        centerY - pixelSize / 2,
        pixelSize,
        pixelSize
      )

      // Add subtle black outline for contrast
      zoomCtx.strokeStyle = "rgba(0, 0, 0, 0.3)"
      zoomCtx.lineWidth = 2.5
      zoomCtx.strokeRect(
        centerX - pixelSize / 2,
        centerY - pixelSize / 2,
        pixelSize,
        pixelSize
      )

      // Re-draw white on top
      zoomCtx.strokeStyle = "rgba(255, 255, 255, 0.95)"
      zoomCtx.lineWidth = 1.5
      zoomCtx.strokeRect(
        centerX - pixelSize / 2,
        centerY - pixelSize / 2,
        pixelSize,
        pixelSize
      )

      // Optional: Figma-style crosshair lines extending from center
      const crosshairLength = pixelSize * 1.5
      zoomCtx.strokeStyle = "rgba(255, 255, 255, 0.6)"
      zoomCtx.lineWidth = 1

      // Vertical line
      zoomCtx.beginPath()
      zoomCtx.moveTo(centerX, centerY - crosshairLength)
      zoomCtx.lineTo(centerX, centerY - pixelSize / 2)
      zoomCtx.moveTo(centerX, centerY + pixelSize / 2)
      zoomCtx.lineTo(centerX, centerY + crosshairLength)
      zoomCtx.stroke()

      // Horizontal line
      zoomCtx.beginPath()
      zoomCtx.moveTo(centerX - crosshairLength, centerY)
      zoomCtx.lineTo(centerX - pixelSize / 2, centerY)
      zoomCtx.moveTo(centerX + pixelSize / 2, centerY)
      zoomCtx.lineTo(centerX + crosshairLength, centerY)
      zoomCtx.stroke()

      const lensDisplaySize = 12 // Figma uses slightly larger lens
      const margin = 30 // More spacing from cursor

      let lensX = cursor.x
      let lensY = cursor.y

      // Horizontal: Always opposite side of cursor
      if (cursor.x < rect.width / 2) {
        lensX = cursor.x + lensDisplaySize / 2 + margin
      } else {
        lensX = cursor.x - lensDisplaySize / 2 - margin
      }

      // Vertical: Align with cursor, slight offset
      lensY = cursor.y

      // Keep within bounds
      lensX = Math.max(
        lensDisplaySize / 2 + 10,
        Math.min(rect.width - lensDisplaySize / 2 - 10, lensX)
      )
      lensY = Math.max(
        lensDisplaySize / 2 + 10,
        Math.min(rect.height - lensDisplaySize / 2 - 10, lensY)
      )

      setLens({
        show: true,
        x: lensX,
        y: lensY,
      })
    } catch (e) {
      console.error("Failed to render lens:", e)
    }

    if (pickedColor) {
      setColorCodes(Array.from(pickedColor) as RGB)
    }
  }

  const clearCanvas = () => {
    if (!canvasRef.current || lockCanvas) return
    const ctx = canvasRef.current.getContext("2d")
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    cancelProcess()
    if (imageLinkRef.current) imageLinkRef.current.value = ""
    setIsImageRendered(false)
  }

  const handleThemeStateLock = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    key: "base" | "theme" | "chart"
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentThemeState((prev) => ({
      ...prev,
      locks: { ...prev.locks, [key]: !prev.locks[key] },
    }))
  }

  const handleThemeStateStyle = (v: ThemeState["mode"]) => {
    setCurrentThemeState((prev) => ({
      ...prev,
      mode: v,
    }))
    if (v === "classic") {
      const r = generateClassicTheme(
        displayedThemeColors,
        currentThemeState.selections,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    } else if (v === "smart") {
      const r = generateSmartTheme(
        displayedThemeColors,
        currentThemeState.selections,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    } else if (v === "funky") {
      const r = generateFunkyTheme(
        displayedThemeColors,
        currentThemeState.selections,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    } else if (v === "manual") {
      const r = generateManualTheme(
        displayedThemeColors,
        currentThemeState.selections,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    }
  }

  const handleColorSelection = (
    key: "base" | "theme" | "chart",
    color: string | RGB,
    livePreview: boolean
  ) => {
    if (currentThemeState.locks[key]) return
    const c = typeof color === "string" ? color : rgbToRgbaString(color)
    let s: ThemeState["selections"] = {
      base: {
        livePreview: false,
        color: "",
      },
      theme: {
        livePreview: false,
        color: "",
      },
      chart: {
        livePreview: false,
        color: "",
      },
    }
    if (livePreview) {
      setCurrentThemeState((prev) => {
        s = {
          ...prev.selections,
          [key]: { color: c, livePreview: true },
        }
        return {
          ...prev,
          selections: s,
        }
      })
    } else {
      setCurrentThemeState((prev) => {
        s = {
          ...prev.selections,
          [key]: { color: c, livePreview: false },
        }
        return {
          ...prev,
          selections: s,
        }
      })
    }

    if (currentThemeState.mode === "classic") {
      const r = generateClassicTheme(
        displayedThemeColors,
        s,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    } else if (currentThemeState.mode === "smart") {
      const r = generateSmartTheme(
        displayedThemeColors,
        s,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    } else if (currentThemeState.mode === "funky") {
      const r = generateFunkyTheme(
        displayedThemeColors,
        s,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    } else if (currentThemeState.mode === "manual") {
      const r = generateManualTheme(
        displayedThemeColors,
        s,
        currentThemeState.locks,
        false
      )
      applyThemeToDOM(r.cssVars)
    }
  }

  const handleGetCode = (colorTypes: ColorTypes) => {
    const cVars = currentThemeState.cssVars
    const v = {} as UserPreferedThemeTokens
    const transformer = {
      hex: rgbToHex,
      hsl: rgbToHslString,
      oklch: rgbToOklchString,
      rgba: () => "",
    }

    for (const themeKey of typedKeys(cVars)) {
      if (!v[colorTypes])
        v[colorTypes] = {} as Record<"root" | "dark", Record<ThemeVars, string>>
      if (!v[colorTypes][themeKey])
        v[colorTypes][themeKey] = {} as Record<ThemeVars, string>

      for (const varKey of typedKeys(cVars[themeKey])) {
        if (!v[colorTypes][themeKey][varKey])
          v[colorTypes][themeKey][varKey] = ""

        const rgbNumArr = transformRgbaCodeToRgbaNumberArray(
          cVars[themeKey][varKey]
        )
        v[colorTypes][themeKey][varKey] = transformer[colorTypes](rgbNumArr)
      }
    }
    if (colorTypes === "rgba") v[colorTypes] = cVars
    setCurrentThemeTokensFormat(colorTypes)
    setUserSelectedThemeTokens((prev) => {
      return {
        ...prev,
        [colorTypes]: v[colorTypes],
      }
    })
  }

  const handleShuffleTheme = () => {
    const v = shuffleAndApplyTheme(
      completeColorsList.dominantColors.data,
      currentThemeState.mode,
      currentThemeState.selections,
      currentThemeState.locks
    )
    setCurrentThemeState((prev) => {
      return {
        ...prev,
        selections: v.selections,
      }
    })

    getCssVars(v.cssVars)
  }

  useEffect(() => {
    if (isLoading === "done") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setColorCodes(colors[0])
      setActiveColor(colors[0])
      setCompleteColorsList((prev) => {
        return {
          ...prev,
          dominantColors: {
            ...prev.dominantColors,
            data: colors,
          },
        }
      })
      setCurrentThemeState((prev) => ({
        ...prev,
        shades: { primary: primaryShades, extended: extendedShades },
        selections: {
          base: {
            ...prev.selections.base,
            color: rgbToRgbaString(
              completeColorsList.dominantColors.data[
                Math.floor(
                  Math.random() * completeColorsList.dominantColors.data.length
                )
              ]
            ),
          },
          theme: {
            ...prev.selections.theme,
            color: rgbToRgbaString(
              completeColorsList.dominantColors.data[
                Math.floor(
                  Math.random() * completeColorsList.dominantColors.data.length
                )
              ]
            ),
          },
          chart: {
            ...prev.selections.chart,
            color: rgbToRgbaString(
              completeColorsList.dominantColors.data[
                Math.floor(
                  Math.random() * completeColorsList.dominantColors.data.length
                )
              ]
            ),
          },
        },
      }))
    }

    // Test
  }, [colors, isLoading])

  useEffect(() => {
    if (isImageRendered && isLoading === "done") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleThemeStateStyle(currentThemeState.mode)
    }
  }, [isImageRendered, isLoading, colors])

  useEffect(() => {
    if (error !== null) {
      toast.error(() => (
        <div className="flex items-center gap-2.5 text-sm text-foreground">
          <div className="size-3" />
          <p>Something happended. Please try again</p>
        </div>
      ))
    }
  }, [error])

  return (
    <div className="flex flex-col gap-5 border-r bg-background p-3.5">
      <div>
        <p className="mb-0.5 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
          Palettix
        </p>
        <p className="text-sm font-semibold">Color Picker</p>
      </div>

      {/* Canvas placeholder */}
      <label
        htmlFor="upload-img-input"
        className="relative flex max-h-64 min-h-44 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted text-xs text-muted-foreground"
        ref={canvasParentRef}
        onClick={(e) => {
          if (isImageRendered) {
            e.preventDefault()
            setLens((prev) => ({ ...prev, show: false }))
            setSavedColors((prev) =>
              prev.length > 7
                ? [...prev.slice(1), colorCodes]
                : [...prev, colorCodes]
            )
            return
          }
        }}
        onMouseLeave={() => {
          if (!isImageRendered) return
          setLens((prev) => ({ ...prev, show: false }))
        }}
      >
        Canvas
        <input
          type="file"
          id="upload-img-input"
          accept="image/*"
          className="hidden h-full w-full cursor-pointer"
          onChange={handleImageUpload}
        />
        <canvas
          ref={canvasRef}
          className={`absolute -z-1 h-full w-full ${isLoading === "done" && "z-1"}`}
          onClick={() => setIsCanvasClicked(true)}
          onMouseEnter={() => {
            if (lockCanvas || !isImageRendered) return
            setLens((prev) => ({ ...prev, show: true }))
          }}
          onMouseLeave={() => {
            setIsCanvasClicked(false)
          }}
          onMouseMove={(e) => {
            if (lockCanvas || isCanvasClicked) {
              setLens((prev) => ({ ...prev, show: false }))
              return
            }
            handleCanvasPointer(e.clientX, e.clientY)
          }}
        ></canvas>
        {/* Preview lens - FIXED SIZE */}
        <canvas
          ref={previewLensRef}
          width={168}
          height={168}
          className={cn(
            "pointer-events-none invisible absolute z-50 flex h-full w-full items-center justify-center overflow-hidden rounded-full",
            lens.show && "visible"
          )}
          style={{
            width: "50px",
            height: "50px",
            left: `${lens.x}px`,
            top: `${lens.y}px`,
            transform: "translate(-50%, -50%)",
            border: `2px solid ${activeColor}`,
            boxShadow: `
                        0 0 0 1px rgba(0, 0, 0, 0.1),
                        0 8px 16px rgba(0, 0, 0, 0.15),
                        0 4px 8px rgba(0, 0, 0, 0.1)
                         `,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            transition: "border-color 0.1s ease-out",
            imageRendering: "auto", // Figma uses smooth rendering
          }}
        />
      </label>

      {/* Palette swatches */}
      <div className="space-y-2">
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Past link
        </p>
        <div className="h-min">
          <div className="flex gap-2">
            <input
              type="text"
              id="link-text"
              aria-describedby="helper-text-explanation"
              className="flex-1 rounded-xl border-gray-400 px-3 py-2 text-primary outline-1"
              placeholder="https://"
              autoComplete="off"
              ref={imageLinkRef}
              onBlur={handleImageLink}
            />
            <button
              id="clear-link-btn"
              className="inline-flex w-8 cursor-pointer items-center justify-center rounded-xl border-2 border-gray-200 bg-transparent text-primary hover:bg-gray-100 hover:text-black"
              onClick={clearCanvas}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>{" "}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          <p>Extracted palette</p>
          <div onClick={() => setLockCanvas((prev) => !prev)}>
            {!lockCanvas ? (
              <LockOpen size={14} className="cursor-pointer" />
            ) : (
              <Lock size={14} className="cursor-pointer" />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {displayedThemeColors.map((c, i) => (
            <Button
              key={i}
              className="h-10 w-10 rounded-full shadow-sm"
              onClick={() => {
                if (lockCanvas) return
                setColorCodes(c)
                setActiveColor(c)
              }}
              style={{ background: rgbToRgbaString(c) }}
            />
          ))}
          <Button
            variant={"outline"}
            className="h-10 w-10 cursor-pointer rounded-full shadow-sm ring-0"
            onClick={() => handleColorsReset()}
          >
            <RefreshCcw />
          </Button>
          <Button
            variant={"outline"}
            className="h-10 w-10 cursor-pointer rounded-full text-lg text-muted-foreground shadow-sm ring-0"
            onClick={clearCanvas}
          >
            C
          </Button>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-1 text-muted-foreground">
        {COLOR_TYPES.map((t, i) => (
          <Button
            key={i}
            className="h-11 border-2 p-2 text-[11px]"
            onClick={() => handleColorCopy(colorCodes, t)}
            style={{ backgroundColor: rgbToRgbaString(colorCodes) }}
          >
            <p className="uppercase">{t}</p>
            {/* <div className="flex gap-2">{c.code}</div> */}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-muted-foreground">
        <p className="text-[12px] tracking-[0.2em] capitalize">Theme shades</p>
        <div className="flex flex-wrap">
          {primaryShadesValues.map((shade, idx, array) => {
            return (
              <Button
                key={idx}
                className="h-11 basis-[calc(50%-4px)] border-2 p-2"
                onClick={() => handleColorCopy(shade.hex.color)}
                style={{ backgroundColor: shade.hex.color }}
              >
                <p
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: array[array.length - 1 - idx].hex.color }}
                >
                  {shade.hex.color}
                </p>
              </Button>
            )
          })}
        </div>
        <Dialog open={showExtendedShades} onOpenChange={setShowExtendedShades}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              More
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Try different shades</DialogTitle>
              <DialogDescription>Contrast table</DialogDescription>
            </DialogHeader>
            <div className="-mx-4 no-scrollbar max-h-[65vh] overflow-y-auto px-4">
              <div className="min-h-screen font-sans">
                <div>
                  <RadioGroup
                    defaultValue={"hex"}
                    className="flex w-fit py-1.5"
                    onValueChange={(v) => setCurrentColorType(v as ColorTypes)}
                  >
                    {COLOR_TYPES.map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <RadioGroupItem value={t} id={t} />
                        <Label
                          htmlFor={t}
                          className="cursor-pointer text-[12px] tracking-[0.2em] capitalize"
                        >
                          {t}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {/* Contrast Matrix Table */}
                <div className="overflow-x-auto">
                  <table className="mx-auto border-separate border-spacing-2">
                    <thead>
                      <tr>
                        {/* Top-Left Empty Header Corner */}
                        <th></th>
                        {extendedShadesValues.map((_, colIdx) => (
                          <th
                            key={colIdx}
                            className="p-1 text-xs font-normal text-gray-500"
                          >
                            {colIdx + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {extendedShadesValues.map((_, rowIdx) => (
                        <tr key={rowIdx}>
                          {/* Left Side Label Column */}
                          <td className="pr-3 text-right text-xs text-gray-500">
                            XX
                          </td>

                          {/* Grid Cells */}
                          {extendedShadesValues.map((colObj, colIdx, array) => (
                            <td
                              key={colIdx}
                              className="h-12 w-14 cursor-pointer rounded-lg text-center align-middle text-sm font-medium transition-all duration-200 select-none"
                              style={{
                                backgroundColor: colObj[currentColorType].color,
                                color:
                                  array[array.length - 1 - colIdx].hex.color,
                              }}
                              onClick={() =>
                                handleColorCopy(colObj[currentColorType].color)
                              }
                            >
                              XX
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-muted-foreground">
        <p className="block text-[12px] tracking-[0.2em] capitalize">
          Theme style
        </p>
        <div className="flex flex-wrap">
          <RadioGroup
            defaultValue="classic"
            className="flex w-fit flex-wrap py-4"
            onValueChange={(v: ThemeState["mode"]) => handleThemeStateStyle(v)}
          >
            <div className="flex cursor-pointer items-center gap-1.5">
              <RadioGroupItem value="classic" id="r1" />
              <Label htmlFor="r1">
                Classic{" "}
                <div className="flex -space-x-1.5">
                  {primaryShadesValues.slice(0, 3).map((c, i) => (
                    <div
                      key={i}
                      className="size-4 rounded-full"
                      style={{
                        backgroundColor: c.rgba.color,
                      }}
                    ></div>
                  ))}
                </div>
              </Label>
            </div>
            <div className="flex cursor-pointer items-center gap-1.5">
              <RadioGroupItem value="smart" id="r2" />
              <Label htmlFor="r2">
                Smart{" "}
                <div className="flex -space-x-1.5">
                  {displayedThemeColors.slice(0, 3).map((c, i) => (
                    <div
                      key={i}
                      className="size-4 rounded-full"
                      style={{
                        backgroundColor: rgbToRgbaString(c) || "#000",
                      }}
                    ></div>
                  ))}
                </div>
              </Label>
            </div>
            <div className="flex cursor-pointer items-center gap-1.5">
              <RadioGroupItem value="funky" id="r3" />
              <Label htmlFor="r3">
                Funky{" "}
                <div className="flex -space-x-1.5">
                  {[
                    [35, 220, 251],
                    [178, 32, 254],
                    [113, 243, 42],
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="size-4 rounded-full"
                      style={{
                        backgroundColor: rgbToRgbaString(c as RGB) || "#000",
                      }}
                    ></div>
                  ))}
                </div>
              </Label>
            </div>
            <div className="flex cursor-pointer items-center gap-1.5">
              <RadioGroupItem value="manual" id="r4" />
              <Label htmlFor="r4">Manual </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="text-muted-foreground">
          <p className="block text-[12px] tracking-[0.2em] capitalize">
            Custom config
          </p>
          <div className="space-y-2 rounded-2xl">
            {customConfigOptions.map((key) => {
              // Fallback or dynamic value resolution for currently selected color hex string
              const color = currentThemeState.selections[key].color
              return (
                <Popover key={key}>
                  {/* Main Trigger Button */}
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-14 w-full justify-between p-3 text-start transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        {color === "Empty" ? (
                          <Ban className="size-6" />
                        ) : (
                          <div
                            className="size-6 shrink-0 rounded-full border shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        )}
                        <div>
                          <p className="text-[11px] leading-tight font-medium text-muted-foreground capitalize">
                            {key}
                          </p>
                          <p className="font-mono text-[13px] font-semibold tracking-tight">
                            {color}
                          </p>
                        </div>
                      </div>

                      {/* Independent Lock Interaction Zone */}
                      <div
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        onClick={(e) => {
                          handleThemeStateLock(e, key)
                        }}
                      >
                        {!currentThemeState.locks[key] ? (
                          <Unlock size={14} className="cursor-pointer" />
                        ) : (
                          <Lock size={14} className="cursor-pointer" />
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>

                  {/* Custom Popover Dropdown Sheet */}
                  <PopoverContent
                    align="end"
                    side="right"
                    className="w-72 space-y-3 border border-border bg-popover p-3 text-popover-foreground shadow-md"
                  >
                    <Tabs defaultValue="dominant" className="w-full">
                      {/* Tab Navigation Track Header */}
                      <TabsList className="mb-2 grid h-8 w-full grid-cols-3 rounded-md bg-muted p-0.5">
                        <TabsTrigger
                          value="dominant"
                          className="py-1 text-xs transition-all"
                        >
                          Dominant
                        </TabsTrigger>
                        <TabsTrigger
                          value="tailwind"
                          className="py-1 text-xs transition-all"
                        >
                          Tailwind
                        </TabsTrigger>
                        <TabsTrigger
                          value="custom"
                          className="py-1 text-xs transition-all"
                        >
                          Custom
                        </TabsTrigger>
                      </TabsList>

                      {/* Pane 1: Dominant Colors Grid Matrix */}
                      <TabsContent
                        value="dominant"
                        className="space-y-2 outline-none"
                      >
                        {completeColorsList.dominantColors.data && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between px-0.5">
                              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {completeColorsList.dominantColors.title}
                              </p>
                            </div>
                            <div className="flex gap-1.5 pr-1">
                              <div className="space-y-1 border-r-2 pr-3">
                                <div className="">
                                  <Button
                                    type="button"
                                    className="aspect-square size-6 rounded-sm border border-muted shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none active:scale-95"
                                    style={{
                                      backgroundColor:
                                        rgbToRgbaString(activeColor),
                                    }}
                                    onClick={() =>
                                      handleColorSelection(
                                        key,
                                        activeColor,
                                        true
                                      )
                                    }
                                  ></Button>
                                </div>
                              </div>
                              <div className="grid scrollbar-thin grid-cols-7 gap-1.5 pr-1">
                                {completeColorsList.dominantColors.data.map(
                                  (color, i) => {
                                    return (
                                      <Button
                                        key={i}
                                        type="button"
                                        className="aspect-square size-6 rounded-full border border-muted shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none active:scale-95"
                                        style={{
                                          backgroundColor:
                                            rgbToRgbaString(color),
                                        }}
                                        onClick={() =>
                                          handleColorSelection(
                                            key,
                                            color,
                                            false
                                          )
                                        }
                                      />
                                    )
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                            Saved colors
                          </p>
                          <div className="space-x-1.5">
                            {savedColors.map((c, i) => (
                              <Button
                                key={i}
                                type="button"
                                className="aspect-square size-6 rounded-sm border border-muted shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none active:scale-95"
                                style={{
                                  backgroundColor: rgbToRgbaString(c),
                                }}
                                onClick={() =>
                                  handleColorSelection(key, c, false)
                                }
                              ></Button>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Pane 2: High Density Tailwind Color Grid Canvas */}
                      <TabsContent
                        value="tailwind"
                        className="space-y-2 outline-none"
                      >
                        {completeColorsList.tailwindColors.data && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between px-0.5">
                              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {completeColorsList.tailwindColors.title}
                              </p>
                              <span className="text-[10px] text-muted-foreground italic">
                                Shades (50-950)
                              </span>
                            </div>

                            {/* Scrollable Matrix Block - Kept strictly bounded */}
                            <div className="max-h-48 scrollbar-thin space-y-2 overflow-y-auto pr-1">
                              {completeColorsList.tailwindColors.data.map(
                                (c, i) => {
                                  return (
                                    <Button
                                      key={i}
                                      className="w-full justify-start border-0 p-0"
                                      onClick={() => {
                                        handleColorSelection(
                                          key,
                                          c.color,
                                          false
                                        )
                                      }}
                                      variant={"outline"}
                                    >
                                      <div
                                        style={{
                                          background: c.color || "#000",
                                        }}
                                        className="size-6"
                                      />

                                      <p className="capitalize">{c.name}</p>
                                    </Button>
                                  )
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      {/* Pane 3: Isolated Safe Custom Native Color Input Picker */}
                      <TabsContent
                        value="custom"
                        className="space-y-2 outline-none"
                      >
                        <div className="space-y-2 py-1">
                          <p className="px-0.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                            {completeColorsList.customColor.title}
                          </p>

                          <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed bg-muted/20 p-4">
                            <label className="relative block size-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-input shadow-sm transition-all hover:scale-105 active:scale-95">
                              <input
                                type="color"
                                className="absolute inset-0 scale-150 cursor-pointer opacity-0"
                                value={
                                  completeColorsList.customColor.data?.color ||
                                  "#000000"
                                }
                                onChange={(e) => {
                                  handleColorSelection(
                                    key,
                                    hexToRgbArray(e.target.value),
                                    false
                                  )
                                  // setCompleteColorsList((prev) => ({
                                  //   ...prev,

                                  //   customColor: {
                                  //     ...prev.customColor,
                                  //     data: {
                                  //       color: rgbToRgbaString(
                                  //         hexToRgbArray(e.target.value)
                                  //       ),
                                  //     },
                                  //   },
                                  // }))
                                }}
                              />
                              <div
                                className="h-full w-full"
                                style={{
                                  backgroundColor:
                                    completeColorsList.customColor.data
                                      ?.color || "#000000",
                                }}
                              />
                            </label>

                            <div className="text-center">
                              <p className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
                                {completeColorsList.customColor.data?.color ||
                                  "#000000"}
                              </p>
                              <p className="mt-0.5 text-[10px] text-muted-foreground">
                                Click color box to adjust custom value
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </PopoverContent>
                </Popover>
              )
            })}
          </div>
        </div>
      </div>

      <footer className="h-full w-full">
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                // onClick={() => handleGetCode()}
              >
                Get code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl sm:max-w-xl">
              <DialogHeader className="gap-1.5">
                <p className="text-lg font-semibold tracking-tight">
                  Theme tokens
                </p>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color format
                </p>
                <div className="pt-2">
                  <RadioGroup
                    defaultValue={"hex"}
                    className="flex items-center gap-6"
                    onValueChange={(v) => handleGetCode(v as ColorTypes)}
                  >
                    {COLOR_TYPES.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <RadioGroupItem value={t} id={t} />
                        <Label
                          htmlFor={t}
                          className="cursor-pointer text-xs font-medium tracking-wider text-foreground/70 uppercase hover:text-foreground"
                        >
                          {t}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </DialogHeader>

              <div className="relative mt-4 rounded-lg border border-border bg-zinc-950 dark:bg-zinc-900/50">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleThemeVarsCopy}
                  className="absolute top-3 right-3 z-10 h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
                >
                  {isThemeCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                <div className="no-scrollbar max-h-[380px] overflow-y-auto p-4 font-mono text-xs leading-relaxed text-zinc-100 select-text">
                  <span className="text-indigo-400">:root</span> {"{"}
                  <div className="pl-4">
                    {Object.entries(
                      userSelectedThemeTokens[currentThemeTokensFormat].root ??
                        {}
                    ).map(([key, value]) => (
                      <div key={key} className="py-0.5">
                        <span className="text-sky-400">{key}</span>:{" "}
                        <span className="text-emerald-400">'{value}'</span>;
                      </div>
                    ))}
                  </div>
                  {"}"}
                  <div className="mt-4">
                    <span className="text-indigo-400">.dark</span> {"{"}
                    <div className="pl-4">
                      {Object.entries(
                        userSelectedThemeTokens[currentThemeTokensFormat]
                          .dark ?? {}
                      ).map(([key, value]) => (
                        <div key={key} className="py-0.5">
                          <span className="text-sky-400">{key}</span>:{" "}
                          <span className="text-emerald-400">'{value}'</span>;
                        </div>
                      ))}
                    </div>
                    {"}"}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleShuffleTheme()}
          >
            Shuffle
          </Button>
        </div>
      </footer>
    </div>
  )
}

export { ColorPicker }
