import { request } from '@/api/_service.js'

const baseUrl = '/workevent'

export function QUERY_WORK_EVENT_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_WORK_EVENT (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_WORK_EVENT (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_WORK_EVENT (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}

export function QUERY_WORK_ITEM_TREE (data) {
  return request({
    url: baseUrl + '/item/tree/query',
    method: 'post',
    data
  })
}

export function QUERY_WORK_ROLE () {
  return request({
    url: baseUrl + '/role/query',
    method: 'get'
  })
}

export function QUERY_WORK_ROLE_BY_ID (param) {
  return request({
    url: baseUrl + '/role/id/query',
    method: 'get',
    params: param
  })
}

export function QUERY_WORK_ITEM (data) {
  return request({
    url: baseUrl + '/item/query',
    method: 'post',
    data
  })
}

export function QUERY_WORK_ITEM_BY_ID (param) {
  return request({
    url: baseUrl + '/item/id/query',
    method: 'get',
    params: param
  })
}
