<template>
  <d2-container>
    <h1>Jenkins实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="计算节点" name="computer">
        <asset-table :instanceId="instanceId" :assetType="assetType.JENKINS.JENKINS_COMPUTER"
                     :tableLayout="tableLayout.computer" ref="computerTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="系统">
              <template slot-scope="scope">
                {{ scope.row.properties.os }}
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="执行器">
              <template slot-scope="scope">
                {{ scope.row.properties.numExecutos }}
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="远程目录">
              <template slot-scope="scope">
                {{ scope.row.properties.remoteRootDirectory }}
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="目录空间">
              <template slot-scope="scope">
                {{ util.bytesToSize(scope.row.properties.remoteRootDirectorySize) }}
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="内存">
              <template slot-scope="scope">
                {{ util.bytesToSize(scope.row.properties.totalPhysicalMemory) }}
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type.js'
import DsChildrenTag from '../../../../components/opscloud/datasource/common/DsChildrenTag'
import WhetherTag from '../../../../components/opscloud/common/tag/WhetherTag'

import util from '@/libs/util'

const tableLayout = {
  computer: {
    assetId: {
      alias: '计算节点'
    },
    name: {
      alias: '节点名称'
    },
    assetKey: {
      alias: 'sshUrl',
      show: false
    },
    assetKey2: {
      alias: '',
      show: false
    },
    zone: {
      alias: '',
      show: false
    }
  }
}

export default {
  data () {
    return {
      activeName: 'computer',
      instanceId: null,
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType,
      util: util
    }
  },
  computed: {},
  mounted () {
    this.instanceId = this.$route.query.id
    this.init()
  },
  components: {
    AssetTable,
    DsChildrenTag,
    WhetherTag
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'computer') {
        this.$refs.computerTable.fetchData()
      }
    },
    init () {
      this.$nextTick(() => {
        this.$refs.computerTable.fetchData()
      })
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
