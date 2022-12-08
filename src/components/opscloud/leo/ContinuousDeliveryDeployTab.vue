<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-button :type="webSocketState.type" class="button">
        <i v-show="webSocketState.type === 'success'" class="fas fa-link" style="margin-right: 5px"></i>
        <i v-show="webSocketState.type === 'warning'" class="fas fa-unlink"
           style="margin-right: 5px"></i>{{ webSocketState.name }}
      </el-button>
      <el-select v-model="queryParam.applicationId" filterable clearable
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="fetchData">
        <el-option
          v-for="item in applicationOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <select-item :name="item.name" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.envType" clearable filterable
                 remote reserve-keyword placeholder="输入关键词搜索环境" :remote-method="getEnv"
                 @change="fetchData">
        <el-option
          v-for="item in envOptions"
          :key="item.id"
          :label="item.envName"
          :value="item.envType">
          <select-item :name="item.envName" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-button type="primary" @click="createDeploy"
                 :disabled="queryParam.applicationId === '' || queryParam.envType === ''">创建部署任务
      </el-button>
      <el-row :gutter="20">
        <!-- 最新部署 -->
        <el-col :span="6" style="margin-top: 10px" v-if="data.deploys !== []">
          <div v-for="deploy in data.deploys" :key="deploy.id" style="font-size: 12px">
            <template>
              <el-card shadow="hover" body-style="padding: 2px" class="card" style="margin-bottom: 10px">
                <div slot="header">
                  <deploy-number-icon :deploy="deploy"></deploy-number-icon>
                  <span style="margin-left: 5px"><i class="far fa-clock"></i>{{ deploy.ago }}</span>
                  <span style="margin-left: 8px"><i
                    class="fab fa-teamspeak"></i>{{ deploy.deployDetails.deploy.dict.displayName }}</span>
                  <el-tooltip class="item" effect="light" content="查看部署快照" placement="top-start">
                    <el-tag style="float: right" @click="queryDeployDetails(deploy)"
                            :disabled="deploy.startTime === null" :type="deploy.startTime === null ? 'info': 'primary'"
                            :id="`deploy_${deploy.id}`">
                      <i class="fas fa-plus-circle"></i></el-tag>
                    <el-button class="btn" type="text" style="margin-right: 10px" v-if="false"
                               @click="queryDeployDetails(deploy.id)" :disabled="deploy.startTime === null">
                      <i class="fab fa-sistrix"></i>
                    </el-button>
                  </el-tooltip>
                </div>
                <span class="label">执行时间</span>
                <span v-show="deploy.startTime !== null && deploy.startTime !== ''"> {{
                    deploy.startTime
                  }} - {{ deploy.endTime ? deploy.endTime : '?' }}
              <span v-show="deploy.runtime !== null" style="margin-left: 2px">
                <b style="color: #3b97d7"> {{ deploy.runtime }}</b></span>
              </span>
                <div><span class="label">部署类型</span> {{ deploy.deployDetails.deploy.dict.deployTypeDesc }}</div>
                <div><span class="label">部署状态</span> {{ deploy.deployStatus }}</div>
                <div><span class="label">部署结果</span>
                  <deploy-result style="margin-left: 5px" :deploy="deploy"></deploy-result>
                </div>
                <div><span class="label">发布版本</span> {{ deploy.versionName }}</div>
              </el-card>
            </template>
          </div>
        </el-col>
        <el-col :span="18" style="margin-top: 10px">
          <el-tag v-show="JSON.stringify(data.deploys) !== '[]'"><i class="fas fa-plus-circle" id="deploy_details"></i>部署详情快照(点击左侧最新任务)
          </el-tag>
          <div style="margin-left: 20px; margin-top: 12px">
            <el-tabs type="border-card" shadow="hover" body-style="padding: 2px"
                     v-if="JSON.stringify(data.deployDetails) !== '{}'"
                     ref="previousVersionTab">
              <el-tab-pane label="以前版本" v-if="data.deployDetails.previousVersion.pods !== []">
                <deploy-version :version="data.deployDetails.previousVersion" :type="'previous'"></deploy-version>
                <span v-for="pod in data.deployDetails.previousVersion.pods" :key="pod.name"
                      style="font-size: 12px; display: inline-block;">
                <pod-version :pod="pod"></pod-version>
              </span>
              </el-tab-pane>
              <el-col>
              </el-col>
            </el-tabs>
            <el-tabs type="border-card" shadow="hover" body-style="padding: 2px" style="margin-top: 15px"
                     v-if="JSON.stringify(data.deployDetails) !== '{}'"
                     ref="releaseVersionTab">
              <el-tab-pane label="发布版本" v-if="data.deployDetails.releaseVersion.pods !== []">
                <deploy-version :version="data.deployDetails.releaseVersion" :type="'release'"
                                :replicas="data.deployDetails.replicas"></deploy-version>
                <span v-for="pod in data.deployDetails.releaseVersion.pods" :key="pod.name"
                      style="font-size: 12px; display: inline-block;">
                <pod-version :pod="pod"></pod-version>
              </span>
              </el-tab-pane>
              <el-col>
              </el-col>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <leo-create-deploy-editor :form-status="formStatus.deploy" ref="createDeployEditor"></leo-create-deploy-editor>
  </div>
