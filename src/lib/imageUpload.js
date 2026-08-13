function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unable to read the selected image.'))
    }

    img.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to optimize image for upload.'))
        return
      }
      resolve(blob)
    }, type, quality)
  })
}

function getScaledDimensions(width, height, maxEdge) {
  const longest = Math.max(width, height)
  if (longest <= maxEdge) return { width, height }

  const scale = maxEdge / longest
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`
}

export async function optimizeImageForUpload(file, options = {}) {
  const {
    maxEdge = 1800,
    targetBytes = 900 * 1024,
    minQuality = 0.72,
    startQuality = 0.9,
    qualityStep = 0.06,
    skipBelowBytes = 350 * 1024,
  } = options

  if (!(file instanceof File)) {
    throw new Error('No image file selected.')
  }

  const isImage = file.type?.toLowerCase().startsWith('image/')
  if (!isImage) {
    throw new Error('Only image files can be uploaded.')
  }

  if (file.size <= skipBelowBytes) {
    return { file, changed: false }
  }

  const image = await readImage(file)
  const dimensions = getScaledDimensions(image.width, image.height, maxEdge)
  const canvas = document.createElement('canvas')
  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) {
    return { file, changed: false }
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height)

  const outputType = 'image/webp'
  let quality = startQuality
  let bestBlob = await canvasToBlob(canvas, outputType, quality)

  while (bestBlob.size > targetBytes && quality > minQuality) {
    quality = Math.max(minQuality, quality - qualityStep)
    bestBlob = await canvasToBlob(canvas, outputType, quality)
    if (quality === minQuality) break
  }

  if (bestBlob.size >= file.size) {
    return { file, changed: false }
  }

  const extension = outputType === 'image/webp' ? 'webp' : 'jpg'
  const nameWithoutExt = (file.name || 'upload').replace(/\.[^.]+$/, '')
  const optimizedName = `${nameWithoutExt}.${extension}`

  const optimizedFile = new File([bestBlob], optimizedName, {
    type: outputType,
    lastModified: Date.now(),
  })

  return {
    file: optimizedFile,
    changed: true,
    originalBytes: file.size,
    optimizedBytes: optimizedFile.size,
  }
}
