<template>
  <el-dialog :visible.sync="formStatus.visible" :width="tableLayout.instance ? '70%': '50%'"
             :before-close="beforeClose">
    <!--页眉-->
    <template slot="title">
      <ticket-title v-if="ticketView !== null" :id="ticketView.ticketId"
                    :title="ticketView.workOrder.name"></ticket-title>
    </template>
    <!--页眉-->
    <!--工单视图-->
    <div class="block" v-if="ticketView !== null">
      <el-timeline>
        <el-timeline-item timestamp="工单选项" placement="top">
          <el-card shadow="hover">
            <ticket-asset-entry-selector v-if="ticketView.ticketPhase === 'NEW'"
                                         :instanceType="'GITLAB'"
                                         :assetType="'GITLAB_GROUP'"
                                         :workOrderTicketId="ticketView.ticketId"
                                         :entryDesc="tableLayout.entryName"
                                         ref="ticketEntrySelector"
                                         @handleNotify="fetchData"></ticket-asset-entry-selector>
            <ticket-entry-table :ticketId="ticketView.ticketId"
                                :workOrderKey="ticketView.workOrderKey"
                                :ticketPhase="ticketView.ticketPhase"
                                :tableLayout="tableLayout"
                                ref="ticketEntryTable">
              <template v-slot:extend>
                <el-table-column prop="role" label="角色" width="150">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.role" placeholder="请选择" @change="updateEntry(scope.row)"
                               :disabled="ticketView.ticketPhase !== 'NEW'">
                      <el-option
                        v-for="item in gitlabRoleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </template>
            </ticket-entry-table>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="审批选项" placement="top">
          <workflow-nodes :workflowView="ticketView.workflowView"
                          :ticketPhase="ticketView.ticketPhase"></workflow-nodes>
        </el-timeline-item>
        <el-timeline-item timestamp="申请说明" placement="top">
          <el-input type="textarea" :rows="2"
                    :placeholder="ticketView.ticketPhase === 'NEW' ? '请输入内容': '申请人好像忘记写了！'"
                    v-model="ticketView.comment"
                    :readonly="ticketView.ticketPhase !== 'NEW'"></el-input>
        </el-timeline-item>
        <el-timeline-item timestamp="审批流程" placement="top" v-if="ticketView.nodeView !== null">
          <node-view :nodeView="ticketView.nodeView"></node-view>
        </el-timeline-item>
        <!--        审批意见只展示给当前审批人-->
        <el-timeline-item timestamp="审批意见" placement="top" v-if="ticketView.isApprover">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="approvalComment"></el-input>
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
import TicketAssetEntrySelector from '@/components/opscloud/workorder/child/TicketAssetEntrySelector'
import TicketEntryTable from '@/components/opscloud/workorder/child/TicketEntryTable'
import NodeView from '@/components/opscloud/workorder/child/NodeView'
import TicketTitle from '@/components/opscloud/workorder/child/TicketTitle'
import WorkflowNodes from '@/components/opscloud/workorder/child/WorkflowNodes'
import {
  SAVE_WORK_ORDER_TICKET,
  SUBMIT_WORK_ORDER_TICKET,
  APPROVE_WORK_ORDER_TICKET
} from '@/api/modules/workorder/workorder.ticket.api'

const gitlabRoleOptions = [
  /**
   *     Guest(10),
   *     Reporter(20),
   *     Developer(30),
   *     Master(40),
   *     Owner(50);
   */
  {
    value: 'REPORTER',
    label: 'Reporter'
  },
  {
    value: 'DEVELOPER',
    label: 'Developer'
  },
  {
    value: 'MASTER',
    label: 'Maintainer'
  },
  {
    value: 'OWNER',
    label: 'Owner'
  }
]

const TableLayout = {
  instance: true,
  entryName: 'Gitlab群组'
}

export default {
  data () {
    return {
      ticketView: null,
      tableLayout: TableLayout,
      approvalComment: '', // 审批说明
      submitting: false,
      saving: false,
      approving: false,
      gitlabRoleOptions: gitlabRoleOptions
    }
  },
  name: 'GitlabGroupTicketEditor',
  props: ['formStatus'],
  components: {
    TicketTitle,
    NodeView,
    TicketAssetEntrySelector,
    TicketEntryTable,
    WorkflowNodes
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (ticketView) {
      this.ticketView = ticketView
      this.approvalComment = ''
      this.submitting = false
      this.saving = false
      this.approving = false
      this.$nextTick(() => {
        if (this.ticketView.ticketPhase === 'NEW') {
          this.$refs.ticketEntrySelector.getDsInstance()
        }
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
    updateEntry (entry) {
      this.$refs.ticketEntryTable.updateEntryRole(entry)
    },
    beforeClose (done) {
      this.$confirm('确定关闭工单?').then(_ => {
        done()
        this.closeEditor()
      }).catch(_ => {
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
