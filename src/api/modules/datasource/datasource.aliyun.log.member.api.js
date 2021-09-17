import { request } from '@/api/_service.js'

const baseUrl = '/datasource/aliyun/log/member'

export function QUERY_LOG_MEMBER_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_LOG_MEMBER (data) {
  // 接口请求
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_LOG_MEMBER (data) {
  // 接口请求
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_LOG_MEMBER_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function PUSH_LOG_MEMBER_BY_ID (id) {
  // 接口请求
  return request({
    url: baseUrl + '/push?id=' + id,
    method: 'put'
  })
}
