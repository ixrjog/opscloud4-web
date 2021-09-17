<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="close">
    <el-form :model="logMember">
      <el-form-item label="服务器组" :label-width="labelWidth" :required="true" v-show="formStatus.operationType">
        <el-select v-model.trim="serverGroup" filterable clearable value-key="name"
                   remote reserve-keyword placeholder="输入关键词搜索服务器组" :remote-method="getServerGroup" :loading="loading">
          <el-option
            v-for="item in serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.comment }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器组" v-show="!formStatus.operationType" :label-width="labelWidth">
        <el-input v-model.trim="logMember.serverGroupName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="自定义Topic" :label-width="labelWidth">
        <el-input v-model.trim="logMember.topic" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="环境" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="logMember.envType" filterable clearable
                   remote reserve-keyword
                   :loading="loading">
          <el-option
            v-for="item in envOptions"
            :key="item.envType"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model.trim="logMember.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import {
  ADD_LOG_MEMBER,
  UPDATE_LOG_MEMBER
} from '@/api/modules/datasource/datasource.aliyun.log.member.api.js'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'

export default {
  data () {
    return {
      labelWidth: '150px',
      envOptions: [],
      serverGroup: '',
      logMember: {},
      serverGroupOptions: [],
      loading: false
    }
  },
  name: 'AliyunLogMemberDialog',
  props: ['formStatus'],
  mounted () {
  },
  methods: {
    close () {
      this.formStatus.visible = false
      this.$emit('close')
    },
    initData (aliyunLogMember) {
      this.getEnv()
      this.logMember = aliyunLogMember
      if (this.logMember.serverGroup !== null) {
        this.serverGroup = this.logMember.serverGroup
      }
      this.getServerGroup('')
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
    getServerGroup (name) {
      const requestBody = {
        name: name,
        serverGroupTypeId: '',
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(res => {
          this.serverGroupOptions = res.body.data
        })
    },
    saveInfo () {
      setTimeout(() => {
        let requestBody = Object.assign({}, this.logMember)
        if (this.formStatus.operationType) {
          requestBody.serverGroupId = this.serverGroup.id
          ADD_LOG_MEMBER(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('close')
            })
        } else {
          UPDATE_LOG_MEMBER(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('close')
            })
        }
      }, 600)
    }
  }
}
</script>
