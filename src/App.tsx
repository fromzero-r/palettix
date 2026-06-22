import { ColorPicker } from "./components/custom/color-picker"
import { useEffect, useState } from "react"
import { SlidingPagination } from "./components/custom/sliding-pagination"
import Page01 from "./pages/01"
import Page02 from "./pages/02"
import Page03 from "./pages/03"
import Page04 from "./pages/04"
import Page05 from "./pages/05"
import { MoonStar, Sun } from "lucide-react"
import { Button } from "./components/ui/button"
import type { ThemeState } from "./global_types/types"
import { applyThemeToDOM } from "./theme/update-theme"
import { THEME_VARS_RGBA } from "./const/const"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar"

export function App() {
  const [page, setPage] = useState(1)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [cssVars, setCssVars] = useState<ThemeState["cssVars"]>(THEME_VARS_RGBA)
  const pages = [Page01, Page02, Page03, Page04, Page05]

  const getCssVars = (v: ThemeState["cssVars"]) => {
    setCssVars(v)
  }

  useEffect(() => {
    const t = localStorage.getItem("theme")
    if (
      t === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme("dark")
    } else {
      document.documentElement.classList.remove("dark")
      setTheme("light")
    }

    if (!t) {
      localStorage.setItem("theme", theme)
    }
  }, [])

  return (
    <SidebarProvider className="flex h-screen w-full overflow-hidden">
      <Sidebar
        collapsible="offcanvas"
        style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
      >
        <SidebarContent>
          <ColorPicker getCssVars={getCssVars} />
        </SidebarContent>
        <SidebarTrigger className="absolute top-3 left-80" />
      </Sidebar>

      <SidebarInset className="mx-auto flex max-w-6xl flex-col">
        <SlidingPagination
          totalPages={5}
          currentPage={page}
          onPageChange={setPage}
        />
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-20 pt-7 pb-20">
          {pages.map((P, i) => i + 1 === page && <P key={i + 1} />)}
        </div>

        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => {
            setTheme((prev) => {
              const t = prev === "light" ? "dark" : "light"
              localStorage.setItem("theme", t)
              document.documentElement.className = t
              applyThemeToDOM(cssVars)
              return t
            })
          }}
          className="absolute right-2.5 bottom-2.5 bg-background text-primary"
        >
          {theme === "light" ? <MoonStar size={20} /> : <Sun size={20} />}
        </Button>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
