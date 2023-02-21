import { request } from '@/api/_service.js'

const baseUrl = '/workorder/ticket'

export function QUERY_WORK_ORDER_TICKET_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function QUERY_MY_WORK_ORDER_TICKET_PAGE (data) {
  return request({
    url: baseUrl + '/my/page/query',
    method: 'post',
    data
  })
}

export function GET_WORK_ORDER_TICKET_VIEW (ticketId) {
  return request({
    url: baseUrl + '/view/get?ticketId=' + ticketId,
    method: 'get'
  })
}

// 查询工单所有配置条目
export function GET_WORK_ORDER_TICKET_ENTRIES (param) {
  return request({
    url: baseUrl + '/entries/get',
    method: 'get',
    params: param
  })
}

export function CREATE_WORK_ORDER_TICKET (data) {
  return request({
    url: baseUrl + '/create',
    method: 'post',
    data
  })
}

export function SAVE_WORK_ORDER_TICKET (data) {
  return request({
    url: baseUrl + '/save',
    method: 'post',
    data
  })
}

export function SUBMIT_WORK_ORDER_TICKET (data) {
  return request({
    url: baseUrl + '/submit',
    method: 'post',
    data
  })
}

export function APPROVE_WORK_ORDER_TICKET (data) {
  return request({
    url: baseUrl + '/approve',
    method: 'post',
    data
  })
}

export function ADD_WORK_ORDER_TICKET_ENTRY (data) {
  return request({
    url: baseUrl + '/entry/add',
    method: 'post',
    data
  })
}

export function DELETE_WORK_ORDER_TICKET_BY_ID (ticketId) {
  return request({
    url: baseUrl + '/del?ticketId=' + ticketId,
    method: 'delete'
  })
}

export function UPDATE_WORK_ORDER_TICKET_ENTRY (data) {
  return request({
    url: baseUrl + '/entry/update',
    method: 'post',
    data
  })
}

export function DELETE_WORK_ORDER_TICKET_ENTRY_BY_ID (ticketEntryId) {
  return request({
    url: baseUrl + '/entry/del?ticketEntryId=' + ticketEntryId,
    method: 'delete'
  })
}

export function QUERY_WORK_ORDER_TICKET_ENTRY (data) {
  return request({
    url: baseUrl + '/entry/query',
    method: 'post',
    data
  })
}

export function DELETE_WORK_ORDER_TICKET_BY_ORDER_AND_PHASE (param) {
  return request({
    url: baseUrl + '/order/phase/del',
    method: 'delete',
    params: param
  })
}

