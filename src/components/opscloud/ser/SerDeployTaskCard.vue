<template>
  <div>
    <el-row style="margin-bottom: 5px">
      <el-select v-model.trim="applicationId" filterable @change="fetchData"
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication">
        <el-option
          v-for="item in applicationOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
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
      <el-button @click="fetchData" :disabled="checkFetchData()">查询</el-button>
      <el-button @click="handleAdd" :disabled="checkFetchData()">新增</el-button>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div v-for="task in table.data" :key="task.id">
          <el-card>
            <div slot="header" class="clearfix">
              <my-span :content="task.taskName" style="font-size: 14px;margin-right: 10px"></my-span>
              <el-tooltip class="item" effect="dark" :content="task.taskUuid" placement="top-start">
                <i class="fas fa-info-circle"></i>
              </el-tooltip>
              <span style="float: right;margin-left: 5px">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <el-button type="text" @click="handlerRowEdit(task)" style="padding: 2px">
                    <i class="fas fa-edit"></i>
                  </el-button>
                </el-tooltip>
                <el-button type="text" @click="handlerRowSel(task)" style="padding: 2px">
                  <i class="fas fa-plus-circle"></i>
                </el-button>
              </span>
            </div>
            <div class="meta-cardInfo">
              <div>
                <p>
                  <d2-count-up :end="task.taskItemSize"/>
                </p>
                <p>Ser 包数量</p>
              </div>
              <div>
                <p>
                  <d2-count-up :end="task.subTaskSize"/>
                </p>
                <p>发布环境数量</p>
              </div>
            </div>
            <el-divider></el-divider>
            <span>{{ task.taskDesc }}</span>
          </el-card>
        </div>
        <ser-deploy-task-editor ref="serDeployTaskEditor" :formStatus="formStatus.serDeployTask"
                                @close="fetchData"></ser-deploy-task-editor>
        <el-pagination background @current-change="paginationCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, prev, pager, next"
                       :total="table.pagination.total"
                       :current-page="table.pagination.currentPage"
                       :page-size="table.pagination.pageSize"></el-pagination>
      </el-col>
      <el-col :span="16" v-if="!checkFetchData() && serDeployTaskUuid !== ''">
        <el-row>
          <el-card>
            <div>
              <h2>{{ serDeployTaskName }}</h2>
              <div>
                <el-upload
                  drag
                  accept=".ser"
                  class="upload-demo"
                  :action="getUploadUri()"
                  :headers="uploadHeaders"
                  :before-upload="beforeUpload"
                  :on-success="onSuccess"
                  :on-error="onError">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，只支持 ser 包</div>
                </el-upload>
              </div>
            </div>
            <el-table :data="taskItemList" style="width: 100%">
              <el-table-column prop="itemName" label="包名" width="180"></el-table-column>
              <el-table-column prop="itemSize" label="大小" width="180"></el-table-column>
              <el-table-column prop="itemMd5" label="MD5" width="320"></el-table-column>
              <el-table-column label="上传人" width="180">
                <template slot-scope="scope">
                  <user-tag :user="scope.row.deployUser"></user-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="移除" placement="top-start">
                    <el-button type="text" @click="handleItemDelete(scope.row)" style="padding: 2px">
                      <i class="fas fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                  <!--                  <el-button plain size="mini" type="danger" @click="handleItemDelete(scope.row)">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="subTaskCard"></el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  DELETE_SER_DEPLOY_TASK_ITEM,
  GET_SER_DEPLOY_TASK_BY_UUID,
  QUERY_SER_DEPLOY_TASK_PAGE
} from '@/api/modules/ser/ser.api'
import SerDeployTaskEditor from '@/components/opscloud/ser/SerDeployTaskEditor'
import { QUERY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import mySpan from '@/components/opscloud/common/MySpan'
import util from '@/libs/util'
import UserTag from '@/components/opscloud/common/tag/UserTag'

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
  name: 'SerDeployTaskTable',
  props: {},
  data () {
    return {
      applicationId: '',
      table: {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 5,
          total: 0
        }
      },
      queryParam: {
        queryName: '',
        isActive: '',
        isFinish: ''
      },
      applicationOptions: [],
      activeOptions: activeOptions,
      finishOptions: finishOptions,
      formStatus: {
        serDeployTask: {
          visible: false,
          operationType: true,
          addTitle: '新增发布任务',
          updateTitle: '更新发布任务'
        }
      },
      uploadHeaders: {},
      taskItemList: [],
      subTaskList: [],
      serDeployTaskName: '',
      serDeployTaskUuid: ''
    }
  },
  components: {
    UserTag,
    SelectItem,
    SerDeployTaskEditor,
    mySpan
  },
  mounted () {
    this.getApplication('')
  },
  methods: {
    checkFetchData () {
      return this.applicationId === ''
    },
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    initData () {
      this.taskItemList = []
      this.subTaskList = []
      this.serDeployTaskName = ''
      this.serDeployTaskUuid = ''
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
    fetchData () {
      this.initData()
      const requestBody = {
        ...this.queryParam,
        applicationId: this.applicationId,
        extend: true,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_SER_DEPLOY_TASK_PAGE(requestBody)
        .then(({ body }) => {
          this.table.data = body.data
          this.table.pagination.total = body.totalNum
        })
    },
    handlerIsFinish () {

    },
    handleAdd () {
      this.formStatus.serDeployTask.operationType = true
      const serDeployTask = {
        applicationId: this.applicationId,
        taskName: '',
        taskDesc: '',
        isActive: true,
        isFinish: false
      }
      this.$refs.serDeployTaskEditor.initData(serDeployTask)
      this.formStatus.serDeployTask.visible = true
    },
    handlerRowSel (row) {
      this.taskItemList = row.taskItemList
      this.subTaskList = row.subTaskList
      this.serDeployTaskName = row.taskName
      this.serDeployTaskUuid = row.taskUuid
    },
    getUploadUri () {
      const actionUri = 'ser/upload'
      return process.env.VUE_APP_API + actionUri
    },
    beforeUpload (file) {
      const token = util.cookies.get('token')
      this.uploadHeaders['Authorization'] = token
      this.uploadHeaders['x-task-uuid'] = this.serDeployTaskUuid
      this.$message.info('正在上传')
    },
    onSuccess (response, file, fileList) {
      this.$message.success('上传成功')
      this.getSerDeployTask()
    },
    onError (err, file, fileList) {
      this.$message.error(err.stack)
    },
    getSerDeployTask () {
      GET_SER_DEPLOY_TASK_BY_UUID({ taskUuid: this.serDeployTaskUuid })
        .then(({ body }) => {
          this.taskItemList = body.taskItemList
        })
    },
    handlerRowEdit (row) {
      this.formStatus.serDeployTask.operationType = false
      const serDeployTask = {
        id: row.id,
        applicationId: row.applicationId,
        taskName: row.taskName,
        taskDesc: row.taskDesc,
        isActive: row.isActive,
        isFinish: row.isFinish
      }
      this.$refs.serDeployTaskEditor.initData(serDeployTask)
      this.formStatus.serDeployTask.visible = true
    },
    handleItemDelete (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_SER_DEPLOY_TASK_ITEM({ id: row.id }).then(() => {
          this.$message.success('删除成功!')
          this.getSerDeployTask()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
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

.el-card {
  margin-bottom: 10px;
  position: relative;

  /deep/ .el-card__header {
    padding: 10px;
  }

  /deep/ .el-card__body {
    padding: 10px;
  }

}

.meta-cardInfo {
  height: 60px;
  margin-top: 16px;
  margin-left: 40px;

  > div {
    position: relative;
    float: left;
    width: 50%;
    text-align: left;

    p {
      line-height: 32px;
      font-size: 12px;
      font-weight: bolder;
      margin: 0;
      color: #B7B6B6;

      &:first-child {
        color: #20A9D9;
        font-size: 24px;
        font-weight: lighter;
        line-height: 20px;
        margin-bottom: 4px;
      }
    }
  }
}

.el-divider--horizontal {
  margin: 12px 0;
}

.upload-demo {
  margin-bottom: 10px;

  /deep/ .el-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  /deep/ .el-upload-dragger {
    width: 70%;
  }

  /deep/ .el-upload-list {
    display: none;
  }

}

.subTaskCard {

}
</style>
