import { request } from '@/api/_service.js'

const baseUrl = '/workorder/group'

export function QUERY_WORK_ORDER_GROUP_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
