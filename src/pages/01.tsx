import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import woman from "@/assets/woman.jpg"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  AlertCircleIcon,
  AlertTriangle,
  ArrowDownRight,
  BellRing,
  BookMarkedIcon,
  CheckCircle2Icon,
  ChevronDown,
  CircleFadingArrowUpIcon,
  Clock,
  Copy,
  Cpu,
  GitBranch,
  Globe,
  HardDrive,
  Heart,
  InfoIcon,
  Key,
  LocationEditIcon,
  MessagesSquare,
  MoreHorizontalIcon,
  Plane,
  Plus,
  Radio,
  RefreshCw,
  ShieldCheck,
  Star,
  Tag,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// DATA

const exceptionChartConfig = {
  volume: {
    label: "Exceptions",
    color: "var(--primary)",
  },
}

const regionalChartConfig = {
  fatal: {
    label: "Fatal",
    color: "var(--error)",
  },
  warn: {
    label: "Warn",
    color: "var(--warning)",
  },
  trace: {
    label: "Trace",
    color: "var(--primary)",
  },
}

const latencyChartConfig = {
  latency: {
    label: "Latency (ms)",
    color: "var(--primary)",
  },
}

const memoryChartConfig = {
  adapters: {
    label: "Zod Input Adapters",
    color: "var(--primary)",
  },
  serializer: {
    label: "Binary Serializer Diff",
    color: "var(--warning)",
  },
  hooks: {
    label: "Active Trace Hooks",
    color: "var(--error)",
  },
  overhead: {
    label: "Free Overhead Buffer",
    color: "var(--surface-3)",
  },
}

const exceptionData = [
  { time: "00:00", volume: 110 },
  { time: "02:00", volume: 95 },
  { time: "04:00", volume: 120 },
  { time: "06:00", volume: 60 },
  { time: "08:00", volume: 85 },
  { time: "10:00", volume: 40 },
  { time: "12:00", volume: 55 },
  { time: "14:00", volume: 142 },
  { time: "16:00", volume: 75 },
  { time: "18:00", volume: 110 },
  { time: "20:00", volume: 48 },
  { time: "22:00", volume: 35 },
]

const regionalData = [
  { zone: "US-East", fatal: 15, warn: 35, trace: 50 },
  { zone: "EU-Cent", fatal: 28, warn: 42, trace: 30 },
  { zone: "AP-South", fatal: 8, warn: 22, trace: 70 },
  { zone: "SA-East", fatal: 40, warn: 35, trace: 25 },
]

const latencyData = [
  { sample: 1, latency: 45 },
  { sample: 2, latency: 52 },
  { sample: 3, latency: 38 },
  { sample: 4, latency: 92 },
  { sample: 5, latency: 120 },
  { sample: 6, latency: 60 },
  { sample: 7, latency: 48 },
  { sample: 8, latency: 165 },
  { sample: 9, latency: 198 },
  { sample: 10, latency: 84 },
  { sample: 11, latency: 55 },
  { sample: 12, latency: 62 },
  { sample: 13, latency: 70 },
  { sample: 14, latency: 110 },
  { sample: 15, latency: 40 },
]

const memoryData = [
  { name: "Zod Input Adapters", value: 55, fill: "var(--primary)" },
  { name: "Binary Serializer Diff", value: 25, fill: "var(--warning)" },
  { name: "Active Trace Hooks", value: 12, fill: "var(--error)" },
  { name: "Free Overhead Buffer", value: 8, fill: "var(--surface-3)" },
]

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
]

export default function Page01() {
  return (
    <section className="grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-3">
      <ClusterNode_Card />
      <DataVolumn_Card />
      <TelemetryToken_Card />

      <GeneratePipelineToken_Form />
      <ConfigureStreamWebhook_Form />
      <IncidentThresholdPolicy_Form />

      <ActiveEngine_Chart />
      <ParsedException_Chart />
      <MemorySegment_Chart />
      <RegionalStructural_Chart />

      <ChelsaKnight_Card />
      <JaipurHeritage_Card />
      <MawlynnongVillage_Card />

      <ProductQuery_Accordion />
      <Classic_Alert />
      <TermsAndConditions_Check />

      <Calendar_ />
      <DigitalClock />
      <Badges />

      <Buttons />

      <SkeletonCard />
      <Slider_1 />
      <Slider_2 />

      <UserDetails_Form />
      <AListOfYearInvoices_Table />
      <ProductDetails_Form />
    </section>
  )
}

// COMPONENTS
// Card 1 - Cluster Node*
function ClusterNode_Card() {
  return (
    <Card className="space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-success-muted text-success">
            <Cpu className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">
              Cluster Node-04X
            </h4>
            <p className="text-[11px] text-text-tertiary">
              Asia-South1 (Mumbai)
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-success/10 bg-success-muted px-2 py-0.5 font-ubuntu text-[10px] font-bold text-success">
          <span className="size-1.5 animate-ping rounded-full bg-success"></span>{" "}
          Operational
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-border-subtle/50 pt-2">
        <div className="rounded-lg border border-border-subtle bg-surface-2 p-2">
          <span className="block text-[10px] font-medium tracking-wider text-text-secondary uppercase">
            Throughput
          </span>
          <span className="font-ubuntu text-base font-bold text-text-primary">
            4.2M{" "}
            <span className="text-xs font-normal text-text-tertiary">
              req/s
            </span>
          </span>
        </div>
        <div className="rounded-lg border border-border-subtle bg-surface-2 p-2">
          <span className="block text-[10px] font-medium tracking-wider text-text-secondary uppercase">
            Memory Fit
          </span>
          <span className="font-ubuntu text-base font-bold text-text-primary">
            14.2{" "}
            <span className="text-xs font-normal text-text-tertiary">GB</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-2 p-2 text-[11px] text-text-secondary">
        <ShieldCheck className="size-3.5 text-success" /> NAPI-RS binding
        compiling asynchronously.
      </div>
    </Card>
  )
}

