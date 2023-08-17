<!--suppress HtmlUnknownTag -->
<template>
  <el-card>
    <el-row>
      <el-button :type="webSocketState.type" class="button" size="mini">
        <i v-show="webSocketState.type === 'success'" class="fas fa-link" style="margin-right: 5px"/>
        <i v-show="webSocketState.type === 'warning'" class="fas fa-unlink"
           style="margin-right: 5px"/>{{ webSocketState.name }}
      </el-button>
      <el-radio-group v-model="queryParam.envType" size="mini" @change="fetchData">
        <el-radio-button v-for="env in envOptions" :label="env.envType" :key="env.id">
          {{ env.envName }}
        </el-radio-button>
      </el-radio-group>
      <el-select v-model="queryParam.applicationId" filterable clearable style="margin-left: 5px" size="mini"
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="handleChange">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px" type="primary" plain size="mini" :loading="loading"
                 :disabled="queryParam.applicationId === null || queryParam.applicationId === ''">
        <i class="fas fa-circle-notch"/>
      </el-button>
    </el-row>
    <div style="height: 5px"/>
    <!--    ARMS-->
    <el-row v-if="application !== '' && application.armsTraceApp.show">
      <el-card shadow="never" class="banner">
        <el-tag type="success" @click="openUrl(application.armsTraceApp.homeUrl)">
          ARMS应用实时监控服务
          <i class="fas fa-external-link-alt" style="margin-left: 2px"/>
        </el-tag>
      </el-card>
      <div style="height: 5px"/>
    </el-row>
    <el-row>
      <template v-if="application !== '' && application.resources !== null && application.resources.length > 0">
          <span v-for="resource in application.resources" :key="resource.id">
            <el-card shadow="never" class="deploymentClass" style="font-size: 10px">
               <div style="margin-top: -10px">
                 <!-- Deployment无状态 -->
                 <deployment-name :deployment="resource.name" namespace="" :cluster="resource.instance.instanceName"/>
                 <business-tags :tags="resource.tags"/>
                 <el-tag style="margin-left: 5px" size="mini">
                    replicas
                   <deployment-replicas :replicas="resource.assetContainers.length"/>
                 </el-tag>
                 <deployment-resources-limits style="margin-left: 5px" :properties="resource.asset.properties"/>
                 <el-checkbox style="margin-left: 5px" v-model="resource.checked" @change="selAllContainers(resource)">
                   <span style="font-size: 12px">所有容器</span>
                 </el-checkbox>
                 <el-tooltip class="item" effect="dark" content="查看容器日志" placement="top-start">
                   <el-button style="float: right; padding: 3px 0" type="text" @click="handleLog(resource)">
                     <i class="fab fa-wpforms" v-show="false"/>Log
                   </el-button>
                   </el-tooltip>
                 <el-tooltip class="item" effect="dark" content="容器终端，登录容器执行命令" placement="top-start">
                   <el-button style="float: right; padding: 3px 0; margin-right: 5px" type="text"
                              @click="handleTerminal(resource)">
                     <i class="fas fa-terminal" v-show="false"/>Login
                   </el-button>
                 </el-tooltip>
               </div>
               <el-divider/>
              <!-- Pod容器组 -->
               <div class="podClass">
                <template v-for="pod in resource.assetContainers">
                   <el-card shadow="hover" :class="pod.properties.restartCount | toPodClass" :key="pod.asset.name">
                   <!-- podName -->
                   <div>
                     <copy-span :content="pod.asset.name" :show-icon="true" style="font-weight:bold"/>
                     <el-popover placement="right" trigger="hover" v-if="false">
                         <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"/>
                         <i class="fas fa-cannabis"/><span style="margin-left: 5px">{{ pod.properties.image }}</span>
                         <br/>
                         <i class="fas fa-globe"/><span style="margin-left: 5px">{{ pod.asset.assetKey }}</span>
                     </el-popover>
                   </div>
                   <div style="height: 2px"/>
                   <div>
                     <span class="label">容器组IP</span>
                     <copy-span :content="pod.asset.assetKey" :show-icon="true"/>
                     <zone-tag v-if="pod.properties.zone !== undefined" :zone="pod.properties.zone" style="margin-left: 5px"/>
                   </div>
                   <div>
                     <span class="label">启动时间</span>{{ pod.properties.startTime }}
                     <span style="color: #20A9D9">[{{ pod.ago }}]</span> 重启次数:
                     <span :style="pod.properties.restartCount === '0' ? 'color: #67C23A':'color: #F56C6C'">
                       {{ pod.properties.restartCount }}
                     </span>
                   </div>
                   <div><span class="label">版本名称</span>{{ pod.properties.versionName }}</div>
                   <div v-if="false"><span class="label">镜像地址</span>{{ pod.properties.image }}</div>
                   <div><span class="label">镜像地址</span>
                     <container-image-display :image="pod.properties.image"/>
                   </div>
                   <pod-phase-tag :pod="pod"/>
                     <i class="fab fa-docker" style="margin-right: 5px"/>
                     <el-checkbox v-for="container in pod.children" :key="container.asset.name"
                                  style="margin-right: 1px" v-model="container.checked">
                       <span style="font-size: 12px">{{ container.asset.name }}</span>
                     </el-checkbox>
                  </el-card>
                </template>
              </div>
            </el-card>
          </span>
      </template>
    </el-row>
    <business-doc-reader :form-status="formStatus.businessDoc" ref="businessDocReader"/>
  </el-card>
