<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instanceId !== null" :instance-id="instanceId"
                               datasource-nane="MeterSphere实例管理"/>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="Build Hook" name="buildHook">
        <asset-table :instanceId="instanceId" :assetType="assetType.METER_SPHERE.METER_SPHERE_BUILD_HOOK"
                     :tableLayout="tableLayout.build" ref="buildHookTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="SUCCESS">
              <template v-slot="scope">
                <el-tag mini :type="scope.row.properties.success === 'true' ? 'success': 'danger'">
                  {{ scope.row.properties.success }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Hook">
              <template v-slot="scope">
                <json-view :json-content="scope.row.properties.hook"/>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Result">
              <template v-slot="scope">
                <json-view :json-content="scope.row.properties.body"/>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Deploy Hook" name="deployHook">
        <asset-table :instanceId="instanceId" :assetType="assetType.METER_SPHERE.METER_SPHERE_DEPLOY_HOOK"
                     :tableLayout="tableLayout.deploy" ref="deployHookTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="SUCCESS">
              <template v-slot="scope">
                <el-tag mini :type="scope.row.properties.success === 'true' ? 'success': 'danger'">
                  {{ scope.row.properties.success }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Hook">
              <template v-slot="scope">
                <json-view :json-content="scope.row.properties.hook"/>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="Result">
              <template v-slot="scope">
                <json-view :json-content="scope.row.properties.body"/>
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
import JsonView from '@/components/opscloud/common/view/JsonView.vue'

const tableLayout = {
  build: {
    assetId: {
      alias: 'Build ID'
    },
    name: {
      alias: '任务名称',
      show: true
    },
    assetKey: {
      alias: '-',
      show: false
    },
    assetKey2: {
      alias: 'Project ID',
      show: true
    },
    zone: {
      alias: '',
      show: false
    }
  },
  deploy: {
    assetId: {
      alias: 'Deploy ID'
    },
    name: {
      alias: '任务名称',
      show: true
    },
    assetKey: {
      alias: 'Build ID',
      show: true
    },
    assetKey2: {
      alias: 'Project ID',
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
      activeName: 'buildHook',
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
    JsonView,
    AssetTable,
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'buildHook') {
        this.$refs.buildHookTable.fetchData()
        return
      }
      if (tab.name === 'deployHook') {
        this.$refs.deployHookTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.buildHookTable) {
          this.$refs.buildHookTable.fetchData()
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
