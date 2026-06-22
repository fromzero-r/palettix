import { EuclideanDistance } from "./euclidean-distance"

type QuickSelectConfig = {
  type: "closest" | "furthest"
  numberOfClusters: number
  data: number[][]
}

/**
 * Implements Selection sorting variants to locate boundary outliers or cluster center sets in linear time.
 */
export class QuickSelect {
  buffer: number[][] = []
  selectedPoints: number[][] = []
  config: QuickSelectConfig
  type: string
  numberOfClusters: number
  data: number[][]

  constructor(config: QuickSelectConfig) {
    this.config = config
    this.type = config.type || "furthest"
    this.numberOfClusters = config.numberOfClusters || 1
    this.data = config.data || []
  }

  /**
   * Kicks off selection operations by buffering targeted item profiles and extracting isolated elements.
   * @public
   */
  init() {
    // Build the buffer of top-k points based on the type (closest or furthest).
    this.#getBuffer(this.data, this.numberOfClusters, this.type)
    // Select random points from the buffer.
    this.getDataPoints()
  }

  /**
   * Randomly samples unique entries out of compiled priority thresholds.
   * Prevents repeated element collisions through tracking via standard tracking collection sets.
   */
  getDataPoints() {
    if (this.buffer.length === 0) {
      throw new Error("Buffer is empty, re-initialize again.")
    }

    const uniqueRandomIndex = new Set()
    while (uniqueRandomIndex.size < this.numberOfClusters) {
      // Generate a random index within the buffer range.
      uniqueRandomIndex.add(Math.floor(Math.random() * this.buffer.length))
    }

    // Add the selected points to the `selectedPoints` array.
    uniqueRandomIndex.forEach((index) =>
      this.selectedPoints.push(this.buffer[index as number])
    )
  }

  /**
   * Partitions item configurations using an Hoare/Lomuto style selection architecture around distance variables.
   * Reduces searching scopes continuously without full array sorting actions.
   * @private
   */
  #getBuffer(array: number[][], numberOfClusters: number, type = "furthest") {
    const kth = numberOfClusters * 10 // Select more points than needed for safety.
    if (!Array.isArray(array) || kth < 1 || kth > array.length) {
      throw new Error("Check the arguments ⚠️")
    }

    const MAX_DEPTH = 100
    let low = 0,
      high = array.length - 1,
      iterationCount = 0

    // Determine the target index based on the type.
    const targetIndex = type === "furthest" ? array.length - kth : kth - 1

    while (true) {
      iterationCount += 1

      // Partition the array and get the pivot index.
      const { pivotIndex } = this.#partition(array, low, high)

      if (iterationCount > MAX_DEPTH) {
        throw new Error(`Iteration exceeds maximum depth of ${MAX_DEPTH}`)
      }

      if (pivotIndex === targetIndex) {
        // Slice the array to build the buffer based on the type.
        this.buffer =
          this.type === "furthest"
            ? array.slice(pivotIndex)
            : array.slice(0, pivotIndex + 1)
        break
      } else if (pivotIndex > targetIndex) {
        // Narrow the search to the left side of the pivot.
        high = pivotIndex - 1
      } else {
        // Narrow the search to the right side of the pivot.
        low = pivotIndex + 1
      }
    }
  }

  /**
   * Sorts array segments using Euclidean proximity offsets computed against a structural base coordinate point.
   * @private
   */
  #partition(array: number[][], low = 0, high = array.length - 1) {
    let i = low - 1
    const pivot = array[high]
    const base = Array.from(array[0]).fill(0) // Example: [0, 0, 0] for RGB values.
    const pivotElementEud = new EuclideanDistance(base, pivot)

    // Rearrange components along indices if tracking distances fall short of selected pivot parameters
    for (let j = low; j < array.length; j++) {
      const currentElementEud = new EuclideanDistance(base, array[j])
      if (currentElementEud.value < pivotElementEud.value) {
        i += 1
        ;[array[j], array[i]] = [array[i], array[j]]
      }
    }

    // Swap the pivot element with the element at i + 1.
    ;[array[i + 1], array[high]] = [array[high], array[i + 1]]

    return { pivotIndex: i + 1, newSortedArray: array }
  }
}
