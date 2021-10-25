<template>
  <d2-container>
    <h1>SonarQube实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="项目管理" name="project">
        <asset-table :instanceId="instanceId" :assetType="assetType.SONAR.SONAR_PROJECT" :tableLayout="tableLayout.project"
                     ref="projectTable">
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
import DsChildrenTag from '@/components/opscloud/datasource/common/DsChildrenTag'

const tableLayout = {
  project: {
    assetId: {
      alias: '项目ID'
    },
    name: {
      alias: '项目名'
    },
    assetKey: {
      alias: '项目名'
    },
    assetKey2: {
      alias: '组织',
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
      activeName: 'project',
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
      if (tab.name === 'project') {
        this.$refs.projectTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.projectTable) {
          this.$refs.projectTable.fetchData()
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
