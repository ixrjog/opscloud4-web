import { request } from '@/api/_service.js'

const baseUrl = '/auth/group'

export function QUERY_GROUP_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
