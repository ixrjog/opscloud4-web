import { request } from '@/api/_service.js'

const baseUrl = '/user'

export function GET_USER_DETAILS () {
  // 接口请求
  return request({
    url: baseUrl + '/details/get',
    method: 'get'
  })
}

export function GET_USER_DETAILS_BY_USERNAME (parameter) {
  // 接口请求
  return request({
    url: baseUrl + '/details/username/get',
    method: 'get',
    params: parameter
  })
}
