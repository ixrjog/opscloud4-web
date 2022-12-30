import { request } from '@/api/_service.js'

const baseUrl = '/leo/build'

export function DO_BUILD (data) {
  return request({
    url: baseUrl + '/do',
    method: 'post',
    data
  })
}

export function GET_BUILD_BRANCH_OPTIONS (data) {
  return request({
    url: baseUrl + '/branch/options/get',
    method: 'post',
    data
  })
}

export function CREATE_BUILD_BRANCH (data) {
  return request({
    url: baseUrl + '/branch/create',
    method: 'post',
    data
  })
}

export function STOP_BUILD (param) {
  return request({
    url: baseUrl + '/stop',
    method: 'put',
    params: param
  })
}

export function UPDATE_LEO_BUILD (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
