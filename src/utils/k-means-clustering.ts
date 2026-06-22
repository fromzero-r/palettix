import { EuclideanDistance } from "./euclidean-distance"
import { QuickSelect } from "./quick-select"

type KMeansClusterConfig = {
  clusters: number
  data: number[][]
}

/**
 * Represents a K-Means clustering algorithm implementation designed for pixel data extraction.
 * Accounts for empty cluster edge-cases using a fallback selection mechanism.
 */
export class KMeansCluster {
  isFinished = false
  leadingColors: number[][] = []
  #centroids: number[][] = []
  #clusterGroup: number[][][] = []
  clusters = 0
  data: number[][] = []

  constructor(config: KMeansClusterConfig) {
    this.clusters = config.clusters || 2
    this.data = config.data
  }

  /**
   * Initializes the clustering process by establishing initial color positions (centroids)
   * and distributing the pixels among them.
   * @public
   */
  init() {
    this.#getInitialCentroids()
    this.#calculateClusterGroup()
  }

  /**
   * Generates a random integer within a range.
   * Used for adding microscopic structural variations to identical pixel color markers.
   * @private
   */
  #getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Selects unique starter coordinates (centroids) from the pixel pool.
   * If identical colors are picked, it applies a minute offset to prevent overlapping starting points.
   * @private
   */
  #getInitialCentroids() {
    const indexSet = new Set<number>()
    const centroidMap = new Map()

    // Pick distinct indexes across the input data length
    while (indexSet.size < this.clusters) {
      const randomIndex = Math.floor(Math.random() * this.data.length)
      indexSet.add(randomIndex)
    }

    this.#centroids = Array.from(indexSet).map((indexNumber) => {
      const point = this.data[indexNumber]
      const pointKey = point.join("")
      const trifle = 2 // Small numeric scale variation threshold

      if (!centroidMap.has(pointKey)) {
        centroidMap.set(pointKey, point)
      } else {
        // Jitter identical colors slightly so separate clusters can form independently
        const modifiedPoint = point.map(
          (num) => num + this.#getRandomInt(0, trifle)
        )
        centroidMap.set(pointKey, modifiedPoint)
      }

      return centroidMap.get(pointKey)
    })
  }

  /**
   * Categorizes every pixel into its closest coordinate cluster.
   * Automatically intercepts empty arrays by using QuickSelect to re-allocate outlier pixels.
   * @private
   */
  #calculateClusterGroup() {
    const clusterGroup: number[][][] = []

    // 1. Map each data coordinate item to its closest centroid match
    for (let i = 0; i < this.data.length; i++) {
      let minDistance = Infinity,
        minNumIndex = -1
      for (let j = 0; j < this.#centroids.length; j++) {
        const p1 = this.data[i]
        const p2 = this.#centroids[j]
        const eud = new EuclideanDistance(p1, p2)
        if (eud.value < minDistance) {
          minDistance = eud.value
          minNumIndex = j
        }
      }
      clusterGroup[minNumIndex] = clusterGroup[minNumIndex] || []
      clusterGroup[minNumIndex].push(this.data[i])
    }

    // 2. Discover the largest populated cluster to siphon replacement data points from
    const largestCluster = clusterGroup.reduce(
      (acc, curr, i) =>
        curr.length > acc.curr ? { idx: i, curr: curr.length } : acc,
      { idx: -1, curr: 0 }
    )

    // 3. Initialize QuickSelect over the dominant data subset to partition outlier candidate markers
    const quickSelect = new QuickSelect({
      type: "furthest",
      numberOfClusters: clusterGroup.length,
      data: clusterGroup[largestCluster.idx],
    })
    quickSelect.init()

    // 4. Fill completely unmapped empty tracking blocks using isolated points isolated by QuickSelect
    this.#clusterGroup = clusterGroup.map((grp, i) => {
      if (grp.length === 0) {
        return [quickSelect.selectedPoints[i]]
      }
      return grp
    })

    // 5. Shift cluster centers toward the average center of their newly added point groups
    this.#moveCentroids()
  }

  /**
   * Recalculates center values and tests convergence state.
   * Cycles optimization operations until delta updates fall below the standard EPSILON threshold.
   * @private
   */
  #moveCentroids() {
    // Determine target center point structures via multi-dimensional index coordinates averaging
    const newCentroids = this.#clusterGroup.map((grp) => {
      if (grp.length === 1) return grp[0]

      const sum = grp.reduce(
        (acc, curr) => acc.map((val, i) => val + curr[i]),
        Array.from(grp[0]).fill(0)
      )
      return sum.map((val) => Math.round(val / grp.length))
    })

    // Compare new coordinates with prior locations to identify convergence state
    const EPSILON = 1e-6
    const isSameCentroids = this.#centroids
      .flat()
      .every((val, idx) => Math.abs(val - newCentroids.flat()[idx]) < EPSILON)

    this.isFinished = isSameCentroids

    if (isSameCentroids) {
      // Complete: Store the final optimized cluster centroids
      this.leadingColors = newCentroids
    } else {
      // Continue: Shift reference locations and recalibrate distance mappings
      this.#centroids = newCentroids
      this.#calculateClusterGroup()
    }
  }
}
