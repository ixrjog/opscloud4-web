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

export function ADD_TEMPLATE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_TEMPLATE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'post',
    data
  })
}

export function DELETE_TEMPLATE_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
