import { request } from '@/api/_service.js'

const baseUrl = '/server/account'

export function QUERY_SERVER_ACCOUNT_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function DELETE_SERVER_ACCOUNT_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function ADD_SERVER_ACCOUNT (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_SERVER_ACCOUNT (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function UPDATE_SERVER_ACCOUNT_PERMISSION (data) {
  return request({
    url: baseUrl + '/permission/update',
    method: 'put',
    data
  })
}
