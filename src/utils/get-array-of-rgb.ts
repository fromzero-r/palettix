export function getArrayOfRGB(data: number[]) {
  const array = []
  let skip

  switch (true) {
    case data.length > 500_000:
      skip = 15
      break
    case data.length > 300_000:
      skip = 12
      break
    case data.length > 200_000:
      skip = 9
      break
    case data.length > 100_000:
      skip = 6
      break
    default:
      skip = 3
      break
  }

  for (let i = 0; i < data.length; i += 4 * skip) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2]
    array.push([r, g, b])
  }

  return array
}
