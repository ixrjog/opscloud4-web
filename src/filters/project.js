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
