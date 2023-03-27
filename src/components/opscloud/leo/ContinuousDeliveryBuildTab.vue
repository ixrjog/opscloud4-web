<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-button :type="webSocketState.type" class="button">
        <i v-show="webSocketState.type === 'success'" class="fas fa-link" style="margin-right: 5px"></i>
        <i v-show="webSocketState.type === 'warning'" class="fas fa-unlink"
           style="margin-right: 5px"></i>{{ webSocketState.name }}
      </el-button>
      <el-radio-group v-model="queryParam.envType" size="mini" @change="fetchData">
        <el-radio-button v-for="env in envOptions" :label="env.envType">{{ env.envName }}</el-radio-button>
      </el-radio-group>
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
      <el-select v-if="false" v-model="queryParam.envType" clearable filterable
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
    </el-row>
    <el-table :data="table.data" style="width: 100%">
      <el-table-column prop="name" label="名称" sortable></el-table-column>
      <el-table-column prop="branch" label="首选分支" sortable>
        <template v-slot="scope">
          <i class="fa fa-code-fork" style="margin-right: 2px"></i>
          <span>{{ scope.row.branch }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="latestBuildInfos" label="最新构建">
        <template v-slot="scope">
          <latest-build-info :buildInfos="scope.row.latestBuildInfos"></latest-build-info>
        </template>
      </el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template v-slot="scope">
          <env-tag :env="scope.row.env"></env-tag>
        </template>
      </el-table-column>
      <el-table-column prop="buildSize" label="构建次数" width="80">
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template v-slot="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleBuild(scope.row)">构建</el-button>
          <el-button type="primary" plain size="mini" @click="handleHistory(scope.row)">历史</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <leo-do-build-editor :form-status="formStatus.build" ref="doBuildEditor"></leo-do-build-editor>
    <leo-build-history :form-status="formStatus.history" ref="buildHistory"></leo-build-history>
    <el-divider>Latest build details</el-divider>
    <div v-for="build in builds" :key="build.id" style="font-size: 12px">
      <template>
        <leo-build-details :build="build" :ref="`leoBuildDetails_${build.id}`"></leo-build-details>
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
import LeoDoBuildEditor from '@/components/opscloud/leo/LeoDoBuildEditor'

import util from '@/libs/util'
import LeoBuildDetails from '@/components/opscloud/leo/LeoBuildDetails'
import LatestBuildInfo from '@/components/opscloud/leo/child/LatestBuildInfo'
import LeoBuildHistory from '@/components/opscloud/leo/LeoBuildHistory'
import router from '@/router'

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
    clearInterval(this.timers.retrySocketTimer) // 销毁定时器
    try {
      this.socket.close()
    } catch (e) {
    }
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    EnvTag,
    LeoBuildDetails,
    LeoDoBuildEditor,
    LatestBuildInfo,
    LeoBuildHistory
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
        router.push({ name: 'login' })
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
            for (let job of messageJson.body.data) {
              if (job.applicationId === this.queryParam.applicationId && job.envType === this.queryParam.envType) {
                this.table.data = messageJson.body.data
                this.table.pagination.total = messageJson.body.data.totalNum
                return
              }
            }
            break
          case LeoRequestType.SUBSCRIBE_LEO_BUILD:
            for (let build of messageJson.body.data) {
              if (build.applicationId === this.queryParam.applicationId) {
                this.builds = messageJson.body.data
                return
              }
            }
            break
          case LeoRequestType.AUTHENTICATION_FAILURE:
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
      this.formStatus.build.visible = true
      this.$refs.doBuildEditor.initData(Object.assign({}, row))
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
      this.handleSubscribeLeoJob()
      this.table.data = []
      this.table.pagination.total = 0
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
