<template>
  <div>
    <el-row style="margin-bottom: 5px;">
      <el-select v-model="queryParam.applicationId" filterable clearable
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="handleChange">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
          <select-item :name="item.name" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-radio-group v-model="queryParam.envType" size="mini" @change="fetchData">
        <el-radio-button v-for="env in envOptions" :label="env.envType" :key="env.id">{{
            env.envName
          }}
        </el-radio-button>
      </el-radio-group>
      <el-button @click="fetchData" class="button"
                 :disabled="table.loading || queryParam.applicationId === null || queryParam.applicationId === ''">刷新
      </el-button>
    </el-row>

    <el-row>
      <template v-if="application !== '' && application.resources !== null && application.resources.length > 0">
          <span v-for="resource in application.resources" :key="resource.id">
            <el-card shadow="never" class="deploymentClass" style="font-size: 10px">
               <div style="margin-top: -10px">
                 <!-- Deployment无状态 -->
                 <deployment-name :deployment="resource.name" namespace="" :cluster="resource.instance.instanceName"></deployment-name>
<!--                 <span v-if="resource.instance !== null">{{ resource.instance.instanceName }}:</span>{{ resource.name }}-->
                 <business-tags :tags="resource.tags"></business-tags>
                 <el-tag style="margin-left: 5px">
                    副本数量
                   <deployment-replicas :replicas="resource.assetContainers.length"></deployment-replicas>
                 </el-tag>
                 <el-checkbox style="margin-left: 5px" v-model="resource.checked"
                              @change="handleCheckAllChange(resource)">
                   <span style="font-size: 12px">所有容器</span>
                 </el-checkbox>
                 <el-tooltip class="item" effect="dark" content="执行重新部署任务" placement="top-start" v-if="false">
                     <el-button style="float: right; padding: 3px 0" type="text" @click="handleRedeploy(resource)"><i
                       class="fas fa-redo" v-show="false"></i>Redeploy</el-button>
                 </el-tooltip>
                 <el-tooltip class="item" effect="dark" content="查看容器日志" placement="top-start">
                   <el-button style="float: right; padding: 3px 0" type="text" @click="handleLog(resource)"><i
                     class="fab fa-wpforms" v-show="false"></i>Log</el-button>
                   </el-tooltip>
                 <el-tooltip class="item" effect="dark" content="容器终端，登录容器执行命令" placement="top-start">
                   <el-button style="float: right; padding: 3px 0" type="text" @click="handleTerminal(resource)"><i
                     class="fas fa-terminal" v-show="false"></i>Login</el-button>
                 </el-tooltip>
               </div>
               <el-divider/>
              <!-- Pod容器组 -->
              <div class="podClass">
               <el-card shadow="hover" v-for="pod in resource.assetContainers" :key="pod.asset.name">
                   <!-- podName -->
                   <div style="margin-bottom: 2px"><b style="color: black">{{ pod.asset.name }}</b>
                    <el-popover placement="right" trigger="hover" v-if="false">
                         <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
                         <i class="fas fa-cannabis"></i><span style="margin-left: 5px">{{ pod.properties.image }}</span>
                         <br/>
                         <i class="fas fa-globe"></i><span style="margin-left: 5px">{{ pod.asset.assetKey }}</span>
                      </el-popover>
                   </div>
                   <div><span class="label">容器组IP</span>{{ pod.asset.assetKey }}</div>
                   <div><span class="label">启动时间</span>{{ pod.properties.startTime }}
                    <span style="color: #20A9D9">[{{ pod.ago }}]</span> 重启次数:
                     <span :style="pod.properties.restartCount === '0' ? 'color: #67C23A':'color: #F56C6C'">
                       {{ pod.properties.restartCount }}</span>
                   </div>
                   <div><span class="label">版本名称</span>{{ pod.properties.versionName }}</div>
                   <div><span class="label">镜像地址</span>{{ pod.properties.image }}</div>
                   <pod-phase-tag :pod="pod"></pod-phase-tag>
                     <i class="fab fa-docker" style="margin-right: 5px"></i>
                     <el-checkbox v-for="container in pod.children"
                                  :key="container.asset.name" style="margin-right: 1px"
                                  v-model="container.checked">
                       <span style="font-size: 12px">
                         {{ container.asset.name }}
                       </span>
                     </el-checkbox>
               </el-card>
              </div>
            </el-card>
          </span>
      </template>
    </el-row>

    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" v-if="false">
      <el-table-column prop="name" label="应用名称" width="180">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
          <el-button type="text" v-if="scope.row.document !== null" style="margin-left: 10px"
                     @click="handleDocRead(scope.row)"><i class="fab fa-creative-commons-share"></i>
          </el-button>
          <div style="color: #9d9fa3">{{ scope.row.comment }}</div>
          <el-row>
            <business-tags :tags="scope.row.tags"></business-tags>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="resources" label="无状态">
        <template v-if="scope.row.resources !== null && scope.row.resources.length > 0">
          <span v-for="resource in scope.row.resources" :key="resource.id">
            <el-card shadow="never" class="deploymentClass">
               <div style="margin-top: -10px">
                 <!-- Deployment无状态 -->
                 <!--                 <el-tag size="mini" style="margin-right: 5px">Deployment</el-tag>-->
                 <span v-if="resource.instance !== null">{{ resource.instance.instanceName }}:</span>{{ resource.name }}
                 <business-tags :tags="resource.tags"></business-tags>
                 <el-checkbox style="margin-left: 5px" v-model="resource.checked"
                              @change="handleCheckAllChange(resource)">
                   <span style="font-size: 12px">所有容器</span>
                 </el-checkbox>
                 <el-tooltip class="item" effect="dark" content="执行重新部署任务" placement="top-start" v-if="false">
                     <el-button style="float: right; padding: 3px 0" type="text" @click="handleRedeploy(resource)"><i
                       class="fas fa-redo" v-show="false"></i>Redeploy</el-button>
                 </el-tooltip>
                 <el-tooltip class="item" effect="dark" content="查看容器日志" placement="top-start">
                   <el-button style="float: right; padding: 3px 0" type="text" @click="handleLog(resource)"><i
                     class="fab fa-wpforms" v-show="false"></i>Log</el-button>
                   </el-tooltip>
                 <el-tooltip class="item" effect="dark" content="容器终端，登录容器执行命令" placement="top-start">
                   <el-button style="float: right; padding: 3px 0" type="text" @click="handleTerminal(resource)"><i
                     class="fas fa-terminal" v-show="false"></i>Terminal</el-button>
                 </el-tooltip>
               </div>
               <el-divider/>
              <!-- Pod容器组 -->
              <div class="podClass">
               <el-card shadow="hover" v-for="pod in resource.assetContainers" :key="pod.asset.name">
                 <div>
                   <span>
                   <i class="fab fa-artstation" style="margin-right: 2px"></i>{{ pod.asset.assetKey }} {{
                       pod.asset.name
                     }}
                     <el-popover placement="right" trigger="hover">
                         <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
                         <i class="fas fa-cannabis"></i><span style="margin-left: 5px">{{ pod.properties.image }}</span>
                         <br/>
                         <i class="fas fa-globe"></i><span style="margin-left: 5px">{{ pod.asset.assetKey }}</span>
                      </el-popover>
                   <div style="margin-left: 5px;color: #B7B6B6">
                     启动时间: {{ pod.properties.startTime }}
                     <span style="color: #20A9D9">[{{ pod.ago }}]</span>
                     / 重启次数:
                     <span :style="pod.properties.restartCount === '0' ? 'color: #67C23A':'color: #F56C6C'">
                       {{ pod.properties.restartCount }}</span>
                   </div>
                     <pod-phase-tag :pod="pod"></pod-phase-tag>
                 </span>
                     <el-checkbox v-for="container in pod.children"
                                  :key="container.asset.name" style="margin-right: 5px;margin-left: 5px"
                                  v-model="container.checked">
                       <span style="font-size: 12px">
                         <i class="fab fa-docker"></i>
                         {{ container.asset.name }}
                       </span>
                     </el-checkbox>
                 </div>
               </el-card>
              </div>
            </el-card>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <business-doc-reader :form-status="formStatus.businessDoc" ref="businessDocReader"></business-doc-reader>
  </div>
