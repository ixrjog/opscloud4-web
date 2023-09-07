<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :visible.sync="formStatus.visible" :width="tableLayout.instance ? '1500px': '1200px'"
             :before-close="beforeClose">
    <!--页眉-->
    <template v-slot:title v-if="ticketView !== null">
      <ticket-title-i18n :id="ticketView.ticketId" :work-order="ticketView.workOrder"/>
    </template>
    <!--页眉-->
    <!--工单视图-->
    <div class="block" v-if="ticketView !== null">
      <el-timeline>
        <el-timeline-item :timestamp="$t('workOrder.workOrderOptions')" placement="top">
          <el-card shadow="hover">
            <ticket-entry-selector v-if="ticketView.ticketPhase === 'NEW'"
                                   :workOrderTicketId="ticketView.ticketId"
                                   :entryDesc="tableLayout.entryName"
                                   @handleNotify="fetchData"/>
            <ticket-entry-table :ticketId="ticketView.ticketId"
                                :workOrderKey="ticketView.workOrderKey"
                                :ticketPhase="ticketView.ticketPhase"
                                :tableLayout="tableLayout"
                                ref="ticketEntryTable"/>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="$t('workOrder.approvalOptions')" placement="top">
          <workflow-nodes :workflowView="ticketView.workflowView" :ticketPhase="ticketView.ticketPhase"/>
        </el-timeline-item>
        <el-timeline-item :timestamp="$t('workOrder.applicationDescription')" placement="top">
          <el-input type="textarea" :rows="2" v-model="ticketView.comment"
                    :placeholder="ticketView.ticketPhase === 'NEW' ? $t('common.pleaseEnterContent') : $t('workOrder.theApplicantSeemsToHaveForgottenToWrite')"
                    :readonly="ticketView.ticketPhase !== 'NEW'"/>
        </el-timeline-item>
        <el-timeline-item :timestamp="$t('workOrder.approvalProcess')" placement="top" v-if="ticketView.nodeView !== null">
          <node-view :nodeView="ticketView.nodeView"/>
        </el-timeline-item>
        <!--        审批意见只展示给当前审批人-->
        <el-timeline-item :timestamp="$t('workOrder.opinionOfApprover')" placement="top" v-if="ticketView.isApprover">
          <el-input type="textarea" :rows="2" :placeholder="$t('common.pleaseEnterContent')" v-model="approvalComment"/>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!--工单视图-->
    <!--页脚-->
    <div slot="footer" class="dialog-footer" v-if="ticketView !== null">
      <el-button v-if="ticketView.ticketPhase === 'NEW'"
                 size="mini" type="primary"
                 :loading="submitting"
                 @click="submitTicket">{{ $t('common.submit') }}
      </el-button>
      <el-button v-if="ticketView.ticketPhase === 'NEW'"
                 size="mini" type="primary"
                 :loading="saving"
                 @click="saveTicket">{{ $t('common.save') }}
      </el-button>
      <el-button v-if="ticketView.isApprover"
                 type="success" plain size="mini"
                 :loading="approving"
                 @click="approveTicket('AGREE')">{{ $t('common.agree') }}
      </el-button>
      <el-button v-if="ticketView.isApprover"
                 type="danger" plain size="mini"
                 :loading="approving"
                 @click="approveTicket('REJECT')">{{ $t('common.reject') }}
      </el-button>
      <el-button size="mini" @click="closeEditor">{{ $t('common.close') }}</el-button>
    </div>
    <!--页脚-->
  </el-dialog>
</template>

<script>

import TicketEntrySelector from '@/components/opscloud/workorder/child/TicketEntrySelector'
import TicketEntryTable from '@/components/opscloud/workorder/child/TicketEntryTable'
import NodeView from '@/components/opscloud/workorder/child/NodeView'
import WorkflowNodes from '@/components/opscloud/workorder/child/WorkflowNodes'
import {
  SAVE_WORK_ORDER_TICKET,
  SUBMIT_WORK_ORDER_TICKET,
  APPROVE_WORK_ORDER_TICKET
} from '@/api/modules/workorder/workorder.ticket.api'
import TicketTitleI18n from '@/components/opscloud/workorder/child/TicketTitleI18n.vue'

const TableLayout = {
  instance: false,
  entryName: 'Apollo Role'
}

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
  name: 'ApolloTicketEditor',
  props: ['formStatus'],
  components: {
    TicketTitleI18n,
    NodeView,
    TicketEntrySelector,
    TicketEntryTable,
    WorkflowNodes
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (ticketView) {
      this.approvalComment = ''
      this.submitting = false
      this.saving = false
      this.approving = false
      this.ticketView = ticketView
      this.$nextTick(() => {
        this.fetchData()
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
      SUBMIT_WORK_ORDER_TICKET(requestBody).then(res => {
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
      APPROVE_WORK_ORDER_TICKET(requestBody).then(res => {
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
      SAVE_WORK_ORDER_TICKET(requestBody).then(res => {
        this.ticketView = res.body
        this.saving = false
      }).catch((res) => {
        this.saving = false
        this.$message.error(res.msg)
      })
    },
    beforeClose (done) {
      this.$confirm('确定关闭工单?')
        .then(_ => {
          done()
          this.closeEditor()
        })
        .catch(_ => {
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
