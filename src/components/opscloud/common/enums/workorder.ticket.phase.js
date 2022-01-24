const WorkOrderTicketPhase = Object.freeze({
  ALL: '',
  NEW: 'NEW', //新建
  TOAUDIT: 'TOAUDIT', //审批中
  APPROVED: 'APPROVED', //审批通过
  REJECT: 'REJECT',//审批拒绝
  PROCESSING: 'PROCESSING',//执行中
  SUCCESS: 'SUCCESS',//执行成功
  FAILED: 'FAILED', //执行失败
  CLOSED: 'CLOSED'//已关闭
})

export default WorkOrderTicketPhase
