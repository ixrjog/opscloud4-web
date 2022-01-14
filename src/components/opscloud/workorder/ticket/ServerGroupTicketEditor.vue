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
      <el-timeline>
        <el-timeline-item timestamp="配置" placement="top">
          <el-card shadow="hover">
            <ticket-entry-selector :workOrderTicketId="ticketView === null ? 0: ticketView.ticketId" :entryDesc="'服务器组'"
                                   ref="entrySelector" @handleNotify="fetchData"></ticket-entry-selector>
            <!--            <el-divider></el-divider>-->
            <ticket-entry-table :ticketId="ticketView === null ? 0: ticketView.ticketId"
                                :tableLayout="tableLayout"
                                ref="ticketEntryTable">
            </ticket-entry-table>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="审批" placement="top">
          <el-card shadow="hover">
            <workflow-nodes :workflowView="ticketView.workflowView"></workflow-nodes>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSubmit">提交</el-button>
      <el-button size="mini" type="primary" @click="handleSave">暂存</el-button>
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <!--      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>-->
    </div>
  </el-dialog>
</template>

<script>

import WorkflowNodes from '@/components/opscloud/workorder/child/WorkflowNodes'

const TableLayout = {
  instance: false,
  entryName: '服务器组名称',
}

import TicketEntrySelector from '@/components/opscloud/workorder/child/TicketEntrySelector'
import TicketEntryTable from '@/components/opscloud/workorder/child/TicketEntryTable'

export default {
  data () {
    return {
      ticketView: null,
      tableLayout: TableLayout,
      loading: false
    }
  },
  name: 'ServerGroupTicketEditor',
  props: ['formStatus'],
  components: {
    TicketEntrySelector,
    TicketEntryTable,
    WorkflowNodes
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
    handleSubmit(){

    },
    handleSave(){

    },
    fetchData () {
      this.$refs.ticketEntryTable.fetchData()
    }
  }
}
</script>
