<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="aliyunLog">
      <el-form-item label="日志项目" :label-width="labelWidth" :required="true">
        <el-select v-model="aliyunLog.project" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜索project" :remote-method="getProject"
                   @change="handleSelProject" :loading="loading">
          <el-option
            v-for="item in projectOptions"
            :key="item.projectName"
            :label="item.name"
            :value="item.projectName">
            <span style="float: left">{{ item.projectName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectDesc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日志库" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="aliyunLog.logstore" placeholder="选择logstore" @change="handleSelLogstore"
                   :disabled="aliyunLog.project === ''" filterable>
          <el-option
            v-for="item in logstoreOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Logtail配置" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="aliyunLog.config" placeholder="选择config" :disabled="aliyunLog.logstore === ''"
                   filterable>
          <el-option
            v-for="item in configOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model.trim="aliyunLog.comment" placeholder="请输入内容"></el-input>
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
  QUERY_PROJECT,
  QUERY_LOGSTORE,
  QUERY_CONFIG,
  ADD_LOG,
  UPDATE_LOG
} from '@/api/modules/datasource/datasource.aliyun.log.api.js'

export default {
  data () {
    return {
      labelWidth: '150px',
      aliyunLog: {},
      projectOptions: [],
      logstoreOptions: [],
      configOptions: [],
      loading: false
    }
  },
  name: 'AliyunLogEditor',
  props: ['formStatus', 'instanceId'],
  mounted () {
    this.getProject('')
  },
  methods: {
    initData (aliyunLog) {
      this.aliyunLog = aliyunLog
    },
    getProject (param) {
      let requestBody = {
        queryName: param,
        instanceId: this.instanceId
      }
      QUERY_PROJECT(requestBody)
        .then(res => {
          this.projectOptions = res.body
        })
    },
    getLogstore () {
      let requestBody = {
        projectName: this.aliyunLog.project,
        instanceId: this.instanceId
      }
      QUERY_LOGSTORE(requestBody)
        .then(res => {
          this.logstoreOptions = res.body
        })
    },
    getConfig () {
      let requestBody = {
        projectName: this.aliyunLog.project,
        logstoreName: this.aliyunLog.logstore,
        instanceId: this.instanceId
      }
      QUERY_CONFIG(requestBody)
        .then(res => {
          this.configOptions = res.body
        })
    },
    handleSelProject () {
      this.logstoreOptions = []
      this.aliyunLog.logstore = ''
      this.configOptions = []
      this.aliyunLog.config = ''
      this.getLogstore()
    },
    handleSelLogstore () {
      this.configOptions = []
      this.aliyunLog.config = ''
      this.getConfig()
    },
    saveInfo () {
      setTimeout(() => {
        let requestBody = Object.assign({}, this.aliyunLog)
        if (this.formStatus.operationType) {
          ADD_LOG(requestBody)
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
          UPDATE_LOG(requestBody)
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
