<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <datasource-instance-title v-if="instance.id !== null" :instance-id="instance.id"
                               datasource-nane="Aliyun实例管理"></datasource-instance-title>
    <el-tabs v-model="activeName.name" v-if="instance.id !== null" @tab-click="handleClick">
      <el-tab-pane label="弹性计算" name="elasticCompute">
        <el-tabs tab-position="left" v-model="activeName.ecs" @tab-click="handleClick">
          <el-tab-pane label="ECS" name="ecs">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ECS"
                         :tableLayout="tableLayout.elasticCompute.ecs"
                         ref="ecsTable">
              <template v-slot:extend>
                <el-table-column prop="assetKey" label="IP地址" width="150">
                  <template v-slot="scope">
                    <span>{{ scope.row.assetKey }}
                      <span style="color: #8492a6 ; font-size: 12px">私有</span>
                    </span>
                    <div v-if="scope.row.assetKey2">{{ scope.row.assetKey2 }}
                      <span style="color: #8492a6 ; font-size: 12px">公有</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="properties" label="配置">
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.cpu }} vCPU </span>
                    <span style="margin-right: 5px">{{ scope.row.properties.memory / 1024 }} GiB</span>
                    <div>{{ scope.row.properties.osType }}</div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="Image" name="image">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ECS_IMAGE"
                         :tableLayout="tableLayout.elasticCompute.image"
                         ref="imageTable">
              <template v-slot:extend>
                <el-table-column label="操作系统" show-overflow-tooltip>
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.oSName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="系统大小(GiB)">
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.size }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="描述" show-overflow-tooltip>
                  <template v-slot="scope">
                    <span>{{ scope.row.description }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="VPC" name="vpc">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.VPC"
                         :tableLayout="tableLayout.elasticCompute.vpc"
                         ref="vpcTable">
              <template v-slot:extend>
                <el-table-column label="安全组" width="450">
                  <template v-slot="scope">
                    <div v-for="sg in getSecurityGroups(scope.row)" :key="sg.id">
                      <el-tag size="mini" :type="sg.isActive?'success':'info'">{{ sg.name }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="交换机" width="350">
                  <template v-slot="scope">
                    <el-tree :data="getVSwitches(scope.row)" accordion></el-tree>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="ACR" name="acr">
        <el-tabs tab-position="left" v-model="activeName.acr" @tab-click="handleClick">
          <el-tab-pane label="ACR实例" name="acrInstance">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ACR_INSTANCE"
                         :tableLayout="tableLayout.acr.instance"
                         ref="acrInstanceTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="域名">
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.domain }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="命名空间" width="200">
                  <template v-slot="scope">
                    <span v-for="namespace in scope.row.tree.ACR_NAMESPACE" :key="namespace.id">
                      <el-tag size="mini" style="margin-right: 2px">{{ namespace.name }}</el-tag>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="仓库" width="400">
                  <template v-slot="scope">
                    <span v-for="repository in scope.row.tree.ACR_REPOSITORY" :key="repository.id">
                      <el-tag size="mini" style="margin-right: 2px">{{ repository.name }}</el-tag>
                    </span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="命名空间" name="acrInstanceNamespace">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ACR_NAMESPACE"
                         :tableLayout="tableLayout.acr.namespace"
                         ref="acrInstanceNamespaceTable">
              <template v-slot:extend>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="镜像仓库" name="acrInstanceRepository">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ACR_REPOSITORY"
                         :tableLayout="tableLayout.acr.repository"
                         ref="acrInstanceRepositoryTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="实例ID">
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.instanceId }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="RAM访问控制" name="ram">
        <el-tabs tab-position="left" v-model="activeName.ram" @tab-click="handleClick">
          <el-tab-pane label="RAM用户" name="ramUser">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.RAM_USER"
                         :tableLayout="tableLayout.ram.user"
                         ref="ramUserTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="授权的策略" width="300">
                  <template v-slot="scope">
                    <ds-children-tag :children="scope.row.children.RAM_POLICY" :type="0"/>
                  </template>
                </el-table-column>
                <el-table-column label="Access Key" width="200">
                  <template v-slot="scope">
                    <div v-for="ak in getAccessKeys(scope.row)" :key="ak.id">
                      <el-tag size="mini" :type="ak.isActive?'success':'info'">{{ ak.name }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="RAM策略" name="ramPolicy">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.RAM_POLICY"
                         :tableLayout="tableLayout.ram.policy" :enableActive="true" ref="ramPolicyTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="成员用户" width="300">
                  <template v-slot="scope">
                    <ds-children-tag :children="scope.row.children.RAM_USER" :type="4"/>
                  </template>
                </el-table-column>
                <el-table-column label="描述">
                  <template v-slot="scope">
                    <span>{{ scope.row.description }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="云数据库" name="rds">
        <el-tabs tab-position="left" v-model="activeName.rds" @tab-click="handleClick">
          <el-tab-pane label="RDS实例" name="rdsInstance">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.RDS_INSTANCE"
                         :tableLayout="tableLayout.rds.instance"
                         ref="rdsInstanceTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="数据库类型">
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.engine }} {{ scope.row.properties.engineVersion }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="properties" label="实例详情">
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.instanceCPU }} 核</span>
                    <span> / {{ scope.row.properties.instanceMemory }} M</span>
                    <el-popover placement="right" trigger="hover">
                      <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
                      <entry-detail name="CPU" :value="scope.row.properties.instanceCPU" unit="核"/>
                      <br/>
                      <entry-detail name="数据库内存" :value="scope.row.properties.instanceMemory" unit="M"/>
                      <br/>
                      <entry-detail name="存储空间" :value="scope.row.properties.instanceStorage" unit="G"/>
                      <br/>
                      <entry-detail name="最大IOPS" :value="scope.row.properties.maxIOPS"/>
                      <br/>
                      <entry-detail name="最大连接数" :value="scope.row.properties.maxConnections"/>
                      <br/>
                      <el-divider>
                        <span style="color: #8492a6 ; font-size: 12px">内网地址</span>
                      </el-divider>
                      <span v-clipboard:copy="scope.row.properties.connectionString" v-clipboard:success="onCopy"
                            v-clipboard:error="onError">
                        <span>{{ scope.row.properties.connectionString }}</span>
                      </span>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="数据库" width="300">
                  <template v-slot="scope">
                    <div v-for="database in scope.row.tree.RDS_DATABASE" :key="database.id">
                      <el-tag size="mini">{{ database.name }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="RDS数据库" name="rdsDatabase">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.RDS_DATABASE"
                         :tableLayout="tableLayout.rds.database" ref="rdsDatabaseTable">
              <template v-slot:extend>
                <el-table-column prop="children" label="RDS实例" width="350">
                  <template v-slot="scope">
                    <ds-children-tag :children="scope.row.children.RDS_INSTANCE" :type="4"/>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="Redis实例" name="redisInstance">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.REDIS_INSTANCE"
                         :tableLayout="tableLayout.rds.redis.instance" ref="redisInstanceTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="数据库类型">
                  <template v-slot="scope">
                    <span>{{ scope.row.kind }} {{ scope.row.properties.engineVersion }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="properties" label="实例详情">
                  <template v-slot="scope">
                    <span>{{ scope.row.properties.capacity }} MB</span>
                    <el-popover placement="right" trigger="hover">
                      <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
                      <entry-detail name="实例容量" :value="scope.row.properties.capacity"
                                    unit="MB"/>
                      <br/>
                      <entry-detail name="最大私网带宽" :value="scope.row.properties.bandwidth" unit="MB/s"/>
                      <br/>
                      <entry-detail name="QPS" :value="scope.row.properties.qps"/>
                      <br/>
                      <entry-detail name="最大连接数" :value="scope.row.properties.connections"/>
                      <el-divider>
                        <span style="color: #8492a6 ; font-size: 12px">连接信息-专有网络</span>
                      </el-divider>
                      <span v-clipboard:copy="scope.row.properties.connectionDomain" v-clipboard:success="onCopy"
                            v-clipboard:error="onError">
                        <span>{{ scope.row.properties.connectionDomain }}</span>
                      </span>
                    </el-popover>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="DMS数据管理" name="dms">
        <el-tabs tab-position="left" v-model="activeName.dms" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="dmsUser">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.DMS_USER"
                         :tableLayout="tableLayout.dms.user" ref="dmsUserTable">
              <template v-slot:button>
                <el-button @click="handlePushRamUser">推送RAM用户</el-button>
              </template>
              <template v-slot:extend>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="ONS消息服务" name="ons">
        <el-tabs tab-position="left" v-model="activeName.ons" @tab-click="handleClick">
          <el-tab-pane label="实例" name="onsRocketMqInstance">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ONS_ROCKETMQ_INSTANCE"
                         :tableLayout="tableLayout.ons.rocketMq.instance"
                         ref="onsRocketMqInstanceTable">
              <template v-slot:extend>
                <el-table-column prop="properties" label="实例详情">
                  <template v-slot="scope">
                    <span>{{ scope.row.kind }}</span>
                    <el-popover placement="right" width="650" trigger="hover">
                      <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
                      <el-divider>
                        <span style="color: #8492a6; font-size: 12px">TCP 协议客户端接入点</span>
                      </el-divider>
                      <entry-detail name="接入点" :value="scope.row.properties.tcpEndpoint" :copy="true"/>
                      <br/>
                      <el-divider>
                        <span style="color: #8492a6; font-size: 12px">HTTP 协议客户端接入点</span>
                      </el-divider>
                      <entry-detail name="内网" :value="scope.row.properties.httpInternetEndpoint" :copy="true"/>
                      <br/>
                      <entry-detail name="公网" :value="scope.row.properties.httpInternalEndpoint" :copy="true"/>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="资源" width="300">
                  <template v-slot="scope">
                    <el-divider content-position="left" v-if="scope.row.tree.ONS_ROCKETMQ_TOPIC !== undefined">
                      <b style="color: #9d9fa3">Topic</b>
                    </el-divider>
                    <div v-for="topic in scope.row.tree.ONS_ROCKETMQ_TOPIC" :key="topic.id">
                      <el-tooltip class="item" :content="topic.description" placement="bottom" effect="light">
                        <el-tag size="mini">{{ topic.name }}</el-tag>
                      </el-tooltip>
                    </div>
                    <el-divider content-position="left" v-if="scope.row.tree.ONS_ROCKETMQ_GROUP !== undefined">
                      <b style="color: #9d9fa3">Group</b>
                    </el-divider>
                    <div v-for="group in scope.row.tree.ONS_ROCKETMQ_GROUP" :key="group.id">
                      <el-tooltip class="item" :content="group.description" placement="bottom" effect="light">
                        <el-tag size="mini">{{ group.name }}</el-tag>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="备注">
                  <template v-slot="scope">
                    <span>{{ scope.row.description }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="Topic" name="onsRocketMqTopic">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ONS_ROCKETMQ_TOPIC"
                         :tableLayout="tableLayout.ons.rocketMq.topic"
                         ref="onsRocketMqTopicTable">
              <template v-slot:extend>
                <el-table-column prop="kind" label="消息类型">
                  <template v-slot="scope">
                    <span>{{ scope.row.kind }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="备注">
                  <template v-slot="scope">
                    <span>{{ scope.row.description }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
          <el-tab-pane label="Group" name="onsRocketMqGroup">
            <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ONS_ROCKETMQ_GROUP"
                         :tableLayout="tableLayout.ons.rocketMq.group"
                         ref="onsRocketMqGroupTable">
              <template v-slot:extend>
                <el-table-column prop="kind" label="客户端协议">
                  <template v-slot="scope">
                    <span>{{ scope.row.kind }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="备注">
                  <template v-slot="scope">
                    <span>{{ scope.row.description }}</span>
                  </template>
                </el-table-column>
              </template>
            </asset-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="域名" name="domain">
        <asset-table :instanceId="instance.id" :assetType="assetType.ALIYUN.ALIYUN_DOMAIN"
                     :tableLayout="tableLayout.domain"
                     ref="domainTable">
          <template v-slot:extend>
            <el-table-column prop="createdTime" label="注册时间"/>
            <el-table-column prop="expiredTime" label="到期时间"/>
            <el-table-column prop="properties" label="提示">
              <template v-slot="scope">
                <span>还有{{ scope.row.properties.ExpirationCurrDateDiff }}天过期</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="备注"/>
          </template>
        </asset-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
import { PUSH_ASSET } from '@/api/modules/datasource/datasource.asset.api.js'
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
  elasticCompute: {
    ecs: {
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
        alias: 'Region ID',
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
        alias: '镜像ID',
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
    }
  },
  acr: {
    instance: {
      assetId: {
        alias: '实例ID'
      },
      name: {
        alias: '名称',
        show: false
      },
      assetKey: {
        alias: '',
        show: false
      },
      assetKey2: {
        alias: '实例类型',
        show: true
      },
      zone: {
        alias: '区',
        show: false
      }
    },
    namespace: {
      assetId: {
        alias: 'ID'
      },
      name: {
        alias: '名称',
        show: true
      },
      assetKey: {
        alias: '',
        show: false
      },
      assetKey2: {
        alias: '实例ID',
        show: true
      },
      zone: {
        alias: '区',
        show: false
      }
    },
    repository: {
      assetId: {
        alias: '仓库ID'
      },
      name: {
        alias: '仓库名称',
        show: true
      },
      assetKey: {
        alias: '',
        show: false
      },
      assetKey2: {
        alias: '命名空间',
        show: true
      },
      zone: {
        alias: '区',
        show: false
      }
    }
  },
  ram: {
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
  },
  rds: {
    instance: {
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
    database: {
      assetId: {
        alias: '实例ID',
        show: true
      },
      name: {
        alias: '数据库名称',
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
    redis: {
      instance: {
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
      }
    }
  },
  dms: {
    user: {
      assetId: {
        alias: '用户ID',
        show: false
      },
      name: {
        alias: '显示名',
        show: true
      },
      assetKey: {
        alias: 'UID',
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
  },
  ons: {
    rocketMq: {
      instance: {
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
      topic: {
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
      group: {
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
      activeName: {
        name: 'elasticCompute',
        ecs: 'ecs',
        acr: 'acrInstance',
        ram: 'ramUser',
        rds: 'rdsInstance',
        ons: 'onsRocketMqInstance',
        dms: 'dmsUser'
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
    EntryDetail,
    DatasourceInstanceTitle
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'ecs' || tab.name === 'elasticCompute') {
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
      // ACR
      if (tab.name === 'acrInstance' || tab.name === 'acr') {
        this.$refs.acrInstanceTable.fetchData()
        return
      }
      if (tab.name === 'acrInstanceNamespace') {
        this.$refs.acrInstanceNamespaceTable.fetchData()
        return
      }
      if (tab.name === 'acrInstanceRepository') {
        this.$refs.acrInstanceRepositoryTable.fetchData()
        return
      }

      if (tab.name === 'ramUser' || tab.name === 'ram') {
        this.$refs.ramUserTable.fetchData()
        return
      }
      if (tab.name === 'ramPolicy') {
        this.$refs.ramPolicyTable.fetchData()
        return
      }
      if (tab.name === 'rdsInstance' || tab.name === 'rds') {
        this.$refs.rdsInstanceTable.fetchData()
        return
      }
      if (tab.name === 'rdsDatabase') {
        this.$refs.rdsDatabaseTable.fetchData()
        return
      }
      if (tab.name === 'redisInstance') {
        this.$refs.redisInstanceTable.fetchData()
        return
      }
      if (tab.name === 'dmsUser' || tab.name === 'dms') {
        this.$refs.dmsUserTable.fetchData()
        return
      }
      if (tab.name === 'onsRocketMqInstance' || tab.name === 'ons') {
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
      if (tab.name === 'domain') {
        this.$refs.domainTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        this.$refs.ecsTable.fetchData()
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
    handlePushRamUser () {
      PUSH_ASSET({
        instanceId: this.instance.id,
        assetType: this.assetType.ALIYUN.DMS_USER
      }).then(() => {
        this.$message.success('后台任务执行中！')
      })
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
