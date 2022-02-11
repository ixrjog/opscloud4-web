import { request } from '@/api/_service.js'

const baseUrl = '/user/am'

export function GET_AM (param) {
  return request({
    url: baseUrl + '/get',
    method: 'get',
    params: param
  })
}

export function CREATE_AM_USER (data) {
  return request({
    url: baseUrl + '/user/create',
    method: 'post',
    data
  })
}

/**
 * 授权用户AM策略
 * @param data
 * @returns {*}
 * @constructor
 */
export function GRANT_AM_POLICY (data) {
  return request({
    url: baseUrl + '/policy/grant',
    method: 'post',
    data
  })
}

/*
 * 撤销用户AM策略
 * @param data
 * @returns {*}
 * @constructor
 */
export function REVOKE_AM_POLICY (data) {
  return request({
    url: baseUrl + '/policy/revoke',
    method: 'put',
    data
  })
}
