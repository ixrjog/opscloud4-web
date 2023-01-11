export function toPhaseType (pod) {
  if (pod.properties.reason !== undefined && pod.properties.reason === 'Evicted') {
    return 'info'
  }
  return pod.properties.status === 'true' && pod.properties.phase === 'Running' ? 'success' : 'warning'
}

export function toPodPhaseType (pod) {
  // 终止中
  if (pod.terminating) return 'warning'
  if (pod.reason !== null && pod.reason === 'Evicted') {
    return 'info'
  }
  return pod.isComplete && pod.phase === 'Running' ? 'success' : 'warning'
}
