<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-button :type="webSocketState.type" class="button" size="mini">
        <i v-show="webSocketState.type === 'success'" class="fas fa-link" style="margin-right: 5px"/>
        <i v-show="webSocketState.type === 'warning'" class="fas fa-unlink"
           style="margin-right: 5px"/>{{ webSocketState.name }}
      </el-button>
      <el-radio-group v-model="queryParam.envType" size="mini" @change="fetchData">
        <el-radio-button v-for="env in envOptions" :label="env.envType" :key="env.envType">
          {{ env.envName }}
        </el-radio-button>
      </el-radio-group>
      <el-select v-model="queryParam.applicationId" filterable clearable size="mini"
                 remote reserve-keyword :placeholder="$t('common.search.searchApplication')"
                 :remote-method="getApplication"
                 @change="fetchData">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px" type="primary" plain size="mini"
                 :disabled="queryParam.applicationId === null || queryParam.applicationId === ''">
        <i class="fas fa-circle-notch"/>
      </el-button>
      <el-button type="primary" size="mini" @click="createDeploy"
                 :disabled="queryParam.applicationId === '' || queryParam.envType === ''">
        {{ $t('leo.deploy.createDeployTask') }}
      </el-button>
      <el-button type="primary" plain size="mini" @click="handleHistory()"
                 :disabled="queryParam.applicationId === '' || queryParam.envType === ''">{{ $t('common.history') }}
      </el-button>
    </el-row>
    <!-- 任务&无状态版本详情 -->
    <div style="height: 10px"/>
    <el-row>
      <el-divider content-position="left">{{ $t('leo.deploy.deploymentVersionDetails') }}
        <deploy-task-tips/>
      </el-divider>
      <!--suppress VueUnrecognizedDirective -->
      <span>
        <div v-if="data.deploymentVersionDetails.length === 0" style="height: 60px; color: #909399; text-align: center"
             v-loading="versionLoading">No Data</div>
        <leo-deployment-version-details v-if="data.deploymentVersionDetails.length > 0"
                                        :deployment-version-details="data.deploymentVersionDetails"/>
      </span>
    </el-row>
    <!-- 最新部署 -->
    <!--    v-if="data.deploys.length > 0"-->
    <el-row :gutter="20">
      <el-divider content-position="left">{{ $t('leo.deploy.latestDeploymentTasks') }}</el-divider>
      <!--suppress VueUnrecognizedDirective -->
      <div v-if="data.deploys.length === 0" style="height: 60px; color: #909399; text-align: center"
           v-loading="deployLoading">
        No Data
      </div>
      <div style="height: 10px"/>
      <el-col style="width: 430px" v-if="data.deploys.length > 0">
        <div v-for="deploy in data.deploys" :key="deploy.id" style="font-size: 12px">
          <template>
            <el-card shadow="hover" body-style="padding: 2px" class="card">
              <div slot="header">
                <deploy-number-icon :deploy="deploy"/>
                <span style="margin-right: 5px"/>
                <i class="far fa-clock"/>{{ i18nAgo(deploy.ago) }}
                <span style="margin-right: 5px"/>
                <i class="fab fa-teamspeak"/>
                {{
                  deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.displayName !== null ? deploy.deployDetails.deploy.dict.displayName : '-'
                }}
                <span style="margin-right: 10px"/>
                <business-tags :tags="deploy.tags"/>
                <el-tooltip class="item" effect="light" :content="$t('leo.deploy.viewDeploymentSnapshot')"
                            placement="top-start">
                  <el-tag style="float: right" @click="queryDeployDetails(deploy)" size="mini"
                          :disabled="deploy.startTime === null" :type="deploy.startTime === null ? 'info': 'primary'"
                          :id="`deploy_${deploy.id}`">
                    <i class="fas fa-plus-circle"/>
                  </el-tag>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="停止部署" placement="top-start"
                            v-if="!deploy.isFinish">
                  <el-button class="btn" style="margin-right: 10px" type="text" @click="stopDeploy(deploy.id)"
                             :loading="buttons.stopping">
                    <i class="far fa-stop-circle"/>
                  </el-button>
                </el-tooltip>
              </div>
              <deploy-task-content :deploy="deploy"/>
            </el-card>
            <div style="height: 10px"/>
          </template>
        </div>
      </el-col>
      <span style="display: flex;flex-flow: row wrap"  v-if="data.deploys.length > 0">
        <el-tag v-show="JSON.stringify(data.deploys) !== '[]'">
          <i class="fas fa-plus-circle" id="deploy_details" style="margin-right: 2px"/>
          {{ $t('leo.deploy.deploymentDetailsSnapshot') }}
        </el-tag>
        <br/>
        <div style="margin-left: 20px; margin-top: 12px" v-if="JSON.stringify(data.deployDetails) !== '{}'">
          <el-tabs type="border-card" shadow="hover" body-style="padding: 2px"
                   v-if="data.deployDetails.versionDetails1 !== null && data.deployDetails.versionDetails1.show"
                   ref="previousVersionTab">
            <!-- 版本1 -->
            <el-tab-pane :label="data.deployDetails.versionDetails1.title">
              <deploy-version :version="data.deployDetails.versionDetails1" :type="'version1'"/>
              <span v-for="pod in data.deployDetails.versionDetails1.pods" :key="pod.name"
                    style="font-size: 12px; display: inline-block">
                  <pod-version :pod="pod"/>
                </span>
            </el-tab-pane>
          </el-tabs>
          <el-tabs type="border-card" shadow="hover" body-style="padding: 2px" style="margin-top: 15px"
                   v-if="data.deployDetails.versionDetails2 !== null && data.deployDetails.versionDetails2.show"
                   ref="releaseVersionTab">
            <!-- 版本2-->
            <el-tab-pane :label="data.deployDetails.versionDetails2.title">
              <deploy-version :version="data.deployDetails.versionDetails2" :type="'version2'"
                              :replicas="data.deployDetails.replicas"/>
              <span v-for="pod in data.deployDetails.versionDetails2.pods" :key="pod.name"
                    style="font-size: 12px; display: inline-block">
                <pod-version :pod="pod"/>
              </span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </span>
    </el-row>
    <leo-create-deploy-editor :form-status="formStatus.deploy" ref="createDeployEditor"/>
    <leo-deploy-history :form-status="formStatus.history" :applicationId="queryParam.applicationId"
                        :envType="queryParam.envType" ref="deployHistory"/>
  </div>
