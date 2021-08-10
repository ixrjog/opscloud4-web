<template>
  <d2-container>
    <h1>Ldap实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="账户" name="account">
        <asset-table :instanceId="instanceId" :assetType="assetType.LDAP.USER" :tableLayout="tableLayout.account"
                     ref="accountTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="手机">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.mobile }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="children" label="成员(账户组)" width="800">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.GROUP" :type="0"></ds-children-tag>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="账户组" name="group">
        <asset-table :instanceId="instanceId" :assetType="assetType.LDAP.GROUP" :tableLayout="tableLayout.group"
                     ref="groupTable">
          <template v-slot:extend>
            <el-table-column prop="children" label="成员(账户)" width="800">
              <template slot-scope="scope">
                <ds-children-tag :children="scope.row.children.USER" :type="1"></ds-children-tag>
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
  account: {
    assetId: {
      alias: '用户名'
    },
    name: {
      alias: '显示名'
    },
    assetKey: {
      alias: '用户名'
    },
    assetKey2: {
      alias: '邮箱',
      show: true
    },
    zone: {
      alias: '',
      show: false
    }
  },
  group: {
    assetId: {
      alias: '组名'
    },
    name: {
      alias: '显示名'
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
      activeName: 'account',
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
      if (tab.name === 'account') {
        this.$refs.accountTable.fetchData()
      }
      if (tab.name === 'group') {
        this.$refs.groupTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.accountTable) {
          this.$refs.accountTable.fetchData()
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
