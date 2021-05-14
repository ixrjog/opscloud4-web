import { request } from '@/api/_service.js'

const baseUrl = '/auth/user/role'

export function UPDATE_USER_ROLE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