</template>

<script>

import { QUERY_APPLICATION_KUBERNETES_PAGE } from '@/api/modules/application/application.api'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import LeaderLine from 'leader-line-vue'
import WebSocketAPI from '@/components/opscloud/common/enums/websocket.api.js'
import SelectItem from '../common/SelectItem'
import LeoCreateDeployEditor from '@/components/opscloud/leo/LeoCreateDeployEditor'

import util from '@/libs/util'
import DeployResult from '@/components/opscloud/leo/child/DeployResult'
import DeployNumberIcon from '@/components/opscloud/leo/child/DeployNumberIcon'
import PodVersion from '@/components/opscloud/leo/child/PodVersion.vue'
import DeployVersion from '@/components/opscloud/leo/child/DeployVersion.vue'

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
      lineOptions: {
        color: '#e56c0d',
        gradient: false,
        // path: 'grid',
        size: 2,
        startPlug: 'disc',
        endPlug: 'disc',
        dropShadow: true
      },
      topDeployId: '',
      data: {
        deploy: '',
        deploys: [],
        deployDetails: {}
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
      applicationOptions: []
    }
  },
  mounted () {
    this.initSocket()
    this.getApplication('')
    this.getEnv()
  },
  destroyed () {
    clearInterval(this.timers.retrySocketTimer) // 销毁定时器
    this.socket.close()
    try {
      this.line.remove()
      this.line = null
    } catch (e) {
    }
  },
  computed: {},
  components: {
    SelectItem,
    LeoCreateDeployEditor,
    DeployResult,
    DeployNumberIcon,
    PodVersion,
    DeployVersion
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
      if (token === undefined && token === null && token === '') {
        this.$message.error('用户Token失效, 请重新登录平台')
        return
      }
      // 连接成功后
      this.socket.onopen = () => {
        // console.log('continuous-delivery连接成功！')
        this.webSocketState = wsStates.success
        try {
          this.handleQueryLeoDeploy()
          this.handleQueryDeployDetails()
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
          case 'QUERY_LEO_DEPLOY':
            this.data.deploys = messageJson.body.data
            if (this.data.deploys.length > 0) {
              if (this.data.deploys[0].id !== this.topDeployId) {
                this.topDeployId = this.data.deploys[0].id
              }
            }
            break
          case 'QUERY_LEO_DEPLOY_DETAILS':
            this.data.deployDetails = messageJson.body
            break
        }
      }
    },
    sendMessage (message) {
      this.socketOnSend(JSON.stringify(message))
    },
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_APPLICATION_KUBERNETES_PAGE(requestBody)
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
    handleHistory (row) {
      this.formStatus.history.visible = true
      // this.$refs.deployHistory.initData(Object.assign({}, row))
    },
    handleQueryLeoDeploy () {
      if (this.queryParam.applicationId === '') return
      if (this.queryParam.envType === '') return
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: 'QUERY_LEO_DEPLOY',
        ...this.queryParam,
        page: 1,
        length: 5
      }
      this.sendMessage(queryMessage)
    },
    lineHide () {
      if (this.line !== null) {
        this.line.hide()
      }
    },
    lineShow () {
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
      if (this.line !== null) {
        this.line.remove()
      }
      this.$nextTick(() => { // 需要延迟执行
        const start = document.getElementById('deploy_' + this.queryParam.deployId)
        if (start === null) {
          return
        }
        LeaderLine.positionByWindowResize = true
        this.line = LeaderLine.setLine(start, document.getElementById('deploy_details'), this.lineOptions)
      })
    },
    queryDeployDetails (deploy) {
      this.data.deploy = deploy
      if (deploy.startTime === null) {
        return
      }
      this.queryParam.deployId = deploy.id
      this.handleQueryDeployDetails()
      this.drawLine()
    },
    handleQueryDeployDetails () {
      if (this.queryParam.deployId === '') return
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: 'QUERY_LEO_DEPLOY_DETAILS',
        deployId: this.queryParam.deployId
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
    fetchData () {
      if (this.queryParam.applicationId === '' || this.queryParam.envType === '') return
      this.handleQueryLeoDeploy()
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

.label {
  color: #99a9bf;
}

.btn {
  float: right;
  padding: 3px 0;
  margin-left: 10px;
}

</style>