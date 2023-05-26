export function getProjectStatusText (value) {
  switch (value) {
    case 'PENDING':
      return '未开始'
    case 'PROGRESS':
      return '进行中'
    case 'PAUSE':
      return '暂停'
    case 'CANCEL':
      return '取消'
    case 'DELIVERED':
      return '已发布'
    default:
      return '未定义'
  }
}

export function getProjectStatusStyle (value) {
  let color
  switch (value) {
    case 'PENDING':
      color = '#f85d63'
      break
    case 'PROGRESS':
      color = '#079d58'
      break
    case 'PAUSE':
      color = '#ee893c'
      break
    case 'CANCEL':
      color = '#a9a7a4'
      break
    case 'DELIVERED':
      color = '#179bb9'
      break
    default:
      color = '#a9a7a4'
  }
  return 'color: ' + color
}

export function getProjectTypeText (value) {
  switch (value) {
    case 'DAILY':
      return '日常'
    case 'PROJECT':
      return '项目'
    case 'URGENT':
      return '紧急'
    default:
      return '未定义'
  }
}

export function getProjectTypeStyle (value) {
  let color
  switch (value) {
    case 'PROJECT':
      color = '#0cb3cb'
      break
    case 'DAILY':
      color = '#0ad97c'
      break
    case 'URGENT':
      color = '#e56c0d'
      break
    default:
      color = '#a9a7a4'
  }
  return 'color: ' + color
}

export function getProjectResAssetText (value) {
  switch (value) {
    case 'ALIYUN_DEVOPS_SPRINT':
      return '迭代'
    case 'ALIYUN_DEVOPS_WORKITEM':
      return '需求'
    default:
      return value
  }
}
