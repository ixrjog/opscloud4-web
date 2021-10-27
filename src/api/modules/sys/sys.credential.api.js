import { request } from '@/api/_service.js'

const baseUrl = '/sys/credential'

export function GET_CREDENTIAL_KIND_OPTIONS () {
  // 接口请求
  return request({
    url: baseUrl + '/kind/options/get',
    method: 'get'
  })
}

export function QUERY_CREDENTIAL_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_CREDENTIAL (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_CREDENTIAL (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_CREDENTIAL_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
