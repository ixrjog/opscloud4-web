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
          <workflow-nodes :workflowView="ticketView.workflowView"></workflow-nodes>
        </el-timeline-item>
        <el-timeline-item timestamp="申请说明" placement="top">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ticketView.comment" :disabled="ticketView.ticketPhase !== 'NEW'"></el-input>
        </el-timeline-item>
        <el-timeline-item timestamp="审批流程" placement="top" v-if="ticketView.nodeView !== null">
          <node-view :nodeView="ticketView.nodeView"></node-view>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
      <el-button size="mini" type="primary" :loading="saving" @click="handleSave">暂存</el-button>
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
  SUBMIT_WORK_ORDER_TICKET
} from '@/api/modules/workorder/workorder.ticket.api'

import TicketEntrySelector from '@/components/opscloud/workorder/child/TicketEntrySelector'
import TicketEntryTable from '@/components/opscloud/workorder/child/TicketEntryTable'
import NodeView from '@/components/opscloud/workorder/child/NodeView'

export default {
  data () {
    return {
      ticketView: null,
      tableLayout: TableLayout,
      submitting: false,
      saving: false,
      loading: false
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
    handleSubmit () {
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
    handleSave () {
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
