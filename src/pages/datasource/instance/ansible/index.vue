<template>
  <d2-container>
    <h1>Ansible实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="版本" name="version">
        <asset-table :instanceId="instanceId" :assetType="assetType.ANSIBLE.ANSIBLE_VERSION"
                     :tableLayout="tableLayout.version" ref="versionTable">
          <template v-slot:extend>
            <el-table-column prop="description" label="版本详情" width="700px">
              <template slot-scope="scope">
                <d2-highlight v-if="scope.row.description != ''" :code="scope.row.description" lang="sh" style="margin-top: 5px"/>
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
  version: {
    assetId: {
      alias: 'ID'
    },
    name: {
      alias: '名称',
      show: true
    },
    assetKey: {
      alias: '类型',
      show: false
    },
    assetKey2: {
      alias: '执行路径',
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
      activeName: 'version',
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
      if (tab.name === 'version') {
        this.$refs.versionTable.fetchData()
        return
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.versionTable) {
          this.$refs.versionTable.fetchData()
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
