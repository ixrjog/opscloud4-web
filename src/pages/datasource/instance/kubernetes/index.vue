<template>
  <d2-container>
    <h1>Kubernetes实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="命名空间" name="namespace">
        <asset-table :instanceId="instanceId" :assetType="assetType.KUBERNETES.KUBERNETES_NAMESPACE"
                     :tableLayout="tableLayout.namespace" ref="namespaceTable">
          <template v-slot:extend>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="无状态" name="deployment">
        <asset-table :instanceId="instanceId" :assetType="assetType.KUBERNETES.KUBERNETES_DEPLOYMENT"
                     :tableLayout="tableLayout.deployment" ref="deploymentTable">
          <template v-slot:extend>
            <el-table-column label="容器组数量" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.properties.replicas }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="容器组" name="pod">
        <asset-table :instanceId="instanceId" :assetType="assetType.KUBERNETES.KUBERNETES_POD"
                     :tableLayout="tableLayout.pod" ref="podTable">
          <template v-slot:extend>
            <el-table-column label="节点" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.properties.nodeName" placement="top-start">
                  <span>{{ scope.row.properties.hostIp }}</span>
                </el-tooltip>
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
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'

const tableLayout = {
  namespace: {
    assetId: {
      alias: 'UID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '关键字'
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
  deployment: {
    assetId: {
      alias: 'UID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '',
      show: false
    },
    assetKey2: {
      alias: '命名空间',
      show: true
    },
    zone: {
      alias: '',
      show: false
    }
  },
  pod: {
    assetId: {
      alias: 'UID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: 'Pod IP',
      show: true
    },
    assetKey2: {
      alias: '命名空间',
      show: true
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
      activeName: 'namespace',
      instanceId: null,
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType
    }
  },
  computed: {},
  mounted () {
    this.instanceId = this.$route.query.id
    this.init()
  },
  components: {
    AssetTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'namespace') {
        this.$refs.namespaceTable.fetchData()
        return
      }
      if (tab.name === 'deployment') {
        this.$refs.deploymentTable.fetchData()
      }
      if (tab.name === 'pod') {
        this.$refs.podTable.fetchData()
      }
    },
    init () {
      this.$nextTick(() => {
        this.$refs.namespaceTable.fetchData()
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