</template>

<script>

import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import LeaderLine from 'leader-line-vue'
import WebSocketAPI from '@/components/opscloud/common/enums/websocket.api.js'
import LeoRequestType from '@/components/opscloud/common/enums/leo.request.js'
import SelectItem from '../common/SelectItem'
import LeoCreateDeployEditor from '@/components/opscloud/leo/LeoCreateDeployEditor'

import util from '@/libs/util'
import DeployNumberIcon from '@/components/opscloud/leo/child/DeployNumberIcon'
import PodVersion from '@/components/opscloud/leo/child/PodVersion.vue'
import DeployVersion from '@/components/opscloud/leo/child/DeployVersion.vue'
import LeoDeployHistory from '@/components/opscloud/leo/LeoDeployHistory.vue'
import LeoDeploymentVersionDetails from '@/components/opscloud/leo/LeoDeploymentVersionDetails.vue'
import router from '@/router'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import {
  QUERY_MY_LEO_JOB_DEPLOY_PAGE,
  QUERY_MY_LEO_JOB_DEPLOYMENT_VERSION_DETAILS
} from '@/api/modules/leo/leo.job.api'
import DeployTaskTips from '@/components/opscloud/leo/child/DeployTaskTips.vue'
import DeployTaskContent from '@/components/opscloud/leo/child/DeployTaskContent.vue'
import tools from '@/libs/tools'
import { STOP_DEPLOY } from '@/api/modules/leo/leo.deploy.api'

const leaderLineOptions = {
  color: '#e56c0d',
  gradient: false,
  // path: 'grid',
  size: 2,
  startPlug: 'disc',
  endPlug: 'disc',
  dropShadow: true
}

const wsStates = {
  success: {
    name: 'Socket successful',
    type: 'success'
  },
  fail: {
    name: 'Socket disconnected',
    type: 'warning'
  }
}

