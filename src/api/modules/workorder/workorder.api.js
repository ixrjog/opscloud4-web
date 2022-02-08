import { request } from '@/api/_service.js'

const baseUrl = '/workorder'

export function GET_WORK_ORDER_VIEW () {
  // 接口请求
  return request({
    url: baseUrl + '/view/get',
    method: 'get'
  })
}

export function QUERY_WORK_ORDER_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function UPDATE_WORK_ORDER (data) {
  return request({
    url: baseUrl + '/update',
    method: 'post',
    data
  })
}
