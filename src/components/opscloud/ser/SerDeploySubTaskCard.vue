<template>
  <el-card class="subTaskCard">
    <div slot="header" class="clearfix">
      <my-span content="发布记录" style="font-size: 14px;margin-right: 10px"></my-span>
      <span style="float: right;margin-left: 5px">
                <el-dropdown trigger="click" @command="handleSubTaskAdd">
                  <span class="el-dropdown-link">
                    <i class="el-icon-plus el-icon--right" style="margin-right: 2px"></i>新增发布
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="env in envOptions" :key="env.id"
                                      :command="env.envType">
                      {{ env.envName }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
    </div>
    <div>
      <el-timeline>
        <el-timeline-item v-for="subTask in subTaskList" :key="subTask.id"
                          :timestamp="subTask.createTime" placement="top">
          <el-card>
            <div slot="header" class="clearfix">
              <el-tag style="margin-right: 5px">{{ subTask.env.envName }}</el-tag>
              <span v-if="subTask.ticketFlag !== null">
                <i class="fas fa-lock" v-if="!subTask.ticketFlag" style="color: #F56C6C"></i>
                <i class="fas fa-unlock" v-if="subTask.ticketFlag" style="color: #67C23A"></i>
              </span>
              <span style="margin-left: 5px;vertical-align: bottom" v-if="subTask.startTime">
                <i class="far fa-clock"/>{{ subTask.ago }}</span>
              <span style="float: right;margin-left: 5px">
                <el-button type="text" @click="handlerRefreshDeploySubTask" style="padding: 2px">
                  刷新</el-button>
                <el-button type="text" @click="handlerDeploySubTask(subTask)" style="padding: 2px">
                  发布</el-button>
              </span>
            </div>
            <el-row>
              <el-col :span="8">
                <div class="label">
                  <span>执行时间</span>
                  <span v-show="subTask.startTime">
                    {{ subTask.startTime }} - {{ subTask.endTime ? subTask.endTime : '?' }}
                  </span>
                  <span v-show="subTask.runtime" style="margin-left: 2px">
                    <b style="color: #3b97d7"> {{ subTask.runtime }}</b>
                  </span>
                </div>
                <div class="label">
                  <span>部署人员</span>
                  <user-tag :user="subTask.deployUser" v-if="subTask.deployUser !== null"></user-tag>
                </div>
                <div class="label">
                  <span>部署状态</span>
                  <span>{{ subTask.taskStatus }}</span>
                </div>
                <div class="label">
                  <span>部署结果</span>
                  <span>{{ subTask.taskResult }}</span>
                </div>
              </el-col>
              <el-col :span="16">
                <el-collapse accordion>
                  <el-collapse-item>
                    <template slot="title">
                      Request<i class="fas fa-hiking" style="margin-left: 5px"></i>
                    </template>
                    <span>{{ subTask.requestContent }}</span>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template slot="title">
                      Response<i class="fas fa-piggy-bank" style="margin-left: 5px"></i>
                    </template>
                    <span>{{ subTask.responseContent }}</span>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template slot="title">
                      Callback<i class="fas fa-shipping-fast" style="margin-left: 5px"></i>
                    </template>
                    <span style="white-space: pre-line">{{ subTask.callbackContent }}</span>
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<script>
import MySpan from '@/components/opscloud/common/MySpan'
import { ADD_SER_DEPLOY_SUB_TASK, DEPLOY_SUB_TASK } from '@/api/modules/ser/ser.api'
import UserTag from '@/components/opscloud/common/tag/UserTag'

export default {
  name: 'SerDeploySubTaskCard',
  props: {
    taskItemList: {
      type: Array,
      required: true
    },
    subTaskList: {
      type: Array,
      required: true
    },
    serDeployTaskUuid: {
      type: String,
      required: true
    },
    serDeployTaskId: {
      type: Number,
      required: true
    },
    application: {
      type: Object,
      required: true
    },
    envOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    MySpan,
    UserTag
  },
  methods: {
    handleSubTaskAdd (envType) {
      this.$confirm('确认新增发布，新增发布后 Ser 包将无法变更?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const serDeploySubTask = {
          serDeployTaskId: this.serDeployTaskId,
          applicationId: this.application.id,
          envType: envType
        }
        ADD_SER_DEPLOY_SUB_TASK(serDeploySubTask).then(() => {
          this.$message.success('新增完成')
          this.handlerRefreshDeploySubTask()
        })
      }).catch(() => {
        this.$message.info('已取消!')
      })
    },
    handlerRefreshDeploySubTask () {
      this.$emit('handleSerDeployTask', this.serDeployTaskUuid)
    },
    handlerDeploySubTask (subTask) {
      this.$confirm('确认发布 Ser 包吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DEPLOY_SUB_TASK({ serDeploySubTaskId: subTask.id }).then(() => {
          this.$message.success('发布完成')
          this.handlerRefreshDeploySubTask()
        })
      }).catch(() => {
        this.$message.info('已取消!')
      })
    }
  }
}
</script>

<style scoped lang="less">

.el-card {
  /deep/ .el-card__header {
    padding: 10px;
  }

  /deep/ .el-card__body {
    padding: 10px;
  }

}

.subTaskCard {
  .label {
    line-height: 35px;

    span:first-child {
      margin-right: 5px;
      color: #B7B6B6;
    }
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 10px
  }

}

</style>
