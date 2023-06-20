<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>{{ title }}</h1>
    <div>
      <work-order-report ref="workOrderReport"/>
    </div>
  </d2-container>
</template>

<script>

import WorkOrderReport from '@/components/opscloud/workorder/WorkOrderReport'

export default {
  data () {
    return {
      title: '工单报表'
    }
  },
  components: {
    WorkOrderReport
  },
  computed: {},
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.$refs.workOrderReport.initData()
    }
  }
}
</script>

<style scoped>

</style>
