import {
  Bold,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  Contrast,
  Copy,
  Eye,
  Italic,
  List,
  ListFilter,
  ListOrdered,
  MapPin,
  Minus,
  Play,
  Plus,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Strikethrough,
  Sun,
  Truck,
  Underline,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import albumcover from "@/assets/album.jpg"
import { Waveform } from "@/components/custom/waveform"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react"

// DATA
const d = [
  // Fade-in start (very small to growing)
  0.02, 0.08, 0.09, 0.08, 0.11, 0.02, 0.11, 0.13, 0.0, 0.13, 0.22, 0.25, 0.15,
  0.51, 0.63,

  // Middle section (original dynamic heights)
  0.6, 0.17, 0.9, 0.18, 0.49, 0.15, 0.85, 0.57, 0.56, 0.93, 0.01, 0.82, 0.61,
  0.58, 0.86, 0.44, 0.66, 0.75, 0.68, 0.6, 0.35, 0.4, 0.62, 0.09, 0.54, 0.51,
  0.18, 0.15, 0.11, 0.54, 0.32, 0.06, 0.12, 0.7, 0.88, 0.91, 0.4, 0.46, 0.65,
  0.71, 0.0, 0.16, 0.32, 0.79, 0.03, 0.65, 0.36, 0.23, 0.56, 0.93, 0.82, 0.99,
  0.08, 0.41, 0.51, 0.26, 0.08, 0.38, 0.52, 0.72, 0.21, 0.95, 0.9, 0.46, 0.42,
  0.02, 0.99, 0.25, 0.1, 0.46, 0.95, 0.82, 0.72, 0.52, 0.87, 0.35, 0.87, 0.97,
  0.83, 0.17, 0.43, 0.26, 0.36, 0.5, 0.07, 0.04, 0.17, 0.13, 0.89, 0.18, 0.46,
  0.51, 0.16, 0.67, 0.61, 0.3, 0.63, 0.46, 0.7, 0.91, 0.16, 0.99, 0.36,

  // Fade-out end (shrinking down to zero)
  0.67, 0.52, 0.46, 0.38, 0.1, 0.02, 0.09, 0.25, 0.23, 0.12, 0.12, 0.06, 0.02,
  0.07, 0.02, 0.05, 0.06, 0.03, 0.04,
]

const ROW_1_LOGOS = [
  {
    name: "Capgemini",

    renderIcon: () => <span className="text-xs font-black">♠</span>,
  },
  {
    name: "CISCO",

    renderIcon: () => (
      <div className="flex h-3 items-end gap-0.5">
        <div className="h-1.5 w-0.5 bg-current" />
        <div className="h-2.5 w-0.5 bg-current" />
        <div className="h-3.5 w-0.5 bg-current" />
        <div className="h-2.5 w-0.5 bg-current" />
        <div className="h-1.5 w-0.5 bg-current" />
      </div>
    ),
  },
  {
    name: "Experian",
    renderIcon: () => (
      <div className="grid size-2.5 grid-cols-2 gap-0.5">
        <div className="rounded-xs bg-current" />
        <div className="rounded-xs bg-current opacity-50" />
        <div className="rounded-xs bg-current opacity-75" />
        <div className="rounded-xs bg-current" />
      </div>
    ),
  },
  {
    name: "ExpressVPN",
    renderIcon: () => <span className="text-sm font-bold">Ξ</span>,
  },
]

const ROW_2_LOGOS = [
  {
    name: "QANTAS",
    renderIcon: () => (
      <div className="size-3 bg-current [clip-path:polygon(100%_0,0_0,100%_100%)]" />
    ),
  },
  {
    name: "Rakuten",
    renderIcon: () => (
      <span className="font-sans font-bold underline decoration-2">R</span>
    ),
  },
  {
    name: "Red Bull",
    renderIcon: () => <div className="size-3 rounded-full bg-current" />,
  },
  {
    name: "Replit",

    renderIcon: () => (
      <span className="font-mono text-sm font-bold">&lt;/&gt;</span>
    ),
  },
]

const STAMP_CARDS_DATA = [
  {
    id: "1",
    stampNumber: "#KZ-90112",
    title: "Ceramic Brake Pad Set",
    description: "Lexus RX 350 (2021)",
    location: "Bay 4 - Main Garage",
    buttonText: "Contact Workshop",
    status: "ON PROCESS",
    dateTime: "June 18, 2026 • 08:15 PM",
    colors: {
      bg: "bg-surface-1 border-border",
      text: "text-text-primary",
      mutedText: "text-text-secondary",
      accentBg: "bg-primary hover:bg-state-hover hover:text-text-primary",
      accentText: "text-primary-foreground",
      badgeBg: "bg-accent text-accent-foreground border-border-subtle",
    },
  },
  {
    id: "2",
    stampNumber: "#TX-44091",
    title: "V8 Engine Tuning",
    description: "Ford Mustang GT (2023)",
    location: "Performance Lab",
    buttonText: "View Diagnostics",
    status: "DIAGNOSING",
    dateTime: "June 19, 2026 • 10:00 AM",
    colors: {
      bg: "bg-surface-2 border-border-strong",
      text: "text-text-primary",
      mutedText: "text-text-tertiary",
      accentBg: "bg-info hover:bg-state-hover hover:text-muted-foreground",
      accentText: "text-info-foreground",
      badgeBg: "bg-info-muted/20 text-info border-info-muted/30",
    },
  },
  {
    id: "3",
    stampNumber: "#EV-10823",
    title: "Battery Cell Balancing",
    description: "Tesla Model Y (2024)",
    location: "Electrical Bay 2",
    buttonText: "Approve Service",
    status: "QUEUED",
    dateTime: "June 18, 2026 • 11:30 PM",
    colors: {
      bg: "bg-surface-3 border-border",
      text: "text-text-primary",
      mutedText: "text-text-secondary",
      accentBg: "bg-success hover:bg-state-hover hover:text-text-primary/70",
      accentText: "text-success-foreground",
      badgeBg: "bg-success text-success-foreground border-border-subtle",
    },
  },
  {
    id: "4",
    stampNumber: "#OB-88310",
    title: "Synthetic Oil Change",
    description: "BMW 330i (2022)",
    location: "Express Lane 1",
    buttonText: "Mark Completed",
    status: "READY",
    dateTime: "June 18, 2026 • 04:45 PM",
    colors: {
      bg: "bg-surface-4 border-border",
      text: "text-text-primary",
      mutedText: "text-text-secondary",
      accentBg: "bg-warning hover:bg-state-hover hover:text-accent-foreground",
      accentText: "text-warning-foreground",
      badgeBg: "bg-warning-muted/30 text-warning-foreground border-warning/20",
    },
  },
  {
    id: "5",
    stampNumber: "#ER-40499",
    title: "Transmission Flush",
    description: "Audi A6 Quattro",
    location: "Heavy Lift Bay 1",
    buttonText: "Investigate Error",
    status: "SYSTEM ERROR",
    dateTime: "June 19, 2026 • 11:15 AM",
    colors: {
      bg: "bg-surface-5 border-border-strong",
      text: "text-text-primary",
      mutedText: "text-text-secondary",
      accentBg: "bg-error hover:bg-state-hover hover:text-text-primary",
      accentText: "text-error-foreground",
      badgeBg: "bg-muted text-muted-foreground border-border-subtle",
    },
  },
  {
    id: "6",
    stampNumber: "#NL-77218",
    title: "Wheel Realignment",
    description: "Porsche 911 (2020)",
    location: "Laser Track 3",
    buttonText: "Review Setup",
    status: "SECONDARY ITEM",
    dateTime: "June 19, 2026 • 01:40 PM",
    colors: {
      bg: "bg-surface-5 border-border-subtle",
      text: "text-text-primary",
      mutedText: "text-text-tertiary",
      accentBg: "bg-secondary hover:bg-state-hover hover:text-muted-foreground",
      accentText: "text-secondary-foreground",
      badgeBg: "bg-popover text-popover-foreground border-border",
    },
  },
  {
    id: "7",
    stampNumber: "#CH-33091",
    title: "ECU Firmware Flash",
    description: "Mercedes AMG C63",
    location: "Tuning Suite B",
    buttonText: "View Performance Curve",
    status: "METRICS LINKED",
    dateTime: "June 19, 2026 • 03:10 PM",
    colors: {
      bg: "bg-surface-7 border-border-strong",
      text: "text-text-primary",
      mutedText: "text-text-secondary",
      accentBg: "bg-chart-1 hover:bg-state-hover hover:text-text-primary",
      accentText: "text-primary-foreground",
      badgeBg: "bg-muted text-muted-foreground border-border-subtle",
    },
  },
]

export default function Page04() {
  // Configured columns and rows dynamically based on layout needs
  const cols = 2
  const rows = 8

  // Utility to generate a sequence of background gradients representing inner lines
  const generateGradients = (
    count: number,
    direction: "to right" | "to bottom"
  ) => {
    const gradients = []
    for (let i = 1; i < count; i++) {
      const percentage = (i / count) * 100
      gradients.push(
        `linear-gradient(${direction}, transparent calc(${percentage}% - 0.5px), var(--border-strong) ${percentage}%, transparent calc(${percentage}% + 0.5px))`
      )
    }
    return gradients.join(", ")
  }

  const horizontalGradients = generateGradients(rows, "to bottom")
  const verticalGradients = generateGradients(cols, "to right")

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Fading Grid Borders Container */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Horizontal fading grid lines */}
        {horizontalGradients && (
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              backgroundImage: horizontalGradients,
              maskImage:
                "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
            }}
          />
        )}
        {/* Vertical fading grid lines */}
        {verticalGradients && (
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              backgroundImage: verticalGradients,
              maskImage:
                "linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)",
            }}
          />
        )}
      </div>

      {/* Content Grid */}

      <div className="relative z-0 grid auto-rows-[minmax(280px,1fr)] grid-cols-1 items-center justify-between md:grid-cols-2">
        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <TextEditor />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <MusicPlayer />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <RadialFab />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <VolumnSlider />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <Counter />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <TrackingCard />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <MagneticCardContainer />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 [mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_75%,transparent_100%)] p-2.5 [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_75%,transparent_100%)]">
          <LogoMarqueeContainer />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <DigitalClockStack />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <InfiniteStampSwiper />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <PremiumGradientCanvas />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <KineticGridBackground />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <CosmicAuroraBackground />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <FractalGlassBackground />
        </section>

        <section className="grid h-full w-full place-items-center space-y-1.5 p-2.5">
          <GlassHorizonBackground />
        </section>
      </div>
    </div>
  )
}

