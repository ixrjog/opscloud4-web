export function toPhaseType (value) {
  switch (value) {
    case 'NEW':
      return 'info'
    case 'TOAUDIT':
      return 'warning'
    case false:
      return 'warning'
    case 'false':
      return 'success'
    default:
      return 'info'
  }
}

export function toPhaseText (value) {
  switch (value) {
    case 'NEW':
      return '新建'
    case 'TOAUDIT':
      return '审批中'
    default:
      return '未定义'
  }
}
