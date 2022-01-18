<template>
  <el-dialog :visible.sync="formStatus.visible">
    <template slot="title">
      <span v-if="ticketView !== null">
         <span>#{{ ticketView.ticketId }}</span>
         <span style="margin-left: 5px">{{ ticketView.workOrder.name }}工单</span>
      </span>
    </template>
    <!--工单视图-->
    <div class="block">
      <el-timeline v-if="ticketView !== null">
        <el-timeline-item timestamp="工单选项" placement="top">
          <el-card shadow="hover">
            <ticket-entry-selector :workOrderTicketId="ticketView === null ? 0: ticketView.ticketId" :entryDesc="'服务器组'"
                                   ref="entrySelector" @handleNotify="fetchData"></ticket-entry-selector>
            <ticket-entry-table :ticketId="ticketView === null ? 0: ticketView.ticketId"
                                :tableLayout="tableLayout"
                                ref="ticketEntryTable">
            </ticket-entry-table>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="审批选项" placement="top">
          <workflow-nodes :workflowView="ticketView.workflowView"
                          :ticketPhase="ticketView.ticketPhase"></workflow-nodes>
        </el-timeline-item>
        <el-timeline-item timestamp="申请说明" placement="top">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ticketView.comment"
                    :readonly="ticketView.ticketPhase !== 'NEW'"></el-input>
        </el-timeline-item>
        <el-timeline-item timestamp="审批流程" placement="top" v-if="ticketView.nodeView !== null">
          <node-view :nodeView="ticketView.nodeView"></node-view>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div slot="footer" class="dialog-footer" v-if="ticketView !== null">
      <el-button v-if="ticketView.ticketPhase === 'NEW'"
                 size="mini" type="primary"
                 :loading="submitting"
                 @click="submitTicket">提交
      </el-button>
      <el-button v-if="ticketView.ticketPhase === 'NEW'"
                 size="mini" type="primary"
                 :loading="saving"
                 @click="saveTicket">暂存
      </el-button>
      <el-button v-if="ticketView.isApproval"
                 type="success" plain size="mini"
                 :loading="approving"
                 @click="approveTicket('AGREE')">同意
      </el-button>
      <el-button v-if="ticketView.isApproval"
                 type="danger" plain size="mini"
                 :loading="approving"
                 @click="approveTicket('REJECT')">拒绝
      </el-button>
      <el-button size="mini" @click="closeEditor">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

import WorkflowNodes from '@/components/opscloud/workorder/child/WorkflowNodes'

const TableLayout = {
  instance: false,
  entryName: '服务器组名称'
}

import {
  SAVE_WORK_ORDER_TICKET,
  SUBMIT_WORK_ORDER_TICKET,
  APPROVE_WORK_ORDER_TICKET
} from '@/api/modules/workorder/workorder.ticket.api'

import TicketEntrySelector from '@/components/opscloud/workorder/child/TicketEntrySelector'
import TicketEntryTable from '@/components/opscloud/workorder/child/TicketEntryTable'
import NodeView from '@/components/opscloud/workorder/child/NodeView'

export default {
  data () {
    return {
      ticketView: null,
      tableLayout: TableLayout,
      approvalComment: '', // 审批说明
      submitting: false,
      saving: false,
      approving: false
    }
  },
  name: 'ServerGroupTicketEditor',
  props: ['formStatus'],
  components: {
    NodeView,
    TicketEntrySelector,
    TicketEntryTable,
    WorkflowNodes,
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (ticketView) {
      this.ticketView = ticketView
      const _this = this
      this.$nextTick(() => {
        _this.$refs.ticketEntryTable.initData(this.ticketView)
      }, 200)
    },
    /**
     * 提交工单
     */
    submitTicket () {
      this.submitting = true
      const requestBody = {
        ticketId: this.ticketView.ticketId,
        comment: this.ticketView.comment,
        workflowView: this.ticketView.workflowView
      }
      SUBMIT_WORK_ORDER_TICKET(requestBody)
        .then(res => {
          this.ticketView = res.body
          this.submitting = false
          this.closeEditor()
        }).catch((res) => {
        this.submitting = false
        this.$message.error(res.msg)
      })
    },
    /**
     * 审批工单
     * approvalType: 审批动作
     */
    approveTicket (approvalType) {
      this.approving = true
      const requestBody = {
        ticketId: this.ticketView.ticketId,
        approvalType: approvalType,
        approvalComment: this.approvalComment
      }
      APPROVE_WORK_ORDER_TICKET(requestBody)
        .then(res => {
          this.ticketView = res.body
          this.approving = false
          this.closeEditor()
        }).catch((res) => {
        this.approving = false
        this.$message.error(res.msg)
      })
    },
    /**
     * 保存（暂存）工单
     */
    saveTicket () {
      this.saving = true
      const requestBody = {
        ticketId: this.ticketView.ticketId,
        comment: this.ticketView.comment,
        workflowView: this.ticketView.workflowView
      }
      SAVE_WORK_ORDER_TICKET(requestBody)
        .then(res => {
          this.ticketView = res.body
          this.saving = false
        }).catch((res) => {
        this.saving = false
        this.$message.error(res.msg)
      })
    },
    closeEditor () {
      this.formStatus.visible = false
      this.$emit('close')
    },
    fetchData () {
      this.$refs.ticketEntryTable.fetchData()
    }
  }
}
</script>
