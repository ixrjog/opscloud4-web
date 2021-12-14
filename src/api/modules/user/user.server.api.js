import { request } from '@/api/_service.js'

const baseUrl = '/user/server'

export function QUERY_USER_SERVER_TREE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/tree/query',
    method: 'post',
    data
  })
}

export function QUERY_USER_REMOTE_SERVER (data) {
  // 接口请求
  return request({
    url: baseUrl + '/remote/query',
    method: 'post',
    data
  })
}
