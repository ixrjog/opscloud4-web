import { request } from '@/api/_service.js'

const baseUrl = '/workorder/ticket'

export function GET_WORK_ORDER_TICKET_VIEW (ticketId) {
  return request({
    url: baseUrl + '/view/get?ticketId=' + ticketId,
    method: 'get'
  })
}

export function CREATE_WORK_ORDER_TICKET (data) {
  return request({
    url: baseUrl + '/create',
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
