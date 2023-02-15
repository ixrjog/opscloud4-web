import { request } from '@/api/_service.js'

const baseUrl = '/sys/doc'

export function PREVIEW_DOCUMENT (data) {
  return request({
    url: baseUrl + '/preview',
    method: 'post',
    data
  })
}


export function GET_DOCUMENT_ZONE (data) {
  return request({
    url: baseUrl + '/zone/get',
    method: 'post',
    data
  })
}

export function QUERY_DOCUMENT_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function QUERY_DOCUMENT_ZONE_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/zone/page/query',
    method: 'post',
    data
  })
}

export function UPDATE_DOCUMENT_ZONE (data) {
  return request({
    url: baseUrl + '/zone/update',
    method: 'put',
    data
  })
}

export function UPDATE_DOCUMENT (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function ADD_DOCUMENT (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function DELETE_DOCUMENT_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
