import { ColorPicker } from "./components/custom/color-picker"
import { useState } from "react"
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
  const [page, setPage] = useState(4)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [cssVars, setCssVars] = useState<ThemeState["cssVars"]>(THEME_VARS_RGBA)
  const pages = [<Page01 />, <Page02 />, <Page03 />, <Page04 />, <Page05 />]

  const getCssVars = (v: ThemeState["cssVars"]) => {
    setCssVars(v)
  }

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
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pt-7 pb-20 px-20">
          {pages.map((P, i) => i + 1 === page && P)}
        </div>

        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => {
            setTheme((prev) => (prev === "light" ? "dark" : "light"))
            localStorage.setItem("theme", theme)
            document.documentElement.className = theme
            applyThemeToDOM(cssVars)
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
