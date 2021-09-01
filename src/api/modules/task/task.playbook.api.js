import { request } from '@/api/_service.js'

const baseUrl = '/task/ansible'


export function QUERY_ANSIBLE_PLAYBOOK_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/playbook/page/query',
    method: 'post',
    data
  })
}

export function ADD_ANSIBLE_PLAYBOOK (data) {
  return request({
    url: baseUrl + '/playbook/add',
    method: 'post',
    data
  })
}

export function UPDATE_ANSIBLE_PLAYBOOK (data) {
  return request({
    url: baseUrl + '/playbook/update',
    method: 'put',
    data
  })
}

export function DELETE_ANSIBLE_PLAYBOOK_BY_ID (id) {
  return request({
    url: baseUrl + '/playbook/del?id=' + id,
    method: 'delete'
  })
}
