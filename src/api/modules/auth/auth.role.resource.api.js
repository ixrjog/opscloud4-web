import { request } from '@/api/_service.js'

const baseUrl = '/auth/role/resource'

export function QUERY_ROLE_RESOURCE_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function QUERY_BIND_ROLE_RESOURCE_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/bind/page/query',
    method: 'post',
    data
  })
}

export function ADD_ROLE_RESOURCE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function DELETE_ROLE_RESOURCE_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
