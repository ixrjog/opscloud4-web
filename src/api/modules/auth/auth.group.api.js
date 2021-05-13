import { request } from '@/api/_service.js'

const baseUrl = '/auth/group'

export function QUERY_GROUP_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function DELETE_GROUP_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function ADD_GROUP (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_GROUP (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
