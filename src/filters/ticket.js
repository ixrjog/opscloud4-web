export function toPhaseType (value) {
  switch (value) {
    case 'NEW':
    case 'CLOSED':
      return 'info'
    case 'TOAUDIT':
      return 'warning'
    case 'REJECT':
    case 'FAILED':
      return 'danger'
    case 'PROCESSING':
    case 'SUCCESS':
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
    case 'REJECT':
      return '审批拒绝'
    case 'PROCESSING':
      return '执行中'
    case 'SUCCESS':
      return '执行成功'
    case 'FAILED':
      return '执行失败'
    case 'CLOSED':
      return '关闭'
    default:
      return '未定义'
  }
}
