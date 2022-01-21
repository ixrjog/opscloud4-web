<template>
  <d2-container>
    <datasource-instance-title v-if="instance.id !== null" :instance-id="instance.id"
                               datasource-nane="AWS实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName.name" v-if="instance.id !== null" @tab-click="handleClick">
      <el-tab-pane label="IAM访问控制" name="iam">
        <el-tabs tab-position="left" v-model="activeName.iam" @tab-click="handleClick">
          <el-tab-pane label="IAM用户" name="iamUser">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.IAM_USER"
                         :tableLayout="tableLayout.iamUser"
                         ref="iamUserTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="授权的策略" width="300">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.IAM_POLICY" :type="5"></ds-children-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Access Key" width="200">
                  <template slot-scope="scope">
                    <div v-for="ak in getAccessKeys(scope.row)" :key="ak.id">
                      <el-tag :type="ak.isActive?'success':'info'">{{ ak.name }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="IAM策略" name="iamPolicy">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.IAM_POLICY"
                         :tableLayout="tableLayout.iamPolicy" :enableActive="true" ref="iamPolicyTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="成员用户" width="300">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.IAM_USER" :type="4"></ds-children-tag>
                  </template>
                </el-table-column>
                <el-table-column label="描述">
                  <template slot-scope="scope">
                    <span>{{ scope.row.description }}</span>
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
import DsChildrenTag from '../../../../components/opscloud/datasource/common/DsChildrenTag'
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'

const tableLayout = {
  iamUser: {
    assetId: {
      alias: 'User ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '用户名',
      show: true
    },
    assetKey2: {
      alias: 'Email',
      show: false
    },
    zone: {
      alias: '区',
      show: false
    }
  },
  iamPolicy: {
    assetId: {
      alias: '策略名称',
      show: false
    },
    name: {
      alias: '策略名称',
      show: false
    },
    assetKey: {
      alias: '策略类型',
      show: true
    },
    assetKey2: {
      alias: '',
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
        name: 'iam',
        iam: 'iamUser'
      },
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
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'iamUser' || tab.name === 'iam') {
        this.$refs.iamUserTable.fetchData()
        return
      }
      if (tab.name === 'iamPolicy') {
        this.$refs.iamPolicyTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        this.$refs.iamUserTable.fetchData()
      }, 50)
    },
    getAccessKeys (row) {
      const { IAM_ACCESS_KEY } = row.tree
      if (IAM_ACCESS_KEY) {
        return IAM_ACCESS_KEY
      }
      return []
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
