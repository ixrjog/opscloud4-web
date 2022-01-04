<template>
  <d2-container>
    <datasource-instance-title v-if="instanceId !== null" :instance-id="instanceId"
                               datasource-nane="腾讯企业邮箱实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="邮箱用户" name="user">
        <asset-table :instanceId="instanceId" :assetType="assetType.TENCENT_EXMAIL.TENCENT_EXMAIL_USER" :tableLayout="tableLayout.user"
                     ref="accountTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="手机">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.mobile }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '@/components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type.js'
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'

const tableLayout = {
  user: {
    assetId: {
      alias: '邮箱'
    },
    name: {
      alias: '显示名'
    },
    assetKey: {
      alias: '用户名'
    },
    assetKey2: {
      alias: '用户名前缀',
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
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'user') {
        this.$refs.accountTable.fetchData()
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
