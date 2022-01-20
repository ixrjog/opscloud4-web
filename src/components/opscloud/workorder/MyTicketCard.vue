<template>
  <div>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>我的工单</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="fetchData">刷新</el-button>
      </div>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
        <el-table-column prop="id" label="编号" width="80"></el-table-column>
        <el-table-column prop="workorder" label="工单">
          <template slot-scope="scope">
            <i :class="scope.row.workOrder.icon" style="margin-right: 5px"></i>{{ scope.row.workOrder.name }}
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="申请人">
          <template slot-scope="scope">
            <user-avatar :user="scope.row.createUser" :size="20"></user-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="ticketPhase" label="进度">
          <template slot-scope="scope">
            <el-tag class="filters" :type="scope.row.ticketPhase | toPhaseType" size="small">
              <i class="el-icon-loading" v-show="scope.row.ticketPhase === 'PROCESSING'"></i>
              {{ scope.row.ticketPhase | toPhaseText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ago" label="申请时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.ticketPhase !== 'NEW' && !scope.row.isApprover"
                       type="success"
                       plain size="mini"
                       :loading="previewing"
                       @click="previewTicket(scope.row)">查看
            </el-button>
            <el-button v-if="scope.row.ticketPhase === 'NEW'"
                       type="primary"
                       plain size="mini"
                       :loading="editing"
                       @click="editTicket(scope.row)">编辑
            </el-button>
            <el-button v-if="scope.row.isApprover"
                       type="primary"
                       plain size="mini"
                       :loading="approving"
                       @click="approvalTicket(scope.row)">审批
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                  @handleSizeChange="handleSizeChange"></pagination>
    </el-card>
  </div>
</template>

<script>

// Filters
import { toPhaseText, toPhaseType } from '@/filters/ticket.js'

import {
  GET_WORK_ORDER_TICKET_VIEW,
  QUERY_MY_WORK_ORDER_TICKET_PAGE
} from '@/api/modules/workorder/workorder.ticket.api.js'
import UserAvatar from '@/components/opscloud/workorder/child/UserAvatar'
import ticketFormStatus from '@/components/opscloud/workorder/child/ticket.form'
import Pagination from '@/components/opscloud/common/page/Pagination'
import WorkOrderKeyConstants from '@/components/opscloud/common/enums/workorder.key.constants'

// const defaultFormStatus = {
//   visible: false,
//   operationType: 1
// }

export default {
  name: 'MyTicketCard',
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
      workOrderKeyConstants: WorkOrderKeyConstants,
      formStatus: {
        ticket: Object.assign({}, ticketFormStatus.ticket)
      },
      queryParam: {
        extend: true,
        workOrderId: '',
        ticketPhase: ''
      },
      editing: false,
      previewing: false,
      approving: false
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
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
    delTicket (id) {
    },
    approvalTicket (row) {
      this.approving = true
      GET_WORK_ORDER_TICKET_VIEW(row.id)
        .then(res => {
          const ticket = res.body
          this.$emit('approvalTicket', ticket)
          this.approving = false
        })
    },
    previewTicket (row) {
      this.previewing = true
      GET_WORK_ORDER_TICKET_VIEW(row.id)
        .then(res => {
          const ticket = res.body
          this.$emit('previewTicket', ticket)
          this.previewing = false
        })
    },
    editTicket (row) {
      this.editing = true
      GET_WORK_ORDER_TICKET_VIEW(row.id)
        .then(res => {
          const ticket = res.body
          this.$emit('editTicket', ticket)
          this.editing = false
        })
    },
    fetchData () {
      this.table.loading = true
      let requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_MY_WORK_ORDER_TICKET_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped>

>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
