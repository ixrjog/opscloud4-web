<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instanceId !== null" :instance-id="instanceId"
                               datasource-nane="Gitlab实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="项目" name="project">
        <asset-table :instanceId="instanceId" :assetType="assetType.GITLAB.GITLAB_PROJECT"
                     :tableLayout="tableLayout.project" ref="projectTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="地址" width="400">
              <template v-slot="scope">
                <div>
                  <span v-clipboard:copy="scope.row.assetKey" v-clipboard:success="onCopy"
                        v-clipboard:error="onError">{{ scope.row.assetKey }}</span>
                </div>
                <div>
                  <el-link :href="scope.row.assetKey2" target="_blank" type="primary" :underline="false"
                           style="font-size: 12px">
                    {{ scope.row.assetKey2 }}
                  </el-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="命名空间">
              <template v-slot="scope">
                <span>{{ scope.row.properties.namespaceName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述">
              <template v-slot="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <asset-table id="groupTable" :instanceId="instanceId" :assetType="assetType.GITLAB.GITLAB_GROUP"
                     :tableLayout="tableLayout.group" ref="groupTable">
          <template v-slot:extend>
            <el-table-column prop="children" label="成员(项目)" width="500px">
              <template v-slot="scope">
                <ds-children-tag :children="scope.row.children.GITLAB_PROJECT" :type="2"/>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="描述">
              <template v-slot="scope">
                <span>{{ scope.row.properties.description }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="用户" name="user">
        <asset-table :instanceId="instanceId" :assetType="assetType.GITLAB.GITLAB_USER" :tableLayout="tableLayout.user"
                     ref="userTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="管理员">
              <template v-slot="scope">
                <whether-tag :whether="scope.row.properties.isAdmin"/>
              </template>
            </el-table-column>
            <el-table-column prop="children" label="密钥" width="200" v-if="false">
              <template v-slot="scope">
                <ds-children-tag :children="scope.row.children.GITLAB_SSHKEY" :type="2"/>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="密钥" name="sshKey">
        <asset-table :instanceId="instanceId" :assetType="assetType.GITLAB.GITLAB_SSHKEY"
                     :tableLayout="tableLayout.sshKey"
                     ref="sshKeyTable">
          <template v-slot:extend>
          </template>
        </asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type.js'
import DsChildrenTag from '../../../../components/opscloud/datasource/common/DsChildrenTag'
import WhetherTag from '../../../../components/opscloud/common/tag/WhetherTag'
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'

const tableLayout = {
  project: {
    assetId: {
      alias: 'Project ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: 'sshUrl'
    },
    assetKey2: {
      alias: '',
      show: false
    },
    zone: {
      alias: '',
      show: false
    }
  },
  group: {
    assetId: {
      alias: 'Group ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: 'webUrl'
    },
    assetKey2: {
      alias: '',
      show: false
    },
    zone: {
      alias: '',
      show: false
    }
  },
  user: {
    assetId: {
      alias: 'User ID'
    },
    name: {
      alias: '显示名'
    },
    assetKey: {
      alias: '用户名'
    },
    assetKey2: {
      alias: 'Email',
      show: true
    },
    zone: {
      alias: '',
      show: false
    },
    description: {
      alias: '描述',
      show: false
    }
  },
  sshKey: {
    assetId: {
      alias: 'Key ID'
    },
    name: {
      alias: '用户名'
    },
    assetKey: {
      alias: '指纹',
      show: true
    },
    assetKey2: {
      alias: 'Pub Key',
      show: false
    },
    zone: {
      alias: '',
      show: false
    },
    description: {
      alias: '标题',
      show: true
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
    DsChildrenTag,
    WhetherTag,
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'group') {
        this.$refs.groupTable.fetchData()
      }
      if (tab.name === 'project') {
        this.$refs.projectTable.fetchData()
      }
      if (tab.name === 'user') {
        this.$refs.userTable.fetchData()
      }
      if (tab.name === 'sshKey') {
        this.$refs.sshKeyTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.projectTable) {
          this.$refs.projectTable.fetchData()
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
  box-sizing: border-box;
}

</style>
