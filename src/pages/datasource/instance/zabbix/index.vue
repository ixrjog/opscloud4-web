<template>
  <d2-container>
    <h1>Zabbix实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="问题" name="problem">
        <asset-table :instanceId="instanceId" :assetType="assetType.ZABBIX.ZABBIX_TRIGGER" ref="problemTable"
                     :tableLayout="tableLayout.problem">
          <template v-slot:extend>
            <el-table-column label="主机">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.ZABBIX_HOST" :type="3"></ds-children-tag>
              </template>
            </el-table-column>
            <el-table-column label="级别">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.kind | getProblemSeverityText }}</el-tag>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="用户" name="user">
        <asset-table :instanceId="instanceId" :assetType="assetType.ZABBIX.ZABBIX_USER" :tableLayout="tableLayout.user"
                     ref="userTable">
          <template v-slot:extend>
            <el-table-column prop="children" label="成员(用户组)" width="600">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.ZABBIX_USER_GROUP" :type="3"></ds-children-tag>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="用户组" name="userGroup">
        <asset-table :instanceId="instanceId" :assetType="assetType.ZABBIX.ZABBIX_USER_GROUP"
                     :tableLayout="tableLayout.userGroup"
                     ref="userGroupTable">
          <template v-slot:extend>
            <el-table-column prop="children" label="成员(用户)" width="600">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.ZABBIX_USER" :type="4"></ds-children-tag>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="主机" name="host">
        <asset-table :instanceId="instanceId" :assetType="assetType.ZABBIX.ZABBIX_HOST" ref="hostTable"
                     :tableLayout="tableLayout.host">
          <template v-slot:extend>
            <el-table-column label="主机组" width="600">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.ZABBIX_HOST_GROUP" :type="3"></ds-children-tag>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="主机组" name="hostGroup">
        <asset-table :instanceId="instanceId" :assetType="assetType.ZABBIX.ZABBIX_HOST_GROUP" ref="hostGroupTable"
                     :tableLayout="tableLayout.hostGroup">
          <template v-slot:extend>
            <el-table-column label="主机" width="600">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.ZABBIX_HOST" :type="3"></ds-children-tag>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="模板" name="template">
        <asset-table :instanceId="instanceId" :assetType="assetType.ZABBIX.ZABBIX_TEMPLATE" ref="templateTable"
                     :tableLayout="tableLayout.template">
          <template v-slot:extend>
            <el-table-column label="主机" width="600">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.ZABBIX_HOST" :type="3"></ds-children-tag>
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
import { getProblemSeverityText } from '@/filters/asset.zabbix'

const tableLayout = {
  problem: {
    assetId: {
      alias: 'triggerId'
    },
    name: {
      alias: '问题'
    },
    assetKey: {
      alias: '用户名'
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
      alias: 'userId'
    },
    name: {
      alias: '显示名'
    },
    assetKey: {
      alias: '用户名'
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
  userGroup: {
    assetId: {
      alias: 'groupId'
    },
    name: {
      alias: '组名'
    },
    assetKey: {
      alias: '组名'
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
  host: {
    assetId: {
      alias: 'hostId'
    },
    name: {
      alias: '主机名'
    },
    assetKey: {
      alias: '主机名'
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
  hostGroup: {
    assetId: {
      alias: 'hostGroupId'
    },
    name: {
      alias: '组名'
    },
    assetKey: {
      alias: '组名'
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
      alias: 'templateId'
    },
    name: {
      alias: '模板名称'
    },
    assetKey: {
      alias: '模板名称'
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
      activeName: 'problem',
      instanceId: null,
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType
    }
  },
  computed: {},
  filters: {
    getProblemSeverityText
  },
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
      if (tab.name === 'problem') {
        this.$refs.problemTable.fetchData()
      }
      if (tab.name === 'user') {
        this.$refs.userTable.fetchData()
      }
      if (tab.name === 'userGroup') {
        this.$refs.userGroupTable.fetchData()
      }
      if (tab.name === 'host') {
        this.$refs.hostTable.fetchData()
      }
      if (tab.name === 'hostGroup') {
        this.$refs.hostGroupTable.fetchData()
      }
      if (tab.name === 'template') {
        this.$refs.templateTable.fetchData()
      }
    },
    init () {
      this.$nextTick(() => {
        this.$refs.problemTable.fetchData()
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
