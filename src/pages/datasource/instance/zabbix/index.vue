<template>
  <d2-container>
    <h1>Ldap实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
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
        <asset-table :instanceId="instanceId" :assetType="assetType.ZABBIX.ZABBIX_USER_GROUP" :tableLayout="tableLayout.userGroup"
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
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type.js'
import DsChildrenTag from '../../../../components/opscloud/datasource/common/DsChildrenTag'

const tableLayout = {
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
  }
}

export default {
  data () {
    return {
      activeName: 'user',
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
      if (tab.name === 'user') {
        this.$refs.userTable.fetchData()
      }
      if (tab.name === 'userGroup') {
        this.$refs.userGroupTable.fetchData()
      }
    },
    init () {
      this.$nextTick(() => {
        this.$refs.userTable.fetchData()
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
