<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover">
      <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0;">
        <el-radio-group v-model="queryParam.ticketPhase" size="mini" @change="fetchData">
          <el-radio-button :label="ticketPhase.ALL">全部</el-radio-button>
          <el-radio-button :label="ticketPhase.NEW">{{ ticketPhase.NEW | toPhaseText }}</el-radio-button>
          <el-radio-button :label="ticketPhase.TOAUDIT">{{ ticketPhase.TOAUDIT | toPhaseText }}</el-radio-button>
          <el-radio-button :label="ticketPhase.REJECT">{{ ticketPhase.REJECT | toPhaseText }}</el-radio-button>
          <el-radio-button :label="ticketPhase.SUCCESS">{{ ticketPhase.SUCCESS | toPhaseText }}</el-radio-button>
          <el-radio-button :label="ticketPhase.FAILED">{{ ticketPhase.FAILED | toPhaseText }}</el-radio-button>
          <el-radio-button :label="ticketPhase.CLOSED">{{ ticketPhase.CLOSED | toPhaseText }}</el-radio-button>
        </el-radio-group>
        <el-select v-model.trim="queryParam.workOrderId" filterable clearable @change="fetchData" size="mini"
                   placeholder="请选择工单类型">
          <el-option v-for="item in workOrderOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
            <span style="float: left"><i :class="item.icon" style="margin-right: 5px"/>{{ item.name }}</span>
          </el-option>
        </el-select>
        <el-button @click="fetchData" style="margin-left: 5px" type="primary" plain size="mini"><i class="fas fa-circle-notch"/></el-button>
        <el-button type="danger" plain size="mini" :disabled="queryParam.workOrderId === ''" @click="delOrderTicket">批量删除</el-button>
      </el-row>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
        <el-table-column prop="id" label="编号" width="80"/>
        <el-table-column prop="workorder" label="工单">
          <template v-slot="scope">
            <i :class="scope.row.workOrder.icon" style="margin-right: 5px"/>{{ scope.row.workOrder.name }}
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="申请人">
          <template v-slot="scope">
            <user-avatar :user="scope.row.createUser" :size="24"/>
          </template>
        </el-table-column>
        <el-table-column prop="ticketPhase" label="进度" width="120">
          <template v-slot="scope">
            <el-tag class="filters" :type="scope.row.ticketPhase | toPhaseType" size="mini">
              <i class="el-icon-loading" v-show="scope.row.ticketPhase === 'PROCESSING'"/>
              {{ scope.row.ticketPhase | toPhaseText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ago" label="申请时间" width="120"/>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button v-if="scope.row.ticketPhase !== 'NEW' && !scope.row.isApprover"
                       type="success"
                       plain size="mini"
                       :loading="scope.row.loading"
                       :disabled="disabled"
                       @click="previewTicket(scope.row)">查看
            </el-button>
            <el-button v-if="scope.row.ticketPhase === 'NEW'"
                       type="primary"
                       plain size="mini"
                       :loading="scope.row.loading"
                       :disabled="disabled"
                       @click="editTicket(scope.row)">编辑
            </el-button>
            <el-button v-if="scope.row.isApprover"
                       type="primary"
                       plain size="mini"
                       :loading="scope.row.loading"
                       :disabled="disabled"
                       @click="approvalTicket(scope.row)">审批
            </el-button>
            <el-button v-if="isAdmin"
                       type="danger"
                       plain size="mini"
                       @click="delTicket(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                  @handleSizeChange="handleSizeChange"/>
    </el-card>
  </div>
</template>

<script>

import { toPhaseText, toPhaseType } from '@/filters/ticket.js'
import { GET_WORK_ORDER_OPTIONS } from '@/api/modules/workorder/workorder.api.js'
import {
  GET_WORK_ORDER_TICKET_VIEW,
  QUERY_WORK_ORDER_TICKET_PAGE,
  QUERY_MY_WORK_ORDER_TICKET_PAGE, DELETE_WORK_ORDER_TICKET_BY_ID, DELETE_WORK_ORDER_TICKET_BY_ORDER_AND_PHASE
} from '@/api/modules/workorder/workorder.ticket.api.js'
import UserAvatar from '@/components/opscloud/workorder/child/UserAvatar'
import ticketFormStatus from '@/components/opscloud/workorder/child/ticket.form'
import Pagination from '@/components/opscloud/common/page/Pagination'
import WorkOrderKeyConstants from '@/components/opscloud/common/enums/workorder.key.constants'
import WorkOrderTicketPhase from '@/components/opscloud/common/enums/workorder.ticket.phase'

export default {
  name: 'MyTicketCard',
  props: {
    title: {
      type: String,
      required: false,
      default: '我的工单'
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      ticketPhase: WorkOrderTicketPhase,
      workOrderKeyConstants: WorkOrderKeyConstants,
      workOrderOptions: [],
      formStatus: {
        ticket: Object.assign({}, ticketFormStatus.ticket)
      },
      queryParam: {
        extend: true,
        workOrderId: '',
        ticketPhase: ''
      },
      disabled: false
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
    this.getWorkOrderOptions()
  },
  components: {
    Pagination,
    UserAvatar
  },
  filters: {
    toPhaseText, toPhaseType
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    getWorkOrderOptions () {
      GET_WORK_ORDER_OPTIONS().then(res => {
        this.workOrderOptions = res.body
      })
    },
    delTicket (ticket) {
      this.$confirm('此操作将删除当前工单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        DELETE_WORK_ORDER_TICKET_BY_ID(ticket.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    delOrderTicket () {
      this.$confirm('此操作将删除指定的工单类型和状态的所有工单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        DELETE_WORK_ORDER_TICKET_BY_ORDER_AND_PHASE({
          workOrderId: this.queryParam.workOrderId,
          phase: this.queryParam.ticketPhase
        }).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    approvalTicket (row) {
      row.loading = true
      this.disabled = true
      GET_WORK_ORDER_TICKET_VIEW(row.id).then(res => {
        const ticket = res.body
        this.$emit('approvalTicket', ticket)
        row.loading = false
        this.disabled = false
      }).catch(() => {
        row.loading = false
        this.disabled = false
      })
    },
    previewTicket (row) {
      row.loading = true
      this.disabled = true
      GET_WORK_ORDER_TICKET_VIEW(row.id).then(res => {
        const ticket = res.body
        this.$emit('previewTicket', ticket)
        row.loading = false
        this.disabled = false
      }).catch(() => {
        row.loading = false
        this.disabled = false
      })
    },
    editTicket (row) {
      row.loading = true
      this.disabled = true
      GET_WORK_ORDER_TICKET_VIEW(row.id).then(res => {
        const ticket = res.body
        this.$emit('editTicket', ticket)
        row.loading = false
        this.disabled = false
      }).catch(() => {
        row.loading = false
        this.disabled = false
      })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      if (this.isAdmin) {
        QUERY_WORK_ORDER_TICKET_PAGE(requestBody)
          .then(res => {
            this.table.data = res.body.data
            this.table.pagination.total = res.body.totalNum
            this.table.loading = false
          })
      } else {
        QUERY_MY_WORK_ORDER_TICKET_PAGE(requestBody)
          .then(res => {
            this.table.data = res.body.data
            this.table.pagination.total = res.body.totalNum
            this.table.loading = false
          })
      }
    }
  }
}
</script>

<style scoped>

.el-button {
  margin-left: 5px;
}

>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.el-select {
  margin-left: 10px;
}
</style>
