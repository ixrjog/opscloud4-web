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
tools.randomWord = function (length) {
  const s = []
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '@', '!', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '+', '-',
    '[', ']', '|', ':', ';', ',', '.', '<', '>', '?']
  const numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const upperArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  const lowerArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const syblArr = ['@', '!', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '+', '-',
    '[', ']', '|', ':', ';', ',', '.', '<', '>', '?']
  s[0] = this.getChar(upperArr, 1)
  s[1] = this.getChar(lowerArr, 1)
  s[2] = this.getChar(numArr, 1)
  s[3] = this.getChar(syblArr, 1)
  return s.join('') + this.getChar(arr, length - 4)
}

/**
 * 取随机长度，1 ～ maxLength
 * @param arr
 * @param max
 */
tools.getChar = function (arr, max) {
  let str = ''
  for (let i = 0; i < max; i++) {
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
  return s.join('')
}

/**
 * Terminal Tools
 * 返回UUID
 * @returns {string}
 */
tools.instanceId = function (id) {
  return id.split('#')[0] + '#' + this.uuid()
}

/**
 * 时间格式yyyy-MM-dd
 * @param date
 */
tools.dateFormatter = function (date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const strDate = date.getDate().toString().padStart(2, '0')
  return `${date.getFullYear()}-${month}-${strDate}`
}

tools.i18nAgo = function (ago) {
  return ago.replace('秒前', ' seconds ago')
    .replace('分钟前', ' minutes ago')
    .replace('小时前', ' hours ago')
    .replace('天前', ' days ago')
    .replace('月前', ' month ago')
    .replace('年前', ' year ago')
}

export default tools
