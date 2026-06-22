import PhoneFrame from "@/components/custom/phone-frame"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownWideNarrow,
  Compass,
  Funnel,
  Leaf,
  MoveUpRight,
  Play,
  Settings,
  Sprout,
  TreePalm,
  TriangleAlert,
} from "lucide-react"
import {
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
  PieChart,
  Pie,
  Sector,
  type PieSectorShapeProps,
} from "recharts"
import f1 from "@/assets/forest1h.jpg";

// DATA
export const description = "A bar chart"

const chartData = [
  { month: "January", footprint: 186 },
  { month: "February", footprint: 305 },
  { month: "March", footprint: 237 },
  { month: "April", footprint: 73 },
  { month: "May", footprint: 209 },
  { month: "June", footprint: 214 },
]

const chartConfig = {
  footprint: {
    label: "Footprint",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const chartData_2 = [
  { type: "leisure", footprint: 10, weight: 70, fill: "var(--color-leisure)" },
  {
    type: "shopping",
    footprint: 20,
    weight: 115,
    fill: "var(--color-shopping)",
  },
  {
    type: "transport",
    footprint: 27,
    weight: 182,
    fill: "var(--color-transport)",
  },
  { type: "food", footprint: 33, weight: 214, fill: "var(--color-food)" },
  { type: "home", footprint: 15, weight: 85, fill: "var(--color-home)" },
]

const chartConfig_2 = {
  footprint: {
    label: "Footprint",
    color: "var(--chart-1)",
  },
  leisure: {
    label: "Leisure",
    color: "var(--chart-1)",
  },
  shopping: {
    label: "Shopping",
    color: "var(--chart-2)",
  },
  transport: {
    label: "Transport",
    color: "var(--chart-3)",
  },
  food: {
    label: "Food",
    color: "var(--chart-4)",
  },
  home: {
    label: "Home",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export default function Page03() {
  return (
    <div className="flex items-center justify-center gap-14">
      <PhoneFrame label="">
        <div className="relative h-60 bg-accent bg-[url(@/assets/forest1h.jpg)] bg-cover bg-center p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-secondary">9:41</span>
            <div className="flex items-center gap-2">
              <div className="bg-blur-dark flex items-center gap-1 rounded-full px-2 py-1 text-secondary-foreground">
                <div className="flex size-4 items-center justify-center rounded-full bg-success-muted">
                  <Leaf className="size-2 fill-success stroke-success" />
                </div>
                <span className="text-[9px] font-medium text-white">
                  Offset 1.2 tonnes
                </span>
              </div>
              <Settings className="size-4 cursor-pointer stroke-white" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="bg-blur-dark flex size-24 flex-col items-center justify-center rounded-full">
              <p className="text-xl font-bold tracking-tight text-white">
                15.02
              </p>
              <p className="-mt-0.5 text-[9px] font-medium tracking-wider text-white uppercase">
                Tons CO₂
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-[210px] right-0 bottom-0 left-0 z-1 no-scrollbar overflow-y-auto rounded-t-3xl bg-background px-4 pt-5 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Hi, Maria!
              </h2>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-text-tertiary">
                <Play className="size-2 rotate-90 fill-success stroke-success" />
                <p>
                  <span className="font-bold text-success">22% below</span> your
                  avg carbon footprint
                </p>
              </div>
            </div>
            <Button className="rounded-full border border-border-subtle px-4 py-0.5 text-[9px] font-semibold text-muted">
              Goal: 12 CO₂
            </Button>
          </div>

          <Card className="mt-4 rounded-2xl border border-border-subtle p-3">
            <div className="mb-2 flex items-start justify-between">
              <div className="shrink-0">
                <p className="text-[9px] font-medium tracking-wider text-text-placeholder uppercase">
                  Weekly overview
                </p>
                <p className="text-[8px] font-bold text-text-secondary">
                  Carbon Footprint (kg)
                </p>
              </div>
              <Tabs defaultValue="w" className="h-5">
                <TabsList className="h-5 rounded-md bg-state-disabled-bg p-0.5">
                  <TabsTrigger
                    value="w"
                    className="h-4 rounded-sm px-2 text-[9px] font-bold data-[state=active]:bg-background data-[state=active]:text-text-primary"
                  >
                    W
                  </TabsTrigger>
                  <TabsTrigger
                    value="m"
                    className="h-4 rounded-sm px-2 text-[9px] font-bold data-[state=active]:bg-background data-[state=active]:text-text-primary"
                  >
                    M
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ChartContainer config={chartConfig}>
              {" "}
              <div className="mt-4 h-24 w-full">
                <BarChart accessibilityLayer data={chartData}>
                  {" "}
                  <CartesianGrid vertical={false} horizontal={false} />{" "}
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />{" "}
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />{" "}
                  <Bar
                    dataKey="footprint"
                    fill="var(--color-footprint)"
                    radius={8}
                  />{" "}
                </BarChart>
              </div>
            </ChartContainer>
          </Card>

          <div className="mt-5 mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-text-primary">
              Offset Emissions
            </p>
            <p className="cursor-pointer text-[10px] font-bold text-text-link hover:text-text-link-hover hover:underline">
              See more &gt;
            </p>
          </div>

          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">
            <Card className="w-36 min-w-36 snap-start overflow-hidden rounded-xl border border-border-subtle bg-card pt-0 shadow-sm">
              <div className="h-20 bg-[url(@/assets/forest2v.jpg)] bg-cover bg-center" />
              <CardContent className="p-2">
                <h4 className="line-clamp-2 text-[10px] leading-tight font-bold text-card-foreground">
                  Plant Reforestation in the Bavarian Forest
                </h4>
                <p className="mt-1 text-[9px] font-medium text-text-tertiary">
                  Germany, Bavaria
                </p>
              </CardContent>
            </Card>

            <Card className="w-36 min-w-36 snap-start overflow-hidden rounded-xl border border-border-subtle bg-card pt-0 shadow-sm">
              <div className="h-20 bg-[url(@/assets/forest2v.jpg)] bg-cover bg-center" />
              <CardContent className="p-2">
                <h4 className="line-clamp-2 text-[10px] leading-tight font-bold text-card-foreground">
                  Sustainable Agriculture in Southern Spain
                </h4>
                <p className="mt-1 text-[9px] font-medium text-text-tertiary">
                  Spain, Andalusia
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PhoneFrame>
      <PhoneFrame label="">
        <div className="no-scrollbar overflow-y-auto p-4">
          <p>Your carbon footprint</p>

          <Card className="mt-4 rounded-2xl border border-border-subtle p-3 px-3 pb-1.5">
            <div className="mb-2 flex items-start justify-between gap-1.5">
              <div className="shrink-0">
                <p className="text-[9px] font-medium tracking-wider text-text-placeholder uppercase">
                  Weekly overview
                </p>
                <p className="text-[8px] font-bold text-text-secondary">
                  Carbon Footprint (kg)
                </p>
              </div>
              <Tabs defaultValue="d" className="h-5">
                <TabsList className="h-5 rounded-md bg-state-disabled-bg p-0.5">
                  <TabsTrigger
                    value="d"
                    className="h-4 rounded-sm px-2 text-[9px] font-bold data-[state=active]:bg-background data-[state=active]:text-text-primary"
                  >
                    D
                  </TabsTrigger>
                  <TabsTrigger
                    value="w"
                    className="h-4 rounded-sm px-2 text-[9px] font-bold data-[state=active]:bg-background data-[state=active]:text-text-primary"
                  >
                    W
                  </TabsTrigger>
                  <TabsTrigger
                    value="m"
                    className="h-4 rounded-sm px-2 text-[9px] font-bold data-[state=active]:bg-background data-[state=active]:text-text-primary"
                  >
                    M
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ChartContainer config={chartConfig_2} className="h-36">
              {" "}
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData_2}
                  dataKey="footprint"
                  nameKey="type"
                  innerRadius={25}
                  outerRadius={40}
                  strokeWidth={5}
                  paddingAngle={10}
                  radius={10}
                  labelLine={false}
                  cornerRadius={3}
                  shape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorShapeProps) => (
                    <Sector {...props} outerRadius={outerRadius} />
                  )}
                  label={({ x, y, textAnchor, payload }) => {
                    return (
                      <>
                        <text
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          fill={payload.fill}
                          fontSize="11"
                          className="font-semibold"
                        >
                          <tspan x={x} dy="0em" dx={1} fontSize={12}>
                            {payload.footprint} %
                          </tspan>
                        </text>
                        <text
                          x={x}
                          y={y}
                          dy="1.4em"
                          dx="0.2em"
                          textAnchor={textAnchor}
                          fill="var(--accent-foreground)"
                          fontSize="9"
                          className="capitalize"
                        >
                          {payload.type}
                        </text>
                        )
                      </>
                    )
                  }}
                />
              </PieChart>
            </ChartContainer>
          </Card>

          <Card className="mt-2 rounded-2xl border border-border-subtle p-3 px-3 pb-1.5">
            {chartData_2.map((d) => (
              <div
                key={d.type}
                className="flex items-center justify-between space-y-1.5"
              >
                <div className="flex w-[80px] items-center gap-1.5">
                  <div
                    className="size-3 rounded-[2px]"
                    style={{
                      background:
                        chartConfig_2[d.type as keyof typeof chartConfig_2]
                          .color,
                    }}
                  />
                  <p className="font-medium capitalize">{d.type}</p>
                </div>
                <div className="font-medium">{d.weight} kg</div>
                <div
                  className="font-medium"
                  style={{
                    color:
                      chartConfig_2[d.type as keyof typeof chartConfig_2].color,
                  }}
                >
                  {d.footprint} %
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1.5 rounded-full bg-accent p-1.25 text-[9px]">
              <TriangleAlert className="size-3" />
              Transport is your biggest contributor
            </div>
          </Card>
          <Card className="mt-2 flex flex-row items-center gap-4 rounded-2xl border border-border-subtle bg-surface-2 py-1 pl-1.5 shadow-sm">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-primary">
                <Sprout className="h-4 w-4" />
                Tip of the day!
              </div>
              <p className="text-[7px] leading-2 text-muted-foreground">
                Taking a step instead of the car once a week could reduce your
                footprint by
              </p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-bold text-accent-foreground">
                  12%
                </span>
                <button className="text-[8px] font-medium text-muted-foreground hover:underline">
                  Learn more &gt;
                </button>
              </div>
            </div>
            <img
              src={f1}
              alt="Green tip visual"
              className="h-21 w-20 rounded-xl object-cover"
            />
          </Card>
        </div>
      </PhoneFrame>
      <PhoneFrame label="">
        <div className="relative h-50 bg-accent bg-[url(@/assets/forest3v.jpg)] bg-cover bg-center p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-secondary">9:41</span>
            <div className="flex items-center gap-2">
              <Compass className="size-4 cursor-pointer stroke-white" />
            </div>
          </div>

          {/* Counter Circle */}
          <div className="relative mt-6 flex items-center justify-center">
            <div className="bg-blur-dark relative z-1 flex size-24 flex-col items-center justify-center rounded-full text-white">
              <p className="-mt-0.5 text-[9px] font-medium tracking-wider uppercase">
                Your Goal
              </p>
              <p className="text-sm font-bold tracking-tight">12 Co2</p>
            </div>
            <div className="bg-blur-white absolute -top-7 -right-1 flex size-20 flex-col items-center justify-center rounded-full text-white">
              <p className="-mt-0.5 text-[9px] font-medium">You'hv offset</p>
              <p className="text-[10px] font-bold tracking-tight">1.3 Co2</p>
            </div>
          </div>
        </div>

        <div className="absolute top-[180px] right-0 bottom-0 left-0 z-1 no-scrollbar space-y-4 overflow-y-auto rounded-t-3xl bg-background px-4 pt-3 pb-6">
          <p>Offset your carbon</p>
          <div className="flex items-center gap-1.5 rounded-full bg-accent p-1.25 text-[9px]">
            <div className="flex-center size-6 shrink-0 rounded-full bg-surface-1">
              <TreePalm className="size-3 fill-accent" />
            </div>
            Spport verified projects to balance your footprint{" "}
          </div>

          <div className="flex gap-1.5">
            <Input
              type="search"
              placeholder="Search..."
              className="rounded-full"
            />
            <div className="flex-center size-7 shrink-0 rounded-full bg-surface-3">
              <Funnel className="size-4" />
            </div>
            <div className="flex-center size-7 shrink-0 rounded-full bg-surface-3">
              <ArrowDownWideNarrow className="size-4" />
            </div>
          </div>

          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">
            <Card className="w-36 min-w-36 snap-start overflow-hidden rounded-xl border border-border-subtle bg-card pt-0 pb-1 shadow-sm">
              <div className="relative h-20 bg-[url(@/assets/forest2v.jpg)] bg-cover bg-center">
                <div className="bg-blur-white flex-center text-normal absolute bottom-1 left-1 size-6 rounded-full font-semibold text-white">
                  G
                </div>
              </div>
              <CardContent className="p-2">
                <h4 className="line-clamp-2 text-[10px] leading-tight font-bold text-card-foreground">
                  Plant Reforestation in the Bavarian Forest
                </h4>
                <p className="mt-1 text-[9px] font-medium text-text-tertiary">
                  Germany, Bavaria
                </p>
                <div className="mt-auto flex items-end justify-between">
                  <p className="text-[10px] font-medium text-surface-7">
                    Offsets at 12 %
                  </p>
                  <div className="flex-center size-6 shrink-0 rounded-full bg-surface-4">
                    <MoveUpRight className="size-3 fill-accent" />
                  </div>{" "}
                </div>
              </CardContent>
            </Card>

            <Card className="w-36 min-w-36 snap-start overflow-hidden rounded-xl border border-border-subtle bg-card pt-0 pb-1 shadow-sm">
              <div className="relative h-20 bg-[url(@/assets/forest3v.jpg)] bg-cover bg-center">
                <div className="bg-blur-white flex-center text-normal absolute bottom-1 left-1 size-6 rounded-full font-semibold text-white">
                  A
                </div>
              </div>
              <CardContent className="p-2">
                <h4 className="line-clamp-2 text-[10px] leading-tight font-bold text-card-foreground">
                  Sustainable Agriculture in Southern Spain
                </h4>
                <p className="mt-1 text-[9px] font-medium text-text-tertiary">
                  Spain, Andalusia
                </p>

                <div className="mt-auto flex items-end justify-between">
                  <p className="text-[10px] font-medium text-surface-7">
                    Offsets at 12 %
                  </p>
                  <div className="flex-center size-6 shrink-0 rounded-full bg-surface-4">
                    <MoveUpRight className="size-3 fill-accent" />
                  </div>{" "}
                </div>
              </CardContent>
            </Card>
            <Card className="w-36 min-w-36 snap-start overflow-hidden rounded-xl border border-border-subtle bg-card pt-0 pb-1 shadow-sm">
              <div className="relative h-20 bg-[url(@/assets/forest1h.jpg)] bg-cover bg-center">
                <div className="bg-blur-white flex-center text-normal absolute bottom-1 left-1 size-6 rounded-full font-semibold text-white">
                  S
                </div>
              </div>
              <CardContent className="p-2">
                <h4 className="line-clamp-2 text-[10px] leading-tight font-bold text-card-foreground">
                  Sustainable Agriculture in Southern Spain
                </h4>
                <p className="mt-1 text-[9px] font-medium text-text-tertiary">
                  Spain, Andalusia
                </p>

                <div className="mt-auto flex items-end justify-between">
                  <p className="text-[10px] font-medium text-surface-7">
                    Offsets at 12 %
                  </p>
                  <div className="flex-center size-6 shrink-0 rounded-full bg-surface-4">
                    <MoveUpRight className="size-3 fill-accent" />
                  </div>{" "}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}
