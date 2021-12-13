import { request } from '@/api/_service.js'

const baseUrl = '/user'

export function QUERY_USER_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_USER (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_USER (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function SET_USER_ACTIVE (data) {
  return request({
    url: baseUrl + '/active/set',
    method: 'put',
    params: data
  })
}

export function DELETE_USER_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function REVOKE_USER_BUSINESS_PERMISSION (data) {
  return request({
    url: baseUrl + '/business/permission/revoke',
    method: 'put',
    data
  })
}

export function GRANT_USER_BUSINESS_PERMISSION (data) {
  return request({
    url: baseUrl + '/business/permission/grant',
    method: 'post',
    data
  })
}

export function SET_USER_BUSINESS_PERMISSION (data) {
  return request({
    url: baseUrl + '/business/permission/set',
    method: 'put',
    params: data
  })
}

// 分页查询用户授权业务对象列表
export function QUERY_USER_BUSINESS_PERMISSION (data) {
  return request({
    url: baseUrl + '/business/permission/query',
    method: 'post',
    data
  })
}

export function QUERY_BUSINESS_PERMISSION_USER (data) {
  return request({
    url: baseUrl + '/permission/business/query',
    method: 'post',
    data
  })
}

export function SYNC_USER () {
  return request({
    url: baseUrl + '/sync',
    method: 'put'
  })
}

export function GET_USER_RAM (username) {
  return request({
    url: baseUrl + '/ram/get?username=' + username,
    method: 'get'
  })
}

export function CREATE_RAM_USER (data) {
  return request({
    url: baseUrl + '/ram/user/create',
    method: 'post',
    data
  })
}
