<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" :before-close="handleClose">
    <el-form :model="accessToken">
      <el-form-item label="令牌ID" :label-width="formStatus.labelWidth">
        <el-input v-model="accessToken.tokenId" placeholder="自动生成" readonly></el-input>
      </el-form-item>
      <el-form-item label="令牌" :label-width="formStatus.labelWidth">
        <el-input v-model="accessToken.token" clearable placeholder="自动生成" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="过期时间" :label-width="formStatus.labelWidth" :required="true">
        <el-date-picker
          v-model="accessToken.expiredTime" value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="描述" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model="accessToken.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleGrant" :disabled="accessToken.id !== ''">授权
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { GRANT_ACCESS_TOKEN } from '@/api/modules/user/user.access.token.api.js'

export default {
  data () {
    return {
      title: '申请访问令牌',
      accessToken: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date('2030-12-12 00:00:00')
        },
        shortcuts: [{
          text: '30天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '90天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', date)
          }
        }, {
          text: '180天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', date)
          }
        }, {
          text: '1年',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
            picker.$emit('pick', date)
          }
        }, {
          text: '2年',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 2)
            picker.$emit('pick', date)
          }
        }, {
          text: '3年',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 3)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  name: 'UserAccessTokenEditor',
  props: ['formStatus'],
  mixins: [],
  mounted () {
  },
  mutation () {
  },
  methods: {
    handleClose () {
      this.formStatus.visible = false
      this.$emit('fetchData')
    },
    initData () {
      this.accessToken = {
        id: '',
        username: '',
        tokenId: '',
        token: '',
        valid: true,
        comment: '',
        expiredTime: ''
      }
    },
    handleGrant () {
      GRANT_ACCESS_TOKEN(this.accessToken)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.accessToken = res.body
        })
    }
  }
}
</script>
