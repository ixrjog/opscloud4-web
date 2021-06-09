import { request } from '@/api/_service.js'

const baseUrl = '/user/credential'

export function SAVE_USER_CREDENTIAL (data) {
  // 接口请求
  return request({
    url: baseUrl + '/save',
    method: 'post',
    data
  })
}
