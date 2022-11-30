export function getBuildResultType (value) {
  switch (value) {
    case 'FAILURE':
      return 'danger'
    case 'UNSTABLE':
      return 'warning'
    case 'REBUILDING':
      return 'warning'
    case 'BUILDING':
      return 'warning'
    case 'ABORTED':
      return 'warning'
    case 'SUCCESS':
      return 'success'
    case 'UNKNOWN':
      return 'warning'
    case 'NOT_BUILT':
      return 'warning'
    case 'CANCELLED':
      return 'danger'
    default:
      return 'info'
  }
}

export function getBuildResultColor (value) {
  switch (value) {
    case 'FAILURE':
      return '#f85d63'
    case 'UNSTABLE':
      return '#e56c0d'
    case 'REBUILDING':
      return '#0cb3cb'
    case 'BUILDING':
      return '#0cb3cb'
    case 'ABORTED':
      return '#e56c0d'
    case 'SUCCESS':
      return '#0ad97c'
    case 'UNKNOWN':
      return '#e56c0d'
    case 'NOT_BUILT':
      return '#a9a7a4'
    case 'CANCELLED':
      return '#a9a7a4'
    default:
      return '#a9a7a4'
  }
}

export function getBuildResultText (value) {
  switch (value) {
    case 'FAILURE':
      return '失败'
    case 'UNSTABLE':
      return '不稳定'
    case 'REBUILDING':
      return '重建'
    case 'BUILDING':
      return '构建中'
    case 'ABORTED':
      return '用户中止'
    case 'SUCCESS':
      return '成功'
    case 'UNKNOWN':
      return '未知'
    case 'NOT_BUILT':
      return '不是你的'
    case 'CANCELLED':
      return '取消'
    default:
      return '执行中'
  }
}
