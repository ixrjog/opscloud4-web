import { request } from '@/api/_service.js'

const baseUrl = '/datasource/aliyun/log'

export function QUERY_LOG_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_LOG (data) {
  // 接口请求
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_LOG (data) {
  // 接口请求
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function PUSH_LOG_BY_ID (id) {
  // 接口请求
  return request({
    url: baseUrl + '/push?id=' + id,
    method: 'put'
  })
}

export function DELETE_LOG_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function QUERY_PROJECT (data) {
  // 接口请求
  return request({
    url: baseUrl + '/project/query',
    method: 'post',
    data
  })
}

export function QUERY_LOGSTORE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/logstore/query',
    method: 'post',
    data
  })
}

export function QUERY_CONFIG (data) {
  // 接口请求
  return request({
    url: baseUrl + '/config/query',
    method: 'post',
    data
  })
}
