<template>
  <div>
    <el-table :data="ticketView.ticketEntries" style="width: 100%" v-loading="loading">
      <el-table-column label="实例名称" v-if="tableLayout.instance">
        <template slot-scope="scope">
          <span>{{ scope.row.instance.instanceName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="tableLayout.entryName"></el-table-column>
      <el-table-column prop="comment" label="描述">
      </el-table-column>
      <!--      <el-table-column prop="entryResult" label="执行结果" v-if="ticket.ticketPhase === 'FINALIZED'"></el-table-column>-->
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="removeEntry(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {
  DELETE_WORK_ORDER_TICKET_ENTRY_BY_ID, GET_WORK_ORDER_TICKET_VIEW
} from '@/api/modules/workorder/workorder.ticket.api'

export default {
  name: 'TicketEntryTable',
  props: ['ticketId', 'tableLayout'],
  data () {
    return {
      ticketView: {
        ticketEntries: []
      },
      loading: false
    }
  },
  methods: {
    initData (ticketView) {
      this.ticketView = ticketView
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
      GET_WORK_ORDER_TICKET_VIEW(this.ticketId)
        .then(res => {
          this.ticketView = res.body
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
