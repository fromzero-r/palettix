import { ColorsContext } from "@/providers/ColorsProvider"
import { useContext, useMemo } from "react"


export function useWorker(totalClusters: number) {
  const context = useContext(ColorsContext)

  if (!context) {
    throw new Error("ColorsContext is not defined!")
  }
  const customColors = useMemo(() => {
    if (context.colors !== null && context.colors?.length > 0)
      return context.colors
    else return new Array(totalClusters).fill([184, 184, 184, 1])
  }, [totalClusters, context.colors])

  return {
    ...context,
    colors: customColors,
  }
}
