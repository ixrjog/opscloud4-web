<template>
  <d2-container>
    <h1>Aliyun实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="ECS" name="ecs">
        <asset-table :instanceId="instanceId" assetType="ECS" :tableLayout="tableLayout"></asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/caesar/datasource/asset/AssetTable'

const tableLayout = {
  assetId: {
    alias: '实例id'
  },
  name: {
    alias: '实例名称'
  },
  assetKey: {
    alias: '私网ip'
  },
  assetKey2: {
    alias: '公网ip',
    show: true
  },
  zone: {
    alias: '区',
    show: true
  }
}

export default {
  data () {
    return {
      activeName: 'ecs',
      instanceId: null,
      tableLayout: tableLayout
    }
  },
  computed: {},
  mounted () {
    this.instanceId = this.$route.query.id
    this.activeName = 'ecs'
  },
  components: {
    AssetTable,
  },
  methods: {
    handleClick () {
      // if (this.activeName === 'group') {
      //   this.$refs.accountGroupTable.fetchData()
      // }
    }
  }
}
</script>

<style scoped>
  .el-input {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .el-select {
    margin-left: 5px;
  }

  .el-button {
    margin-left: 5px;
  }

  >>> .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

</style>
