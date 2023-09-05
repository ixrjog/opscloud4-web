export function toPermissionRoleType (value) {
  switch (value) {
    case 'dev':
      return 'success'
    case 'qa':
      return 'warning'
    case 'admin':
      return 'danger'
    default:
      return 'info'
  }
}

export function toPermissionRoleClass (value) {
  switch (value) {
    case 'dev':
      return 'develop'
    case 'qa':
      return 'qualityAssurance'
    case 'admin':
      return 'admin'
    default:
      return 'user'
  }
}

export function toPermissionRoleText (value) {
  switch (value) {
    case 'dev':
      return '研发'
    case 'qa':
      return '质量保障'
    case 'admin':
      return '管理员'
    default:
      return '普通用户'
  }
}