// Card 2 - Data Volumn*
function DataVolumn_Card() {
  return (
    <Card className="flex flex-col justify-between space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
            Data Volume Usage
          </span>
          <HardDrive className="size-4 text-text-tertiary" />
        </div>
        <div className="font-ubuntu text-2xl font-bold tracking-tight text-text-primary">
          84.2 GB{" "}
          <span className="text-sm font-normal text-text-tertiary">
            / 100 GB
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: "84.2%" }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-text-secondary">
          <span>84.2% consumed</span>
          <span className="font-medium text-text-primary">
            15.8 GB remaining
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border-subtle/50 pt-2 text-xs">
        <span className="text-text-tertiary">Resets in 6 days</span>
        <button className="font-semibold text-primary transition-colors hover:text-state-hover">
          Upgrade plan
        </button>
      </div>
    </Card>
  )
}

// Card 3 - Telemetry Token*
function TelemetryToken_Card() {
  return (
    <Card className="space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-text-primary">
            Telemetry Token
          </h4>
          <p className="text-xs text-text-secondary">
            Active continuous pipeline ingestion key.
          </p>
        </div>
        <Key className="size-4 text-text-tertiary" />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface-2 p-2 font-ubuntu text-xs text-text-primary">
        <span className="truncate pr-4 select-all">
          es_live_4f71a9ce84bb30091aa4cd82
        </span>
        <button className="shrink-0 rounded p-1 text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
          <Copy className="size-3.5" />
        </button>
      </div>
      <div className="flex items-center justify-between pt-1 text-[11px]">
        <span className="text-text-tertiary">
          Scope:{" "}
          <span className="font-medium text-text-secondary">write:ingest</span>
        </span>
        <span className="text-text-tertiary">
          Created:{" "}
          <span className="font-medium text-text-secondary">2026-06-12</span>
        </span>
      </div>
    </Card>
  )
}

// Card 4 - Chelsa Knight*
function ChelsaKnight_Card() {
  return (
    <Card className="rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <Avatar className="size-10 border border-border-subtle">
          <AvatarImage src={woman} className="object-cover" />
          <AvatarFallback className="bg-surface-3 text-text-secondary">
            CN
          </AvatarFallback>
        </Avatar>
        <div className="flex gap-2">
          <div className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-surface-2 text-text-primary transition-colors hover:bg-state-hover active:bg-state-active">
            <Heart className="size-5 fill-current text-text-tertiary" />
          </div>
          <div className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-surface-2 text-text-primary transition-colors hover:bg-state-hover active:bg-state-active">
            <MessagesSquare className="size-5 fill-current text-text-tertiary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-0">
        <div>
          <p className="font-heading text-3xl font-bold tracking-tight text-text-primary">
            Chelsa Knight
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <div className="flex items-center justify-center gap-1 rounded-full border border-border-subtle bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            <Star className="size-3 fill-current text-warning" />
            <span>4.8</span>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full border border-border-subtle bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            <LocationEditIcon className="size-3 text-text-tertiary" />
            <span>Mizoram</span>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full border border-border-subtle bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            <BookMarkedIcon className="size-3 text-text-tertiary" />
            <span>+4 years</span>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full border border-border-subtle bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            <Clock className="size-3 text-text-tertiary" />
            <span>Full-time</span>
          </div>
        </div>

        <div className="pt-1">
          <div className="font-sans text-sm font-medium text-text-secondary">
            Hardware Engineer
          </div>
          <div className="font-ubuntu text-2xl font-bold tracking-tight text-text-primary">
            Senior
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border-subtle p-0 pt-2">
        <div className="py-1">
          <span className="font-ubuntu text-xl font-bold text-text-primary">
            ₹52,000
          </span>{" "}
          <span className="text-sm font-medium text-text-secondary">
            /Month
          </span>
        </div>
        <Button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-state-hover active:bg-state-active">
          See details
        </Button>
      </CardFooter>
    </Card>
  )
}

