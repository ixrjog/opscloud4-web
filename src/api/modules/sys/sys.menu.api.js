import { request } from '@/api/_service.js'

const baseUrl = '/sys/menu'

export function SAVE_MENU (param) {
  return request({
    url: baseUrl + '/save',
    method: 'post',
    data: param
  })
}

export function SAVE_MENU_CHILD (param) {
  return request({
    url: baseUrl + '/child/save',
    method: 'post',
    data: param
  })
}

export function DELETE_MENU (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}

export function DELETE_MENU_CHILD (param) {
  return request({
    url: baseUrl + '/child/del',
    method: 'delete',
    params: param
  })
}

export function QUERY_MENU () {
  return request({
    url: baseUrl + '/query',
    method: 'get'
  })
}

export function QUERY_MENU_CHILD (param) {
  return request({
    url: baseUrl + '/child/query',
    method: 'get',
    params: param
  })
}

export function QUERY_MENU_TREE () {
  return request({
    url: baseUrl + '/tree/query',
    method: 'get'
  })
}

export function SAVE_AUTH_ROLE_MENU (param) {
  return request({
    url: baseUrl + '/role/save',
    method: 'post',
    data: param
  })
}

export function QUERY_AUTH_ROLE_MENU (param) {
  return request({
    url: baseUrl + '/role/query',
    method: 'get',
    params: param
  })
}

export function QUERY_AUTH_ROLE_MENU_DETAIL (param) {
  return request({
    url: baseUrl + '/role/detail/query',
    method: 'get',
    params: param
  })
}
