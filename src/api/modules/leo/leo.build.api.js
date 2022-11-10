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

