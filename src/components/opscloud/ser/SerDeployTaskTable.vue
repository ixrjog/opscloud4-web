<template>
  <div>
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
        <span style="color: #9d9fa3">{{ task.taskDesc }}</span>
      </el-card>
    </div>
    <ser-deploy-task-editor ref="serDeployTaskEditor" :formStatus="formStatus.serDeployTask"
                            @close="fetchData"></ser-deploy-task-editor>
    <el-pagination background @current-change="paginationCurrentChange"
                   @size-change="handleSizeChange" hide-on-single-page
                   layout="total, prev, pager, next"
                   :total="table.pagination.total"
                   :current-page="table.pagination.currentPage"
                   :page-size="table.pagination.pageSize"></el-pagination>
  </div>
</template>

<script>
import SerDeployTaskEditor from '@/components/opscloud/ser/SerDeployTaskEditor'
import { QUERY_SER_DEPLOY_TASK_PAGE } from '@/api/modules/ser/ser.api'
import MySpan from '@/components/opscloud/common/MySpan'

export default {
  data () {
    return {
      formStatus: {
        serDeployTask: {
          visible: false,
          operationType: true,
          addTitle: '新增发布任务',
          updateTitle: '更新发布任务'
        }
      },
      table: {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 5,
          total: 0
        }
      },
      queryParam: {},
      application: {}
    }
  },
  name: 'SerDeployTaskTable',
  props: {},
  components: {
    SerDeployTaskEditor,
    MySpan
  },
  methods: {
    initData (queryParam, application) {
      this.queryParam = queryParam
      this.application = application
      this.fetchData()
    },
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    handlerRowEdit (row) {
      this.formStatus.serDeployTask.operationType = false
      const serDeployTask = {
        id: row.id,
        applicationId: row.application.id,
        taskName: row.taskName,
        taskDesc: row.taskDesc,
        isActive: row.isActive,
        isFinish: row.isFinish
      }
      this.$refs.serDeployTaskEditor.initData(serDeployTask, this.application)
      this.formStatus.serDeployTask.visible = true
    },
    fetchData () {
      const requestBody = {
        ...this.queryParam,
        applicationId: this.application.id,
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
    handlerRowSel (row) {
      this.$emit('handleSerDeployTask', row.taskUuid)
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin-bottom: 10px;

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
    width: 30%;
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

</style>
