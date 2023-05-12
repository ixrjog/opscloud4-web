<template>
  <d2-container>
    <datasource-instance-title v-if="instance.id !== null" :instance-id="instance.id"
                               datasource-nane="云效实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName" v-if="instance.id !== null" @tab-click="handleClick">
      <el-tab-pane label="项目" name="project">
        <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN_DEVOPS.ALIYUN_DEVOPS_PROJECT"
                     :tableLayout="tableLayout.project"
                     ref="projectTable">
          <template v-slot:extend>
            <el-table-column prop="tree" label="迭代" width="300">
              <template v-slot="scope">
                    <span v-for="sprint in scope.row.tree.ALIYUN_DEVOPS_SPRINT" :key="sprint.id">
                      <el-tag size="mini" style="margin-right: 2px">{{ sprint.name }}</el-tag>
                    </span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="备注"></el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="迭代" name="sprint">
        <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN_DEVOPS.ALIYUN_DEVOPS_SPRINT"
                     :tableLayout="tableLayout.sprint"
                     ref="sprintTable">
          <template v-slot:extend>
            <el-table-column prop="tree" label="工作项" width="300">
              <template v-slot="scope">
                    <span v-for="workitem in scope.row.tree.ALIYUN_DEVOPS_WORKITEM" :key="workitem.id">
                      <el-tag size="mini" style="margin-right: 2px">{{ workitem.name }}</el-tag>
                    </span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="备注"></el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="工作项" name="workitem">
        <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN_DEVOPS.ALIYUN_DEVOPS_WORKITEM"
                     :tableLayout="tableLayout.workitem"
                     ref="workitemTable">
          <template v-slot:extend>
            <el-table-column prop="description" label="工作项内容"></el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'
import DsChildrenTag from '../../../../components/opscloud/datasource/common/DsChildrenTag'
import EntryDetail from '@/components/opscloud/common/EntryDetail'
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'

const treeObj = {
  label: '',
  children: []
}

const tableLayout = {
  project: {
    assetId: {
      alias: '项目ID'
    },
    name: {
      alias: '项目名称'
    },
    assetKey: {
      alias: '-',
      show: false
    },
    assetKey2: {
      alias: '资源大类型',
      show: false
    },
    zone: {
      alias: '-',
      show: false
    }
  },
  sprint: {
    assetId: {
      alias: '迭代ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '项目ID',
      show: false
    },
    assetKey2: {
      show: false
    },
    zone: {
      alias: '-',
      show: false
    }
  },
  workitem: {
    assetId: {
      alias: '工作项ID'
    },
    name: {
      alias: '工作项标题'
    },
    assetKey: {
      alias: '-',
      show: false
    },
    assetKey2: {
      alias: '工作项类型',
      show: true,
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
      activeName: 'project',
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
    DsChildrenTag,
    EntryDetail,
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'project') {
        this.$refs.projectTable.fetchData()
        return
      }
      if (tab.name === 'sprint') {
        this.$refs.sprintTable.fetchData()
        return
      }
      if (tab.name === 'workitem') {
        this.$refs.workitemTable.fetchData()
        return
      }
    },
    init () {
      setTimeout(() => {
        this.$refs.projectTable.fetchData()
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