</template>

<script>

import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api.js'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags'
import SelectItem from '@/components/opscloud/common/SelectItem'
import PodPhaseTag from '@/components/opscloud/common/tag/PodPhaseTag'
import BusinessDocReader from '@/components/opscloud/business/BusinessDocReader'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import DeploymentReplicas from '@/components/opscloud/leo/child/DeploymentReplicas.vue'
import DeploymentName from '@/components/opscloud/leo/child/DeploymentName.vue'
import { toPodClass } from '@/filters/kubernetes.pod'
import DeploymentResourcesLimits from '@/components/opscloud/leo/child/DeploymentResourcesLimits.vue'
import CopySpan from '@/components/opscloud/common/CopySpan.vue'
import WebSocketAPI from '@/components/opscloud/common/enums/websocket.api.js'
import util from '@/libs/util'
import router from '@/router'
import { GET_KUBERNETES_DEPLOYMENT } from '@/api/modules/kubernetes/kubernetes.api'
import ContainerImageDisplay from '@/components/opscloud/common/ContainerImageDisplay.vue'
import ZoneTag from '@/components/opscloud/terminal/child/ZoneTag.vue'

const wsStates = {
  success: {
    name: 'WS连接成功',
    type: 'success'
  },
  fail: {
    name: 'WS连接断开',
    type: 'warning'
  }
}

