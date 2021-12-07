import { request } from '@/api/_service.js'

const baseUrl = '/template'

export function QUERY_TEMPLATE_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
