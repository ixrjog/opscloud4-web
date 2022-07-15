export function toPhaseType (pod) {
  if (pod.properties.reason !== undefined && pod.properties.reason === 'Evicted') {
    return 'info'
  }
  return pod.properties.status === 'true' && pod.properties.phase === 'Running' ? 'success' : 'warning'
}