export default {
  name: 'application-kubernetes-selector',
  data () {
    return {
      socket: null,
      socketURI: util.wsUrl(WebSocketAPI.KUBERNETES_DEPLOYMENT),
      webSocketState: wsStates.fail,
      wsStates: wsStates,
      timers: {
        retrySocketTimer: null,
        queryJobTimer: null
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
      applicationOptions: [],
      loading: false
    }
  },
  destroyed () {
    this.exit()
  },
  watch: {},
  mounted () {
    this.initSocket()
    this.getEnv('')
    this.getApplication('')
  },
  computed: {},
  components: {
    ZoneTag,
    DeploymentName,
    DeploymentReplicas,
    BusinessTags,
    SelectItem,
    PodPhaseTag,
    BusinessDocReader,
    DeploymentResourcesLimits,
    CopySpan,
    ContainerImageDisplay
  },
  filters: {
    toPodClass
  },
  methods: {
    exit () {
      // 销毁定时器
      clearInterval(this.timers.retrySocketTimer)
      try {
        this.socket.close()
      } catch (e) {
      }
    },
    setTimers () {
      // retrySocket定时器
      if (this.timers.retrySocketTimer === null) {
        this.timers.retrySocketTimer = setInterval(() => {
          this.retrySocket()
        }, 10000)
      }
    },
    retrySocket () {
      if (this.socket.readyState !== 1) {
        this.webSocketState = wsStates.fail
        try {
          this.socket.close()
        } catch (e) {
        }
        this.socket = null
        this.initSocket()
      }
    },
    initSocket () {
      this.socket = new WebSocket(this.socketURI)
      this.socketOnClose()
      this.socketOnOpen()
      this.socketOnError()
      this.socketOnMessage()
      this.setTimers()
    },
    socketOnOpen () {
      const token = util.cookies.get('token')
      if (!token || token === 'undefined') {
        this.exit()
        return
      }
      // 连接成功后
      this.socket.onopen = () => {
        this.webSocketState = wsStates.success
        try {
          this.fetchData()
        } catch (e) {
        }
      }
    },
    socketOnClose () {
      this.socket.onclose = () => {
      }
    },
    socketOnError () {
      this.socket.onerror = () => {
      }
    },
    socketOnSend (data) {
      this.socket.send(data)
    },
    socketOnMessage () {
      this.socket.onmessage = (message) => {
        const messageJson = JSON.parse(message.data)
        // 消息路由
        this.processMessages(messageJson)
      }
    },
    processMessages (msgBody) {
      const messageJson = msgBody
      const _this = this
      switch (messageJson.messageType) {
        case 'QUERY_KUBERNETES_DEPLOYMENT':
          if (messageJson.body.id === _this.queryParam.applicationId) {
            const map = new Map()
            const newApp = messageJson.body
            if (_this.application !== '') {
              for (const deployment of _this.application.resources) {
                for (const pod of deployment.assetContainers) {
                  for (const container of pod.children) {
                    map.set(container.asset.assetKey, container.checked)
                  }
                }
              }
              for (const deployment of newApp.resources) {
                for (const pod of deployment.assetContainers) {
                  for (const container of pod.children) {
                    if (map.has(container.asset.assetKey)) {
                      container.checked = map.get(container.asset.assetKey)
                    }
                  }
                }
              }
            }
            _this.application = newApp
          }
          break
        case 'AUTHENTICATION_FAILURE':
          this.exit()
          router.push({ name: 'login' })
          break
      }
    },
    sendMessage (message) {
      this.socketOnSend(JSON.stringify(message))
    },
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
            // nodeIP     hostIp: item.properties.hostIp
            podIp: item.asset.assetKey,
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
        this.$message.warning('未选中容器！')
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
    openUrl (url) {
      window.open(url)
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
      if (this.queryParam.envType === '') {
        return
      }
      this.loading = true
      GET_KUBERNETES_DEPLOYMENT({
        applicationId: this.queryParam.applicationId,
        envType: this.queryParam.envType
      })
        .then(res => {
          this.processMessages(res.body)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: 'QUERY_KUBERNETES_DEPLOYMENT',
        ...this.queryParam
      }
      this.sendMessage(queryMessage)
      this.application = ''
    },
    selAllContainers (resource) {
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
  //
  //&button {
  //  margin-left: 8px;
  //}
}

.podClass {
  .el- {
    &card {
      margin-bottom: 5px;
      margin-right: 5px;
      position: relative;
      width: 368px;
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

.banner {
  position: relative;
  font-size: 12px;

  /deep/ .el-card__body {
    padding: 2px 2px 2px 2px;
  }
}

.el-radio-group {
  margin-left: 5px;
}

.label {
  color: #99a9bf;
  margin-right: 5px;
}

.podFault {
  border: 2px solid #e56c0d;
}

.podNormal {
}

</style>
