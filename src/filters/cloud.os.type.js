export function getAWSOsTypeText (osType) {
  switch (osType) {
    case 'Linux/UNIX':
      return 'Linux'
    case 'Red Hat Enterprise Linux':
      return 'Linux'
    case 'Windows':
      return 'Windows'
    case 'Windows with SQL Server Standard':
      return 'Windosw'
    default:
      return osType
  }
}

export function getAliyunOsTypeText (osType) {
  switch (osType) {
    case 'linux':
      return 'Linux'
    case 'windows':
      return 'Windows'
    default:
      return osType
  }
}
