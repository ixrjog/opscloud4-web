import { request } from '@/api/_service.js'

const baseUrl = '/leo/template'

export function QUERY_LEO_TEMPLATE_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_LEO_TEMPLATE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_LEO_TEMPLATE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function UPDATE_LEO_TEMPLATE_CONTENT (data) {
  return request({
    url: baseUrl + '/content/update',
    method: 'put',
    data
  })
}

export function UPLOAD_TEMPLATE (param) {
  return request({
    url: baseUrl + '/upload',
    method: 'put',
    params: param
  })
}

export function UPGRADE_LEO_JOB_TEMPLATE (data) {
  return request({
    url: baseUrl + '/job/upgrade',
    method: 'put',
    data
  })
}

export function DELETE_LEO_TEMPLATE_BY_ID (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}
