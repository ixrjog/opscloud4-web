import { request } from '@/api/_service.js'

const baseUrl = '/leo/deploy'

export function DO_DEPLOY (data) {
  return request({
    url: baseUrl + '/do',
    method: 'post',
    data
  })
}

export function QUERY_LEO_DEPLOY_VERSION (data) {
  return request({
    url: baseUrl + '/version/query',
    method: 'post',
    data
  })
}

export function QUERY_LEO_DEPLOY_DEPLOYMENT (data) {
  return request({
    url: baseUrl + '/deployment/query',
    method: 'post',
    data
  })
}

export function STOP_DEPLOY (param) {
  return request({
    url: baseUrl + '/stop',
    method: 'put',
    params: param
  })
}

export function CLONE_DEPLOY_DEPLOYMENT (data) {
  return request({
    url: baseUrl + '/deployment/clone',
    method: 'post',
    data
  })
}