// Card 5 - Jaipur Heritage*
function JaipurHeritage_Card() {
  return (
    <Card className="rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-sm">
      <div className="relative flex h-full w-full items-end rounded-lg bg-[url(@/assets/scene.jpg)] bg-cover bg-center p-3 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-t before:from-overlay/90 before:via-overlay/40 before:to-transparent">
        <div className="relative z-1 w-full space-y-2">
          <div>
            <p className="font-heading text-2xl font-bold tracking-tight text-white">
              Jaipur
            </p>
            <p className="pl-0.5 text-xs font-medium text-white/80">Heritage</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[10px] font-medium text-white/90">
              <Tag className="size-3 text-white/70" />
              <span>
                from <span className="font-bold">₹11,000</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-white/90">
              <Plane className="size-3 text-white/70" />
              <span>Mizoram</span>
            </div>
          </div>
          <Button className="w-full rounded-full bg-surface-1 py-1.5 text-center text-xs font-semibold text-text-primary shadow-sm transition-colors hover:bg-state-hover active:bg-state-active">
            Search flight
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Card 6 - Mawlynnong Village*
function MawlynnongVillage_Card() {
  return (
    <Card className="flex rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-sm">
      <div className="h-[48%] w-full rounded-lg border border-border-subtle bg-[url(@/assets/scene.jpg)] bg-cover bg-center"></div>
      <div className="flex w-full flex-1 flex-col justify-between space-y-2 p-2">
        <div>
          <p className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Mawlynnong
          </p>
          <p className="pl-0.5 text-xs font-medium text-text-secondary">
            Village
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[10px] font-medium text-text-secondary">
            <Tag className="size-3 text-text-tertiary" />
            <span>
              from{" "}
              <span className="font-semibold text-text-primary">₹11,000</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-text-secondary">
            <Plane className="size-3 text-text-tertiary" />
            <span>Meghalaya</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <Button className="flex-1 rounded-full bg-primary py-1.5 text-center text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-state-hover active:bg-state-active">
            Search flight
          </Button>
          <Button
            className="flex size-7 items-center justify-center rounded-full border border-border-subtle bg-surface-2 text-error transition-all hover:bg-state-hover active:scale-95"
            variant="outline"
          >
            <Heart className="size-3.5 fill-current text-error" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Form 1 - Generate Pipeline*
function GeneratePipelineToken_Form() {
  return (
    <Card className="rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-heading text-base font-bold text-text-primary">
            Generate Pipeline Token
          </h3>
          <p className="text-xs text-text-secondary">
            Provision a localized token for asynchronous telemetry nodes.
          </p>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="token-name"
              className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
            >
              Token Name Identification
            </label>
            <input
              id="token-name"
              type="text"
              placeholder="e.g., Edge Daemon Parser"
              className="w-full rounded-md border border-border-strong bg-surface-2 p-2 text-sm text-text-primary transition-all outline-none placeholder:text-text-placeholder focus:border-border-focus focus:ring-1 focus:ring-state-focus"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="token-ttl"
              className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
            >
              Expiration Matrix
            </label>
            <div className="relative">
              <select
                id="token-ttl"
                className="w-full appearance-none rounded-md border border-border-strong bg-surface-2 p-2 pr-8 text-sm text-text-primary transition-all outline-none focus:border-border-focus focus:ring-1 focus:ring-state-focus"
              >
                <option value="30">30 Days Duration</option>
                <option value="90">90 Days Duration</option>
                <option value="365">1 Year Duration</option>
                <option value="never">Indefinite (No Expiration)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-text-tertiary" />
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <span className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase">
              Assigned Scope Capabilities
            </span>
            <div className="space-y-1.5">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-text-primary">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-3.5 rounded border-border-strong text-primary focus:ring-state-focus"
                />
                <span>telemetry:write (Ingest diagnostics)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-text-primary">
                <input
                  type="checkbox"
                  className="size-3.5 rounded border-border-strong text-primary focus:ring-state-focus"
                />
                <span>metrics:read (Access historical shards)</span>
              </label>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-state-hover"
        >
          <Plus className="size-3.5" /> Generate Key Matrix
        </button>
      </form>
    </Card>
  )
}

// Form 2 - Configure Stream*
function ConfigureStreamWebhook_Form() {
  return (
    <Card className="rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-heading text-base font-bold text-text-primary">
            Configure Stream Webhook
          </h3>
          <p className="text-xs text-text-secondary">
            Broadcast compiled node traps down-funnel in real time.
          </p>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="webhook-url"
              className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
            >
              Destination Payload URL
            </label>
            <div className="relative">
              <Globe className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-placeholder" />
              <input
                id="webhook-url"
                type="url"
                placeholder="https://api.yourdomain.com/v1/hooks"
                className="w-full rounded-md border border-border-strong bg-surface-2 p-2 pl-9 text-sm text-text-primary transition-all outline-none placeholder:text-text-placeholder focus:border-border-focus focus:ring-1 focus:ring-state-focus"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="webhook-secret"
              className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
            >
              HMAC Authentication Secret
            </label>
            <input
              id="webhook-secret"
              type="password"
              placeholder="••••••••••••••••••••••••"
              className="w-full rounded-md border border-border-strong bg-surface-2 p-2 text-sm text-text-primary transition-all outline-none placeholder:text-text-placeholder focus:border-border-focus focus:ring-1 focus:ring-state-focus"
            />
          </div>
          <div className="space-y-2">
            <span className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase">
              Trigger Ingestion Filters
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 p-2 text-xs text-text-primary transition-colors hover:bg-state-hover">
                <input
                  type="radio"
                  name="trigger-rule"
                  defaultChecked
                  className="size-3 text-primary focus:ring-state-focus"
                />
                <span>All Core Faults</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 p-2 text-xs text-text-primary transition-colors hover:bg-state-hover">
                <input
                  type="radio"
                  name="trigger-rule"
                  className="size-3 text-primary focus:ring-state-focus"
                />
                <span>Only Critical Fatal</span>
              </label>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-surface-2 py-2 text-xs font-semibold text-text-primary shadow-sm transition-colors hover:bg-state-hover"
        >
          <Radio className="size-3.5 text-text-secondary" /> Activate
          Destination Link
        </button>
      </form>
    </Card>
  )
}

// Form 3 - Incident Threshold*
function IncidentThresholdPolicy_Form() {
  return (
    <Card className="rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-heading text-base font-bold text-text-primary">
            Incident Threshold Policy
          </h3>
          <p className="text-xs text-text-secondary">
            Construct rules to automatically trigger operational escalation
            traps.
          </p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                htmlFor="policy-metric"
                className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
              >
                Target Metric
              </label>
              <div className="relative">
                <select
                  id="policy-metric"
                  className="w-full appearance-none rounded-md border border-border-strong bg-surface-2 p-1.5 pr-7 text-xs text-text-primary outline-none focus:border-border-focus focus:ring-1 focus:ring-state-focus"
                >
                  <option value="latency">Latency</option>
                  <option value="cpu">CPU Bound</option>
                  <option value="io">I/O Wait</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-text-tertiary" />
              </div>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="policy-condition"
                className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
              >
                Condition Vector
              </label>
              <div className="relative">
                <select
                  id="policy-condition"
                  className="w-full appearance-none rounded-md border border-border-strong bg-surface-2 p-1.5 pr-7 text-xs text-text-primary outline-none focus:border-border-focus focus:ring-1 focus:ring-state-focus"
                >
                  <option value="gt">&gt; Greater than</option>
                  <option value="lt">&lt; Less than</option>
                  <option value="eq">= Exactly</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-text-tertiary" />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="policy-value"
              className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
            >
              Boundary Value (ms / % Limit)
            </label>
            <input
              id="policy-value"
              type="number"
              placeholder="500"
              defaultValue="450"
              className="w-full rounded-md border border-border-strong bg-surface-2 p-2 text-sm text-text-primary transition-all outline-none focus:border-border-focus focus:ring-1 focus:ring-state-focus"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="policy-duration"
              className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase"
            >
              Duration Windows Sustained
            </label>
            <div className="relative">
              <select
                id="policy-duration"
                className="w-full appearance-none rounded-md border border-border-strong bg-surface-2 p-2 pr-8 text-sm text-text-primary outline-none focus:border-border-focus focus:ring-1 focus:ring-state-focus"
              >
                <option value="1">Consecutively for 1 Minute</option>
                <option value="5">Consecutively for 5 Minutes</option>
                <option value="15">Consecutively for 15 Minutes</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-text-tertiary" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border-subtle bg-surface-2 py-2 text-xs font-semibold text-error transition-colors hover:bg-error/10"
          >
            <Trash2 className="size-3.5" /> Discard
          </button>
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-state-hover"
          >
            <BellRing className="size-3.5" /> Deploy Rule
          </button>
        </div>
      </form>
    </Card>
  )
}

// Form 4 - User Details
function UserDetails_Form() {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-4 shadow-sm">
      <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FieldGroup className="space-y-3.5">
          <Field className="space-y-1.5">
            <FieldLabel
              htmlFor="form-name"
              className="text-xs font-semibold tracking-wider text-text-secondary uppercase"
            >
              Name
            </FieldLabel>
            <Input
              id="form-name"
              type="text"
              placeholder="Evil Rabbit"
              required
              className="w-full rounded-md border border-border-strong bg-surface-1 p-2 text-sm text-text-primary shadow-sm transition-all outline-none placeholder:text-text-placeholder focus:border-border-focus focus:ring-1 focus:ring-state-focus"
            />
          </Field>

          <Field className="space-y-1.5">
            <FieldLabel
              htmlFor="form-email"
              className="text-xs font-semibold tracking-wider text-text-secondary uppercase"
            >
              Email
            </FieldLabel>
            <Input
              id="form-email"
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-md border border-border-strong bg-surface-1 p-2 text-sm text-text-primary shadow-sm transition-all outline-none placeholder:text-text-placeholder focus:border-border-focus focus:ring-1 focus:ring-state-focus"
            />
            <FieldDescription className="text-[11px] leading-normal text-text-tertiary">
              We&apos;ll never share your email with anyone.
            </FieldDescription>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="form-phone"
                className="text-xs font-semibold tracking-wider text-text-secondary uppercase"
              >
                Phone
              </FieldLabel>
              <Input
                id="form-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-md border border-border-strong bg-surface-1 p-2 text-sm text-text-primary shadow-sm transition-all outline-none placeholder:text-text-placeholder focus:border-border-focus focus:ring-1 focus:ring-state-focus"
              />
            </Field>
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="form-country"
                className="text-xs font-semibold tracking-wider text-text-secondary uppercase"
              >
                Country
              </FieldLabel>
              <div className="relative w-full [&_span]:overflow-hidden [&_span[data-radix-select-value]]:max-w-full">
                <Select defaultValue="us">
                  <SelectTrigger
                    id="form-country"
                    className="w-full rounded-md border border-border-strong bg-surface-1 p-2 text-sm text-text-primary shadow-sm transition-all outline-none focus:border-border-focus"
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="z-50 rounded-md border border-border-subtle bg-popover p-1 text-sm text-text-primary shadow-md">
                    <SelectItem
                      value="us"
                      className="cursor-pointer rounded p-2 hover:bg-state-hover"
                    >
                      United States
                    </SelectItem>
                    <SelectItem
                      value="uk"
                      className="cursor-pointer rounded p-2 hover:bg-state-hover"
                    >
                      United Kingdom
                    </SelectItem>
                    <SelectItem
                      value="ca"
                      className="cursor-pointer rounded p-2 hover:bg-state-hover"
                    >
                      Canada
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Field>
          </div>

          <Field className="space-y-1.5">
            <FieldLabel
              htmlFor="form-address"
              className="text-xs font-semibold tracking-wider text-text-secondary uppercase"
            >
              Address
            </FieldLabel>
            <Input
              id="form-address"
              type="text"
              placeholder="123 Main St"
              className="w-full rounded-md border border-border-strong bg-surface-1 p-2 text-sm text-text-primary shadow-sm transition-all outline-none placeholder:text-text-placeholder focus:border-border-focus focus:ring-1 focus:ring-state-focus"
            />
          </Field>

          <Field
            orientation="horizontal"
            className="flex items-center justify-end gap-2.5 pt-2"
          >
            <Button
              type="button"
              variant="outline"
              className="rounded border border-border-strong px-4 py-2 text-xs font-medium text-text-primary shadow-sm transition-colors hover:bg-state-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-state-hover"
            >
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>{" "}
    </div>
  )
}

// Chart 1 - Parsed Exception*
function ParsedException_Chart() {
  return (
    <Card className="space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-heading text-base font-bold text-text-primary">
            Parsed Exception Volume Trend
          </h3>
          <p className="text-xs text-text-secondary">
            Historical anomaly distribution map monitored over trailing 24
            hours.
          </p>
        </div>
        <div className="text-right">
          <span className="font-ubuntu text-xl font-bold text-text-primary">
            12,842
          </span>
          <span className="flex items-center justify-end gap-0.5 text-[10px] font-medium text-success">
            <ArrowDownRight className="size-3" /> -4.3%
          </span>
        </div>
      </div>

      <ChartContainer config={exceptionChartConfig} className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={exceptionData}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              opacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="var(--text-tertiary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient
                id="shadcnAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="volume"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#shadcnAreaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}

// Chart 2 - Regional Structural*
function RegionalStructural_Chart() {
  return (
    <Card className="space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-heading text-base font-bold text-text-primary">
            Regional Structural Fault Breakdown
          </h3>
          <p className="text-xs text-text-secondary">
            Error clustering weight distribution mapped across node locations.
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-medium">
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-error"></span>
            <span className="text-text-secondary">Fatal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-warning"></span>
            <span className="text-text-secondary">Warn</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-primary"></span>
            <span className="text-text-secondary">Trace</span>
          </div>
        </div>
      </div>

      <ChartContainer config={regionalChartConfig} className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={regionalData}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              opacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="zone"
              stroke="var(--text-tertiary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="fatal"
              stackId="a"
              fill="var(--error)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="warn"
              stackId="a"
              fill="var(--warning)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="trace"
              stackId="a"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}

// Chart 3 - Active Engine*
function ActiveEngine_Chart() {
  return (
    <Card className="space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-heading text-base font-bold text-text-primary">
            Active Engine I/O Latency Spikes
          </h3>
          <p className="text-xs text-text-secondary">
            Real-time sampling tracking macro jitter intervals.
          </p>
        </div>
        <button className="flex size-7 items-center justify-center rounded border border-border-strong bg-surface-1 text-text-primary shadow-sm transition-colors hover:bg-state-hover">
          <RefreshCw
            className="size-3.5 animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </button>
      </div>

      <div className="relative">
        <div className="absolute -top-1 left-12 z-1 flex items-center gap-1 rounded border border-error/20 bg-error-muted px-1.5 py-0.5 font-ubuntu text-[9px] font-bold text-error opacity-90">
          <AlertTriangle className="size-2.5" /> Threshold Invalidation Trigger{" "}
          {`>`} 150ms
        </div>

        <ChartContainer config={latencyChartConfig} className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={latencyData}
              margin={{ top: 15, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                opacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="sample"
                stroke="var(--text-tertiary)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-tertiary)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 220]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{
                  stroke: "var(--primary)",
                  strokeWidth: 1,
                  r: 2,
                  fill: "var(--surface-1)",
                }}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}

// Chart 4 - Memory Segment*
function MemorySegment_Chart() {
  return (
    <Card className="space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="space-y-0.5">
        <h3 className="font-heading text-base font-bold text-text-primary">
          Memory Segment Core Allocation
        </h3>
        <p className="text-xs text-text-secondary">
          Current internal cache pool structures mapping layer bounds.
        </p>
      </div>

      <div className="flex flex-col items-center justify-around gap-4 pt-2 sm:flex-row">
        <ChartContainer config={memoryChartConfig} className="size-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie
                data={memoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={38}
                outerRadius={50}
                paddingAngle={2}
                stroke="var(--surface-1)"
                strokeWidth={2}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between border-b border-border-subtle/50 pb-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-primary" />
              <span className="font-medium text-text-secondary">
                Zod Input Adapters
              </span>
            </div>
            <span className="font-ubuntu font-bold text-text-primary">
              55% Pool
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border-subtle/50 pb-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-warning" />
              <span className="font-medium text-text-secondary">
                Binary Serializer Diff
              </span>
            </div>
            <span className="font-ubuntu font-bold text-text-primary">
              25% Pool
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border-subtle/50 pb-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-error" />
              <span className="font-medium text-text-secondary">
                Active Trace Hooks
              </span>
            </div>
            <span className="font-ubuntu font-bold text-text-primary">
              12% Pool
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-surface-3" />
              <span className="font-medium text-text-tertiary">
                Free Overhead Buffer
              </span>
            </div>
            <span className="font-ubuntu font-bold text-text-tertiary">
              8% Vol
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Accordion 1 - Product Query
function ProductQuery_Accordion() {
  return (
    <div className="space-y-3">
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="space-y-2 pb-2"
      >
        <AccordionItem
          value="item-1"
          className="rounded-xl border border-border-subtle bg-surface-1 px-4 shadow-sm"
        >
          <AccordionTrigger className="font-medium text-text-primary transition-colors hover:text-text-link">
            Materials & Care{" "}
          </AccordionTrigger>
          <AccordionContent className="pb-3 text-sm text-text-secondary">
            Made with 100% organic cotton. Machine wash cold and tumble dry
            low.{" "}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible defaultValue="item-2">
        <AccordionItem
          value="item-2"
          className="rounded-xl border border-border-subtle bg-surface-1 px-4 shadow-sm"
        >
          <AccordionTrigger className="text-left font-medium text-text-primary transition-colors hover:text-text-link">
            Size & Fit Guide{" "}
          </AccordionTrigger>
          <AccordionContent className="pb-3 text-sm text-text-secondary">
            Fits true to size with a relaxed feel. Model is 6 feet tall wearing
            a size medium.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible defaultValue="item-2">
        <AccordionItem
          value="item-2"
          className="rounded-xl border border-border-subtle bg-surface-1 px-4 shadow-sm"
        >
          <AccordionTrigger className="text-left font-medium text-text-primary transition-colors hover:text-text-link">
            Shipping & Returns{" "}
          </AccordionTrigger>
          <AccordionContent className="pb-3 text-sm text-text-secondary">
            Free standard shipping on all orders. Return or exchange within 30
            days of purchase.{" "}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

// Accordion 2 - Account & Security (For Future add on)
// function _AccountAndSecurity_Accordion() {
//   return (
//     // Grouped into a single Accordion component so only one item opens at a time
//     <Accordion
//       type="single"
//       collapsible
//       defaultValue="item-1"
//       className="w-full max-w-2xl space-y-3"
//     >
//       {/* Item 1 */}
//       <AccordionItem
//         value="item-1"
//         className="hover:border-border-hover data-[state=open]:border-border-active rounded-xl border border-border-subtle bg-surface-1 px-5 shadow-sm transition-all duration-200 data-[state=open]:shadow-md"
//       >
//         <AccordionTrigger className="py-4 text-left font-medium text-text-primary transition-colors hover:text-text-link hover:no-underline [&_svg]:text-text-secondary [&_svg]:transition-transform [&_svg]:duration-200">
//           Change Password
//         </AccordionTrigger>
//         <AccordionContent className="pb-4 text-sm leading-relaxed text-text-secondary antialiased">
//           Update your password anytime in your profile settings to stay safe.
//         </AccordionContent>
//       </AccordionItem>

//       {/* Item 2 */}
//       <AccordionItem
//         value="item-2"
//         className="hover:border-border-hover data-[state=open]:border-border-active rounded-xl border border-border-subtle bg-surface-1 px-5 shadow-sm transition-all duration-200 data-[state=open]:shadow-md"
//       >
//         <AccordionTrigger className="py-4 text-left font-medium text-text-primary transition-colors hover:text-text-link hover:no-underline [&_svg]:text-text-secondary [&_svg]:transition-transform [&_svg]:duration-200">
//           Privacy Controls
//         </AccordionTrigger>
//         <AccordionContent className="pb-4 text-sm leading-relaxed text-text-secondary antialiased">
//           Manage who sees your profile and choose how we use your data.
//         </AccordionContent>
//       </AccordionItem>

//       {/* Item 3 */}
//       <AccordionItem
//         value="item-3"
//         className="hover:border-border-hover data-[state=open]:border-border-active rounded-xl border border-border-subtle bg-surface-1 px-5 shadow-sm transition-all duration-200 data-[state=open]:shadow-md"
//       >
//         <AccordionTrigger className="py-4 text-left font-medium text-text-primary transition-colors hover:text-text-link hover:no-underline [&_svg]:text-text-secondary [&_svg]:transition-transform [&_svg]:duration-200">
//           Notification Settings
//         </AccordionTrigger>
//         <AccordionContent className="pb-4 text-sm leading-relaxed text-text-secondary antialiased">
//           Turn email updates or phone push alerts on and off whenever you want.
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   )
// }

// Alert 1 - Classic
function Classic_Alert() {
  return (
    <div className="space-y-3">
      <Alert className="flex items-start gap-3 rounded-xl border border-success/20 bg-success-muted p-4 text-success-foreground shadow-sm">
        <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-success" />
        <div>
          <AlertTitle className="font-heading text-sm font-semibold">
            Payment successful
          </AlertTitle>
          <AlertDescription className="mt-1 text-xs leading-normal text-success-foreground/90">
            Your payment of $29.99 has been processed. A receipt has been sent
            to your email address.
          </AlertDescription>
        </div>
      </Alert>

      <Alert className="flex items-start gap-3 rounded-xl border border-info/20 bg-info-muted p-4 text-info-foreground shadow-sm">
        <InfoIcon className="mt-0.5 size-5 shrink-0 text-info" />
        <div>
          <AlertTitle className="font-heading text-sm font-semibold">
            New feature available
          </AlertTitle>
          <AlertDescription className="mt-1 text-xs leading-normal text-info-foreground/90">
            We&apos;ve added dark mode support. You can enable it in your
            account settings.
          </AlertDescription>
        </div>
      </Alert>

      <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please check your payment method
          and try again.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// CheckBox 1 - Terms and Conditions
function TermsAndConditions_Check() {
  return (
    <Card className="h-fit rounded-xl border border-border-subtle bg-surface-1 p-0 shadow-sm">
      <FieldGroup className="w-full space-y-3 rounded-xl border border-border-subtle bg-surface-2 p-3.5">
        <Field orientation="horizontal" className="flex items-start gap-3 py-1">
          <Checkbox
            id="terms-checkbox"
            name="terms-checkbox"
            className="mt-1 border-border-strong text-primary focus:ring-state-focus"
          />
          <Label
            htmlFor="terms-checkbox"
            className="cursor-pointer text-sm font-medium text-text-primary"
          >
            Accept terms and conditions
          </Label>
        </Field>

        <Field
          orientation="horizontal"
          className="flex items-start gap-3 border-t border-border-subtle/60 pt-2.5"
        >
          <Checkbox
            id="terms-checkbox-2"
            name="terms-checkbox-2"
            defaultChecked
            className="mt-1 border-border-strong text-primary focus:ring-state-focus"
          />
          <FieldContent className="space-y-0.5">
            <FieldLabel
              htmlFor="terms-checkbox-2"
              className="cursor-pointer text-sm font-medium text-text-primary"
            >
              Accept terms and conditions
            </FieldLabel>
            <FieldDescription className="text-xs leading-normal text-text-secondary">
              By clicking this checkbox, you agree to the terms.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field
          orientation="horizontal"
          data-disabled
          className="pointer-events-none flex items-start gap-3 border-t border-border-subtle/60 pt-2.5 opacity-50"
        >
          <Checkbox
            id="toggle-checkbox"
            name="toggle-checkbox"
            disabled
            className="mt-1 border-border-subtle bg-state-disabled-bg text-state-disabled-fg"
          />
          <FieldLabel
            htmlFor="toggle-checkbox"
            className="text-sm font-medium text-state-disabled-fg"
          >
            Enable notifications
          </FieldLabel>
        </Field>

        <FieldLabel className="block border-t border-border-subtle/60 pt-2.5">
          <Field orientation="horizontal" className="flex items-start gap-3">
            <Checkbox
              id="toggle-checkbox-2"
              name="toggle-checkbox-2"
              className="mt-1 border-border-strong text-primary focus:ring-state-focus"
            />
            <FieldContent className="space-y-0.5">
              <FieldTitle className="text-sm font-medium text-text-primary">
                Enable notifications
              </FieldTitle>
              <FieldDescription className="text-xs leading-normal text-text-secondary">
                You can enable or disable notifications at any time.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
    </Card>
  )
}

// Digital Clock
function DigitalClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const rawDateStr = time.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const [month, day, year] = rawDateStr.replace(",", "").split(" ")
  const formattedDate = `${day} ${month.toLowerCase()}, ${year}`

  return (
    <Card className="group relative flex min-w-[200px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-b from-surface-1 to-surface-2 p-6 text-center shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12),0_0_32px_-8px_rgba(var(--primary),0.08)] transition-all duration-500 ease-out select-none hover:-translate-y-1 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.18),0_0_40px_-4px_rgba(var(--primary),0.15)]">
      {/* Fluid ambient blur background shapes */}
      <div className="absolute -top-8 -right-8 size-24 rounded-full bg-primary/10 blur-2xl transition-colors duration-500 group-hover:bg-primary/25" />
      <div className="absolute -bottom-10 -left-10 size-24 rounded-full bg-warning/5 blur-2xl transition-colors duration-500 group-hover:bg-warning/15" />

      <CardContent className="relative z-1 flex w-full flex-col items-center space-y-4 p-0">
        {/* Micro-interactive soft pill tag */}
        <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-ubuntu text-[10px] font-bold tracking-wider text-primary uppercase shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
          </span>
          Live Sync
        </div>

        {/* Typography layer with rich depth gradient */}
        <div className="space-y-1">
          <div className="scale-100 bg-gradient-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text font-ubuntu text-4xl font-extrabold tracking-tighter text-transparent tabular-nums transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            {formattedTime}
          </div>

          {/* Morphing baseline weight bar */}
          <div className="mx-auto h-1 w-6 rounded-full bg-gradient-to-r from-primary to-warning opacity-70 transition-all duration-500 ease-out group-hover:w-12" />
        </div>

        {/* Elevated container widget card footer */}
        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle/30 bg-surface-3/40 px-4 py-2 backdrop-blur-md transition-colors duration-500 group-hover:border-border-strong/60">
          <div className="font-sans text-[11px] font-bold tracking-wide text-text-secondary uppercase">
            {formattedDate}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Calendar
function Calendar_() {
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )
  const addDays = (d: Date, v: number) => {
    return new Date(d.getFullYear(), 1, v)
  }

  return (
    <Card className="mx-auto w-fit max-w-73 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-1 shadow-sm transition-colors duration-200">
      <CardContent className="p-3.5">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          className="border-0 bg-transparent p-0 font-sans text-text-primary [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-1.5 border-t border-border-subtle bg-surface-2 p-3">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="min-w-[70px] flex-1 rounded border border-border-strong bg-surface-1 py-1 text-xs font-medium text-text-primary shadow-sm transition-colors hover:bg-state-hover"
            onClick={() => {
              const newDate = addDays(new Date(), preset.value)
              setDate(newDate)
              setCurrentMonth(
                new Date(newDate.getFullYear(), newDate.getMonth(), 1)
              )
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}

// Badges
function Badges() {
  return (
    <Card className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex flex-wrap justify-center gap-2">
        <Badge className="rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground shadow-sm">
          Badge
        </Badge>
        <Badge
          variant="secondary"
          className="rounded-full border border-border-subtle bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-state-hover"
        >
          Secondary
        </Badge>
        <Badge
          variant="destructive"
          className="rounded-full border border-transparent bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground shadow-sm"
        >
          Destructive
        </Badge>
        <Badge
          variant="outline"
          className="rounded-full border border-border-strong bg-surface-1 px-2.5 py-0.5 text-xs font-medium text-text-primary shadow-sm"
        >
          Outline
        </Badge>
      </div>
    </Card>
  )
}

// Buttons
function Buttons() {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-state-hover active:bg-state-active">
          Button
        </Button>
        <Button
          variant="secondary"
          className="rounded-md border border-border-subtle bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-state-hover active:bg-state-active"
        >
          Secondary
        </Button>
        <Button
          variant="destructive"
          className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm transition-colors hover:bg-state-hover active:bg-state-active"
        >
          Destructive
        </Button>
        <Button
          variant="outline"
          className="rounded-md border border-border-strong bg-surface-1 px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-state-hover active:bg-state-active"
        >
          Outline
        </Button>
        <Button
          variant="ghost"
          className="rounded-md px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-state-hover active:bg-state-active"
        >
          Ghost
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium text-text-link underline underline-offset-4 transition-colors hover:text-text-link-hover"
        >
          Link
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-surface-1 text-text-primary shadow-sm transition-colors hover:bg-state-hover"
        >
          <CircleFadingArrowUpIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-1.5 rounded-md border border-border-strong bg-surface-1 px-3 py-1.5 text-xs font-medium text-text-primary shadow-sm transition-colors hover:bg-state-hover"
        >
          <GitBranch className="size-3.5 text-text-secondary" /> New Branch
        </Button>
        <Button
          variant="outline"
          disabled
          className="pointer-events-none flex items-center gap-2 rounded-md border border-border-subtle bg-state-disabled-bg px-4 py-2 text-sm font-medium text-state-disabled-fg opacity-60"
        >
          <Spinner data-icon="inline-start" className="size-3.5 animate-spin" />
          Generating
        </Button>
        <Button
          variant="secondary"
          disabled
          className="pointer-events-none flex items-center gap-2 rounded-md border border-border-subtle bg-state-disabled-bg px-4 py-2 text-sm font-medium text-state-disabled-fg opacity-60"
        >
          Downloading
          <Spinner data-icon="inline-start" className="size-3.5 animate-spin" />
        </Button>

        <div className="flex items-center gap-4 p-1">
          <Spinner className="text-text-primary" />
        </div>
        <div className="flex items-center gap-4 rounded-lg border border-border-subtle bg-surface-2 px-3 py-1.5">
          <Spinner className="size-3 text-text-tertiary" />
          <Spinner className="size-4 text-text-secondary" />
          <Spinner className="size-5 text-text-primary" />
          <Spinner className="size-6 text-primary" />
        </div>
      </div>
    </div>
  )
}

// Skeleton Card
function SkeletonCard() {
  return (
    <Card className="w-full space-y-4 rounded-xl border border-border-subtle bg-surface-1 p-4 shadow-sm">
      <CardHeader className="space-y-2 p-0">
        <Skeleton className="h-4 w-2/3 animate-pulse rounded bg-skeleton-base" />
        <Skeleton className="h-3 w-1/2 animate-pulse rounded bg-skeleton-base" />
      </CardHeader>
      <CardContent className="p-0">
        <Skeleton className="aspect-video w-full animate-pulse rounded-lg bg-skeleton-base" />
      </CardContent>
    </Card>
  )
}

// Sider 1
function Slider_1() {
  return (
    <Card className="flex w-full flex-row items-center justify-center gap-6 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40 bg-progress-track text-progress-fill"
      />
      <Slider
        defaultValue={[25]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40 bg-progress-track text-progress-fill"
      />
    </Card>
  )
}

// Slider 2
function Slider_2() {
  return (
    <Card className="flex w-full flex-col justify-center gap-4 rounded-xl border border-border-subtle bg-surface-1 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="slider-demo-temperature"
          className="text-sm font-medium text-text-primary"
        >
          Temperature
        </Label>
        <span className="rounded border border-border-subtle bg-surface-2 px-2 py-0.5 font-ubuntu text-xs font-bold text-text-secondary">
          {[0.3, 0.7].join(", ")}
        </span>
      </div>
      <Slider
        id="slider-demo-temperature"
        value={[0.3, 0.7]}
        onValueChange={() => {}}
        min={0}
        max={1}
        step={0.1}
        className="w-full bg-progress-track text-progress-fill"
      />
    </Card>
  )
}

// Table 1 - A List Of Year Invoices*
function AListOfYearInvoices_Table() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-sm xl:col-span-2">
      {" "}
      <Table className="w-full border-collapse text-left text-sm text-text-primary">
        <TableCaption className="p-3 text-xs text-text-tertiary">
          A list of your recent invoices.
        </TableCaption>
        <TableHeader className="border-b border-border-subtle bg-surface-2 font-medium text-text-secondary">
          <TableRow>
            <TableHead className="w-[100px] p-3">Invoice</TableHead>
            <TableHead className="p-3">Status</TableHead>
            <TableHead className="p-3">Method</TableHead>
            <TableHead className="p-3 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border-subtle/50">
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.invoice}
              className="transition-colors hover:bg-state-hover/40"
            >
              <TableCell className="p-3 font-ubuntu font-semibold text-text-primary">
                {invoice.invoice}
              </TableCell>
              <TableCell className="p-3 text-text-secondary">
                {invoice.paymentStatus}
              </TableCell>
              <TableCell className="p-3 text-text-secondary">
                {invoice.paymentMethod}
              </TableCell>
              <TableCell className="p-3 text-right font-ubuntu font-medium text-text-primary">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="border-t border-border-strong bg-surface-2 font-semibold">
          <TableRow>
            <TableCell colSpan={3} className="p-3 text-text-secondary">
              Total
            </TableCell>
            <TableCell className="p-3 text-right font-ubuntu text-text-primary">
              $2,500.00
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

// Table 2 - Product Details
function ProductDetails_Form() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-sm">
      <Table className="w-full border-collapse text-left text-sm text-text-primary">
        <TableHeader className="border-b border-border-subtle bg-surface-2 font-medium text-text-secondary">
          <TableRow>
            <TableHead className="p-3">Product</TableHead>
            <TableHead className="p-3">Price</TableHead>
            <TableHead className="p-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border-subtle/50">
          {[
            { name: "Wireless Mouse", price: "$29.99" },
            { name: "Mechanical Keyboard", price: "$129.99" },
            { name: "USB-C Hub", price: "$49.99" },
          ].map((item, idx) => (
            <TableRow
              key={idx}
              className="transition-colors hover:bg-state-hover/40"
            >
              <TableCell className="p-3 font-medium text-text-primary">
                {item.name}
              </TableCell>
              <TableCell className="p-3 font-ubuntu text-text-secondary">
                {item.price}
              </TableCell>
              <TableCell className="p-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="inline-flex size-8 items-center justify-center rounded-md text-text-secondary transition-all hover:bg-state-hover active:bg-state-active"
                    >
                      <MoreHorizontalIcon className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="z-50 min-w-[120px] animate-in rounded-lg border border-border-subtle bg-popover p-1 text-text-primary shadow-lg duration-100 fade-in-50"
                  >
                    <DropdownMenuItem className="cursor-pointer rounded p-2 text-xs font-medium transition-colors hover:bg-state-hover">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded p-2 text-xs font-medium transition-colors hover:bg-state-hover">
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 h-px bg-border-subtle" />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer rounded p-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
