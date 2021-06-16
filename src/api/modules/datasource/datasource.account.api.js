import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance/account'

export function QUERY_ACCOUNT_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function PULL_ACCOUNT (param) {
  // 接口请求
  return request({
    url: baseUrl + '/pull',
    method: 'get',
    params: param
  })
}

export function QUERY_ACCOUNT_GROUP_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/group/page/query',
    method: 'post',
    data
  })
}

export function PULL_ACCOUNT_GROUP (param) {
  // 接口请求
  return request({
    url: baseUrl + '/group/pull',
    method: 'get',
    params: param
  })
}
