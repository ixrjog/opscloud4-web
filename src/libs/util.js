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
 * 取反色，用于终端字符提示前端展示
 * @param color
 * @returns {string}
 */
util.colorReverse = function (color) {
  const reversedColor = '0x' + color.replace(/#/g, '')
  const str = '000000' + (0xFFFFFF - reversedColor).toString(16)
  return '#' + str.substring(str.length - 6, str.length)
}

export default util
