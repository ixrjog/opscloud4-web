import { request } from '@/api/_service.js'

const baseUrl = '/workorder/ticket'

export function CREATE_WORK_ORDER_TICKET (data) {
  return request({
    url: baseUrl + '/create',
    method: 'post',
    data
  })
}

export function QUERY_WORK_ORDER_TICKET_ENTRY (data) {
  return request({
    url: baseUrl + '/entry/query',
    method: 'post',
    data
  })
}
