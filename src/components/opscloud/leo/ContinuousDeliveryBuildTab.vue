<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-select v-model.trim="queryParam.applicationId" filterable clearable
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="setQueryLeoJobTimer">
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
                 @change="setQueryLeoJobTimer">
        <el-option
          v-for="item in envOptions"
          :key="item.id"
          :label="item.envName"
          :value="item.envType">
          <select-item :name="item.envName" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-button :type="webSocketState.type" class="button">{{ webSocketState.name }}</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%">
      <el-table-column prop="name" label="名称" sortable></el-table-column>
      <el-table-column prop="branch" label="首选分支" sortable>
        <template v-slot="scope">
          <i class="fa fa-code-fork" style="margin-right: 2px"></i>
          <span>{{ scope.row.branch }}</span>
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
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <leo-do-build-editor :form-status="formStatus.build" ref="doBuildEditor"></leo-do-build-editor>
    <el-divider>最新构建详情</el-divider>

    <div v-for="build in builds" :key="build.id" style="font-size: 12px">
      <template>
        <leo-build-details :build="build">
        </leo-build-details>
      </template>
    </div>

  </div>
</template>

<script>

import { QUERY_APPLICATION_KUBERNETES_PAGE } from '@/api/modules/application/application.api'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'

import SelectItem from '../common/SelectItem'
import BusinessTags from '../common/tag/BusinessTags'
import Pagination from '../common/page/Pagination'
import EnvTag from '@/components/opscloud/common/tag/EnvTag'
import LeoDoBuildEditor from '@/components/opscloud/leo/LeoDoBuildEditor'

import util from '@/libs/util'
import LeoBuildDetails from '@/components/opscloud/leo/LeoBuildDetails'

const wsUrl = 'ws/continuous-delivery'

export default {
  name: 'continuous-delivery-build-tab',
  data () {
    return {
      socket: null,
      socketURI: util.wsUrl(wsUrl),
      // WebSocket Connecting
      webSocketState: {
        name: 'websocket closed',
        type: 'warning'
      },
      timers: {
        retrySocketTimer: null,
        queryJobTimer: null,
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
    clearInterval(this.timers.queryJobTimer) // 销毁定时器
    this.socket.close()
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    EnvTag,
    LeoBuildDetails,
    LeoDoBuildEditor
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
        this.webSocketState = {
          name: 'websocket closed',
          type: 'warning'
        }
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
        this.webSocketState = {
          name: 'websocket connecting',
          type: 'success'
        }
        try {
          const loginMessage = {
            messageType: 'LOGIN',
            token: token
          }
          this.sendMessage(loginMessage)
        } catch (e) {
          this.$message.error('登录失败, 未选择服务器或其它原因')
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
          case 'QUERY_LEO_JOB':
            this.table.data = messageJson.body.data
            this.table.pagination.total = messageJson.body.data.totalNum
            break
          case 'QUERY_LEO_BUILD':
            this.builds = messageJson.body.data
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
      QUERY_APPLICATION_KUBERNETES_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
        })
    },
    handleBuild (row) {
      this.formStatus.build.visible = true
      this.$refs.doBuildEditor.initData(Object.assign({}, row))
    },
    setQueryLeoJobTimer () {
      if (this.queryParam.applicationId === '' || this.queryParam.envType === '') return
      // queryJob定时器
      // 销毁定时器
      this.timers.queryJobTimer && clearInterval(this.timers.queryJobTimer) // 销毁定时器
      this.handleQueryLeoJob()
      this.timers.queryJobTimer = setInterval(() => {
        this.handleQueryLeoJob()
        this.handleQueryLeoBuild()
      }, 5000)
    },
    handleQueryLeoJob () {
      const queryMessage = {
        messageType: 'QUERY_LEO_JOB',
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      this.sendMessage(queryMessage)
    },
    handleQueryLeoBuild () {
      const queryMessage = {
        messageType: 'QUERY_LEO_BUILD',
        ...this.queryParam,
        page: 1,
        length: 5
      }
      this.sendMessage(queryMessage)
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

</style>
