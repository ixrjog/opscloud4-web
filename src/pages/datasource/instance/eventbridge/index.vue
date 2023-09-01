<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instanceId !== null" :instance-id="instanceId"
                               datasource-nane="EventBridge"/>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="Deploy Event" name="deployEvent">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN_EVENTBRIDGE.EVENT_BRIDGE_DEPLOY_EVENT"
                     :tableLayout="tableLayout.deploy" ref="deployEventTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="Success" width="150px">
              <template v-slot="scope">
                <el-tag mini :type="scope.row.properties.success === 'true' ? 'success': 'danger'">
                  {{ scope.row.properties.success }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Hook">
              <template v-slot="scope">
                <my-highlight v-if="scope.row.properties.hook !== ''" :code="scope.row.properties.hook" lang="json"/>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Request ID">
              <template v-slot="scope">
                {{ scope.row.properties.requestId !== null ? scope.row.properties.requestId : '' }}
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
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

const tableLayout = {
  deploy: {
    assetId: {
      alias: 'Event ID'
    },
    name: {
      alias: '任务名称',
      show: true
    },
    assetKey: {
      alias: 'Deploy ID',
      show: true
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
      activeName: 'deployEvent',
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
    MyHighlight
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'deployEvent') {
        this.$refs.deployEventTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.deployEventTable) {
          this.$refs.deployEventTable.fetchData()
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
