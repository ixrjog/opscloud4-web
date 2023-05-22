import { request } from '@/api/_service.js'

const baseUrl = '/kubernetes'

export function GET_KUBERNETES_DEPLOYMENT (param) {
  return request({
    url: baseUrl + '/terminal/deployment/get',
    method: 'get',
    params: param
  })
}
