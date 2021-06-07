
import util from '@/libs/util.js'
import store from '@/store/index'
// import menuAside from '@/menu/aside'

import { GET_USER_UI_INFO } from '@/api/modules/user/user.ui.api.js'

const ui = {}

ui.init = function () {
  debugger
  GET_USER_UI_INFO()
    .then(res => {
      const ui = res.body
      store.commit('d2admin/menu/asideSet', ui.menuInfo)

    })
}

export default ui
