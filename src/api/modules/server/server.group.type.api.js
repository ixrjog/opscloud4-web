import { request } from '@/api/_service.js'

const baseUrl = '/server/group/type'

export function QUERY_SERVER_GROUP_TYPE_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function DELETE_SERVER_GROUP_TYPE_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function ADD_SERVER_GROUP_TYPE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_SERVER_GROUP_TYPE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
