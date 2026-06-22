import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import { ColorsProvider } from "./providers/ColorsProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ColorsProvider>
        <TooltipProvider>
          <App />
          <Toaster position="bottom-right" className="" />
        </TooltipProvider>
      </ColorsProvider>
  </StrictMode>
)
