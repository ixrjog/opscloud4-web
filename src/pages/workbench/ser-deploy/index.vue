<template>
  <d2-container>
    <div>
      <div>
        <h1>{{ title }}</h1>
      </div>
      <el-row>
        <el-select v-model.trim="application" filterable @change="fetchData" value-key="id"
                   remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication">
          <el-option
            v-for="item in applicationOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
            <select-item :name="item.name" :comment="item.comment"></select-item>
          </el-option>
        </el-select>
        <el-input v-model="queryParam.queryName" placeholder="输入关键字查询" @change="fetchData"
                  :disabled="checkFetchData()"/>
        <el-select v-model="queryParam.isActive" clearable placeholder="是否有效" @change="fetchData"
                   :disabled="checkFetchData()">
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.isFinish" clearable placeholder="是否完成" @change="fetchData"
                   :disabled="checkFetchData()">
          <el-option
            v-for="item in finishOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-radio-group v-model="queryCurrentSerParam.envName" size="mini" @change="queryCurrentSer"
                        :disabled="checkFetchData()" style="margin-right: 5px">
          <el-radio-button v-for="env in envOptions" :label="env.envName" :key="env.envName">
          </el-radio-button>
        </el-radio-group>
        <el-button @click="fetchData" :disabled="checkFetchData()">查询</el-button>
        <el-button @click="handleAdd" :disabled="checkFetchData()" style="margin: 0">新增</el-button>
      </el-row>
      <el-divider content-position="left" v-if="!checkFetchData()">
        {{ application.name }} - {{ application.comment }}
      </el-divider>
      <el-row v-if="JSON.stringify(currentSerList) !== '[]'" style="margin-top: 10px">
        <ser-simple-card :current-ser-list="currentSerList"></ser-simple-card>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <ser-deploy-task-table ref="serDeployTaskTable"
                                 @handleSerDeployTask="handleSerDeployTask">
          </ser-deploy-task-table>
          <ser-deploy-task-editor ref="serDeployTaskEditor" :formStatus="formStatus.serDeployTask"
                                  @close="fetchData"></ser-deploy-task-editor>
        </el-col>
        <el-col :span="16" v-if="!checkFetchData() && serDeployTaskUuid !== ''">
          <el-row>
            <ser-deploy-item-card ref="serDeployItemCard"
                                  :ser-deploy-task-name="serDeployTaskName"
                                  :ser-deploy-task-uuid="serDeployTaskUuid"
                                  :sub-task-list="subTaskList"
                                  :task-item-list="taskItemList"
                                  @handleSerDeployTask="handleSerDeployTask">
            </ser-deploy-item-card>
          </el-row>
          <el-row>
            <ser-deploy-sub-task-card ref="serDeploySubTaskCard"
                                      :application="application"
                                      :env-options="envOptions"
                                      :ser-deploy-task-id="serDeployTaskId"
                                      :ser-deploy-task-uuid="serDeployTaskUuid"
                                      :sub-task-list="subTaskList"
                                      :task-item-list="taskItemList"
                                      @handleSerDeployTask="handleSerDeployTask">
            </ser-deploy-sub-task-card>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </d2-container>
</template>

<script>

import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import SerSimpleCard from '@/components/opscloud/ser/SerSimpleCard'
import SerDeployTaskTable from '@/components/opscloud/ser/SerDeployTaskTable'
import { GET_SER_DEPLOY_TASK_BY_UUID, QUERY_CURRENT_SER } from '@/api/modules/ser/ser.api'
import SerDeployItemCard from '@/components/opscloud/ser/SerDeployItemCard'
import SerDeploySubTaskCard from '@/components/opscloud/ser/SerDeploySubTaskCard'
import SerDeployTaskEditor from '@/components/opscloud/ser/SerDeployTaskEditor'
import { QUERY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import SelectItem from '@/components/opscloud/common/SelectItem'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const finishOptions = [{
  value: true,
  label: '完成'
}, {
  value: false,
  label: '未完成'
}]

export default {
  name: 'index',
  data () {
    return {
      title: 'Ser 包发布',
      application: {},
      queryParam: {
        queryName: '',
        isActive: '',
        isFinish: ''
      },
      queryCurrentSerParam: {
        envName: ''
      },
      serDeployTaskId: -1,
      serDeployTaskUuid: '',
      serDeployTaskName: '',
      activeOptions: activeOptions,
      finishOptions: finishOptions,
      envOptions: [],
      applicationOptions: [],
      currentSerList: [],
      formStatus: {
        serDeployTask: {
          visible: false,
          operationType: true,
          addTitle: '新增发布任务',
          updateTitle: '更新发布任务'
        }
      },
      taskItemList: [],
      subTaskList: []
    }
  },
  filters: {},
  computed: {},
  mounted () {
    this.getEnv()
    this.initData()
    this.getApplication('')
  },
  components: {
    SerSimpleCard,
    SerDeployTaskTable,
    SerDeployItemCard,
    SerDeploySubTaskCard,
    SerDeployTaskEditor,
    SelectItem
  },
  methods: {
    initData () {
      this.serDeployTaskId = -1
      this.serDeployTaskUuid = ''
      this.serDeployTaskName = ''
      this.currentSerList = []
      this.taskItemList = []
      this.subTaskList = []
    },
    getApplication () {
      const requestBody = {
        queryName: name,
        tagKey: 'Ser',
        extend: false,
        page: 1,
        length: 10
      }
      QUERY_APPLICATION_PAGE(requestBody)
        .then(({ body }) => {
          this.applicationOptions = body.data
        })
    },
    checkFetchData () {
      return JSON.stringify(this.application) === '{}'
    },
    fetchData () {
      this.initData()
      this.queryCurrentSer()
      this.$refs.serDeployTaskTable.initData(this.queryParam, this.application)
    },
    getEnv () {
      const requestBody = {
        envName: '',
        isActive: true,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(({ body }) => {
          this.envOptions = body.data
        })
    },
    getSerDeployTask () {
      GET_SER_DEPLOY_TASK_BY_UUID({ taskUuid: this.serDeployTaskUuid })
        .then(({ body }) => {
          this.taskItemList = body.taskItemList
          this.subTaskList = body.subTaskList
          this.serDeployTaskName = body.taskName
          this.serDeployTaskId = body.id
        })
    },
    handleSerDeployTask (serDeployTaskUuid) {
      this.serDeployTaskUuid = serDeployTaskUuid
      this.getSerDeployTask()
      this.queryCurrentSer()
    },
    handleAdd () {
      this.formStatus.serDeployTask.operationType = true
      const serDeployTask = {
        applicationId: this.application.id,
        taskName: '',
        taskDesc: '',
        isActive: true,
        isFinish: false
      }
      this.$refs.serDeployTaskEditor.initData(serDeployTask, this.application)
      this.formStatus.serDeployTask.visible = true
    },
    queryCurrentSer () {
      if (this.queryCurrentSerParam.envName !== '') {
        const requestBody = {
          ...this.queryCurrentSerParam,
          applicationName: this.application.name
        }
        QUERY_CURRENT_SER(requestBody)
          .then(({ body }) => {
            this.currentSerList = body
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  margin-right: 5px;
  display: inline-block;
  max-width: 200px;
}

.el-select {
  margin-right: 5px;
}

.el-button {
  margin-right: 5px;
}

.my-span {
  margin-right: 5px;
}
</style>
