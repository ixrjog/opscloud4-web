export function getSessionTypeText (value) {
  switch (value) {
    case 'WEB_TERMINAL':
      return '批量终端'
    case 'KUBERNETES_TERMINAL':
      return '容器终端'
    case 'SSH_SERVER':
      return 'SSH服务器'
    default:
      return '未定义'
  }
}
