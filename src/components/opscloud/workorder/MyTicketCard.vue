<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover">
      <el-row>
        <el-radio-group v-model="queryParam.ticketPhase" size="mini" @change="fetchData">
          <el-radio-button :label="ticketPhase.ALL">{{ $t('common.all')}}</el-radio-button>
          <el-radio-button :label="ticketPhase.NEW">
            <span v-if="$i18n.locale === 'zh-chs'">{{ ticketPhase.NEW | toPhaseText }}</span>
            <span v-if="$i18n.locale === 'en'">{{ ticketPhase.NEW }}</span>
          </el-radio-button>
          <el-radio-button :label="ticketPhase.TOAUDIT">
            <span v-if="$i18n.locale === 'zh-chs'">{{ ticketPhase.TOAUDIT | toPhaseText }}</span>
            <span v-if="$i18n.locale === 'en'">{{ ticketPhase.TOAUDIT }}</span>
          </el-radio-button>
          <el-radio-button :label="ticketPhase.REJECT">
            <span v-if="$i18n.locale === 'zh-chs'">{{ ticketPhase.REJECT | toPhaseText }}</span>
            <span v-if="$i18n.locale === 'en'">{{ ticketPhase.REJECT  }}</span>
          </el-radio-button>
          <el-radio-button :label="ticketPhase.SUCCESS">
            <span v-if="$i18n.locale === 'zh-chs'">{{ ticketPhase.SUCCESS | toPhaseText }}</span>
            <span v-if="$i18n.locale === 'en'">{{ ticketPhase.SUCCESS  }}</span>
          </el-radio-button>
          <el-radio-button :label="ticketPhase.FAILED">
            <span v-if="$i18n.locale === 'zh-chs'">{{ ticketPhase.FAILED | toPhaseText }}</span>
            <span v-if="$i18n.locale === 'en'">{{ ticketPhase.FAILED }}</span>
          </el-radio-button>
          <el-radio-button :label="ticketPhase.CLOSED">
            <span v-if="$i18n.locale === 'zh-chs'">{{ ticketPhase.CLOSED | toPhaseText }}</span>
            <span v-if="$i18n.locale === 'en'">{{ ticketPhase.CLOSED }}</span>
          </el-radio-button>
        </el-radio-group>
        <el-select v-model.trim="queryParam.workOrderId" filterable clearable @change="fetchData" size="mini"
                   :placeholder="$t('workOrder.selectAWorkOrderType')" style="width: 250px">
          <el-option v-for="item in workOrderOptions"
                     :key="item.id"
                     :label="$i18n.locale === 'zh-chs' ? item.name : item.i18nEn"
                     :value="item.id">
            <span style="float: left">
              <i :class="item.icon" style="margin-right: 5px"/>{{ $i18n.locale === 'zh-chs' ? item.name : item.i18nEn }}
            </span>
          </el-option>
        </el-select>
        <el-button @click="fetchData" style="margin-left: 5px" type="primary" plain size="mini">
          <i class="fas fa-circle-notch"/>
        </el-button>
        <el-button type="danger" plain size="mini" :disabled="queryParam.workOrderId === ''" @click="delOrderTicket">
          {{ $t('common.batchDeletion') }}
        </el-button>
      </el-row>
      <div style="height: 5px"/>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
        <el-table-column prop="id" :label="$t('workOrder.numberOf')" width="80"/>
        <el-table-column prop="workorder" :label="$t('workOrder.name')">
          <template v-slot="scope">
            <i :class="scope.row.workOrder.icon" style="margin-right: 5px"/>
            <span v-if="$i18n.locale === 'zh-chs'">{{ scope.row.workOrder.name }}</span>
            <span v-if="$i18n.locale === 'en'">{{ scope.row.workOrder.i18nEn }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" :label="$t('workOrder.applicant')">
          <template v-slot="scope">
            <user-avatar :user="scope.row.createUser" :size="24"/>
          </template>
        </el-table-column>
        <el-table-column prop="ticketPhase" :label="$t('workOrder.phase')" width="120">
          <template v-slot="scope">
            <el-tag class="filters" :type="scope.row.ticketPhase | toPhaseType" size="mini">
              <i class="el-icon-loading" v-show="scope.row.ticketPhase === 'PROCESSING'"/>
              <span v-if="$i18n.locale === 'zh-chs'">{{ scope.row.ticketPhase | toPhaseText }}</span>
              <span v-if="$i18n.locale === 'en'">{{ scope.row.ticketPhase  }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ago" :label="$t('workOrder.applicationTime')" width="120">
          <template v-slot="scope">
            {{ i18nAgo(scope.row.ago) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operate')" width="180">
          <template v-slot="scope">
            <el-button v-if="scope.row.ticketPhase !== 'NEW' && !scope.row.isApprover"
                       type="success"
                       plain size="mini"
                       :loading="scope.row.loading"
                       :disabled="disabled"
                       @click="previewTicket(scope.row)">{{ $t('common.view') }}
            </el-button>
            <el-button v-if="scope.row.ticketPhase === 'NEW'"
                       type="primary"
                       plain size="mini"
                       :loading="scope.row.loading"
                       :disabled="disabled"
                       @click="editTicket(scope.row)">{{ $t('common.edit') }}
            </el-button>
            <el-button v-if="scope.row.isApprover"
                       type="primary"
                       plain size="mini"
                       :loading="scope.row.loading"
                       :disabled="disabled"
                       @click="approvalTicket(scope.row)">{{ $t('common.approval') }}
            </el-button>
            <el-button v-if="isAdmin"
                       type="danger"
                       plain size="mini"
                       @click="delTicket(scope.row)">{{ $t('common.delete') }}
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
import tools from '@/libs/tools'

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
    i18nAgo (ago) {
      return this.$i18n.locale === 'zh-chs' ? ago : tools.i18nAgo(ago)
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
  box-sizing: border-box;
}

.el-select {
  margin-left: 10px;
}
</style>
