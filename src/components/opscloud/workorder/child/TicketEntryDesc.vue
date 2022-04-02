<template>
  <div v-if="JSON.stringify(ticketEntry) !== '{}'">
    <div style="margin: 0 0 20px">
      <my-span :content="ticketEntry.name" style="font-size: 20px"></my-span>
      <span class="btn-group">
        <span v-if="ticketPhase === orderPhase.NEW">
          <el-button type="text" @click="removeEntry()">重新编辑</el-button>
        </span>
        <span v-if="ticketPhase === orderPhase.SUCCESS || ticketPhase === orderPhase.FAILED">
          <el-tooltip class="item" effect="dark" placement="top-start"
                      :content="ticketEntry.result === null ? 'success': ticketEntry.result">
            <el-tag :type="ticketEntry.entryStatus === 1 ? 'success':'danger'">
              {{ ticketEntry.entryStatus === 1 ? '执行成功' : '执行失败' }}
            </el-tag>
          </el-tooltip>
        </span>
      </span>
      <slot name="header" :ticketEntry="ticketEntry"></slot>
    </div>
    <slot name="body" :ticketEntry="ticketEntry"></slot>
  </div>
</template>

<script>

import {
  DELETE_WORK_ORDER_TICKET_ENTRY_BY_ID, GET_WORK_ORDER_TICKET_ENTRIES
} from '@/api/modules/workorder/workorder.ticket.api'
import WorkOrderTicketPhase from '@/components/opscloud/common/enums/workorder.ticket.phase'
import MySpan from '@/components/opscloud/common/MySpan'

export default {
  name: 'TicketEntryDesc',
  props: ['ticketId', 'workOrderKey', 'ticketPhase', 'tableLayout'],
  data () {
    return {
      orderPhase: WorkOrderTicketPhase,
      ticketEntries: [],
      ticketEntry: {}
    }
  },
  components: {
    MySpan
  },
  methods: {
    initData (ticketEntries) {
      this.ticketEntries = ticketEntries
      this.ticketEntry = Object.assign({}, ticketEntries[0])
    },
    removeEntry () {
      DELETE_WORK_ORDER_TICKET_ENTRY_BY_ID(this.ticketEntry.id)
        .then(res => {
          // 返回数据
          if (res.success) {
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    fetchData () {
      const requestParam = {
        ticketId: this.ticketId,
        workOrderKey: this.workOrderKey
      }
      GET_WORK_ORDER_TICKET_ENTRIES(requestParam)
        .then(res => {
          this.ticketEntries = res.body.ticketEntries
          this.$emit('ticketEntriesChanged', this.ticketEntries)
        })
    }
  }
}
</script>

<style scoped lang="less">
.btn-group {
  float: right;
  margin-left: 5px;
}

.el- {
  &card {
    margin-bottom: 10px;

    /deep/ .el-card__body {
      padding: 10px;
    }

    /deep/ .el-card__header {
      padding: 10px 10px;
      border-bottom: 1px solid #EBEEF5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
</style>
