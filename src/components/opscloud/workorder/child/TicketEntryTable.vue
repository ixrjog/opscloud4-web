<template>
  <div>
    <el-table :data="ticketEntries" style="width: 100%" v-loading="loading">
      <el-table-column label="实例名称" v-if="tableLayout.instance">
        <template slot-scope="scope">
          <span>{{ scope.row.instance.instanceName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="tableLayout.entryName"></el-table-column>
      <el-table-column prop="comment" label="描述">
      </el-table-column>
      <el-table-column label="执行结果" v-if="ticketPhase === orderPhase.SUCCESS || ticketPhase === orderPhase.FAILED">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.result === null ? 'success': scope.row.result" placement="top-start">
            <el-tag :type="scope.row.entryStatus === 1 ? 'success' : 'danger'">
              {{ scope.row.entryStatus === 1 ? '执行成功' : '执行失败' }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" v-if="ticketPhase ===  orderPhase.NEW">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="removeEntry(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {
  DELETE_WORK_ORDER_TICKET_ENTRY_BY_ID, GET_WORK_ORDER_TICKET_ENTRIES
} from '@/api/modules/workorder/workorder.ticket.api'
import WorkOrderTicketPhase from '@/components/opscloud/common/enums/workorder.ticket.phase'

export default {
  name: 'TicketEntryTable',
  props: ['ticketId', 'workOrderKey', 'ticketPhase', 'tableLayout'],
  data () {
    return {
      orderPhase: WorkOrderTicketPhase,
      ticketEntries: [],
      loading: false
    }
  },
  methods: {
    initData (ticketView) {
      this.ticketEntries = ticketView.ticketEntries
    },
    removeEntry (entry) {
      this.loading = true
      DELETE_WORK_ORDER_TICKET_ENTRY_BY_ID(entry.id)
        .then(res => {
          // 返回数据
          if (res.success) {
            this.$message({
              message: '移除成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    fetchData () {
      this.loading = true
      const requestParam = {
        ticketId: this.ticketId,
        workOrderKey: this.workOrderKey
      }
      GET_WORK_ORDER_TICKET_ENTRIES(requestParam)
        .then(res => {
          this.ticketEntries = res.body.ticketEntries
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
