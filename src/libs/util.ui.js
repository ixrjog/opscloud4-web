import util from '@/libs/util.js'
import store from '@/store/index'
// import menuAside from '@/menu/aside'

import { GET_USER_UI_INFO } from '@/api/modules/user/user.ui.api.js'
import { uniqueId } from 'lodash'

const ui = {}

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

/**
 * 20231107 fix i18n
 */
ui.init = function () {
  const i18n = util.cookies.get('lang')
  if (i18n === undefined) return
  const token = util.cookies.get('token')
  if (token === undefined) return // 未登录
  GET_USER_UI_INFO()
    .then(res => {
      const ui = res.body
      if (i18n === 'zh-chs') {
        store.commit('d2admin/menu/asideSet', supplementPath(ui.menuInfo))
        return
      }
      // default en
      for (const menu of ui.menuInfo) {
        menu.title = menu.i18nEn
        for (const subMenu of menu.children) {
          subMenu.title = subMenu.i18nEn
        }
      }
      store.commit('d2admin/menu/asideSet', supplementPath(ui.menuInfo))
    })
}

export default ui
