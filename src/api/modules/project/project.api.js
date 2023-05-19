import { request } from '@/api/_service.js'

const baseUrl = '/project'

export function GET_PROJECT_BUSINESS_OPTIONS () {
  return request({
    url: baseUrl + '/business/options/get',
    method: 'get'
  })
}

export function QUERY_PROJECT_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function QUERY_RES_PROJECT_PAGE (data) {
  return request({
    url: baseUrl + '/res/page/query',
    method: 'post',
    data
  })
}

export function GET_PROJECT_BY_ID (param) {
  return request({
    url: baseUrl + '/get',
    method: 'get',
    params: param
  })
}

export function ADD_PROJECT (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_PROJECT (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_PROJECT (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}

export function PREVIEW_PROJECT_RES_PAGE (data) {
  return request({
    url: baseUrl + '/res/preview/page/query',
    method: 'post',
    data
  })
}

export function BIND_PROJECT_RES (data) {
  return request({
    url: baseUrl + '/res/bind',
    method: 'put',
    data
  })
}

export function UNBIND_PROJECT_RES (param) {
  return request({
    url: baseUrl + '/res/unbind',
    method: 'delete',
    params: param
  })
}
