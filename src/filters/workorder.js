import WorkOrderStatus from '@/components/opscloud/common/enums/workorder.status'

export function toStatusDesc (value) {
  switch (value) {
    case WorkOrderStatus.NORMAL.type:
      return WorkOrderStatus.NORMAL.desc
    case WorkOrderStatus.DEVELOPING.type:
      return WorkOrderStatus.DEVELOPING.desc
    case WorkOrderStatus.SYS.type:
      return WorkOrderStatus.SYS.desc
    case WorkOrderStatus.INACTIVE.type:
      return WorkOrderStatus.INACTIVE.desc
    default:
      return '未定义'
  }
}

export function toStatusColor (value) {
  switch (value) {
    case WorkOrderStatus.NORMAL.type:
      return WorkOrderStatus.NORMAL.color
    case WorkOrderStatus.DEVELOPING.type:
      return WorkOrderStatus.DEVELOPING.color
    case WorkOrderStatus.SYS.type:
      return WorkOrderStatus.SYS.color
    case WorkOrderStatus.INACTIVE.type:
      return WorkOrderStatus.INACTIVE.color
    default:
      return 'primary'
  }
}

export function toStatusName (value) {
  switch (value) {
    case 0:
      return '新建'
    case 1:
      return '开发中'
    case 2:
      return '停用'
    default:
      return '新建'
  }
}
