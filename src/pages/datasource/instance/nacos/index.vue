<template>
  <d2-container>
    <h1>Nacos实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="集群节点" name="node">
        <asset-table :instanceId="instanceId" :assetType="assetType.NACOS.NACOS_CLUSTER_NODE" :tableLayout="tableLayout.node"
                     ref="nodeTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="节点状态">
              <template slot-scope="scope">
                <span>
                 <el-tag :type="scope.row.properties.state === 'UP' ? 'success' : 'info'">{{ scope.row.properties.state }}</el-tag>
                </span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="权限" name="permission">
        <asset-table :instanceId="instanceId" :assetType="assetType.NACOS.NACOS_PERMISSION" :tableLayout="tableLayout.permission"
                     ref="permissionTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="资源">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.resource }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="动作">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.action }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="用户" name="user">
        <asset-table :instanceId="instanceId" :assetType="assetType.NACOS.NACOS_USER" :tableLayout="tableLayout.user"
                     ref="userTable">
          <template v-slot:extend>
          </template>
        </asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '@/components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type.js'
import DsChildrenTag from '@/components/opscloud/datasource/common/DsChildrenTag'

const tableLayout = {
  node: {
    assetId: {
      alias: '节点地址',
      show: false
    },
    name: {
      alias: '节点地址',
      show: true
    },
    assetKey: {
      alias: 'IP'
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
  permission: {
    assetId: {
      alias: '节点地址',
      show: false
    },
    name: {
      alias: '角色',
      show: true
    },
    assetKey: {
      alias: ''
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
  user: {
    assetId: {
      alias: '节点地址',
      show: false
    },
    name: {
      alias: '用户名',
      show: true
    },
    assetKey: {
      alias: ''
    },
    assetKey2: {
      alias: '角色',
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
      activeName: 'node',
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
    AssetTable,
    DsChildrenTag
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'node') {
        this.$refs.nodeTable.fetchData()
      }
      if (tab.name === 'permission') {
        this.$refs.permissionTable.fetchData()
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
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

</style>
