export function getServerStatusType (value) {
  switch (value) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case -1:
      return 'warning'
    default:
      return 'danger'
  }
}

export function getServerStatusText (value) {
  switch (value) {
    case 0:
      return '离线'
    case 1:
      return '在线'
    case -1:
      return '不确定'
    default:
      return '未定义'
  }
}
