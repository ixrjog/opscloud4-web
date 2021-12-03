<template>
  <d2-container>
    <h1>Aliyun实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="云服务器" name="cloudServer">
        <el-tabs tab-position="left" v-model="cloudServerActiveName" @tab-click="handleClick">
          <el-tab-pane label="ECS" name="ecs">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ECS" :tableLayout="tableLayout.ecs"
                         ref="ecsTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="CPU">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties.cpu }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="properties" label="内存(MiB)">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties.memory }}</span>
                  </template>
                </el-table-column>
              </template>
              <!--          <template v-slot:operation="scope">-->
              <!--            <el-button type="primary" plain size="mini" v-if="JSON.stringify(scope.row.convertBusinessTypes) !== '{}' && scope.row.convertBusinessTypes.SERVER !== null"-->
              <!--                       @click="handleImportServer(scope.row.convertBusinessTypes.SERVER)">导入</el-button>-->
              <!--          </template>-->
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="Image" name="image">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ECS_IMAGE"
                         :tableLayout="tableLayout.image"
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
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.VPC" :tableLayout="tableLayout.vpc"
                         ref="vpcTable">
              <template v-slot:extend>
                <el-table-column label="安全组" width="450">
                  <template slot-scope="scope">
                    <div v-for="sg in getSecurityGroups(scope.row)" :key="sg.id">
                      <el-tag :type="sg.isActive?'success':'info'">{{ sg.name }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="交换机" width="350">
                  <template slot-scope="scope">
                    <el-tree :data="getVSwitches(scope.row)" accordion></el-tree>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="RAM访问控制" name="ram">
        <el-tabs tab-position="left" v-model="ramActiveName" @tab-click="handleClick">
          <el-tab-pane label="RAM用户" name="ramUser">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.RAM_USER"
                         :tableLayout="tableLayout.ramUser"
                         ref="ramUserTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="授权的策略" width="500">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.RAM_POLICY" :type="0"></ds-children-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Access Key" width="180">
                  <template slot-scope="scope">
                    <div v-for="ak in getAccessKeys(scope.row)" :key="ak.id">
                      <el-tag :type="ak.isActive?'success':'info'">{{ ak.name }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="RAM策略" name="ramPolicy">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.RAM_POLICY"
                         :tableLayout="tableLayout.ramPolicy" ref="ramPolicyTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="成员用户" width="400">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.RAM_USER" :type="4"></ds-children-tag>
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
      <el-tab-pane label="RDS云数据库" name="rds">
        <el-tabs tab-position="left" v-model="rdsActiveName" @tab-click="handleClick">
          <el-tab-pane label="Mysql实例" name="rdsMysqlInstance">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.RDS_MYSQL_INSTANCE"
                         :tableLayout="tableLayout.rdsMysqlInstance"
                         ref="rdsMysqlInstanceTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="Database" width="400">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.RDS_MYSQL_DATABASE" :type="5"></ds-children-tag>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="MysqlDatabase" name="rdsMysqlDatabase">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.RDS_MYSQL_DATABASE"
                         :tableLayout="tableLayout.rdsMysqlDatabase" ref="rdsMysqlDatabaseTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="Mysql实例" width="350">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.RDS_MYSQL_INSTANCE" :type="4"></ds-children-tag>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="ONS消息服务" name="ons">
        <el-tabs tab-position="left" v-model="onsActiveName" @tab-click="handleClick">
          <el-tab-pane label="实例" name="onsRocketMqInstance">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ONS_ROCKETMQ_INSTANCE"
                         :tableLayout="tableLayout.onsRocketMqInstance"
                         ref="onsRocketMqInstanceTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="Topic" width="400">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.ONS_ROCKETMQ_TOPIC" :type="3"></ds-children-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="children" label="Group" width="400">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.ONS_ROCKETMQ_GROUP" :type="3"></ds-children-tag>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="Topic" name="onsRocketMqTopic">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ONS_ROCKETMQ_TOPIC"
                         :tableLayout="tableLayout.onsRocketMqTopic"
                         ref="onsRocketMqTopicTable">
              <template v-slot:extend>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="Group" name="onsRocketMqGroup">
            <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ONS_ROCKETMQ_GROUP"
                         :tableLayout="tableLayout.onsRocketMqGroup"
                         ref="onsRocketMqGroupTable">
              <template v-slot:extend>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="Log日志服务" name="log">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-card shadow="never">
              <aliyun-log-table :instanceId="instanceId" ref="aliyunLogTable"
                                @handleSelLog="handleSelLog"></aliyun-log-table>
            </el-card>
          </el-col>
          <el-col :span="14">
            <el-card shadow="never">
              <aliyun-log-member-table ref="aliyunLogMemberTable"></aliyun-log-member-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'
import DsChildrenTag from '../../../../components/opscloud/datasource/common/DsChildrenTag'
import AliyunLogTable from '../../../../components/opscloud/datasource/aliyun/log/AliyunLogTable'
import AliyunLogMemberTable from '../../../../components/opscloud/datasource/aliyun/log/AliyunLogMemberTable'

const treeObj = {
  label: '',
  children: []
}

const tableLayout = {
  ecs: {
    assetId: {
      alias: '实例ID'
    },
    name: {
      alias: '实例名称'
    },
    assetKey: {
      alias: '私网IP',
      show: true
    },
    assetKey2: {
      alias: '公网IP',
      show: true
    },
    zone: {
      alias: '区',
      show: true
    }
  },
  image: {
    assetId: {
      alias: '镜像ID'
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
  },
  vpc: {
    assetId: {
      alias: '实例ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '手机',
      show: false
    },
    assetKey2: {
      alias: '网段',
      show: true
    },
    zone: {
      alias: '区',
      show: false
    }
  },
  ramUser: {
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
  ramPolicy: {
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
  },
  rdsMysqlInstance: {
    assetId: {
      alias: '实例ID',
      show: true
    },
    name: {
      alias: '实例名称',
      show: true
    },
    assetKey: {
      alias: '',
      show: false
    },
    assetKey2: {
      alias: '',
      show: false
    },
    zone: {
      alias: '区',
      show: false
    }
  },
  rdsMysqlDatabase: {
    assetId: {
      alias: '实例ID',
      show: true,
    },
    name: {
      alias: '实例名称',
      show: true,
    },
    assetKey: {
      alias: '',
      show: false
    },
    assetKey2: {
      alias: '',
      show: false
    },
    zone: {
      alias: '区',
      show: false
    }
  },
  onsRocketMqInstance: {
    assetId: {
      alias: '实例ID',
      show: true
    },
    name: {
      alias: '实例名称',
      show: true
    },
    assetKey: {
      alias: '',
      show: false
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
  onsRocketMqTopic:{
    assetId: {
      alias: '实例ID',
      show: true
    },
    name: {
      alias: 'Topic',
      show: true
    },
    assetKey: {
      alias: '',
      show: false
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
  onsRocketMqGroup:{
    assetId: {
      alias: '实例ID',
      show: true
    },
    name: {
      alias: 'Group',
      show: true
    },
    assetKey: {
      alias: '',
      show: false
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
      activeName: 'cloudServer',
      cloudServerActiveName: 'ecs',
      ramActiveName: 'ramUser',
      rdsActiveName: 'rdsMysqlInstance',
      onsActiveName: 'onsRocketMqInstance',
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
    AliyunLogTable,
    AliyunLogMemberTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'ecs') {
        this.$refs.ecsTable.fetchData()
        return
      }
      if (tab.name === 'image') {
        this.$refs.imageTable.fetchData()
        return
      }
      if (tab.name === 'vpc') {
        this.$refs.vpcTable.fetchData()
        return
      }
      if (tab.name === 'ramUser') {
        this.$refs.ramUserTable.fetchData()
        return
      }
      if (tab.name === 'ramPolicy') {
        this.$refs.ramPolicyTable.fetchData()
        return
      }
      if (tab.name === 'rdsMysqlInstance') {
        this.$refs.rdsMysqlInstanceTable.fetchData()
        return
      }
      if (tab.name === 'rdsMysqlDatabase') {
        this.$refs.rdsMysqlDatabaseTable.fetchData()
        return
      }
      if (tab.name === 'onsRocketMqInstance') {
        this.$refs.onsRocketMqInstanceTable.fetchData()
        return
      }
      if (tab.name === 'onsRocketMqTopic') {
        this.$refs.onsRocketMqTopicTable.fetchData()
        return
      }
      if (tab.name === 'onsRocketMqGroup') {
        this.$refs.onsRocketMqGroupTable.fetchData()
        return
      }
      if (tab.name === 'log') {
        this.$refs.aliyunLogTable.fetchData()
        return
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.ecsTable) {
          this.$refs.ecsTable.fetchData()
        }
        if (this.$refs.ramUserTable) {
          this.$refs.ramUserTable.fetchData()
        }
        if (this.$refs.rdsMysqlInstanceTable) {
          this.$refs.rdsMysqlInstanceTable.fetchData()
        }
        if (this.$refs.onsRocketMqInstanceTable) {
          this.$refs.onsRocketMqInstanceTable.fetchData()
        }
      }, 50)
    },
    getVSwitches (row) {
      const { V_SWITCH } = row.tree
      if (!V_SWITCH) {
        return []
      }
      const map = new Map()
      for (const sw of V_SWITCH) {
        if (map.get(sw.zone) !== undefined && JSON.stringify(map.get(sw.zone)) !== '[]') {
          map.get(sw.zone).push(sw)
        } else {
          const list = []
          list.push(sw)
          map.set(sw.zone, list)
        }
      }
      const options = []
      for (const [key, value] of map.entries()) {
        const treeNode = Object.assign({}, treeObj)
        const children = []
        for (const item of value) {
          children.push({
            label: `${item.name} (${item.assetKey2})`
          })
        }
        treeNode.label = `${key} (${children.length})`
        treeNode.children = children
        options.push(treeNode)
      }
      return options
    },
    getSecurityGroups (row) {
      const { ECS_SG } = row.tree
      if (ECS_SG) {
        return ECS_SG
      }
      return []
    },
    getAccessKeys (row) {
      const { RAM_ACCESS_KEY } = row.tree
      if (RAM_ACCESS_KEY) {
        return RAM_ACCESS_KEY
      }
      return []
    },
    handleSelLog (logId) {
      this.$refs.aliyunLogMemberTable.initData(logId)
    }
  }
}
</script>

<style scoped>
</style>
