export function getWhetherType (value) {
  switch (value) {
    case true:
      return 'success'
    case 'true':
      return 'success'
    case false:
      return 'warning'
    case 'false':
      return 'warning'
    default:
      return 'info'
  }
}

export function getWhetherText (value) {
  switch (value) {
    case true:
      return '是'
    case false:
      return '否'
    case 'true':
      return '是'
    case 'false':
      return '否'
    default:
      return '未定义'
  }
}
