<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instanceId !== null" :instance-id="instanceId"
                               datasource-nane="Jenkins实例管理"/>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="构建任务视图" name="buildExecutor">
        <jenkins-build-executor-status-card :instanceId="instanceId"
                                            ref="buildExecutor"/>
      </el-tab-pane>
      <el-tab-pane label="计算节点" name="computer">
        <asset-table :instanceId="instanceId" :assetType="assetType.JENKINS.JENKINS_COMPUTER"
                     :tableLayout="tableLayout.computer" ref="computerTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="系统">
              <template v-slot="scope">
                <span>{{ scope.row.properties.os }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="执行器">
              <template v-slot="scope">
                <span>{{ scope.row.properties.numExecutos }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="远程目录">
              <template v-slot="scope">
                <span>{{ scope.row.properties.remoteRootDirectory }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="目录空间">
              <template v-slot="scope">
                <span>{{ util.bytesToSize(scope.row.properties.remoteRootDirectorySize) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="内存">
              <template v-slot="scope">
                <span>{{ util.bytesToSize(scope.row.properties.totalPhysicalMemory) }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="任务模板" name="template">
        <asset-table :instanceId="instanceId" :assetType="assetType.JENKINS.JENKINS_TEMPLATE"
                     :tableLayout="tableLayout.template" ref="templateTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="_class">
              <template v-slot="scope">
                <span>{{ scope.row.properties._class }}</span>
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

import util from '@/libs/util'
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'
import JenkinsBuildExecutorStatusCard from '@/components/opscloud/jenkins/JenkinsBuildExecutorStatusCard'

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
  },
  template: {
    assetId: {
      alias: '模板路径'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '',
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
      activeName: 'buildExecutor',
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
    JenkinsBuildExecutorStatusCard,
    AssetTable,
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'buildExecutor') {
        this.$refs.buildExecutor.start()
      }
      if (tab.name === 'computer') {
        this.$refs.computerTable.fetchData()
      }
      if (tab.name === 'template') {
        this.$refs.templateTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.buildExecutor) {
          this.$refs.buildExecutor.start()
        }
      }, 1000)
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
