/**
 * A class to calculate and store the Euclidean distance between two points in n-dimensional space.
 */
export class EuclideanDistance {
  /**
   * The calculated Euclidean distance between the two points.
   * @type {number}
   */
  value = 0.0

  /**
   * Creates an instance of the EuclideanDistance class and calculates the distance.
   * @param {number[]} point1 - The first point in n-dimensional space.
   * @param {number[]} point2 - The second point in n-dimensional space.
   * @throws Will throw an error if the input points are not arrays or if their dimensions do not match.
   */
  constructor(point1:number[], point2:number[]) {
    this.#calculateEuclideanDistance(point1, point2)
  }

  /**
   * Calculates the Euclidean distance between two points in n-dimensional space.
   * This is a private method and should not be called directly.
   *
   * Formula: sqrt((x2 - x1)^2 + (y2 - y1)^2 + ... + (zn - zn-1)^2)
   *
   * @private
   * @param {number[]} point1 - The first point in n-dimensional space.
   * @param {number[]} point2 - The second point in n-dimensional space.
   * @throws Will throw an error if the input points are not arrays or if their dimensions do not match.
   */
  #calculateEuclideanDistance(point1:number[], point2:number[]) {
    // Validate that both inputs are arrays
    if (!Array.isArray(point1) || !Array.isArray(point2)) {
      throw new Error(
        `Both points should be arrays. Received: Point 1: ${point1}, Point 2: ${point2}`
      )
    }

    // Validate that both arrays have the same length
    if (point1.length !== point2.length) {
      throw new Error(
        `Both arrays should have the same dimensions. Received: Point 1: ${point1}, Point 2: ${point2}`
      )
    }

    // Calculate the difference for each dimension and store in an array
    const differences = point1.map(
      (coordinate, index) => point2[index] - coordinate
    )

    // Use Math.hypot to calculate the Euclidean distance
    this.value = Math.hypot(...differences)
  }
}
