import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import ui from './util.ui'

const util = {
  cookies,
  db,
  log,
  ui
}

/**
 * 返回UUID
 * @returns {string}
 */
util.uuid = function () {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substring((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  const uuid = s.join('')
  return uuid
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * 返回ws
 * @returns {string}
 */
util.wsUrl = function (wsUrl) {
  if (process.env.NODE_ENV === 'development') {
    return process.env.VUE_APP_WS_API + wsUrl
  } else {
    const host = window.location.host
    const httpProtocol = window.location.href.split('://')[0]
    return (httpProtocol === 'http' ? 'ws' : 'wss') + '://' + host + process.env.VUE_APP_WS_API + wsUrl
  }
}

util.bytesToSize = function (bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024 // or 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

/**
 * 格式化秒
 * @param result
 * @returns {string}
 */
util.formatSecond = function (result) {
  const d = Math.floor((result / 3600) / 24)
  const h = Math.floor((result / 3600) % 24)
  const m = Math.floor((result / 60) % 60)
  const s = Math.floor(result % 60)
  result = ''
  if (s > 0) {
    result = s + ' 秒 '
  }
  if (m > 0) {
    result = m + ' 分钟 ' + result
  }
  if (h > 0) {
    result = h + ' 小时 ' + result
  }
  if (d > 0) {
    result = d + ' 天 ' + result
  }
  return result === '' ? '0秒' : result
}

/**
 * 取反色，用于终端字符提示前端展示
 * @param color
 * @returns {string}
 */
util.colorReverse = function (color) {
  const reversedColor = '0x' + color.replace(/#/g, '')
  const str = '000000' + (0xFFFFFF - reversedColor).toString(16)
  return '#' + str.substring(str.length - 6, str.length)
}

util.version = function () {
  return process.env.PROJECT_VERSION
}

export default util
