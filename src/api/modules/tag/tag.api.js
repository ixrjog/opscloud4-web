import { request } from '@/api/_service.js'

const baseUrl = '/tag'

export function GET_TAG_BUSINESS_OPTIONS () {
  // 接口请求
  return request({
    url: baseUrl + '/business/options/get',
    method: 'get'
  })
}

export function GET_TAG_BY_BUSINESS_TYPE (parameter) {
  // 接口请求
  return request({
    url: baseUrl + '/business/type/get',
    method: 'get',
    params: parameter
  })
}

export function UPDATE_BUSINESS_TAGS (data) {
  return request({
    url: baseUrl + '/business/update',
    method: 'put',
    data
  })
}

export function QUERY_TAG_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_TAG (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_TAG (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
