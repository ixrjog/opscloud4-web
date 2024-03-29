<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instance.id !== null" :instance-id="instance.id"
                               datasource-nane="Kubernetes实例管理"/>
    <el-tabs v-model="activeName" v-if="instance.id !== null" @tab-click="handleClick">
      <el-tab-pane label="Node" name="node">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.KUBERNETES_NODE"
                     :tableLayout="tableLayout.node" ref="nodeTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="CPU/Memory" show-overflow-tooltip>
              <template v-slot="scope">
                <span>cpu {{ scope.row.properties.cpu }} / memory {{ scope.row.properties.memory }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Region" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.properties['labels:failure-domain.beta.kubernetes.io/region'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Zone" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.properties['labels:failure-domain.beta.kubernetes.io/zone'] }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Namespace" name="namespace">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.KUBERNETES_NAMESPACE"
                     :tableLayout="tableLayout.namespace" ref="namespaceTable">
          <template v-slot:extend>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Deployment" name="deployment">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.KUBERNETES_DEPLOYMENT"
                     :tableLayout="tableLayout.deployment" ref="deploymentTable">
          <template v-slot:extend>
            <el-table-column label="容器组数量" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.properties.replicas }}</span>
              </template>
            </el-table-column>
            <el-table-column label="资源限制" show-overflow-tooltip>
              <template v-slot="scope">
                <span>CPU {{
                    scope.row.properties['resources.limits.cpu']
                  }} / Memory {{ scope.row.properties['resources.limits.memory'] }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Service" name="service">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.KUBERNETES_SERVICE"
                     :tableLayout="tableLayout.service" ref="serviceTable">
          <template v-slot:extend>
            <el-table-column label="容器组数量" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.properties.replicas }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Ingress" name="ingress">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.KUBERNETES_INGRESS"
                     :tableLayout="tableLayout.ingress" ref="ingressTable">
          <template v-slot:extend>
            <el-table-column label="Ingress Class Name" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.properties.ingressClassName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Rules" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.properties.rules }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="VirtualService" name="virtualService">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.ISTIO_VIRTUAL_SERVICE"
                     :tableLayout="tableLayout.virtualService" ref="virtualServiceTable">
          <template v-slot:extend>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="DestinationRule" name="destinationRule">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.ISTIO_DESTINATION_RULE"
                     :tableLayout="tableLayout.destinationRule" ref="destinationRuleTable">
          <template v-slot:extend>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Pod" name="pod">
        <asset-table :instanceId="instance.id" :assetType="assetType.KUBERNETES.KUBERNETES_POD"
                     :tableLayout="tableLayout.pod" ref="podTable">
          <template v-slot:extend>
            <el-table-column label="节点" show-overflow-tooltip>
              <template v-slot="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.properties.nodeName" placement="top-start">
                  <span>{{ scope.row.properties.hostIp }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="BusinessTemplate" name="template">
        <kubernetes-template-table :instanceUuid="instance.uuid" ref="templateTable"/>
      </el-tab-pane>
      <el-tab-pane label="FinOps" name="finOps">
        <kubernetes-fin-ops-table :instanceId="instance.id" ref="finOpsTable"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'
import KubernetesTemplateTable from '@/components/opscloud/datasource/template/KubernetesTemplateTable'
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'
import KubernetesFinOpsTable from '@/components/opscloud/datasource/finops/KubernetesFinOpsTable.vue'

const tableLayout = {
  node: {
    assetId: {
      alias: 'UID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: 'IP',
      show: true
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
  ingress: {
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
  virtualService: {
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
  destinationRule: {
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
  service: {
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
  name: 'datasource-instance-kubernetes',
  data () {
    return {
      activeName: 'node',
      instance: {
        id: null,
        uuid: null
      },
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType
    }
  },
  computed: {},
  mounted () {
    this.instance.id = this.$route.query.id
    this.instance.uuid = this.$route.query.uuid
    this.init()
  },
  components: {
    AssetTable,
    KubernetesTemplateTable,
    DatasourceInstanceTitle,
    KubernetesFinOpsTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'node') {
        this.$refs.nodeTable.fetchData()
        return
      }
      if (tab.name === 'namespace') {
        this.$refs.namespaceTable.fetchData()
        return
      }
      if (tab.name === 'deployment') {
        this.$refs.deploymentTable.fetchData()
      }
      if (tab.name === 'service') {
        this.$refs.serviceTable.fetchData()
      }
      if (tab.name === 'ingress') {
        this.$refs.ingressTable.fetchData()
      }
      if (tab.name === 'virtualService') {
        this.$refs.virtualServiceTable.fetchData()
      }
      if (tab.name === 'destinationRule') {
        this.$refs.destinationRuleTable.fetchData()
      }
      if (tab.name === 'pod') {
        this.$refs.podTable.fetchData()
      }
      if (tab.name === 'template') {
        this.$refs.templateTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.nodeTable) {
          this.$refs.nodeTable.fetchData()
        }
      }, 50)
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
//-webkit-box-sizing: border-box; box-sizing: border-box;
}

</style>
