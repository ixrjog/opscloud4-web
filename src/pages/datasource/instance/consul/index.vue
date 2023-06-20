<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instanceId !== null" :instance-id="instanceId"
                               datasource-nane="Consul实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="服务" name="service">
        <asset-table :instanceId="instanceId" :assetType="assetType.CONSUL.CONSUL_SERVICE"
                     :tableLayout="tableLayout.service" ref="serviceTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="Health Checks">
              <template v-slot="scope">
                <entry-detail :value="scope.row.properties.checksPassing" name="ChecksPassing"/>
                <br/>
                <entry-detail :value="scope.row.properties.checksCritical" name="ChecksCritical"/>
                <br/>
                <entry-detail :value="scope.row.properties.checksWarning" name="ChecksWarning"/>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Nodes">
              <template v-slot="scope">
                <div v-for="node in JSON.parse(scope.row.properties.nodes )" :key="node">
                  {{ node }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" v-if="false">
              <template v-slot="scope">
                {{ scope.row.description }}
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
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'
import EntryDetail from '@/components/opscloud/common/EntryDetail'

const tableLayout = {
  service: {
    assetId: {
      alias: 'Name',
      show: false
    },
    name: {
      alias: '服务名称'
    },
    assetKey: {
      alias: 'Na',
      show: false
    },
    assetKey2: {
      alias: 'Data Center',
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
      activeName: 'service',
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
    DatasourceInstanceTitle,
    EntryDetail
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'service') {
        this.$refs.serviceTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.serviceTable) {
          this.$refs.serviceTable.fetchData()
        }
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
