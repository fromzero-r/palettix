import { clearActiveTasks, runWorkerTask } from "@/utils/worker-manager"
import { createContext, useState, type ReactNode } from "react"

interface KMeansContextType {
  colors: number[][] | null
  isLoading: "idle" | "loading" | "done"
  error: string | null
  processImage: (data: ImageDataArray, clusters: number) => void
  cancelProcess: (reason?: string) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ColorsContext = createContext<KMeansContextType | null>(null)

export const ColorsProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] =
    useState<KMeansContextType["isLoading"]>("idle")
  const [colors, setColors] = useState<number[][] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processImage = (data: ImageDataArray, clusters: number) => {
    setIsLoading("loading")
    runWorkerTask(data, clusters, (err, value) => {
      if (err !== null) {
        setError(err)
      } else if (value !== null) {
        setColors(value)
      }
      setIsLoading("done")
    })
  }
  const cancelProcess = (reason?: string) => {
    clearActiveTasks(reason)
    setIsLoading("idle")
    setColors(null)
    setError(null)
  }

  return (
    <ColorsContext.Provider
      value={{ isLoading, colors, error, processImage, cancelProcess }}
    >
      {children}
    </ColorsContext.Provider>
  )
}
