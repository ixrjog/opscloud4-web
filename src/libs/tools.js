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

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag 是否任意长度 min 任意长度最小位[固定位数] max 任意长度最大位
*/
tools.randomWord = function (randomFlag, min, max) {
  let str = ''
  let range = min
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '@', '!', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '+', '-',
    '[', ']', '|', ':', ';', ',', '.', '<', '>', '?']

  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min// 任意长度
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

/**
 * 返回UUID
 * @returns {string}
 */
tools.uuid = function () {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  const uuid = s.join('')
  return uuid
}

/**
 * Terminal Tools
 * 返回UUID
 * @returns {string}
 */
tools.instanceId = function (id) {
  return id.split('#')[0] + '#' + this.uuid()
}

export default tools
