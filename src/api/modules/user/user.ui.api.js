import { request } from '@/api/_service.js'

const baseUrl = '/user/ui'

export function GET_USER_UI_INFO () {
  // 接口请求
  return request({
    url: baseUrl + '/info/get',
    method: 'get'
  })
}
