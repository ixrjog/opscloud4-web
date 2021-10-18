<template>
  <d2-container>
    <h1>Sonatype Nexus Repository实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="资产管理" name="asset">
        <asset-table :instanceId="instanceId" :assetType="assetType.NEXUS.NEXUS_ASSET" :tableLayout="tableLayout.user"
                     ref="assetTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="md5">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.md5 }}</span>
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
import DsChildrenTag from '@/components/opscloud/datasource/common/DsChildrenTag'

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
      activeName: 'asset',
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
      if (tab.name === 'asset') {
        this.$refs.assetTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.assetTable) {
          this.$refs.assetTable.fetchData()
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
