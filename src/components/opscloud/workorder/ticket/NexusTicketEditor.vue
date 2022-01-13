<template>
  <el-dialog :visible.sync="formStatus.visible">
    <template slot="title">
      <span v-if="ticketView !== null">
         <span>#{{ ticketView.ticketId }}</span>
         <span style="margin-left: 5px">{{ ticketView.workOrder.name }}工单</span>
      </span>
    </template>
    <!--    <el-divider></el-divider>-->
    <ticket-entry-selector :workOrderTicketId="ticketView === null ? 0: ticketView.ticketId" :entryDesc="'Nexus权限'"
                           ref="entrySelector" @handleNotify="fetchData"></ticket-entry-selector>
    <el-divider></el-divider>
    <ticket-entry-table :ticketId="ticketView === null ? 0: ticketView.ticketId"
                        :tableLayout="tableLayout"
                        ref="ticketEntryTable">
    </ticket-entry-table>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <!--      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>-->
    </div>
  </el-dialog>
</template>

<script>

const TableLayout = {
  instance: false,
  entryName: 'Nexus权限',
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
  name: 'NexusTicketEditor',
  props: ['formStatus'],
  components: {
    TicketEntrySelector,
    TicketEntryTable
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
    fetchData () {
      this.$refs.ticketEntryTable.fetchData()
    }
  }
}
</script>
