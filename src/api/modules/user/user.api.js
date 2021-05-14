import { request } from '@/api/_service.js'

const baseUrl = '/user'

export function QUERY_USER_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
