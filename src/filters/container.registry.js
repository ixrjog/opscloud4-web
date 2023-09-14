export function toContainerRegistry (image) {
  if (image === 'Null') {
    return 'Null'
  }
  const index = image.indexOf('/')
  if (index === -1) {
    return ''
  } else {
    return image.substring(0, index)
  }

}

export function toContainerRegistryPath (image) {
  if (image === 'Null') {
    return 'Null'
  }
  const index = image.indexOf('/')
  if (index === -1) {
    return ''
  } else {
    return image.substring(index, 255)
  }
}
