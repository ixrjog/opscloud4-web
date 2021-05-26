import { request } from '@/api/_service.js'

const baseUrl = '/sys/env'

export function QUERY_ENV_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_ENV (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_ENV (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_ENV_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
