export default function Page05() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* =========================================================================
          SCREEN 1: CARGO SHIPMENT ENTRY (Left)
         ========================================================================= */}
      <div className="relative flex h-[600px] w-[300px] shrink-0 flex-col justify-between overflow-hidden rounded-[40px] border border-border bg-background p-8 shadow-lg">
        <div className="z-1 flex items-center justify-between">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border-strong">
            <div className="h-2 w-2 rounded-full bg-text-primary" />
          </div>
          <span className="flex cursor-pointer items-center gap-1 text-xs font-semibold tracking-wider text-text-primary uppercase">
            Menu <span className="text-sm leading-none font-bold">-</span>
          </span>
        </div>

        <div className="z-1 mt-8 space-y-1">
          <h1 className="text-4xl leading-none font-light tracking-tight text-text-secondary">
            Cargo
          </h1>
          <h1 className="text-4xl leading-none font-light tracking-tight text-text-secondary">
            Shipment
          </h1>
          <h2 className="text-4xl leading-none font-semibold tracking-tight text-text-primary">
            Package in
          </h2>
          <h2 className="text-4xl leading-none font-semibold tracking-tight text-text-primary">
            Any Where
          </h2>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg
            className="h-full w-full opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 10 90 L 90 10 M 90 10 L 50 10 M 90 10 L 90 50"
              stroke="currentColor"
              className="text-text-primary"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="z-1 mt-auto space-y-6">
          <div className="flex justify-end pl-12">
            <p className="text-right text-[11px] leading-relaxed tracking-wide text-text-secondary">
              Cargolux offers a wide range of different services by air, sea and
              land. Each of your shipment will be handled with big care.
            </p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-border-strong transition-colors hover:bg-surface-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transform text-text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </div>

            <div className="group relative flex h-20 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-[24px] border border-border bg-chart-2 shadow-inner">
              <div className="absolute inset-0 bg-var(--primary)/10 mix-blend-multiply" />
              <div className="z-1 flex h-8 w-8 transform items-center justify-center rounded-full bg-background shadow-md transition-transform group-hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-0.5 h-3 w-3 fill-current text-text-primary"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SCREEN 2: USABILITY ORBIT TRACKING WITH CURVY GALAXY LINES (Center)
         ========================================================================= */}
      <div className="relative flex h-[600px] w-[300px] shrink-0 flex-col justify-between overflow-hidden rounded-[40px] border border-border bg-chart-2 p-8 shadow-lg">
        <div className="z-1 flex items-center justify-between">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-background/30">
            <div className="h-2 w-2 rounded-full bg-background" />
          </div>
          <span className="text-[10px] font-medium tracking-[0.15em] text-background/60 uppercase">
            [ Usability App ]
          </span>
          <span className="flex cursor-pointer items-center gap-0.5 text-xs font-semibold tracking-wider text-background uppercase opacity-80 hover:opacity-100">
            Close &times;
          </span>
        </div>

        <div className="z-1 mt-6 flex items-start justify-between">
          <div className="flex items-start">
            <span className="text-6xl font-light tracking-tighter text-background">
              4.9
            </span>
            <span className="mt-1 ml-1 text-xl font-bold text-background">
              ★
            </span>
          </div>

          <ul className="space-y-1.5 font-mono text-[10px] tracking-wide text-background/90">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-background" /> ACM-1
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-background/50" /> BRS
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-3" /> CTE
            </li>
          </ul>
        </div>

        {/* Galaxy Orbital Radar Interface Layer with Curvy, Sinusoidal Orbits */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg
            className="h-full w-full fill-none stroke-background/25"
            viewBox="0 0 340 640"
          >
            {/* Curvy Concentric Sinusoidal Wave Patterns */}
            <path
              d="M -20 280 Q 80 200, 170 290 T 360 260"
              strokeWidth="0.75"
              strokeDasharray="3 3"
            />
            <path
              d="M -20 340 Q 90 240, 170 340 T 360 310"
              strokeWidth="1.25"
            />
            <path
              d="M -20 400 Q 100 280, 170 390 T 360 360"
              strokeWidth="0.75"
            />
            <path
              d="M -20 460 Q 110 320, 170 440 T 360 410"
              strokeWidth="0.5"
            />

            {/* Dynamic Node Blip Matrix resting precisely along the curves */}
            <circle
              cx="85"
              cy="242"
              r="3.5"
              className="fill-text-primary stroke-none"
            />
            <circle
              cx="135"
              cy="305"
              r="2.5"
              className="fill-text-primary stroke-none"
            />
            <circle
              cx="210"
              cy="315"
              r="4.5"
              className="fill-background stroke-background/40"
              strokeWidth="3"
            />
            <circle
              cx="170"
              cy="340"
              r="3"
              className="fill-chart-3 stroke-none"
            />

            {/* Radar Sweep Telemetry Tracker Vector */}
            <line
              x1="170"
              y1="440"
              x2="210"
              y2="315"
              stroke="var(--background)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <polygon
              points="210,315 204,321 214,323"
              className="fill-background stroke-none"
            />

            <text
              x="75"
              y="230"
              className="fill-background/40 font-mono text-[9px]"
              stroke="none"
            >
              35
            </text>
            <text
              x="225"
              y="310"
              className="fill-background/40 font-mono text-[9px]"
              stroke="none"
            >
              45
            </text>
          </svg>
        </div>

        <div className="z-1 mt-auto grid grid-cols-3 gap-1.5 rounded-[32px] border border-border bg-background p-2.5 shadow-sm">
          <button className="rounded-full border border-border-strong px-1 py-2 text-[8px] font-bold tracking-tight text-text-primary uppercase hover:bg-surface-1">
            Sales
          </button>
          <button className="rounded-full border border-border-strong px-1 py-2 text-[8px] font-bold tracking-tight text-text-primary uppercase hover:bg-surface-1">
            Community
          </button>
          <button className="rounded-full border border-border-strong px-1 py-2 text-[8px] font-bold tracking-tight text-text-primary uppercase hover:bg-surface-1">
            Calculator
          </button>
          <button className="rounded-full border border-border-strong px-1 py-2 text-[8px] font-bold tracking-tight text-text-primary uppercase hover:bg-surface-1">
            Payment
          </button>
          <button className="col-span-2 rounded-full bg-chart-2 px-1 py-2 text-[8px] font-bold tracking-tight text-background uppercase hover:opacity-90">
            Tracking
          </button>
        </div>
      </div>

      {/* =========================================================================
          SCREEN 3: AIRFRAME SPECIFICATION CARRIER WITH ACCURATE AIRPLANE SVG (Right)
         ========================================================================= */}
      <div className="relative flex h-[600px] w-[300px] shrink-0 flex-col justify-between overflow-hidden rounded-[40px] border border-border bg-info-muted p-8 shadow-lg">
        <div className="z-1 flex items-center justify-between">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border-strong">
            <div className="h-2 w-2 rounded-full bg-text-primary" />
          </div>
          <div className="group flex cursor-pointer items-center gap-1">
            <span className="text-[10px] font-semibold tracking-widest text-text-primary uppercase">
              Airplanes
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 transform text-text-primary transition-transform group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="z-1 mt-6">
          <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
            [ Best Choice ]
          </span>
          <h2 className="mt-1 text-4xl leading-none font-normal tracking-tight text-text-primary">
            Airbus
          </h2>
          <h2 className="text-4xl leading-none font-normal tracking-tight text-text-primary">
            Cargo
          </h2>
          <h3 className="mt-0.5 text-3xl font-semibold tracking-tight text-chart-2">
            A380F
          </h3>
        </div>

        {/* High-Fidelity Big Airplane Wireframe SVG Layout Line Art */}
        <div className="pointer-events-none absolute right-[-64px] bottom-[10%] -rotate-[10deg] h-[480px] w-[360px] opacity-85">
          <svg
            width="2940"
            height="4370"
            viewBox="0 0 2940 4370"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full *:stroke-6"
          >
            <path
              d="M328.107 3949.96C318.018 3961.66 314.57 3965.5 314.107 3965.96"
              stroke="#AFAFAF"
              stroke-width="5"
              stroke-linecap="round"
            />
            <path
              d="M2871.11 149.096C2833.82 154.043 2831.26 183.57 2829.61 172.461M2829.61 172.461C2827.95 161.352 2822.21 132.406 2859.5 127.459M2829.61 172.461C2816.83 187.464 2806.26 207.575 2804.61 196.466C2804.61 187.961 2805.63 166.59 2829.52 149.096M2912.11 124.46C2912.11 138.96 2909.61 125.45 2909.61 144.46C2872.32 149.407 2853.76 153.07 2852.11 141.961C2850.46 130.852 2877.99 105.908 2915.28 100.96C2912.11 124.46 2915.28 103.46 2912.11 124.46Z"
              stroke="var(--primary)"
              stroke-width="6"
            />
            <rect
              x="2217.83"
              y="2937.3"
              width="46.5919"
              height="72.8275"
              transform="rotate(3.97622 2217.83 2937.3)"
              stroke="var(--primary)"
            />
            <rect
              x="2315.69"
              y="2401.49"
              width="46.5919"
              height="72.8275"
              transform="rotate(3.97622 2315.69 2401.49)"
              stroke="var(--primary)"
            />
            <rect
              x="2520.69"
              y="1211.49"
              width="46.5919"
              height="72.8275"
              transform="rotate(3.97622 2520.69 1211.49)"
              stroke="var(--primary)"
            />
            <rect
              x="2206.88"
              y="3059.49"
              width="17.8512"
              height="32.2469"
              transform="rotate(3.97622 2206.88 3059.49)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2260.9"
              y="2709.45"
              width="17.8512"
              height="32.2469"
              transform="rotate(5.26273 2260.9 2709.45)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2304.67"
              y="2527.86"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2304.67 2527.86)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2369.23"
              y="2170.55"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2369.23 2170.55)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2407.23"
              y="1950.55"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2407.23 1950.55)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2447.23"
              y="1724.55"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2447.23 1724.55)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2474.23"
              y="1530.55"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2474.23 1530.55)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2526.23"
              y="1302.55"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2526.23 1302.55)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2589.23"
              y="971.546"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2589.23 971.546)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2622.23"
              y="753.546"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2622.23 753.546)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2198.88"
              y="3110.49"
              width="17.8512"
              height="32.2469"
              transform="rotate(3.97622 2198.88 3110.49)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2251.76"
              y="2760.26"
              width="17.8512"
              height="32.2469"
              transform="rotate(5.26273 2251.76 2760.26)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2290.64"
              y="2577.54"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2290.64 2577.54)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2355.2"
              y="2220.23"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2355.2 2220.23)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2393.2"
              y="2000.23"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2393.2 2000.23)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2433.2"
              y="1774.23"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2433.2 1774.23)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2460.2"
              y="1580.23"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2460.2 1580.23)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2512.2"
              y="1352.23"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2512.2 1352.23)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2575.2"
              y="1021.23"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2575.2 1021.23)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2608.2"
              y="803.228"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2608.2 803.228)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2198.88"
              y="3155.49"
              width="17.8512"
              height="32.2469"
              transform="rotate(3.97622 2198.88 3155.49)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2250.75"
              y="2805.25"
              width="17.8512"
              height="32.2469"
              transform="rotate(5.26273 2250.75 2805.25)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2285.27"
              y="2622.22"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2285.27 2622.22)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2349.83"
              y="2264.91"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2349.83 2264.91)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2387.83"
              y="2044.91"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2387.83 2044.91)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2427.83"
              y="1818.91"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2427.83 1818.91)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2454.83"
              y="1624.91"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2454.83 1624.91)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2506.83"
              y="1396.91"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2506.83 1396.91)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2569.83"
              y="1065.91"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2569.83 1065.91)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2602.83"
              y="847.905"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2602.83 847.905)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2196.88"
              y="3206.49"
              width="17.8512"
              height="32.2469"
              transform="rotate(3.97622 2196.88 3206.49)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2247.61"
              y="2856.19"
              width="17.8512"
              height="32.2469"
              transform="rotate(5.26273 2247.61 2856.19)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2277.19"
              y="2672.61"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2277.19 2672.61)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2341.75"
              y="2315.3"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2341.75 2315.3)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2379.75"
              y="2095.3"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2379.75 2095.3)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2419.75"
              y="1869.3"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2419.75 1869.3)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2446.75"
              y="1675.3"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2446.75 1675.3)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2498.75"
              y="1447.3"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2498.75 1447.3)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2561.75"
              y="1116.3"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2561.75 1116.3)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <rect
              x="2594.75"
              y="898.302"
              width="17.8512"
              height="32.2469"
              transform="rotate(10.8332 2594.75 898.302)"
              fill="var(--primary)"
              stroke="var(--primary)"
            />
            <path
              d="M2845.11 42.4618L2925.61 57.4618M2509.11 1163.96C2548.32 1010.44 2528.82 495.924 2845.11 42.4618C2881.51 0.0617981 2922.61 -2.20487 2938.61 1.9618L2925.61 57.4618M2925.61 57.4618L2195.22 4144.96M1716.4 1635.86C1799.72 1594.71 1879.27 1555.04 1953.61 1517.21C2045.68 1470.36 2129.75 1426.35 2203.11 1385.9C2382.23 1287.14 2497.44 1209.64 2509.11 1163.96M2243.61 2350.96L2284.11 2189.46L2509.11 1163.96M2509.11 1163.96L2218.61 2770.46M1372.67 2446.96L1471.08 2427.74L1655.11 2391.79L1733.61 2376.46L1912.86 2367.5M1733.61 2376.46C1733.61 2435.26 1681.27 2482.84 1655.11 2499.28V2391.79M2243.61 2350.96L2218.61 2770.46M1912.86 2367.5L1978.61 2364.21L2243.61 2350.96M2155.11 4056.46L1316.61 4195.37L1240.61 4207.96L1316.61 4033.46L2155.11 3583.96V3189.96L2218.61 2770.46M2155.11 4056.46V4369.46L2195.22 4144.96M2155.11 4056.46V3924.96L1316.61 4126.96V4195.37M2365.11 3278.46C2352.44 3267.63 2325.11 3252.46 2317.11 3278.46C2307.11 3310.96 2223.61 3765.46 2223.61 3800.96C2223.61 3829.36 2204.68 4042.13 2195.22 4144.96M2284.11 2189.46L2067.11 2203.09M1397.36 2318.67L1276.11 2350.96L1104.36 2389.35M1276.11 2350.96V2282.96M846.607 2446.96L831.607 2409.46L685.107 2454.37M846.607 2446.96L831.607 2679.46C854.441 2667.76 903.107 2622.77 915.107 2536.34M846.607 2446.96L932.607 2427.74M321.107 2652.36L0.607422 2714.96L20.6074 2590.96C20.6074 2590.96 41.3557 2477.08 150.595 2427.74M321.107 2652.36V2565.96L538.607 2499.28M321.107 2652.36L538.607 2609.88M538.607 2609.88V2499.28M1104.8 2499.28L915.107 2536.34L685.107 2581.26L538.607 2609.88M538.607 2499.28L685.107 2454.37M685.107 2454.37V2581.26M1104.8 2499.28V2628.96C1123.9 2625.37 1165.71 2591.46 1180.11 2484.57M1372.67 2446.96L1180.11 2484.57L1104.8 2499.28M1276.11 2282.96L1104.8 2323.46L932.607 2376.46V2427.74M932.607 2427.74L1104.36 2389.35M1104.8 2323.46L1104.36 2389.35M1276.11 2282.96L1387.87 2247.87M2067.11 2203.09V2131.46H1912.86M2067.11 2203.09L1912.86 2212.77M1518.61 2286.38L1655.11 2250.03L1758.61 2222.46L1912.86 2212.77M1912.86 2212.77V2131.46M1912.86 2131.46H1758.61L1632.61 2171.02M1632.61 2171.02L1655.11 2250.03M1632.61 2171.02L1499.64 2212.77M1518.61 2286.38L1499.64 2212.77M1518.61 2286.38L1397.36 2318.67M1499.64 2212.77L1387.87 2247.87M1387.87 2247.87L1397.36 2318.67M1912.86 2367.5L1923.11 2464.96C1939.11 2469.44 1972.61 2455.56 1978.61 2364.21M1372.67 2446.96L1387.87 2581.26C1400.06 2578.35 1433.77 2543.56 1471.08 2427.74M150.595 2427.74C155.113 2425.7 110.607 2453.46 164.607 2421.96C218.607 2390.46 265.607 2362.46 387.107 2301.96M644.607 2216.46L404.607 2335.46L159.607 2450.46L150.595 2427.74M404.607 2335.46L387.107 2301.96M1372.67 1804.28C1217.01 1880.32 1055.75 1959.21 896.107 2039.02C721.335 2126.4 548.508 2214.89 387.107 2301.96M1716.4 1635.86C1678.05 1654.8 1638.91 1674.04 1599.11 1693.56C1525.59 1729.61 1449.82 1766.59 1372.67 1804.28C1217.01 1880.32 1761.75 1613.74 1602.11 1693.56C1427.33 1780.94 548.508 2214.89 387.107 2301.96M644.607 2216.46L622.607 2177.82M1602.11 1693.56L896.107 2098.96L644.607 2216.46M896.107 2098.96V2039.02M896.107 2007.46H868.607C878.774 1907.79 905.807 1698.56 932.607 1658.96M998.607 2007.46L1083.11 1946.22C1103.91 1918.02 1114.77 1750.3 1117.61 1669.96C1067.11 1649.79 959.407 1619.36 932.607 1658.96M932.607 1658.96C967.107 1677.13 1052.41 1704.76 1117.61 1669.96M998.607 2007.46L1009.61 1851.96V1780.46C997.774 1780.9 968.207 1828.39 944.607 2014.82L998.607 2007.46ZM1599.11 1693.56V1762.46L1387.87 1851.96L1202.11 1960.96L1009.61 2054.96L998.607 2007.46M1202.11 1960.96L1180.11 1898.51L1372.67 1804.28M1716.4 1635.86L1733.61 1693.56L1968.36 1556.76M2203.11 1385.9V1419.96L1968.36 1556.76M1953.61 1517.21L1968.36 1556.76M1602.11 1662H1574.61C1584.77 1562.33 1611.81 1353.1 1638.61 1313.5M1707.61 1640.2L1789.11 1600.76C1809.91 1572.56 1820.77 1404.84 1823.61 1324.5C1773.11 1304.33 1665.41 1273.9 1638.61 1313.5M1638.61 1313.5C1673.11 1331.67 1758.41 1359.3 1823.61 1324.5M1707.61 1640.2L1715.61 1506.5V1435C1703.77 1435.44 1674.21 1482.93 1650.61 1669.36L1707.61 1640.2Z"
              stroke="var(--primary)"
              fill="var(--primary)"
            />
          </svg>
        </div>

        <div className="z-1 mt-auto space-y-4">
          <div>
            <span className="block font-mono text-[10px] tracking-wider text-text-secondary uppercase">
              Total Pallets
            </span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-text-primary">
                2-69
              </span>
            </div>
          </div>

          <div>
            <span className="block font-mono text-[10px] tracking-wider text-text-secondary uppercase">
              Hold Volume
            </span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-text-primary">
                87 m³
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
