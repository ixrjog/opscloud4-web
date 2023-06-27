<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instance.id !== null" :instance-id="instance.id"
                               datasource-nane="ARMS应用实时监控服务实例管理"/>
    <el-tabs v-model="activeName" v-if="instance.id !== null" @tab-click="handleClick">
      <el-tab-pane label="监控应用" name="traceApp">
        <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN_ARMS.ALIYUN_ARMS_TRACE_APP"
                     :tableLayout="tableLayout.traceApp"
                     ref="appTable">
          <template v-slot:extend>
            <el-table-column prop="regionId" label="Region ID">
              <template v-slot="scope">{{ scope.row.regionId }}</template>
            </el-table-column>
            <el-table-column prop="createdTime" label="创建时间">
              <template v-slot="scope">{{ scope.row.createdTime }}</template>
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
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'

const tableLayout = {
  traceApp: {
    assetId: {
      alias: '应用ID'
    },
    name: {
      alias: '应用名称'
    },
    assetKey: {
      alias: 'PID',
      show: true
    },
    assetKey2: {
      alias: '-',
      show: false
    },
    zone: {
      alias: '-',
      show: false
    }
  }
}

export default {
  data () {
    return {
      activeName: 'traceApp',
      instance: {
        id: null
      },
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType
    }
  },
  computed: {},
  mounted () {
    this.instance.id = this.$route.query.id
    this.init()
  },
  components: {
    AssetTable,
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'traceApp') {
        this.$refs.traceAppTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        this.$refs.appTable.fetchData()
      }, 50)
    },
    onCopy (e) {
      this.$message.success('内容已复制到剪切板！')
    },
    onError (e) {
      this.$message.error('抱歉，复制失败！')
    }
  }
}
</script>

<style scoped>
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 12px 0;
}
</style>
