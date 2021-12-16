<template>
  <d2-container>
    <h1>钉钉应用实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="通讯录用户" name="user">
        <asset-table :instanceId="instanceId" :assetType="assetType.DINGTALK_APP.DINGTALK_USER"
                     :tableLayout="tableLayout.user" ref="userTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="手机">
              <template slot-scope="scope">
                {{ scope.row.properties.mobile }}
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="工号">
              <template slot-scope="scope">
                {{ scope.row.properties.jobNumber }}
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述">
              <template slot-scope="scope">
                {{ scope.row.description }}
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="部门" name="department">
        <asset-table :instanceId="instanceId" :assetType="assetType.DINGTALK_APP.DINGTALK_DEPARTMENT"
                     :tableLayout="tableLayout.department" ref="departmentTable">
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

const tableLayout = {
  department: {
    assetId: {
      alias: 'Dept ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: 'sshUrl'
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
      alias: 'User ID'
    },
    name: {
      alias: '显示名'
    },
    assetKey: {
      alias: '用户名'
    },
    assetKey2: {
      alias: 'Email',
      show: true
    },
    zone: {
      alias: '',
      show: false
    },
    description: {
      alias: '描述',
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
    AssetTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'department') {
        this.$refs.departmentTable.fetchData()
      }
      if (tab.name === 'user') {
        this.$refs.userTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        this.$refs.userTable.fetchData()
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
