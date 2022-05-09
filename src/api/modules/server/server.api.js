import { request } from '@/api/_service.js'

const baseUrl = '/server'

export function GET_SERVER_PROTOCOL_OPTIONS () {
  return request({
    url: baseUrl + '/protocol/options/get',
    method: 'get'
  })
}

export function QUERY_SERVER_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function DELETE_SERVER_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function ADD_SERVER (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_SERVER (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function SCAN_SERVER_MONITOR () {
  return request({
    url: baseUrl + '/monitor/scan',
    method: 'put'
  })
}
