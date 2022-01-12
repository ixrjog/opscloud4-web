<template>
  <el-dialog :title="ticketView === null ? '' : ticketView.workOrder.name" :visible.sync="formStatus.visible">
    <el-divider></el-divider>
    <ticket-entry-selector :workOrderTicketId="ticketView === null ? 0: ticketView.ticketId" :entryDesc="'服务器组'"
                           ref="entrySelector"></ticket-entry-selector>
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <!--      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>-->
    </div>
  </el-dialog>
</template>

<script>

import TicketEntrySelector from '@/components/opscloud/workorder/child/TicketEntrySelector'

export default {
  data () {
    return {
      labelWidth: '150px',
      ticketView: null
    }
  },
  name: 'ServerGroupTicketEditor',
  props: ['formStatus'],
  components: {
    TicketEntrySelector
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (ticketView) {
      this.ticketView = ticketView
      this.$refs.entrySelector.fetchData('')
    }
  }
}
</script>