export default {
  name: 'continuous-delivery-deploy-tab',
  data () {
    return {
      socket: null,
      socketURI: util.wsUrl(WebSocketAPI.CONTINUOUS_DELIVERY_DEPLOY),
      webSocketState: wsStates.fail,
      wsStates: wsStates,
      timers: {
        retrySocketTimer: null
      },
      instance: {
        id: ''
      },
      line: null,
      leaderLineOptions: leaderLineOptions,
      topDeployId: '',
      data: {
        // 查询当前的部署
        deploy: '',
        // 部署详情列表
        deploys: [],
        deployDetails: {},
        deploymentVersionDetails: []
      },
      formStatus: {
        deploy: {
          visible: false,
          labelWidth: '150px'
        },
        history: {
          visible: false,
          labelWidth: '150px'
        }
      },
      queryParam: {
        applicationId: '',
        envType: 1,
        deployId: ''
      },
      envOptions: [],
      applicationOptions: [],
      buttons: {
        stopping: false
      },
      deployLoading: false,
      versionLoading: false
    }
  },
  mounted () {
    this.initSocket()
    this.getApplication('')
    this.getEnv()
  },
  destroyed () {
    this.exit()
  },
  computed: {},
  components: {
    DeployTaskContent,
    DeployTaskTips,
    SelectItem,
    LeoCreateDeployEditor,
    DeployNumberIcon,
    PodVersion,
    DeployVersion,
    LeoDeployHistory,
    LeoDeploymentVersionDetails,
    BusinessTags
  },
  watch: {
    // 监听数据
    topDeployId: {
      deep: true,
      handler (v) {
        this.drawLine()
      }
    }
  },
  filters: {},
  methods: {
    exit () {
      // 销毁定时器
      clearInterval(this.timers.retrySocketTimer)
      try {
        this.socket.close()
      } catch (e) {
      }
      try {
        this.line.remove()
        this.line = null
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
        // console.log('continuous-delivery连接成功！')
        this.webSocketState = wsStates.success
        try {
          this.handleSubscribeLeoDeploy()
          this.handleSubscribeDeployDetails()
          // 订阅无状态版本
          this.handleSubscribeDeploymentVersionDetails()
        } catch (e) {
          // this.$message.error('发送消息错误')
        }
      }
    },
    socketOnClose () {
      this.socket.onclose = () => {
        // console.log('continuous-delivery连接关闭！')
      }
    },
    socketOnError () {
      this.socket.onerror = () => {
        // console.log('socket continuous-delivery连接失败')
      }
    },
    socketOnSend (data) {
      this.socket.send(data)
    },
    socketOnMessage () {
      this.socket.onmessage = (message) => {
        const messageJson = JSON.parse(message.data)
        // 消息路由
        switch (messageJson.messageType) {
          case LeoRequestType.SUBSCRIBE_LEO_DEPLOY:
            for (const deploy of messageJson.body.data) {
              if (this.queryParam.applicationId === deploy.applicationId) {
                this.setDetails(messageJson.body.data)
                return
              }
            }
            break
          case LeoRequestType.SUBSCRIBE_LEO_DEPLOY_DETAILS:
            this.data.deployDetails = messageJson.body
            break
          case LeoRequestType.SUBSCRIBE_LEO_DEPLOYMENT_VERSION_DETAILS:
            for (const version of messageJson.body) {
              if (this.queryParam.applicationId === version.applicationId && this.queryParam.envType === version.envType) {
                this.data.deploymentVersionDetails = messageJson.body
                return
              }
            }
            break
          case LeoRequestType.AUTHENTICATION_FAILURE:
            this.exit()
            router.push({ name: 'login' })
            break
        }
      }
    },
    removeLine () {
      try {
        if (this.line !== null) {
          this.line.remove()
        }
      } catch (e) {
      }
    },
    sendMessage (message) {
      this.socketOnSend(JSON.stringify(message))
    },
    /**
     * 设置数据并重绘链接线
     * @param deploys
     */
    setDetails (deploys) {
      if (deploys.length === 0) {
        this.removeLine()
        this.data.deploys = []
        this.topDeployId = ''
        return
      }
      // 设置数据
      if (deploys[0].id !== this.topDeployId) {
        this.topDeployId = deploys[0].id
      }
      if (this.data.deploy !== '') {
        let find = false
        for (const d of deploys) {
          if (d.id === this.data.deploy.id) {
            find = true
            break
          }
        }
        if (!find) {
          this.removeLine()
        }
      }
      this.data.deploys = deploys
    },
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_MY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
        })
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
    handleHistory () {
      if (this.queryParam.applicationId === '' || this.queryParam.envType === '') return
      this.formStatus.history.visible = true
      this.$refs.deployHistory.initData()
    },
    hideLine () {
      if (this.line !== null) {
        this.line.hide()
      }
    },
    showLine () {
      if (this.line !== null) {
        this.line.show()
      }
    },
    scroll (y) {
      try {
        // 重新绘制
        this.line.position()
      } catch (e) {
      }
    },
    drawLine () {
      if (this.queryParam.deployId === '') {
        return
      }
      this.removeLine()
      this.$nextTick(() => { // 需要延迟执行
        const start = document.getElementById('deploy_' + this.queryParam.deployId)
        if (start === null) {
          return
        }
        this.line = LeaderLine.setLine(start, document.getElementById('deploy_details'), this.leaderLineOptions)
      })
    },
    handleSubscribeLeoDeploy () {
      if (this.queryParam.applicationId === '') return
      if (this.queryParam.envType === '') return
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: LeoRequestType.SUBSCRIBE_LEO_DEPLOY,
        ...this.queryParam,
        page: 1,
        length: 3
      }
      this.sendMessage(queryMessage)
    },
    handleSubscribeDeployDetails () {
      if (this.queryParam.deployId === '') return
      this.data.deployDetails = {}
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: LeoRequestType.SUBSCRIBE_LEO_DEPLOY_DETAILS,
        deployId: this.queryParam.deployId
      }
      this.sendMessage(queryMessage)
    },
    handleSubscribeDeploymentVersionDetails () {
      if (this.queryParam.applicationId === '') return
      if (this.queryParam.envType === '') return
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: LeoRequestType.SUBSCRIBE_LEO_DEPLOYMENT_VERSION_DETAILS,
        ...this.queryParam
      }
      this.sendMessage(queryMessage)
    },
    createDeploy () {
      this.formStatus.deploy.visible = true
      const data = {
        application: this.applicationOptions.find(e => e.id === this.queryParam.applicationId),
        env: this.envOptions.find(e => e.envType === this.queryParam.envType)
      }
      this.$refs.createDeployEditor.initData(Object.assign({}, data))
    },
    i18nAgo (ago) {
      return this.$i18n.locale === 'zh-chs' ? ago : tools.i18nAgo(ago)
    },
    stopDeploy (id) {
      this.buttons.stopping = true
      STOP_DEPLOY({ deployId: id })
        .then(res => {
          this.$message.info('后台执行中请稍等!')
          this.buttons.stopping = false
        })
    },
    queryDeployDetails (deploy) {
      this.data.deploy = deploy
      if (deploy.startTime === null) {
        return
      }
      this.queryParam.deployId = deploy.id
      this.handleSubscribeDeployDetails()
      this.drawLine()
    },
    fetchData () {
      if (this.queryParam.applicationId === '' || this.queryParam.envType === '') return
      const requestBody = {
        ...this.queryParam,
        page: 1,
        length: 3
      }
      this.versionLoading = true
      QUERY_MY_LEO_JOB_DEPLOYMENT_VERSION_DETAILS(requestBody)
        .then(res => {
          this.data.deploymentVersionDetails = res.body
          this.versionLoading = false
        })

      this.deployLoading = true
      QUERY_MY_LEO_JOB_DEPLOY_PAGE(requestBody)
        .then(res => {
          this.setDetails(res.body.data)
          this.deployLoading = false
        })
      this.handleSubscribeLeoDeploy()
      this.handleSubscribeDeploymentVersionDetails()
      this.data.deployDetails = {}
    }
  }
}
</script>

<style scoped>

.el-input {
  display: inline-block;
  max-width: 200px;
}

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

.btn {
  float: right;
  padding: 3px 0;
  margin-left: 10px;
}

.el-divider__text, .el-link {
  font-size: 12px;
  color: #9d9fa3;
}

.el-divider--horizontal {
  margin: 12px 0;
}

.el-radio-group {
  margin-left: 5px;
}

</style>
