import { request } from '@/api/_service.js'

const baseUrl = '/user/mfa'

export function GET_USER_MFA () {
  return request({
    url: baseUrl + '/get',
    method: 'get'
  })
}


export function RESET_USER_MFA () {
  return request({
    url: baseUrl + '/reset',
    method: 'get'
  })
}
