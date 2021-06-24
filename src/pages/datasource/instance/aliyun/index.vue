<template>
  <d2-container>
    <h1>Aliyun实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="ECS" name="ecs">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ECS" :tableLayout="tableLayout.ecs" ref="ecsTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="cpu">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.cpu }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="内存(GiB)">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.memory }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Image" name="image">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ECS_IMAGE" :tableLayout="tableLayout.image"
                     ref="imageTable">
          <template v-slot:extend>
            <el-table-column label="操作系统" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.properties.oSName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="系统大小(GiB)">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.size }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="VPC" name="vpc">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.VPC" ref="vpcTable"></asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/caesar/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/caesar/common/enums/ds.instance.asset.type'

const tableLayout = {
  ecs: {
    assetId: {
      alias: '实例id'
    },
    name: {
      alias: '实例名称'
    },
    assetKey: {
      alias: '私网ip'
    },
    assetKey2: {
      alias: '公网ip',
      show: true
    },
    zone: {
      alias: '区',
      show: true
    }
  },
  image: {
    assetId: {
      alias: '镜像id'
    },
    name: {
      alias: '镜像名称'
    },
    assetKey: {
      alias: '镜像id',
      show: false
    },
    assetKey2: {
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
      activeName: 'ecs',
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
      if (tab.name === 'ecs') {
        this.$refs.ecsTable.fetchData()
      }
      if (tab.name === 'image') {
        this.$refs.imageTable.fetchData()
      }
      if (tab.name === 'vpc') {
        this.$refs.vpcTable.fetchData()
      }
    },
    init () {
      this.$nextTick(() => {
        this.$refs.ecsTable.fetchData()
      })
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
