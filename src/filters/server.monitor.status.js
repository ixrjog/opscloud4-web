export function getServerMonitorStatusType (value) {
  switch (value) {
    case 0:
      return 'success'
    case 1:
      return 'danger'
    case -1:
      return 'info'
    default:
      return 'danger'
  }
}

export function getServerMonitorStatusText (value) {
  switch (value) {
    case 0:
      return '启用'
    case 1:
      return '禁用'
    case -1:
      return 'N'
    default:
      return '未定义'
  }
}
