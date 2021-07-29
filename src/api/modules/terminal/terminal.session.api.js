import { request } from '@/api/_service.js'

const baseUrl = '/terminal/session'

export function QUERY_TERMINAL_SESSION_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
