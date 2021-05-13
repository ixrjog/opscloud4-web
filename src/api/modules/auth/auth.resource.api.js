import { request } from '@/api/_service.js'

const baseUrl = '/auth/resource'

export function QUERY_RESOURCE_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_RESOURCE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_RESOURCE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_RESOURCE_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
