import { Card } from "@/components/ui/card"
import {
  Heart,
  Maximize2,
  Music,
  Palette,
  Play,
  Share2,
  Volume2,
} from "lucide-react"
import artist from "@/assets/artist.jpg"
import record from "@/assets/record.jpg"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CartesianGrid, Bar, BarChart, LabelList } from "recharts"
import { Waveform } from "@/components/custom/waveform"

// DATA
const chartData = [
  { time: "week", visitors: 487, fill: "var(--color-week)" },
  { time: "month", visitors: 600, fill: "var(--color-month)" },
  { time: "year", visitors: 875, fill: "var(--color-year)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  week: {
    label: "Week",
    color: "var(--chart-1)",
  },
  month: {
    label: "Month",
    color: "var(--chart-2)",
  },
  year: {
    label: "Year",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export default function Page02() {
  return (
    <div className="grid grid-cols-3 gap-4 font-ubuntu w-full">
      <FadingSongLyrics />
      <ArtistAbout />
      <Settings />
      <TheEllens />
      <Chart />
      <WaveForm />
      <TopPlaylist />
    </div>
  )
}

// Fading Song Lyrics
function FadingSongLyrics() {
  return (
    <Card className="col-start-1 row-span-2 row-start-3 h-[260px] rounded-4xl border-border bg-card p-5">
      <div className="mb-1 flex justify-between">
        <p className="text-[13px] font-semibold">Text</p>

        <div className="flex gap-4">
          <Maximize2 className="size-5" />
          <Share2 className="size-5" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mask-b-from-80% mask-b-to-100% px-2.5 text-[14px] leading-5.5 tracking-[0.25em] text-accent-foreground">
        <p className="text-wrap whitespace-pre-line text-secondary-foreground">
          You'll never know where did it go
        </p>
        <p>
          <span className="text-muted-foreground">I am alive, </span> I am alive
        </p>
        <p>Let the fire break the sky</p>
        <p>Left the pheonix learn to fly</p>
      </div>
    </Card>
  )
}

// Artist About
function ArtistAbout() {
  return (
    <Card className="col-start-2 row-span-3 row-start-1 rounded-4xl border-border bg-card px-5 pt-4">
      <div className="mb-1 flex justify-between">
        {" "}
        <p className="pl-0.5 text-[13px] font-semibold">About the artist</p>
      </div>

      <img
        src={artist}
        alt="srtist"
        className="mb-1 h-60 w-full rounded-2xl object-cover object-top-left"
      />
      <div className="flex items-center justify-between">
        <div className="pl-1 leading-4">
          <p className="text-lg font-semibold text-primary">Mira Miar</p>
          <p className="text-accent-foreground">Monthly listeners : 20k</p>
        </div>
        <Button type="button" className="rounded-full p-4">
          Subscribe
        </Button>
      </div>
      <div className="pl-1 text-sm">
        Mira Miar is an independent blending genres to create a distinctive,
        modern sound. She writes, recored...{" "}
        <span className="font-semibold text-accent-foreground">more</span>
      </div>
    </Card>
  )
}

// Settings
function Settings() {
  return (
    <Card className="col-start-3 row-start-1 w-[230px] rounded-4xl border-border bg-card px-5 pt-4">
      <p className="text-[13px] font-semibold">Settings</p>
      <div className="space-y-3">
        <div className="flex justify-between text-accent-foreground">
          <Label htmlFor="theme">
            <Palette className="size-4" />
            <p>Theme</p>
          </Label>
          <Switch id="theme" defaultChecked />
        </div>
        <div className="flex justify-between text-accent-foreground">
          <Label htmlFor="autoplay">
            <Play className="size-4" />
            <p>Autoplay</p>
          </Label>
          <Switch id="autoplay" />
        </div>
        <div className="">
          <div className="mb-2 flex cursor-pointer gap-2 text-accent-foreground">
            <Volume2 className="size-4" />
            <p className="font-medium">Volumn</p>
          </div>
          <Slider
            defaultValue={[75]}
            max={100}
            step={1}
            className="mx-auto w-full max-w-xs"
          />{" "}
          <div className="flex justify-between text-accent-foreground">
            <p>Low</p>
            <p>High</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Chart
function Chart() {
  return (
    <Card className="col-start-3 row-span-2 row-start-2 flex h-[200px] w-[350px] flex-col justify-between rounded-4xl border-border bg-card px-5 pt-4">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold">Text</p>
          <p className="text-muted-foreground">Listening time • 18 hrs.</p>
        </div>

        <Share2 className="size-5" />
      </div>{" "}
      <div className="flex items-end justify-between">
        <div className="text-6xl">
          20 <span className="text-2xl text-muted-foreground">hrs</span>
        </div>
        <ChartContainer config={chartConfig} className="h-28 w-45">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} horizontal={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar
              dataKey="visitors"
              strokeWidth={2}
              radius={2}
              barSize={90}
              label={false}
              className="space-x-5.5"
            >
              <LabelList
                position="top"
                dataKey="time"
                fillOpacity={10}
                className="fill-secondary-foreground"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  )
}

// The Ellens
function TheEllens() {
  return (
    <Card className="relative col-start-1 row-span-2 row-start-5 h-[180px] w-[200px] justify-self-end rounded-4xl border-border bg-card px-5 pt-4">
      <div className="mb-5 flex gap-2 text-accent-foreground">
        <Music className="size-4" />
        <p>The Ellens</p>
      </div>
      <div className="flex justify-between">
        <div className="text-4xl">
          80 <span className="text-2xl text-muted-foreground">times</span>
        </div>
        <img
          src={record}
          alt="record"
          className="absolute -top-4 -right-9 size-27 rotate-160 rounded-full"
        />
      </div>
      <p className="text-accent-foreground/50">
        Was listed in{" "}
        <span className="font-semibold text-muted-foreground">2016</span>
      </p>
    </Card>
  )
}

// Top Playlist
function TopPlaylist() {
  return (
    <Card className="col-start-2 row-span-2 row-start-4 h-[240px] rounded-4xl border-border bg-card px-5 pt-4">
      <div className="mb-2.5 flex justify-between">
        <p className="">Top playlist</p>
        <p className="text-[13px] text-muted-foreground">see all</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 rounded-full bg-secondary p-1">
          <img
            src={artist}
            alt="artist_p"
            className="size-9 rounded-full object-cover"
          />
          <div>
            <p className="">Mia monroe</p>
            <p className="text-[13px] text-muted-foreground">
              Whispering to the moon ♪
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground">
            <Play className="size-4 fill-muted stroke-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-secondary p-1">
          <img
            src={record}
            alt="record_p"
            className="size-9 rounded-full object-cover"
          />
          <div>
            <p className="">Mia monroe</p>
            <p className="text-[13px] text-muted-foreground">
              Whispering to the moon ♪
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground">
            <Play className="size-4 fill-muted stroke-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-secondary p-1">
          <img
            src={artist}
            alt="artist_p"
            className="size-9 rounded-full object-cover"
          />
          <div>
            <p className="">Mia monroe</p>
            <p className="text-[13px] text-muted-foreground">
              Whispering to the moon ♪
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground">
            <Play className="size-4 fill-muted stroke-muted-foreground" />
          </div>
        </div>
      </div>
    </Card>
  )
}

// Wave Lenght
function WaveForm() {
  return (
    <Card className="col-start-3 row-start-4 rounded-4xl border-border bg-card px-5 pt-4">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-muted-foreground">The Ellens</p>
          <p className="font-semibold">Crawling whispers</p>
        </div>

        <Heart className="size-5" />
      </div>{" "}
      <div>
        <Waveform
          playedColor="var(--primary)"
          unplayedColor="var(--accent-foreground)"
          barWidth={8}
          progress={0.65}
          gap={9}
        />
      </div>
    </Card>
  )
}
