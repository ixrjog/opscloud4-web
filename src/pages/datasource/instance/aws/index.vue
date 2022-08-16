<template>
  <d2-container>
    <datasource-instance-title v-if="instance.id !== null" :instance-id="instance.id"
                               datasource-nane="AWS实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName.name" v-if="instance.id !== null" @tab-click="handleClick">
      <el-tab-pane label="弹性计算" name="elasticCompute">
        <el-tabs tab-position="left" v-model="activeName.ec2" @tab-click="handleClick">
          <el-tab-pane label="EC2" name="ec2">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.EC2"
                         :tableLayout="tableLayout.elasticCompute.ec2"
                         ref="ec2Table">
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
                <el-table-column prop="regionId" label="Region ID" width="90">
                  <template slot-scope="scope">
                    <span>{{ scope.row.regionId }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="properties" label="配置">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties.cpu }} vCPU </span>
                    <span style="margin-right: 5px">{{ scope.row.properties.memory / 1024 }} GiB</span>
                    <div>{{ scope.row.properties.platformDetails }}</div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="ECR" name="ecr">
        <el-tabs tab-position="left" v-model="activeName.ecr" @tab-click="handleClick">
          <el-tab-pane label="镜像仓库" name="ecrRepository">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.ECR_REPOSITORY"
                         :tableLayout="tableLayout.ecr.repository"
                         ref="ecrRepositoryTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="实例ID" v-if="false">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties.instanceId }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="IAM访问控制" name="iam">
        <el-tabs tab-position="left" v-model="activeName.iam" @tab-click="handleClick">
          <el-tab-pane label="IAM用户" name="iamUser">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.IAM_USER"
                         :tableLayout="tableLayout.iam.user"
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
                      <el-tag size="mini" :type="ak.isActive?'success':'info'">{{ ak.name }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="IAM策略" name="iamPolicy">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.IAM_POLICY"
                         :tableLayout="tableLayout.iam.policy" :enableActive="true" ref="iamPolicyTable">
              <template v-slot:extend>
                <el-table-column prop="assetKey2" label="ARN" width="400">
                  <template slot-scope="scope">
                    <el-tag size="mini">{{ scope.row.assetKey2 }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="children" label="成员用户" width="200">
                  <template slot-scope="scope">
                    <ds-children-tag :children="scope.row.children.IAM_USER" :type="4"></ds-children-tag>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="消息服务" name="mq">
        <el-tabs tab-position="left" v-model="activeName.mq" @tab-click="handleClick">
          <el-tab-pane label="SQS队列" name="queue">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.SQS"
                         :tableLayout="tableLayout.sqs.queue"
                         ref="queueTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="Region Id">
                  <template slot-scope="scope">
                    <span style="display: block">{{ scope.row.regionId }}</span>
                    <span style="color: #8492a6;font-size: 10px">
                      {{ scope.row.regionId | getAWSRegionTypeText }}</span>
                    <el-popover placement="right" width="600" trigger="hover">
                      <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
                      <el-divider>
                        <span style="color: #8492a6; font-size: 12px">详细信息</span>
                      </el-divider>
                      <entry-detail name="URL" :value="scope.row.assetKey" :copy="true"></entry-detail>
                      <br/>
                      <entry-detail name="ARN" :value="scope.row.assetKey2" :copy="true"></entry-detail>
                      <br/>
                      <el-divider>
                        <span style="color: #8492a6; font-size: 12px">更多</span>
                      </el-divider>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <entry-detail name="最大消息大小"
                                        :value="util.bytesToSize(scope.row.properties.MaximumMessageSize)"></entry-detail>
                        </el-col>
                        <el-col :span="12">
                          <entry-detail name="默认可见性超时"
                                        :value="util.formatSecond(scope.row.properties.VisibilityTimeout)"></entry-detail>
                        </el-col>
                        <el-col :span="12">
                          <entry-detail name="消息保留周期"
                                        :value="util.formatSecond(scope.row.properties.MessageRetentionPeriod)"></entry-detail>
                        </el-col>
                        <el-col :span="12">
                          <entry-detail name="接收消息等待时间" :value="scope.row.properties.ReceiveMessageWaitTimeSeconds"
                                        unit="秒"></entry-detail>
                        </el-col>
                        <el-col :span="12">
                          <entry-detail name="交付延迟" :value="scope.row.properties.DelaySeconds" unit="秒"></entry-detail>
                        </el-col>
                      </el-row>
                      <br/>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间">
                  <template slot-scope="scope">
                    <span>{{ scope.row.createdTime }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="SNS主题" name="topic">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.SNS_TOPIC"
                         :tableLayout="tableLayout.sns.topic" ref="topicTable">
              <template v-slot:extend>
                <el-table-column label="Region ID">
                  <template slot-scope="scope">
                    <span style="display: block">{{ scope.row.regionId }}</span>
                    <span style="color: #8492a6;font-size: 10px">
                      {{ scope.row.regionId | getAWSRegionTypeText }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="assetKey2" label="ARN" width="500" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag size="mini">{{ scope.row.assetKey2 }}</el-tag>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="SNS订阅" name="subscription">
            <asset-table :instanceId="instance.id" :assetType="assetType.AWS.SNS_SUBSCRIPTION"
                         :tableLayout="tableLayout.sns.subscription" ref="subscriptionTable">
              <template v-slot:extend>
                <el-table-column prop="protocol" label="协议" width="50">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties.protocol }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="assetKey2" label="订阅关系" width="600">
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="1">
                        <i class="fas fa-link" style="padding-top: 20px"></i>
                      </el-col>
                      <el-col :span="23">
                        <div>
                          <el-tooltip class="item" effect="dark" content="终端节点" placement="top-end">
                            <el-tag size="mini">{{ scope.row.assetKey }}</el-tag>
                          </el-tooltip>
                        </div>
                        <div>
                          <el-tooltip class="item" effect="dark" content="主题ARN" placement="bottom-end">
                            <el-tag size="mini">{{ scope.row.assetKey2 }}</el-tag>
                          </el-tooltip>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="域名" name="domain">
        <asset-table :instanceId="instance.id" :assetType="assetType.AWS.AMAZON_DOMAIN"
                     :tableLayout="tableLayout.domain"
                     ref="domainTable">
          <template v-slot:extend>
            <el-table-column prop="expiredTime" label="到期时间"></el-table-column>
            <el-table-column prop="description" label="备注"></el-table-column>
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
import DatasourceInstanceTitle from '@/components/opscloud/datasource/DsInstanceTitle'
import util from '@/libs/util'
import EntryDetail from '@/components/opscloud/common/EntryDetail'
import { getAWSRegionTypeText } from '@/filters/cloud.region'

const tableLayout = {
  elasticCompute: {
    ec2: {
      assetId: {
        alias: '实例ID'
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
  },
  iam: {
    user: {
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
    policy: {
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
        show: false
      },
      assetKey2: {
        alias: 'ARN',
        show: false
      },
      zone: {
        alias: '区',
        show: false
      }
    }
  },
  ecr:{
    repository:{
      assetId: {
        alias: 'ARN'
      },
      name: {
        alias: '仓库名称'
      },
      assetKey: {
        alias: '',
        show: false
      },
      assetKey2: {
        alias: 'URI',
        show: true
      },
      zone: {
        alias: '区',
        show: false
      }
    }
  },
  sqs:{
    queue: {
      assetId: {
        alias: 'Queue名称',
        show: false
      },
      name: {
        alias: 'Queue名称',
        show: false
      },
      assetKey: {
        alias: '策略类型',
        show: false
      },
      assetKey2: {
        alias: 'ARN',
        show: false
      },
      zone: {
        alias: '区',
        show: false
      }
    }
  },
  sns: {
    topic: {
      assetId: {
        alias: 'Topic名称',
        show: false
      },
      name: {
        alias: 'Topic名称',
        show: true
      },
      assetKey: {
        alias: '策略类型',
        show: false
      },
      assetKey2: {
        alias: 'ARN',
        show: false
      },
      zone: {
        alias: '区',
        show: false
      }
    },
    subscription: {
      assetId: {
        alias: 'SubscriptionARN',
        show: false
      },
      name: {
        alias: '主题名称',
        show: true
      },
      assetKey: {
        alias: '策略类型',
        show: false
      },
      assetKey2: {
        alias: 'ARN',
        show: false
      },
      zone: {
        alias: '区',
        show: false
      }
    }
  },
  domain: {
    assetId: {
      alias: '域名',
      show: false
    },
    name: {
      alias: '域名',
      show: true
    },
    assetKey: {
      alias: '域名',
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
  }
}

export default {
  data () {
    return {
      activeName: {
        name: 'elasticCompute',
        ecr: 'ecrRepository',
        ec2: 'ec2',
        iam: 'iamUser',
        mq: 'queue'
      },
      instance: {
        id: null
      },
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType,
      util: util
    }
  },
  filters: {
    getAWSRegionTypeText
  },
  computed: {},
  mounted () {
    this.instance.id = this.$route.query.id
    this.init()
  },
  components: {
    EntryDetail,
    AssetTable,
    DsChildrenTag,
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'elasticCompute' || tab.name === 'ec2') {
        this.$refs.ec2Table.fetchData()
        return
      }
      if (tab.name === 'ecr' || tab.name === 'ecrRepository') {
        this.$refs.ecrRepositoryTable.fetchData()
        return
      }
      if (tab.name === 'iamUser' || tab.name === 'iam') {
        this.$refs.iamUserTable.fetchData()
        return
      }
      if (tab.name === 'iamPolicy') {
        this.$refs.iamPolicyTable.fetchData()
        return
      }
      if (tab.name === 'mq' || tab.name === 'queue') {
        this.$refs.queueTable.fetchData()
      }
      if (tab.name === 'topic') {
        this.$refs.topicTable.fetchData()
      }
      if (tab.name === 'subscription') {
        this.$refs.subscriptionTable.fetchData()
      }
      if (tab.name === 'domain') {
        this.$refs.domainTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        this.$refs.ec2Table.fetchData()
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
