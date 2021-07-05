export function getProblemSeverityText (value) {
  switch (value) {
    case '0':
      return '未定义'
    case '1':
      return '信息'
    case '2':
      return '警告'
    case '3':
      return '一般严重'
    case '4':
      return '严重'
    case '5':
      return '灾难'
    default:
      return ''
  }
}