function RadialFab() {
  const [isOpen, setIsOpen] = useState(true)

  const actions = [
    {
      icon: Contrast,
      label: "Contrast",
      bg: "var(--surface-4)",
      onClick: () => console.log("Contrast clicked"),
    },
    {
      icon: Sun,
      label: "Brightness",
      bg: "var(--surface-6)",
      onClick: () => console.log("Brightness clicked"),
    },
    {
      icon: Compass,
      label: "Target",
      bg: "var(--surface-3)",
      onClick: () => console.log("Target clicked"),
    },
    {
      icon: Eye,
      label: "View",
      bg: "var(--surface-5)",
      onClick: () => console.log("View clicked"),
    },
  ]

  const radius = 90

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {actions.map((action, index) => {
          const totalAngle = 120
          const startAngle = 170
          const angleInRadians =
            ((startAngle + (index / (actions.length - 1)) * totalAngle) *
              Math.PI) /
            180

          const x = Math.cos(angleInRadians) * radius
          const y = Math.sin(angleInRadians) * radius

          return (
            <Button
              key={index}
              variant="outline"
              size="icon"
              onClick={action.onClick}
              className={cn(
                "absolute size-14 rounded-full text-white transition-all duration-300 ease-out hover:bg-zinc-800 hover:text-white",
                isOpen
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-0 opacity-0"
              )}
              style={{
                transform: isOpen
                  ? `translate(${x}px, ${y}px) scale(1)`
                  : "translate(0px, 0px) scale(0)",
                background: action.bg,
              }}
              aria-label={action.label}
            >
              <action.icon className="size-6" />
            </Button>
          )
        })}

        <Button
          size="icon"
          className={cn(
            "h-16 w-16 rounded-full bg-surface-3 text-white shadow-lg transition-transform duration-300 hover:bg-[#4f46e5]",
            isOpen && "scale-100"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <Plus
            className={cn(
              "size-11 transition-transform duration-300",
              isOpen && "rotate-45"
            )}
          />
        </Button>
      </div>
    </div>
  )
}

function VolumnSlider() {
  const [level, setLevel] = useState(75)
  const MIN_VOL = 0
  const MAX_VOL = 100
  const STEP = 5

  return (
    <div className="flex justify-between gap-3.5">
      <Button
        className="flex-center size-10 cursor-pointer rounded-full bg-accent *:hover:stroke-red-600"
        onClick={() => setLevel((prev) => Math.max(MIN_VOL, prev - STEP))}
      >
        <Minus className="stroke-muted-foreground" />
      </Button>
      <div className="flex-center w-[120px]">
        <Slider
          defaultValue={[level]}
          value={[level]}
          min={MIN_VOL}
          max={MAX_VOL}
          step={STEP}
          onValueChange={(v) => setLevel(v[0])}
          className="**:data-[slot=slider-track]: mx-auto h-3 w-full max-w-xs **:data-[slot=slider-thumb]:hidden **:data-[slot=slider-track]:h-10 **:data-[slot=slider-track]:rounded-full **:data-[slot=slider-track]:bg-accent"
        />
      </div>
      <Button
        className="flex-center size-10 cursor-pointer rounded-full bg-accent *:hover:stroke-red-600"
        onClick={() => setLevel((prev) => Math.min(MAX_VOL, prev + STEP))}
      >
        <Plus className="stroke-muted-foreground" />
      </Button>
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex justify-between gap-3.5">
      <Button
        className="flex-center size-10 cursor-pointer rounded-lg bg-accent *:hover:stroke-red-600"
        onClick={() => setCount((prev) => (prev === 0 ? 0 : prev - 1))}
      >
        <Minus className="stroke-muted-foreground" />
      </Button>
      <div className="flex-center w-[120px] rounded-lg bg-surface-5">
        {count}
      </div>
      <Button
        className="flex-center size-10 cursor-pointer rounded-lg bg-accent *:hover:stroke-red-600"
        onClick={() => setCount((prev) => prev + 1)}
      >
        <Plus className="stroke-muted-foreground" />
      </Button>
    </div>
  )
}

function TrackingCard() {
  const trackingNumber = "F523HI487"

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber)
  }

  return (
    <Card className="w-full max-w-md rounded-3xl border-0 p-6 shadow-sm">
      <CardContent className="space-y-8 p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
              <span className="font-serif text-xl font-black">a</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold tracking-tight text-foreground">
                  {trackingNumber}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground hover:bg-muted"
                  onClick={handleCopy}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Books</p>
            </div>
          </div>

          <Badge className="gap-1.5 rounded-full bg-info p-4 text-xs font-medium text-white hover:bg-indigo-500/90">
            <Truck className="h-3.5 w-3.5" />
            In Transit
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold text-foreground">
            <span>Warsaw</span>
            <span>Paris</span>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 border-t-2 border-dashed border-muted" />

            <div className="absolute top-1/2 left-0 h-0.5 w-2/3 -translate-y-1/2 bg-success" />

            <div className="z-1 h-4 w-4 rounded-full bg-success" />

            <div className="z-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-success bg-background" />

            <div className="z-1 h-4 w-4 rounded-full bg-muted" />
          </div>

          <div className="flex justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">Mar 28, 2026</p>
              <p className="text-muted-foreground">Shipped</p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="font-medium text-foreground">Mar 30, 2026</p>
              <p className="text-muted-foreground">Est. Arrival</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MagneticCardContainer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Raw position coordinates for the cursor ball
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Physics settings to give the ball its fluid, heavyweight organic pull
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const ballX = useSpring(cursorX, springConfig)
  const ballY = useSpring(cursorY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    // Default standard tracked coordinates relative to container parent
    let targetX = e.clientX - rect.left
    let targetY = e.clientY - rect.top

    // Optional: Add Magnetic pull if hovering near a specific child button
    if (buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect()
      const btnCenterX = btnRect.left + btnRect.width / 2
      const btnCenterY = btnRect.top + btnRect.height / 2

      // Calculate distance between structural cursor and button center
      const distanceX = e.clientX - btnCenterX
      const distanceY = e.clientY - btnCenterY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      // Trigger threshold attraction zone (e.g., 80px)
      if (distance < 80) {
        targetX = btnCenterX - rect.left + distanceX * 0.3
        targetY = btnCenterY - rect.top + distanceY * 0.3
      }
    }

    cursorX.set(targetX)
    cursorY.set(targetY)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex h-[400px] w-full max-w-2xl cursor-none items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]" />
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference will-change-transform"
        style={{
          x: ballX,
          y: ballY,
        }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />

      <div className="relative z-1 flex flex-col items-center space-y-4 text-center">
        <h3 className="text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl">
          Experience Interactive Flow
        </h3>
        <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
          Hover anywhere inside this component boundary to awaken the canvas
          cursor engine. Get close to the core target component below to
          experience magnetic gravitational attraction.
        </p>

        <button
          ref={buttonRef}
          className="group relative mt-4 inline-flex h-12 items-center justify-center rounded-full bg-muted px-6 font-medium text-muted-foreground transition-transform duration-300 active:scale-95"
        >
          <span className="relative z-1 block transition-transform duration-300 group-hover:scale-90">
            Target Node
          </span>
        </button>
      </div>
    </div>
  )
}

