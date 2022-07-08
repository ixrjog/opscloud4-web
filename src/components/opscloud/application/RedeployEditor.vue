<template>
  <el-dialog title="Deployment重新部署操作" :visible.sync="formStatus.visible" width="50%">
    <el-form :model="resource" label-width="150px">
      <el-form-item label="命名空间">
        <el-input v-model="resource.asset.assetKey2" readonly></el-input>
      </el-form-item>
      <el-form-item label="Deployment">
        <el-input v-model="resource.asset.assetKey" readonly></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <business-tags :tags="resource.tags"></business-tags>
      </el-form-item>
      <el-form-item label="操作说明" required>
        <el-input v-model="requestParam.comment" placeholder="生产环境执行操作必须说明原因"></el-input>
      </el-form-item>
      <el-form-item label="操作日志">
        <el-table :data="resource.operationLogs" style="width: 100%">
          <el-table-column prop="date" label="操作人">
            <template slot-scope="scope">
              <user-tag :user="scope.row.user"></user-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ago" label="时间"></el-table-column>
          <el-table-column prop="comment" label="说明" show-overflow-tooltip></el-table-column>
          <el-table-column prop="result" label="结果">
            <template slot-scope="scope">
              <el-tag disable-transitions :type="scope.row.result === 'SUCCESS' ? 'success' : 'danger'">
                {{ scope.row.result }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleOperation" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags'
import UserTag from '@/components/opscloud/common/tag/UserTag'
import { OPERATION_APPLICATION_RES } from '@/api/modules/application/application.api'

export default {
  data () {
    return {
      resource: {
        asset: {
          assetKey: '',
          assetKey2: ''
        },
        tags: '',
        operationLogs: []
      },
      requestParam: {
        comment: ''
      },
      loading: false
    }
  },
  name: 'RedeployEditor',
  props: ['formStatus'],
  components: {
    UserTag,
    BusinessTags
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (resource) {
      debugger
      this.resource = resource
      this.requestParam.comment = ''
    },
    handleOperation () {
      this.$confirm('此操作将重新部署无状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestBody = {
          resourceId: this.resource.id,
          operationType: 'REDEPLOY',
          comment: this.requestParam.comment
        }
        this.loading = true
        OPERATION_APPLICATION_RES(requestBody).then(() => {
          this.$message.success('执行成功!')
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    }
  }
}
</script>
