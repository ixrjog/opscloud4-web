import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'

const tools = {
  cookies,
  db,
  log
}

tools.arrayEquals = function (arr1, arr2) {
  if (!arr1 || !arr2) return false

  if (arr1.length !== arr2.length) return false

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      if (!arr1[i].equals(arr2[i])) {
        return false
      }
    } else if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

export default tools
