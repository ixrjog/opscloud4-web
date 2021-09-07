<template>
  <el-row>
    <el-col :span="8">
      <!--          服务器树-->
      <server-tree class="server-tree" ref="serverTree"></server-tree>
    </el-col>
    <el-col :span="8">
      <el-button @click="handleClick">查看选中节点</el-button>
    </el-col>
  </el-row>
</template>

<script>

import ServerTree from '../tree/ServerTree'

export default {
  name: 'AnsibleBatchTaskTable',
  data () {
    return {
      activeName: 'batchTask'
    }
  },
  mounted () {
  },
  components: {
    ServerTree
  },
  methods: {
    handleClick () {
      let nodes = this.$refs.serverTree.getCheckedNodes(true)
      console.log(nodes)
    }
  }
}
</script>

<style scoped>

  .server-tree {
    margin-top: 5px;
  }

</style>
