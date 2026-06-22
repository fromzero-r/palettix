# Palettix

An image-driven theme generator that extracts dominant colors from any image and turns them into a fully styled, copyable design system — with live component previews.

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white)

---

## What is Palettix?

Palettix lets you upload any image — a photo, a brand asset, a mood board — and instantly generates a complete set of CSS theme variables based on the image's dominant colors. Every color decision is reflected live across a showcase of real shadcn/ui components and custom-styled pages, so you see exactly how your theme behaves before copying a single line.

---

## Features

### Image input

- Upload an image directly from your device
- Paste a public image URL from any site
- The app extracts up to 12 dominant colors from the image automatically

### Color picker & shade generation

Hover over any part of the image to sample its exact pixel color using a Figma-style magnifier lens. Any sampled color instantly generates a full shade scale (50 → 950) in the Tailwind convention.

Copy any individual shade or the full scale in your preferred format:

- `HEX` — `#3B82F6`
- `HSL` — `hsl(217 91% 60%)`
- `RGBA` — `rgba(59, 130, 246, 1)`
- `OKLCH` — `oklch(0.627 0.189 264.1)`

---

## Theming modes

All four modes respect the colors you assign to the **base**, **theme**, and **chart** roles. The mode determines how those colors are interpreted and extended across the full variable set.

### Classic

Uses the selected color's full shade scale end-to-end. Predictable, clean, and cohesive — every variable traces back to the same hue family. Best for when you want a tight, single-color-family result.

### Smart

Doesn't just apply shades mechanically. Smart analyzes the selected color and transforms it where needed — for example, a deep red picked as a base color gets shifted to a usable neutral, because very saturated dark colors rarely work well as backgrounds. The result still feels related to your choice, just better suited for real UI.

### Funky

Applies independent color strategies to each role (base, theme, accent, charts). Your color choice is the seed — internally, different strategy functions explore unexpected but aesthetic combinations based on color theory (complementary, triadic, analogous, hue-zone mapping, and more). The output deliberately ventures beyond what you picked, while staying visually coherent.

### Manual

Applies subtle tonal adjustments to your selections. You stay close to what you chose — the mode just refines lightness and saturation values for better real-world fit without changing the hue significantly.

---

## Shuffle & locking

- **Shuffle** picks new random dominant colors from the extracted palette and re-runs the active theming mode — giving you a fresh result instantly
- **Lock** any individual color role (base, theme, or charts) before shuffling — locked roles stay fixed while unlocked ones randomize
- Each shuffle is guaranteed to produce a different combination than the previous run

---

## Live preview

Every color change is applied instantly to the DOM via CSS custom properties — no page reloads. The preview spans multiple pages of real components:

- shadcn/ui components (buttons, cards, inputs, badges, charts, sidebars, and more) styled with your generated theme
- Custom pages built with the same theme variables, showing real-world UI patterns
- Toggle between light and dark mode at any time — the theme adapts across both

---

## Exporting your theme

Open the **Get Code** dialog once you're happy with the result. Your full theme is formatted as `:root` and `.dark` CSS variable blocks — ready to drop directly into your `globals.css`.

Choose your preferred format before copying: `HEX`, `HSL`, `RGBA`, or `OKLCH`.

Variables cover the full shadcn/ui token set plus extended tokens for surfaces, interactive states, status colors, text hierarchy, shadows, skeletons, progress bars, badges, and charts.

---

## A note on light vs dark results

Some color combinations look great in light mode but feel off in dark — and vice versa. This is expected behavior, not a bug.

Color perception changes significantly between light and dark contexts. A warm amber that feels energetic on a white background can feel muddy on a dark one. The relationship between hue, saturation, and perceived brightness shifts entirely when the background flips.

**If your current combination isn't landing in both modes, try:**

- Switching to **Smart** mode — it compensates for per-role lightness issues automatically
- Shuffling with your preferred role locked — a different base or theme color often resolves contrast issues
- Toggling between light and dark before copying — the live toggle is there for exactly this reason

There's no single combination that's universally perfect in both modes. Palettix gives you the tools to find what works for your specific use case.

---

## Built with

- [Vite + React](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide React](https://lucide.dev)
- HTML5 Canvas API
---

**Note**: Best viewed on desktop screens. Layouts are optimized for larger displays and may look compressed on mobile devices.

---