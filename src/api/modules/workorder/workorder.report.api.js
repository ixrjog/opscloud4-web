import { request } from '@/api/_service.js'

const baseUrl = '/workorder/report'

export function QUERY_WORK_ORDER_REPORT_BY_NAME () {
  return request({
    url: baseUrl + '/name',
    method: 'get'
  })
}

export function QUERY_WORK_ORDER_REPORT_BY_MONTH () {
  return request({
    url: baseUrl + '/month',
    method: 'get'
  })
}
