import { request } from '@/api/_service.js'

const baseUrl = '/terminal/session'

export function QUERY_TERMINAL_SESSION_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function QUERY_TERMINAL_SESSION_INSTANCE_COMMAND_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/instance/command/page/query',
    method: 'post',
    data
  })
}

export function CLOSE_TERMINAL_SESSION_BY_ID (id) {
  // 接口请求
  return request({
    url: baseUrl + '/close?id=' + id,
    method: 'put'
  })
}
