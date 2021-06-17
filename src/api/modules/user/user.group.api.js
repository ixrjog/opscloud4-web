import { request } from '@/api/_service.js'

const baseUrl = '/user/group'

export function QUERY_USER_GROUP_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
