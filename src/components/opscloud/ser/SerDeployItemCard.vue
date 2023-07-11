<template>
  <el-card>
    <div>
      <h3 style="margin: 5px 0 10px">任务名称: {{ serDeployTaskName }}</h3>
      <div>
        <el-upload
          drag
          accept=".ser"
          class="upload-demo"
          :action="getUploadUri()"
          :headers="uploadHeaders"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          v-if="JSON.stringify(subTaskList) === '[]'">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，只支持 ser 包</div>
        </el-upload>
      </div>
    </div>
    <el-table :data="taskItemList" style="width: 100%">
      <el-table-column prop="itemName" label="包名">
        <template slot-scope="scope">
          <span>{{ scope.row.itemName }}</span>
          <p style="color: #9d9fa3;margin: 0">{{ scope.row.itemSize }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="itemMd5" label="MD5"></el-table-column>
      <el-table-column label="上传人">
        <template slot-scope="scope">
          <user-tag :user="scope.row.reloadUser"></user-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleItemDelete(scope.row)" style="padding: 2px">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import UserTag from '@/components/opscloud/common/tag/UserTag'
import util from '@/libs/util'
import { DELETE_SER_DEPLOY_TASK_ITEM } from '@/api/modules/ser/ser.api'

export default {
  data () {
    return {
      uploadHeaders: {}
    }
  },
  name: 'SerDeployItemCard',
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
    serDeployTaskName: {
      type: String,
      required: true
    }
  },
  components: {
    UserTag
  },
  methods: {
    initData () {

    },
    getUploadUri () {
      const actionUri = 'ser/upload'
      return process.env.VUE_APP_API + actionUri
    },
    beforeUpload (file) {
      this.uploadHeaders['Authorization'] = util.cookies.get('token')
      this.uploadHeaders['x-task-uuid'] = this.serDeployTaskUuid
      this.$message.info('正在上传')
    },
    onSuccess (response, file, fileList) {
      this.$message.success('上传成功')
      this.$emit('handleSerDeployTask', this.serDeployTaskUuid)
    },
    onError (err, file, fileList) {
      this.$message.error(err.stack)
    },
    handleItemDelete (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_SER_DEPLOY_TASK_ITEM({ id: row.id }).then(() => {
          this.$message.success('删除成功!')
          this.$emit('handleSerDeployTask', this.serDeployTaskUuid)
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
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

</style>