function MarqueeRow({
  logos,
  direction,
  className,
  speed = 25,
}: {
  logos: typeof ROW_1_LOGOS
  direction: "left" | "right"
  className?: string
  speed?: number
}) {
  const isLeft = direction === "left"
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden border border-border-strong py-1",
        className
      )}
    >
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={{
          x: isLeft ? [0, "-25%"] : ["-25%", 0],
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className={`flex rotate-12 items-center gap-3 px-5 py-2.5 font-mono transition-all duration-300 select-none hover:scale-[1.03]`}
          >
            {logo.renderIcon && (
              <div className="flex shrink-0 items-center justify-center opacity-80">
                {logo.renderIcon()}
              </div>
            )}
            <span className={`text-base whitespace-nowrap`}>{logo.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function LogoMarqueeContainer() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-1.5 rounded-lg bg-background">
      <MarqueeRow
        logos={ROW_1_LOGOS}
        direction="left"
        speed={28}
        className="bg-accent"
      />

      <MarqueeRow
        logos={ROW_2_LOGOS}
        direction="right"
        speed={32}
        className="bg-primary"
      />
    </div>
  )
}

function TimeSegment({
  value,
  label,
  bgClass,
  textClass,
}: {
  value: string
  label: string
  bgClass: string
  textClass: string
}) {
  const formattedValue = value.padStart(2, "0")

  return (
    <div
      className={`relative flex h-28 w-full items-center justify-between overflow-hidden px-8 sm:px-12 md:px-16 ${bgClass}`}
    >
      <span className="absolute top-3 right-4 font-mono text-xs font-semibold tracking-wider uppercase opacity-60">
        {label}
      </span>

      <div className="absolute -top-3 flex overflow-hidden font-display text-7xl font-black tracking-tighter select-none sm:text-8xl md:text-[170px]">
        {formattedValue.split("").map((digit, index) => (
          <div
            key={index}
            className="relative flex h-[1em] w-[0.7em] justify-center overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                  mass: 0.8,
                }}
                className={`absolute block will-change-transform ${textClass}`}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

function DigitalClockStack() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString()
  const minutes = time.getMinutes().toString()
  const seconds = time.getSeconds().toString()

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-lg border border-neutral-200 shadow-sm dark:border-neutral-800">
      <TimeSegment
        value={hours}
        label="h"
        bgClass="bg-surface-4"
        textClass="text-surface-foreground"
      />

      <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-800" />

      <TimeSegment
        value={minutes}
        label="min"
        bgClass="bg-surface-3"
        textClass="text-surface-foreground"
      />

      <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-800" />

      <TimeSegment
        value={seconds}
        label="sec"
        bgClass="bg-surface-2"
        textClass="text-surface-foreground"
      />
    </div>
  )
}

function SwipeableStampCard({
  data,
  index,
  total,
  onSwipe,
}: {
  data: (typeof STAMP_CARDS_DATA)[0]
  index: number
  total: number
  onSwipe: (direction: "left" | "right") => void
}) {
  const c = data.colors
  const isTop = index === 0

  const dragX = useMotionValue(0)
  const rotate = useTransform(dragX, [-200, 200], [-12, 12])
  const opacity = useTransform(
    dragX,
    [-200, -150, 0, 150, 200],
    [0.5, 1, 1, 1, 0.5]
  )

  const scale = 1 - index * 0.04
  const xOffset = index === 1 ? index - 50 : index === 2 ? index + 45 : 0

  const handleDragEnd = (_: Event, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 120) {
      onSwipe(info.offset.x > 0 ? "right" : "left")
    }
  }

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      style={{
        zIndex: total - index,
        x: isTop ? dragX : 0,
        rotate: isTop ? rotate : index === 1 ? -5 : index === 2 ? 8 : 0,
        opacity: isTop ? opacity : 1,
        maskImage:
          "radial-gradient(circle at 12px 0px, transparent 12px, black 13px), radial-gradient(circle at 12px 100%, transparent 12px, black 13px)",
        maskSize: "24px 51%",
        maskPosition: "top left, bottom left",
        maskRepeat: "repeat-x",
        WebkitMaskImage:
          "radial-gradient(circle at 12px 0px, transparent 12px, black 13px), radial-gradient(circle at 12px 100%, transparent 12px, black 13px)",
        WebkitMaskSize: "24px 51%",
        WebkitMaskPosition: "top left, bottom left",
        WebkitMaskRepeat: "repeat-x",
      }}
      initial={{ scale: 0.95, x: xOffset + 10, opacity: 0 }}
      animate={{
        scale,
        x: xOffset,
        opacity: 1,
        pointerEvents: isTop ? "auto" : "none",
      }}
      exit={{
        scale: 0.85,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`absolute w-full max-w-[250px] rounded-2xl border p-6 ${c.bg} ${c.text} cursor-grab touch-none shadow-2xl active:cursor-grabbing`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-4">
        <span
          className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${c.badgeBg}`}
        >
          {data.status}
        </span>
        <p className={`truncate text-xs font-medium ${c.mutedText}`}>
          {data.description}
        </p>
      </div>

      <div className="my-6 space-y-1">
        <h2 className="font-mono text-4xl font-black tracking-tight">
          {data.stampNumber}
        </h2>
        <p className="text-base font-semibold tracking-tight">{data.title}</p>
      </div>

      <div className="mb-6 space-y-2">
        <div className={`flex items-center gap-2 text-xs ${c.mutedText}`}>
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{data.location}</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${c.mutedText}`}>
          <Calendar className="size-3.5 shrink-0" />
          <span className="truncate">{data.dateTime}</span>
        </div>
      </div>

      <button
        className={`w-full rounded-xl px-4 py-3 text-sm font-bold tracking-tight transition-all active:scale-[0.97] ${c.accentBg} ${c.accentText} shadow-md cursor-pointer`}
      >
        {data.buttonText}
      </button>
    </motion.div>
  )
}

function TextEditor() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2.5 rounded-lg bg-accent p-2">
        {[
          Bold,
          Italic,
          Underline,
          Strikethrough,
          List,
          ListOrdered,
          ListFilter,
        ].map((Icon, i) => (
          <div
            key={i}
            className="flex-center size-7 cursor-pointer rounded-sm hover:bg-state-hover"
          >
            <Icon className="size-4" />
          </div>
        ))}

        <Button className="px-3">Add</Button>
      </div>{" "}
      <Tabs defaultValue="overview" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>

          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>

              <CardDescription>
                View your key metrics and recent project activity. Track
                progress across all your active projects.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
              You have 12 active projects and 3 pending tasks.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>

              <CardDescription>
                Track performance and user engagement metrics. Monitor trends
                and identify growth opportunities.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
              Page views are up 25% compared to last month.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MusicPlayer() {
  return (
    <div className="flex items-center gap-0">
      <img
        src={albumcover}
        alt="album-cover"
        className="size-[148px] rounded-lg bg-cover"
      />

      <div className="space-y-4 rounded-lg bg-accent px-3 py-2">
        <Waveform
          data={d}
          animated={false}
          progress={20}
          barCount={90}
          width={400}
          height={40}
          playedColor="var(--primary)"
          unplayedColor="var(--bg-surface-1)"
        />

        <div className="mb-1 flex justify-between text-text-primary">
          <p className="text-[10px]">1:02</p>

          <p className="text-[10px]">4:10</p>
        </div>

        <Slider
          defaultValue={[60]}
          onValueChange={() => {}}
          min={0}
          max={100}
          step={1}
          className="bg-accent **:data-[slot=slider-track]:bg-accent-foreground"
        />

        <div className="flex items-center justify-between">
          <Shuffle className="size-4 cursor-pointer stroke-muted-foreground hover:stroke-state-hover" />

          <div className="flex items-center justify-between gap-7">
            <SkipBack className="size-4 cursor-pointer fill-accent-foreground hover:fill-state-hover" />

            <div className="flex-center size-9 cursor-pointer rounded-full bg-surface-7 hover:bg-state-hover">
              <Play className="size-4" />
            </div>

            <SkipForward className="size-4 cursor-pointer fill-accent-foreground hover:fill-state-hover" />
          </div>

          <Repeat className="size-4 cursor-pointer stroke-muted-foreground hover:stroke-state-hover" />
        </div>
      </div>
    </div>
  )
}

function InfiniteStampSwiper() {
  const [cards, setCards] = useState(STAMP_CARDS_DATA)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSwipe = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setCards((prev) => {
      const next = [...prev]
      const first = next.shift()
      if (first) next.push(first)
      return next
    })

    // Match the timing window with spring execution to unlatch state mutations safely
    setTimeout(() => setIsAnimating(false), 250)
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="relative flex w-full items-center justify-center">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            if (index > 2) return null
            return (
              <SwipeableStampCard
                key={card.id}
                data={card}
                index={index}
                total={cards.length}
                onSwipe={handleSwipe}
              />
            )
          })}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 z-5 flex items-center gap-3">
        <button
          disabled={isAnimating}
          onClick={handleSwipe}
          className="flex size-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-white shadow-xl transition-all hover:bg-neutral-800 active:scale-90 disabled:opacity-50"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          disabled={isAnimating}
          onClick={handleSwipe}
          className="flex size-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-white shadow-xl transition-all hover:bg-neutral-800 active:scale-90 disabled:opacity-50"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  )
}

