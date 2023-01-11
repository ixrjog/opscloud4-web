<template>
  <d2-container>
    <datasource-instance-title v-if="instance.id !== null" :instance-id="instance.id"
                               datasource-nane="华为云实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName.name" v-if="instance.id !== null" @tab-click="handleClick">
      <el-tab-pane label="云服务器" name="cloudServer">
        <el-tabs tab-position="left" v-model="activeName.ecs" @tab-click="handleClick">
          <el-tab-pane label="ECS" name="ecs">
            <asset-table :instanceId="instance.id" :assetType="assetType.HUAWEICLOUD.HUAWEICLOUD_ECS"
                         :tableLayout="tableLayout.ecs"
                         ref="ecsTable">
              <template v-slot:extend>
                <el-table-column prop="assetKey" label="IP地址" width="150">
                  <template slot-scope="scope">
                    <span>{{ scope.row.assetKey }}
                      <span style="color: #8492a6 ; font-size: 12px">私有</span>
                    </span>
                    <div v-if="scope.row.assetKey2">{{ scope.row.assetKey2 }}
                      <span style="color: #8492a6 ; font-size: 12px">公有</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="regionId" label="Region ID" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.regionId }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="properties" label="配置">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties.vcpus }} vCPU </span>
                    <span style="margin-right: 5px">{{ scope.row.properties.ram / 1024 }} GiB</span>
                    <div>{{ scope.row.properties.osType }}</div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'
import util from '@/libs/util'

const tableLayout = {
  ecs: {
    assetId: {
      alias: 'Server ID'
    },
    name: {
      alias: '实例名称'
    },
    assetKey: {
      alias: '私网IP',
      show: false
    },
    assetKey2: {
      alias: '公网IP',
      show: false
    },
    zone: {
      alias: '区',
      show: false
    }
  }
}

export default {
  data () {
    return {
      activeName: {
        name: 'cloudServer',
        ecs: 'ecs'
      },
      instance: {
        id: null
      },
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType,
      util: util
    }
  },
  filters: {},
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
      if (tab.name === 'cloudServer' || tab.name === 'ecs') {
        this.$refs.ecsTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        this.$refs.ecsTable.fetchData()
      }, 50)
    },
    getAccessKeys (row) {
      const { IAM_ACCESS_KEY } = row.tree
      if (IAM_ACCESS_KEY) {
        return IAM_ACCESS_KEY
      }
      return []
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
