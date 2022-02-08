import { request } from '@/api/_service.js'

const baseUrl = '/user/ram'

// export function GET_USER_RAM (username) {
//   return request({
//     url: baseUrl + '/get?username=' + username,
//     method: 'get'
//   })
// }

export function CREATE_RAM_USER (data) {
  return request({
    url: baseUrl + '/user/create',
    method: 'post',
    data
  })
}

/**
 * 授权用户RAM策略
 * @param data
 * @returns {*}
 * @constructor
 */
export function GRANT_RAM_POLICY (data) {
  return request({
    url: baseUrl + '/policy/grant',
    method: 'post',
    data
  })
}

/*
 * 撤销用户RAM策略
 * @param data
 * @returns {*}
 * @constructor
 */
export function REVOKE_RAM_POLICY (data) {
  return request({
    url: baseUrl + '/policy/revoke',
    method: 'put',
    data
  })
}