function PremiumGradientCanvas() {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-background p-6">
      <div className="pointer-events-none absolute inset-0 select-none">
        <div
          className="absolute top-[-10%] left-[-10%] h-[70%] w-[60%] animate-pulse rounded-full bg-chart-1 opacity-40 blur-[100px] dark:opacity-30"
          style={{ animationDuration: "8s" }}
        />

        <div
          className="absolute top-[10%] right-[-10%] h-[65%] w-[55%] animate-bounce rounded-full bg-chart-3 opacity-35 blur-[120px] dark:opacity-25"
          style={{ animationDuration: "12s" }}
        />

        <div className="absolute bottom-[-20%] left-[25%] h-[50%] w-[50%] rounded-full bg-info-muted opacity-30 blur-[90px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay select-none dark:opacity-[0.22]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-1 w-full max-w-md rounded-3xl border border-white/10 bg-surface-1/40 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-border-subtle dark:bg-surface-1/20">
        <div className="space-y-4">
          <span className="block w-fit rounded-full border border-white/5 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-text-secondary uppercase dark:bg-surface-2/40">
            Studio Engine
          </span>
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-text-primary">
            Grads
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Experience organic design layers crafted entirely out of modern CSS
            compilation. Fully reactive to system light and dark states.
          </p>
          <button className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold tracking-tight text-primary-foreground shadow-md transition-all hover:bg-state-hover active:scale-[0.98]">
            Explore Canvas
          </button>
        </div>
      </div>
    </div>
  )
}

