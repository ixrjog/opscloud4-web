<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :visible.sync="formStatus.visible" width="55%" :before-close="beforeClose">
    <!--页眉-->
    <template v-slot:title>
      <ticket-title v-if="ticketView !== null" :id="ticketView.ticketId" :title="ticketView.workOrder.name"/>
    </template>
    <!--页眉-->
    <!--工单视图-->
    <div class="block" v-if="ticketView !== null">
      <el-timeline>
        <el-timeline-item timestamp="工单选项" placement="top">
          <el-card shadow="hover">
            <ticket-sns-topic-form :workOrderTicketId="ticketView.ticketId" ref="ticketSqsForm"
                                   v-show="ticketView.ticketPhase === 'NEW' && JSON.stringify(ticketView.ticketEntries) === '[]'"
                                   @handleNotify="fetchData"/>
            <ticket-entry-desc :ticketId="ticketView.ticketId"
                               :workOrderKey="ticketView.workOrderKey"
                               :ticketPhase="ticketView.ticketPhase"
                               v-show="JSON.stringify(ticketView.ticketEntries) !== '[]'"
                               ref="ticketEntryDesc" @ticketEntriesChanged="ticketEntriesChanged">
              <template v-slot:header="scope">
                <div v-if="scope.ticketEntry.entry.topicArn">
                  <copy-span :content="scope.ticketEntry.entry.topicArn" style="color: #8492a6"/>
                </div>
              </template>
              <template v-slot:body="scope">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <entry-detail name="实例名称" :value="scope.ticketEntry.instance.instanceName"/>
                  </el-col>
                  <el-col :span="12">
                    <entry-detail name="环境" :value="toRegionTypeText(scope.ticketEntry.entry.envName)"/>
                  </el-col>
                </el-row>
                <br/>
                <el-row>
                  <el-col :span="12" v-if="scope.ticketEntry.entry.attributes.FifoTopic">
                    <entry-detail name="FIFO主题" :value="scope.ticketEntry.entry.attributes.FifoTopic"/>
                  </el-col>
                  <el-col :span="12" v-if="scope.ticketEntry.entry.attributes.ContentBasedDeduplication">
                    <entry-detail name="基于内容的消息重复数据删除"
                                  :value="scope.ticketEntry.entry.attributes.ContentBasedDeduplication"/>
                  </el-col>
                </el-row>
              </template>
            </ticket-entry-desc>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="审批选项" placement="top">
          <workflow-nodes :workflowView="ticketView.workflowView"
                          :ticketPhase="ticketView.ticketPhase"/>
        </el-timeline-item>
        <el-timeline-item timestamp="申请说明" placement="top">
          <el-input type="textarea" :rows="2"
                    :placeholder="ticketView.ticketPhase === 'NEW' ? '请输入内容': '申请人好像忘记写了！'"
                    v-model="ticketView.comment"
                    :readonly="ticketView.ticketPhase !== 'NEW'"/>
        </el-timeline-item>
        <el-timeline-item timestamp="审批流程" placement="top" v-if="ticketView.nodeView !== null">
          <node-view :nodeView="ticketView.nodeView"/>
        </el-timeline-item>
        <!--        审批意见只展示给当前审批人-->
        <el-timeline-item timestamp="审批意见" placement="top" v-if="ticketView.isApprover">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="approvalComment"/>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!--工单视图-->
    <!--页脚-->
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
      <el-button v-if="ticketView.isApprover"
                 type="success" plain size="mini"
                 :loading="approving"
                 @click="approveTicket('AGREE')">同意
      </el-button>
      <el-button v-if="ticketView.isApprover"
                 type="danger" plain size="mini"
                 :loading="approving"
                 @click="approveTicket('REJECT')">拒绝
      </el-button>
      <el-button size="mini" @click="closeEditor">关闭</el-button>
    </div>
    <!--页脚-->
  </el-dialog>
</template>

<script>
import NodeView from '@/components/opscloud/workorder/child/NodeView'
import TicketTitle from '@/components/opscloud/workorder/child/TicketTitle'
import WorkflowNodes from '@/components/opscloud/workorder/child/WorkflowNodes'
import {
  SAVE_WORK_ORDER_TICKET,
  SUBMIT_WORK_ORDER_TICKET,
  APPROVE_WORK_ORDER_TICKET, GET_WORK_ORDER_TICKET_ENTRIES
} from '@/api/modules/workorder/workorder.ticket.api'
import TicketEntryDesc from '@/components/opscloud/workorder/child/TicketEntryDesc'
import util from '@/libs/util'
import { getAWSRegionTypeText } from '@/filters/cloud.region'
import TicketSnsTopicForm from '@/components/opscloud/workorder/child/TicketSnsTopicForm'
import EntryDetail from '@/components/opscloud/common/EntryDetail'
import CopySpan from '@/components/opscloud/common/CopySpan'

export default {
  data () {
    return {
      ticketView: null,
      approvalComment: '', // 审批说明
      submitting: false,
      saving: false,
      approving: false,
      util: util
    }
  },
  name: 'SnsTopicTicketEditor',
  props: ['formStatus'],
  components: {
    TicketTitle,
    NodeView,
    TicketSnsTopicForm,
    TicketEntryDesc,
    WorkflowNodes,
    EntryDetail,
    CopySpan
  },
  mixins: [],
  mounted () {
  },
  filters: {
    getAWSRegionTypeText
  },
  methods: {
    initData (ticketView) {
      this.ticketView = ticketView
      this.approvalComment = ''
      this.submitting = false
      this.saving = false
      this.approving = false
      this.$nextTick(() => {
        if (ticketView.ticketPhase === 'NEW' && JSON.stringify(ticketView.ticketEntries) === '[]') {
          this.$refs.ticketSqsForm.initDate(ticketView.ticketEntries)
        } else {
          this.$refs.ticketEntryDesc.initData(ticketView.ticketEntries)
        }
      }, 200)
    },
    /**
     * 提交工单
     */
    submitTicket () {
      if (JSON.stringify(this.ticketView.ticketEntries) === '[]') {
        this.$message.warning('请先保存以校验 SNS 主题配置')
        return
      }
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
      const requestParam = {
        ticketId: this.ticketView.ticketId,
        workOrderKey: this.ticketView.workOrderKey
      }
      GET_WORK_ORDER_TICKET_ENTRIES(requestParam)
        .then(res => {
          this.ticketEntries = res.body.ticketEntries
          this.ticketEntriesChanged(this.ticketEntries)
        })
    },
    ticketEntriesChanged (ticketEntries) {
      this.ticketView.ticketEntries = ticketEntries
      if (JSON.stringify(ticketEntries) === '[]') {
        this.$refs.ticketSqsForm.initDate()
      } else {
        this.$refs.ticketEntryDesc.initData(ticketEntries)
      }
    },
    toRegionTypeText (envName) {
      return envName + ' [' + getAWSRegionTypeText(envName) + ']'
    }
  }
}
</script>
