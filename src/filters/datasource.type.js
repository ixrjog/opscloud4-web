export function getDatasourceTypeText (value) {
  switch (value) {
    case 1:
      return 'LDAP'
    default:
      return '未定义'
  }
}