function KineticGridBackground() {
  return (
    <div className="relative flex h-full w-full items-center justify-start overflow-hidden border border-border bg-background p-8">
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--border-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--border-strong) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-16 w-96 rotate-12 rounded-full bg-chart-4 opacity-40 blur-[60px]" />
        <div className="absolute right-1/4 bottom-1/4 h-44 w-64 -rotate-45 rounded-full bg-info opacity-40 blur-[80px]" />
        <div className="absolute -right-1 bottom-1 size-44 -rotate-45 rounded-full bg-error opacity-40 blur-[50px]" />
      </div>

      <div className="relative z-1 max-w-sm">
        <h3 className="font-mono text-2xl font-black tracking-tight text-text-primary uppercase">
          Sys.Matrix_09
        </h3>
        <p className="mt-1 font-mono text-xs tracking-wider text-text-secondary uppercase">
          Node Deployment Verified //
        </p>
      </div>
    </div>
  )
}

function GlassHorizonBackground() {
  return (
    <div className="relative flex h-full w-full items-center justify-between overflow-hidden border border-border-subtle bg-surface-2 p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-4 -left-8 h-16 w-48 rotate-[35deg] rounded-full border border-white/10 bg-gradient-to-r from-info/40 to-chart-1/10" />
        <div className="absolute right-4 bottom-2 h-20 w-56 -rotate-[15deg] rounded-full border border-white/5 bg-gradient-to-l from-chart-3/30 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-4 inset-y-4 rounded-xl border border-white/5 bg-surface-1/10 backdrop-blur-md" />

      <div className="relative z-10 pl-4">
        <h3 className="font-serif text-2xl font-light text-text-primary italic">
          Refraction
        </h3>
      </div>
      <div className="relative z-10 pr-4 text-right">
        <span className="font-mono text-xs font-semibold tracking-wider text-text-secondary uppercase">
          [ 05 / 05 ]
        </span>
      </div>
    </div>
  )
}

