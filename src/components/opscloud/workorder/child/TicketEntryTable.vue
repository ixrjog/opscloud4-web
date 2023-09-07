<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-table :data="ticketEntries" style="width: 100%" v-loading="loading">
      <el-table-column label="Instance Name" v-if="tableLayout.instance">
        <template v-slot="scope">
          <span>{{ scope.row.instance.instanceName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="tableLayout.entryName"></el-table-column>
      <el-table-column label="Role" v-if="tableLayout.role !== null && tableLayout.role">
        <template v-slot="scope">
          <el-select v-model="scope.row.role" :placeholder="$t('common.select.select')" @change="updateEntry(scope.row)"
                     :disabled="ticketPhase !== 'NEW'">
            <el-option v-for="item in roleOptions"
                       :key="item.value"
                       :label="$t(item.label)"
                       :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <slot name="extend">
        <!--扩展字段-->
      </slot>
      <el-table-column prop="comment" label="Desc"/>
      <el-table-column label="Result" v-if="ticketPhase === orderPhase.SUCCESS || ticketPhase === orderPhase.FAILED">
        <template v-slot="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.result === null ? 'success': scope.row.result"
                      placement="top-start">
            <el-tag :type="scope.row.entryStatus === 1 ? 'success' : 'danger'">
              <span v-if="$i18n.locale === 'zh-chs'">{{ scope.row.entryStatus === 1 ? '执行成功' : '执行失败' }}</span>
              <span v-if="$i18n.locale === 'en'">{{ scope.row.entryStatus === 1 ? 'Success' : 'Failed' }}</span>
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Operate" width="160" v-if="ticketPhase === orderPhase.NEW">
        <template v-slot="scope">
          <el-button type="danger" plain size="mini" @click="removeEntry(scope.row)">{{ $t('common.remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {
  DELETE_WORK_ORDER_TICKET_ENTRY_BY_ID, GET_WORK_ORDER_TICKET_ENTRIES, UPDATE_WORK_ORDER_TICKET_ENTRY
} from '@/api/modules/workorder/workorder.ticket.api'
import WorkOrderTicketPhase from '@/components/opscloud/common/enums/workorder.ticket.phase'

import { toPermissionRoleType, toPermissionRoleText } from '@/filters/user.permission.js'

const roleOptions = [
  {
    value: '',
    label: 'workOrder.roleOptions.user'
  },
  {
    value: 'qa',
    label: 'workOrder.roleOptions.qa'
  },
  {
    value: 'admin',
    label: 'workOrder.roleOptions.admin'
  }
]

export default {
  name: 'TicketEntryTable',
  props: ['ticketId', 'workOrderKey', 'ticketPhase', 'tableLayout'],
  data () {
    return {
      orderPhase: WorkOrderTicketPhase,
      ticketEntries: [],
      loading: false,
      roleOptions: roleOptions
    }
  },
  filters: {
    toPermissionRoleType, toPermissionRoleText
  },
  methods: {
    initData (ticketView) {
      this.ticketEntries = ticketView.ticketEntries
    },
    updateEntryRole (entry) {
      UPDATE_WORK_ORDER_TICKET_ENTRY(entry)
        .then(res => {
          // 返回数据
          if (res.success) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    updateEntry (entry) {
      const requestBody = Object.assign({}, entry)
      // if (requestBody.role === null || requestBody.role === '') {
      //   requestBody.role = 'admin'
      // } else {
      //   requestBody.role = ''
      // }
      UPDATE_WORK_ORDER_TICKET_ENTRY(requestBody)
        .then(res => {
          // 返回数据
          if (res.success) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
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
          this.$emit('ticketEntriesChanged', this.ticketEntries)
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
