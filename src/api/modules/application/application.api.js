import { request } from '@/api/_service.js'

const baseUrl = '/application'

export function GET_APP_BUSINESS_OPTIONS () {
  return request({
    url: baseUrl + '/business/options/get',
    method: 'get'
  })
}

export function QUERY_APPLICATION_KUBERNETES_PAGE (data) {
  return request({
    url: baseUrl + '/kubernetes/page/query',
    method: 'post',
    data
  })
}

export function QUERY_APPLICATION_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function GET_APPLICATION_BY_ID (param) {
  return request({
    url: baseUrl + '/get',
    method: 'get',
    params: param
  })
}

export function ADD_APPLICATION (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_APPLICATION (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_APPLICATION (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}

export function BIND_APPLICATION_RES (data) {
  return request({
    url: baseUrl + '/res/bind',
    method: 'put',
    data
  })
}

export function UNBIND_APPLICATION_RES (param) {
  return request({
    url: baseUrl + '/res/unbind',
    method: 'delete',
    params: param
  })
}
