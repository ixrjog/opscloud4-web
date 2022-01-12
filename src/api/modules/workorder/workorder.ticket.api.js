import { request } from '@/api/_service.js'

const baseUrl = '/workorder/ticket'

export function QUERY_WORK_ORDER_TICKET_ENTRY (data) {
  // 接口请求
  return request({
    url: baseUrl + '/entry/query',
    method: 'post',
    data
  })
}
