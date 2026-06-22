import { KMeansCluster } from "../utils/k-means-clustering"
import { getArrayOfRGB } from "../utils/get-array-of-rgb"

onmessage = (e) => {
  const { id, data, clusters } = e.data
  try {
    const KMeans = new KMeansCluster({
      data: getArrayOfRGB(data),
      clusters,
    })
    KMeans.init()
    if (KMeans.isFinished) {
      self.postMessage({ id, type: "result", payload: KMeans.leadingColors })
    }
  } catch (err) {
    console.error(err)
    self.postMessage({ id, type: "error", message: String(err) })
  }
}