function CosmicAuroraBackground() {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden border p-6"
      style={{
        backgroundColor: "var(--accent)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 scale-125 opacity-80 mix-blend-screen">
        <div
          className="absolute top-[-20%] left-[-10%] h-[90%] w-[65%] rounded-full blur-[70px]"
          style={{
            backgroundImage: `linear-gradient(to bottom right, var(--chart-1), transparent)`,
          }}
        />
        <div
          className="absolute right-[-5%] bottom-[-10%] h-[80%] w-[60%] rounded-full blur-[65px]"
          style={{
            backgroundImage: `linear-gradient(to top left, var(--info), transparent)`,
          }}
        />
        <div
          className="absolute top-[20%] left-[35%] h-[60%] w-[40%] rounded-full blur-[80px]"
          style={{ backgroundColor: "var(--chart-2)", opacity: 0.3 }}
        />
      </div>

      <div className="relative z-10 text-center tracking-tight">
        <h3
          className="font-sans text-5xl font-light tracking-[0.15em] uppercase"
          style={{
            color: "var(--foreground)",
            filter: "drop-shadow(0 0 12px rgba(255,255,255,0.2))",
          }}
        >
          Cosmic
        </h3>
        <p
          className="mt-2 text-[10px] font-medium tracking-[0.4em] uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Gradient Backgrounds
        </p>
      </div>
    </div>
  )
}

function FractalGlassBackground() {
  return (
    <div
      className="relative flex h-full w-full items-end justify-start overflow-hidden border p-6"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border-strong)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 scale-110">
        <div
          className="absolute top-0 left-[-10%] h-full w-[50%] opacity-60 blur-[50px]"
          style={{ backgroundColor: "var(--info)" }}
        />
        <div
          className="absolute top-0 left-[20%] h-full w-[45%] opacity-70 blur-[45px]"
          style={{ backgroundColor: "var(--chart-4)" }}
        />
        <div
          className="absolute right-[-5%] bottom-0 h-[90%] w-[50%] opacity-60 blur-[50px]"
          style={{ backgroundColor: "var(--chart-3)" }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-80 mix-blend-overlay"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4) 0px, rgba(255,255,255,0.15) 2px, transparent 4px)`,
          backgroundSize: "8px 100%",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='glassNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.90' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23glassNoise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 pl-2">
        <h3
          className="font-sans text-4xl leading-none font-light tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Fractal<span className="font-medium">Glass</span>
        </h3>
      </div>
    </div>
  )
}
