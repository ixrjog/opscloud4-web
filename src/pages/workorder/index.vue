<template>
  <d2-container>
    <h1>我的工单</h1>
    <el-col :span="8">
      <work-order-card></work-order-card>
    </el-col>
  </d2-container>
</template>

<script>

// import RoleTable from '../../../components/opscloud/rbac/RoleTable'
// import RoleResourceMaster from '../../../components/opscloud/rbac/RoleResourceMaster'

import WorkOrderCard from '@/components/opscloud/workorder/WorkOrderCard'

export default {
  data () {
    return {
      activeName: 'role'
    }
  },
  mounted () {
  },
  components: {
    WorkOrderCard
  },
  methods: {}
}
</script>

<style scoped>

</style>
