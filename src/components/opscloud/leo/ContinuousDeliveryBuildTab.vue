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
      <el-select v-model.trim="queryParam.applicationId" filterable clearable size="mini"
                 remote reserve-keyword :placeholder="$t('common.search.searchApplication')" :remote-method="getApplication"
                 @change="fetchData">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-input v-model="queryParam.queryName" size="mini" @change="fetchData" clearable
                :placeholder="$t('common.search.searchJob')"/>
      <el-button @click="fetchData" style="margin-left: 5px" type="primary" plain size="mini"
                 :disabled="queryParam.applicationId === null || queryParam.applicationId === ''">
        <i class="fas fa-circle-notch"/>
      </el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" v-loading="table.loading" style="width: 100%">
      <el-table-column prop="name" :label="$t('leo.build.name')" sortable/>
      <el-table-column prop="branch" :label="$t('leo.build.preferredBranch')" sortable>
        <template v-slot="scope">
          <i class="fa fa-code-fork" style="margin-right: 2px"/>
          <span>{{ scope.row.branch }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="latestBuildInfos" :label="$t('leo.build.latestBuild')">
        <template v-slot="scope">
          <latest-build-info :buildInfos="scope.row.latestBuildInfos"/>
        </template>
      </el-table-column>
      <el-table-column prop="env" :label="$t('common.env')" width="80">
        <template v-slot="scope">
          <env-tag :env="scope.row.env"/>
        </template>
      </el-table-column>
      <el-table-column prop="buildSize" :label="$t('leo.build.builds')" width="80">
      </el-table-column>
      <el-table-column prop="tags" :label="$t('common.tags')" width="250">
        <template v-slot="scope">
          <business-tags :tags="scope.row.tags"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operate')" width="200">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleBuild(scope.row)">{{ $t('leo.build.build') }}</el-button>
          <el-button type="primary" plain size="mini" @click="handleHistory(scope.row)">{{ $t('common.history') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <leo-do-build-kubernetes-image-editor :form-status="formStatus.build.kubernetesImage"
                                          ref="doBuildKubernetesImageEditor"/>
    <leo-do-build-front-end-editor :form-status="formStatus.build.frontEnd" ref="doBuildFrontEndEditor"/>
    <leo-do-build-maven-publish-editor :form-status="formStatus.build.mavenPublish" ref="doBuildMavenPublishEditor"/>
    <leo-build-history :form-status="formStatus.history" ref="buildHistory"/>
    <el-divider>Latest build details</el-divider>
    <div v-for="build in builds" :key="build.id" style="font-size: 12px">
      <template>
        <leo-build-details :build="build" :ref="`leoBuildDetails_${build.id}`"/>
      </template>
    </div>
  </div>
</template>

<script>

import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'

import WebSocketAPI from '@/components/opscloud/common/enums/websocket.api.js'
import LeoRequestType from '@/components/opscloud/common/enums/leo.request.js'
import SelectItem from '../common/SelectItem'
import BusinessTags from '../common/tag/BusinessTags'
import Pagination from '../common/page/Pagination'
import EnvTag from '@/components/opscloud/common/tag/EnvTag'

import util from '@/libs/util'
import LeoBuildDetails from '@/components/opscloud/leo/LeoBuildDetails'
import LatestBuildInfo from '@/components/opscloud/leo/child/LatestBuildInfo'
import LeoBuildHistory from '@/components/opscloud/leo/LeoBuildHistory'
import router from '@/router'
import LeoDoBuildMavenPublishEditor from '@/components/opscloud/leo/LeoDoBuildMavenPublishEditor.vue'
import LeoDoBuildKubernetesImageEditor from '@/components/opscloud/leo/LeoDoBuildKubernetesImageEditor.vue'
import {
  QUERY_MY_LEO_JOB_PAGE
} from '@/api/modules/leo/leo.job.api'
import LeoDoBuildFrontEndEditor from '@/components/opscloud/leo/LeoDoBuildFrontEndEditor.vue'

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
  name: 'continuous-delivery-build-tab',
  data () {
    return {
      socket: null,
      socketURI: util.wsUrl(WebSocketAPI.CONTINUOUS_DELIVERY_BUILD),
      webSocketState: wsStates.fail,
      wsStates: wsStates,
      timers: {
        retrySocketTimer: null,
        queryJobTimer: null
      },
      instance: {
        id: ''
      },
      table: {
        loading: false,
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      builds: [],
      formStatus: {
        build: {
          kubernetesImage: {
            visible: false,
            labelWidth: '150px'
          },
          frontEnd: {
            visible: false
          },
          mavenPublish: {
            visible: false,
            labelWidth: '150px'
          }
        },
        history: {
          visible: false,
          labelWidth: '150px'
        }
      },
      queryParam: {
        applicationId: '',
        queryName: '',
        envType: 1
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
    this.exit()
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    EnvTag,
    LeoBuildDetails,
    LeoDoBuildKubernetesImageEditor,
    LeoDoBuildFrontEndEditor,
    LeoDoBuildMavenPublishEditor,
    LatestBuildInfo,
    LeoBuildHistory
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
          this.handleSubscribeLeoJob()
          this.handleQueryLeoBuild()
        } catch (e) {
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
    /**
     * message = {
     *   messageType: 'QUERY_LEO_BUILD',
     *   body: {}
     * }
     *
     * consoleLog = {
     *   buildId: 1,
     *   log: ''
     * }
     *
     */
    socketOnMessage () {
      this.socket.onmessage = (message) => {
        const messageJson = JSON.parse(message.data)
        // 消息路由
        switch (messageJson.messageType) {
          case LeoRequestType.SUBSCRIBE_LEO_JOB:
            for (const job of messageJson.body.data) {
              if (job.applicationId === this.queryParam.applicationId && job.envType === this.queryParam.envType) {
                this.table.data = messageJson.body.data
                this.table.pagination.total = messageJson.body.data.totalNum
                return
              }
            }
            break
          case LeoRequestType.SUBSCRIBE_LEO_BUILD:
            for (const build of messageJson.body.data) {
              if (build.applicationId === this.queryParam.applicationId) {
                this.builds = messageJson.body.data
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
        length: 20
      }
      QUERY_MY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
        })
    },
    handleBuild (row) {
      const buildType = row?.configDetails?.job?.build?.type || 'kubernetes-image'
      switch (buildType) {
        case 'maven-publish':
          this.formStatus.build.mavenPublish.visible = true
          this.$refs.doBuildMavenPublishEditor.initData(Object.assign({}, row))
          break
        case 'front-end':
          this.formStatus.build.frontEnd.visible = true
          this.$refs.doBuildFrontEndEditor.initData(Object.assign({}, row))
          break
        /**
         * 'kubernetes-image'
         */
        default:
          this.formStatus.build.kubernetesImage.visible = true
          this.$refs.doBuildKubernetesImageEditor.initData(Object.assign({}, row))
      }
    },
    handleHistory (row) {
      this.formStatus.history.visible = true
      this.$refs.buildHistory.initData(Object.assign({}, row))
    },
    handleSubscribeLeoJob () {
      if (this.queryParam.applicationId === '') return
      if (this.queryParam.envType === '') return
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: LeoRequestType.SUBSCRIBE_LEO_JOB,
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      this.sendMessage(queryMessage)
    },
    handleQueryLeoBuild () {
      if (this.queryParam.applicationId === '') return
      if (this.queryParam.envType === '') return
      const queryMessage = {
        token: util.cookies.get('token'),
        messageType: LeoRequestType.SUBSCRIBE_LEO_BUILD,
        ...this.queryParam,
        page: 1,
        length: 3
      }
      this.sendMessage(queryMessage)
    },
    fetchData () {
      if (this.queryParam.applicationId === '' || this.queryParam.envType === '') return
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      this.table.loading = true
      QUERY_MY_LEO_JOB_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
      this.handleSubscribeLeoJob()
      this.handleQueryLeoBuild()
      this.builds = []
    }
  }
}
</script>

<style scoped>

.el-input {
  display: inline-block;
  max-width: 200px;
  margin-left: 5px;
}

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

.el-radio-group {
  margin-left: 5px;
}

</style>