</template>

<script>

import {
  GET_APPLICATION_KUBERNETES, QUERY_MY_APPLICATION_PAGE
} from '@/api/modules/application/application.api.js'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags'
import SelectItem from '@/components/opscloud/common/SelectItem'
import PodPhaseTag from '@/components/opscloud/common/tag/PodPhaseTag'
import BusinessDocReader from '@/components/opscloud/business/BusinessDocReader'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import DeploymentReplicas from '@/components/opscloud/leo/child/DeploymentReplicas.vue'
import DeploymentName from '@/components/opscloud/leo/child/DeploymentName.vue'

export default {
  name: 'application-kubernetes-selector',
  data () {
    return {
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 5,
          total: 0
        }
      },
      formStatus: {
        businessDoc: {
          visible: false,
          title: '应用文档'
        }
      },
      queryParam: {
        applicationId: '',
        // authorized: true,
        extend: true,
        envType: 1
      },
      envOptions: [],
      application: '',
      applicationOptions: []
    }
  },
  mounted () {
    this.getEnv('')
    this.getApplication('')
  },
  computed: {},
  components: {
    DeploymentName,
    DeploymentReplicas,
    BusinessTags,
    SelectItem,
    PodPhaseTag,
    BusinessDocReader
  },
  filters: {},
  methods: {
    getEnv (name) {
      const requestBody = {
        envName: name,
        isActive: true,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 30
      }
      QUERY_MY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
          // this.table.pagination.total = res.body.totalNum
          // this.table.loading = false
        })
    },
    handleChange () {
      if (this.queryParam.applicationId === '') {
        this.getApplication('')
      } else {
        this.fetchData()
      }
    },
    handleDocRead (row) {
      this.$refs.businessDocReader.initData(Object.assign({}, row.document))
      this.formStatus.businessDoc.visible = true
    },
    handleRemote (remoteServer) {
      this.$emit('handleRemote', remoteServer)
    },
    handleOpenTerminalByType (resource, type) {
      const pods = []
      for (const item of resource.assetContainers) {
        const containers = item.children.filter(e => e.checked)
        if (containers.length > 0) {
          const pod = {
            name: item.asset.name,
            namespace: item.asset.assetKey2,
            podIp: item.asset.assetKey, // nodeIP     hostIp: item.properties.hostIp
            containers: containers.map(e => {
              return {
                name: e.asset.name,
                instanceId: e.asset.assetKey + '#' + e.asset.name
              }
            })
          }
          pods.push(pod)
        }
      }
      if (pods.length === 0) {
        this.$message.warning('未选中容器，无法执行当前操作！')
        return
      }
      const loginParam = {
        state: 'LOGIN',
        sessionType: type,
        data: {
          applicationId: resource.applicationId,
          businessId: resource.businessId,
          businessType: resource.businessType,
          resourceType: resource.resourceType,
          lines: 100,
          pods: pods
        }
      }
      this.$emit('handleOpen', loginParam)
    },
    handleLog (resource) {
      this.handleOpenTerminalByType(resource, 'CONTAINER_LOG')
    },
    handleTerminal (resource) {
      this.handleOpenTerminalByType(resource, 'CONTAINER_TERMINAL')
    },
    fetchData () {
      if (this.queryParam.applicationId === '') {
        return
      }
      const requestBody = {
        ...this.queryParam
      }
      GET_APPLICATION_KUBERNETES(requestBody)
        .then(res => {
          this.application = res.body
        })
    },
    handleCheckAllChange (resource) {
      for (const assetContainer of resource.assetContainers) {
        for (const children of assetContainer.children) {
          children.checked = resource.checked
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>

.el- {
  &divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 10px 0;
  }

  &input {
    display: inline-block;
    max-width: 200px;
  }

  //&select {
  //  margin-left: 5px;
  //}

  &button {
    margin-left: 8px;
  }
}

.podClass {
  .el- {
    &card {
      margin-bottom: 5px;
      margin-right: 5px;
      position: relative;
      width: 360px;
      display: inline-block;

      /deep/ .el-card__body {
        padding: 10px;
      }

      .position {
        position: absolute;
        right: 5px;
        top: 10px;
        font-size: 12px;
      }
    }
  }
}

.deploymentClass {
  margin-bottom: 5px;
  position: relative;

  /deep/ .el-card__body {
    padding: 20px 10px 0;
  }
}

.el-radio-group {
  margin-left: 5px;
}

.label {
  color: #99a9bf;
  margin-right: 5px;
}

</style>
