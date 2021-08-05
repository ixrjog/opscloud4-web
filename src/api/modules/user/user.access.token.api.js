import { request } from '@/api/_service.js'

const baseUrl = '/user/access/token'

export function GRANT_ACCESS_TOKEN (data) {
  // 接口请求
  return request({
    url: baseUrl + '/grant',
    method: 'post',
    data
  })
}

export function REVOKE_ACCESS_TOKEN (data) {
  return request({
    url: baseUrl + '/revoke',
    method: 'put',
    params: data
  })
}
