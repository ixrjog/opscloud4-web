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

export function toPodClass (podRestartCount) {
  if (parseInt(podRestartCount) === 0) {
    return 'podNormal'
  } else {
    return 'podFault'
  }
}

export function toZoneClass (zone) {
  const z = zone.slice(-1)
  if (z === 'a' || z === 'b' || z === 'c') {
    return 'zone-' + z
  } else {
    return 'zone-unknown'
  }
}

export function toZoneShort (zone) {
  return  zone.slice(-2)
}

export function toDeploymentVersionClass (version) {
  switch (version.versionType) {
    case 'BLUE':
      return 'versionBlue'
    case 'GREEN':
      return 'versionGreen'
    case 'OTHER':
      return 'versionOther'
    case 'OFFLINE':
      return 'versionOffline'
    default:
      return 'versionOther'
  }
}
