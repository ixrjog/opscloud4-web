<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-button :type="webSocketState.type" class="button">
        <i v-show="webSocketState.type === 'success'" class="fas fa-link" style="margin-right: 5px"></i>
        <i v-show="webSocketState.type === 'warning'" class="fas fa-unlink"
           style="margin-right: 5px"></i>{{ webSocketState.name }}
      </el-button>
      <el-select v-model.trim="queryParam.applicationId" filterable clearable
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
        <el-col :span="6" style="margin-top: 10px">
          <div v-for="deploy in deploys" :key="deploy.id" style="font-size: 12px" v-if="deploys !== []">
            <template>
              <el-card shadow="hover" body-style="padding: 2px" class="card" style="margin-bottom: 10px"
                       :ref="`leoDeploy_${deploy.id}`">
                <div slot="header">
                  <!--                  <el-tag>{{ build.jobName }}</el-tag>-->
                  <deploy-number-icon :deploy="deploy"></deploy-number-icon>
                  <span style="margin-left: 5px"><i class="far fa-clock"></i>{{ deploy.ago }}</span>
                  <span style="margin-left: 8px"><i
                    class="fab fa-teamspeak"></i>{{ deploy.deployDetails.deploy.dict.displayName }}</span>
                  <el-tooltip class="item" effect="light" content="查看部署快照" placement="top-start">
                    <el-button class="btn" type="text" style="margin-right: 10px"
                               @click="queryDeployDetails(deploy.id)" :disabled="deploy.startTime === null">
                      <i class="fas fa-play"></i>
                    </el-button>
                  </el-tooltip>
                </div>
                <span class="label">执行时间</span>
                <span v-show="deploy.startTime !== null && deploy.startTime !== ''"> {{
                    deploy.startTime
                  }} - {{ deploy.endTime ? deploy.endTime : '?' }}
              <span v-show="deploy.runtime !== null" style="margin-left: 2px"><<b
                style="color: #3b97d7">{{ deploy.runtime }}</b>></span>
              </span>
                <div><span class="label">部署状态</span> {{ deploy.deployStatus }}</div>
                <div><span class="label">部署结果</span>
                  <deploy-result style="margin-left: 5px" :deploy="deploy"></deploy-result>
                </div>
                <div><span class="label">发布版本</span> {{ deploy.versionName }}</div>
              </el-card>
            </template>
          </div>
        </el-col>
        <!-- 部署快照 Snapshot -->
        <el-col :span="18" v-if="JSON.stringify(deployDetails) !== '{}'" style="margin-top: 10px">
          <el-tabs type="border-card" shadow="hover" body-style="padding: 2px" ref="previousVersionTab">
            <el-tab-pane label="以前版本">
              <deploy-version :version="deployDetails.previousVersion" :type="'previous'"></deploy-version>
              <span v-for="pod in deployDetails.previousVersion.pods" :key="pod.name"
                    style="font-size: 12px; display: inline-block;" v-if="deployDetails.previousVersion.pods !== []">
                <pod-version :pod="pod"></pod-version>
              </span>
            </el-tab-pane>
            <el-col>
            </el-col>
          </el-tabs>

          <el-tabs type="border-card" shadow="hover" body-style="padding: 2px" style="margin-top: 15px" ref="releaseVersionTab">
            <el-tab-pane label="发布版本">
              <deploy-version :version="deployDetails.releaseVersion" :type="'release'" :replicas="deployDetails.replicas"></deploy-version>
              <span v-for="pod in deployDetails.releaseVersion.pods" :key="pod.name"
                    style="font-size: 12px; display: inline-block;" v-if="deployDetails.releaseVersion.pods !== []">
                <pod-version :pod="pod"></pod-version>
              </span>
            </el-tab-pane>
            <el-col>
            </el-col>
          </el-tabs>
        </el-col>
      </el-row>

    </el-row>
    <leo-create-deploy-editor :form-status="formStatus.deploy" ref="createDeployEditor"></leo-create-deploy-editor>
  </div>
</template>

<script>

import { QUERY_APPLICATION_KUBERNETES_PAGE } from '@/api/modules/application/application.api'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'

import WebSocketAPI from '@/components/opscloud/common/enums/websocket.api.js'
import SelectItem from '../common/SelectItem'
import BusinessTags from '../common/tag/BusinessTags'
import Pagination from '../common/page/Pagination'
import EnvTag from '@/components/opscloud/common/tag/EnvTag'
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
      table: {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      deploys: [],
      deployDetails: {},
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
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    EnvTag,
    LeoCreateDeployEditor,
    DeployResult,
    DeployNumberIcon,
    PodVersion,
    DeployVersion
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
            this.deploys = messageJson.body.data
            //this.table.pagination.total = messageJson.body.data.totalNum
            break
          case 'QUERY_LEO_DEPLOY_DETAILS':
            this.deployDetails = messageJson.body
            break
        }
      }
    },
    sendMessage (message) {
      this.socketOnSend(JSON.stringify(message))
    },
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
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
    queryDeployDetails (deployId) {
      this.queryParam.deployId = deployId
      this.handleQueryDeployDetails()
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
