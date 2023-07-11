import { request } from '@/api/_service.js'

const baseUrl = '/leo/job'

export function QUERY_LEO_JOB_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function QUERY_MY_LEO_JOB_PAGE (data) {
  return request({
    url: baseUrl + '/my/page/query',
    method: 'post',
    data
  })
}

export function QUERY_LEO_JOB_BUILD_PAGE (data) {
  return request({
    url: baseUrl + '/build/page/query',
    method: 'post',
    data
  })
}

export function QUERY_MY_LEO_JOB_BUILD_PAGE (data) {
  return request({
    url: baseUrl + '/my/build/page/query',
    method: 'post',
    data
  })
}

export function QUERY_LEO_JOB_DEPLOY_PAGE (data) {
  return request({
    url: baseUrl + '/deploy/page/query',
    method: 'post',
    data
  })
}

export function QUERY_MY_LEO_JOB_DEPLOY_PAGE (data) {
  return request({
    url: baseUrl + '/my/deploy/page/query',
    method: 'post',
    data
  })
}

export function QUERY_MY_LEO_JOB_DEPLOYMENT_VERSION_DETAILS (data) {
  return request({
    url: baseUrl + '/my/deployment/version/details/query',
    method: 'post',
    data
  })
}

export function ADD_LEO_JOB (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_LEO_JOB (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function UPGRADE_LEO_JOB_TEMPLATE_CONTENT (param) {
  return request({
    url: baseUrl + '/template/content/upgrade',
    method: 'put',
    params: param
  })
}

export function DELETE_LEO_JOB_BY_ID (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}

export function CREATE_CR_REPOSITORY_WITH_LEO_JOB_ID (param) {
  return request({
    url: baseUrl + '/cr/repository/create',
    method: 'put',
    params: param
  })
}

export function CLONE_LEO_JOB (data) {
  return request({
    url: baseUrl + '/clone',
    method: 'post',
    data
  })
}

export function CLONE_LEO_ONE_JOB (data) {
  return request({
    url: baseUrl + '/one/clone',
    method: 'post',
    data
  })
}
