import WorkOrderTicketPhase from '@/components/opscloud/common/enums/workorder.ticket.phase'

export function toPhaseType (value) {
  switch (value) {
    case WorkOrderTicketPhase.NEW:
    case WorkOrderTicketPhase.CLOSED:
      return 'info'
    case WorkOrderTicketPhase.TOAUDIT:
      return 'warning'
    case WorkOrderTicketPhase.REJECT:
    case WorkOrderTicketPhase.FAILED:
      return 'danger'
    case WorkOrderTicketPhase.PROCESSING:
    case WorkOrderTicketPhase.SUCCESS:
      return 'success'
    default:
      return 'info'
  }
}

export function toPhaseText (value) {
  switch (value) {
    case WorkOrderTicketPhase.NEW:
      return '新建'
    case WorkOrderTicketPhase.TOAUDIT:
      return '审批中'
    case WorkOrderTicketPhase.REJECT:
      return '审批拒绝'
    case WorkOrderTicketPhase.PROCESSING:
      return '执行中'
    case WorkOrderTicketPhase.SUCCESS:
      return '执行成功'
    case WorkOrderTicketPhase.FAILED:
      return '执行失败'
    case WorkOrderTicketPhase.CLOSED:
      return '关闭'
    default:
      return '未定义'
  }
}
