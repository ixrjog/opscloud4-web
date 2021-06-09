import { request } from '@/api/_service.js'

const baseUrl = '/user'

export function GET_USER_DETAILS () {
  // 接口请求
  return request({
    url: baseUrl + '/details/get',
    method: 'get'
  })
}
