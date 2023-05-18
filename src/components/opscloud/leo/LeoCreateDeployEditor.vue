<template>
  <el-dialog title="部署任务" :visible.sync="formStatus.visible" width="70%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="部署" name="deploy">
        <el-form :model="application">
          <el-form-item label="应用名称" :label-width="formStatus.labelWidth">
            <el-input v-model="application.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="任务环境" :label-width="formStatus.labelWidth">
            <el-input v-model="env.envName" readonly style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="构建任务" :label-width="formStatus.labelWidth" required>
            <el-select v-model="doDeployParam.jobId" filterable clearable remote reserve-keyword @change="selLeoJob"
                       placeholder="搜索并选择任务" style="width: 400px" :remote-method="getLeoJob">
              <el-option
                v-for="item in jobOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <select-item :name="item.name" :comment="item.jobKey"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Deployment" :label-width="formStatus.labelWidth" required>
            <el-select v-model="doDeployParam.assetId" filterable clearable remote reserve-keyword
                       :disabled="this.doDeployParam.jobId === ''"
                       placeholder="选择Deployment" style="width: 400px" :remote-method="getLeoDeployDeployment">
              <el-option
                v-for="item in deployDeploymentOptions"
                :key="item.businessId"
                :label="item.name"
                :value="item.businessId">
                <select-item :name="item.name" :comment="item.resourceType"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署类型" :label-width="formStatus.labelWidth" required>
            <el-col :span="6">
              <el-radio v-model="doDeployParam.deployType" label="ROLLING" border>滚动 Rolling</el-radio>
              <el-alert class="radio-desc" :closable="false"
                        title="渐进式创建新版本，然后停止老版本，自动完成整个流程 (滚动比例25%)"
                        type="info">
              </el-alert>
            </el-col>
            <el-col :span="6">
              <el-radio v-model="doDeployParam.deployType" label="REDEPLOY" border>重启 Redeploy</el-radio>
              <el-alert class="radio-desc" :closable="false"
                        title="不变更版本，只滚动重启所有副本。离线的Canary环境重新上线"
                        type="info">
              </el-alert>
            </el-col>
            <!--            小部分流量，升级并导入新版本，手工验证完毕后，全量升级部署-->
            <el-col :span="6">
              <el-radio v-model="doDeployParam.deployType" label="OFFLINE" border>下线 Offline</el-radio>
              <el-alert class="radio-desc" :closable="false"
                        title="仅支持小流量环境（Canary）下线"
                        type="info">
              </el-alert>
            </el-col>
            <el-col :span="6" v-if="false">
              <el-radio v-model="doDeployParam.deployType" label="BG" border :disabled="true">蓝绿 Blue/Green</el-radio>
              <el-alert class="radio-desc" :closable="false"
                        title="创建出新版本，与老版本并存，通过切换流量实现发布与回滚"
                        type="info">
              </el-alert>
            </el-col>
          </el-form-item>
          <el-form-item label="发布版本" :label-width="formStatus.labelWidth" required
                        v-if="doDeployParam.deployType === 'ROLLING'">
            <el-select v-model="doDeployParam.buildId" filterable clearable remote reserve-keyword
                       :disabled="doDeployParam.jobId === ''"
                       placeholder="搜索并选择版本" style="width: 400px" :remote-method="getLeoDeployVersion">
              <el-option v-for="item in deployVersionOptions"
                         :key="item.id"
                         :label="item.versionName"
                         :value="item.id">
                  <span style="float: left">{{ item.versionName }}</span>
                <span :style="{float: 'right', color: '#8492a6', fontSize: '13px',marginLeft: '15px'}">{{item.ago}} #{{item.buildNumber}}次构建
                  <span v-if="item.ticketId !== 0" style="color: #0da815">[<i class="fas fa-check" v-if="item.ticketId !== 0" style="margin-right: 1px"/>工单]</span>
                </span>
<!--                <select-item :name="item.versionName"-->
<!--                             :comment="item.ago + ' #' + item.buildNumber + '次构建'"></select-item>-->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署说明" :label-width="formStatus.labelWidth">
            <el-input v-model="doDeployParam.comment"></el-input>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="doDeploy" icon="fa fa-play" :loading="buttons.doDeploying"
                     :disabled="buttons.doDeploying || doDeployParam.jobId === '' ||  (doDeployParam.deployType === 'ROLLING' &&  doDeployParam.buildId === '') || doDeployParam.assetId === ''">
            <span style="margin-left: 2px">执行部署</span>
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { QUERY_LEO_JOB_PAGE } from '@/api/modules/leo/leo.job.api'
import { QUERY_LEO_DEPLOY_VERSION, QUERY_LEO_DEPLOY_DEPLOYMENT, DO_DEPLOY } from '@/api/modules/leo/leo.deploy.api'

export default {
  data () {
    return {
      activeName: 'deploy',
      editing: false,
      application: '',
      env: '',
      doDeployParam: {
        jobId: '',
        buildId: '',
        // deployment
        assetId: '',
        deployType: 'ROLLING'
      },
      jobOptions: [],
      // 部署版本
      deployVersionOptions: [],
      deployDeploymentOptions: [],
      style: { height: '400px' },
      buttons: {
        doDeploying: false
      }
    }
  },
  name: 'LeoCreateDeployEditor',
  props: ['formStatus'],
  components: {},
  mixins: [],
  mounted () {
  },
  methods: {
    /**
     *  const data = {
     *    application: {},
     *    env: {}
     *  }
     * @param data
     */
    getLeoJob (name) {
      const requestBody = {
        queryName: name,
        applicationId: this.application.id,
        envType: this.env.envType,
        buildType: 'kubernetes-image',
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_LEO_JOB_PAGE(requestBody)
        .then(res => {
          this.jobOptions = res.body.data
          if (this.jobOptions.length === 1) {
            this.doDeployParam.jobId = this.jobOptions[0].id
            this.getLeoDeployDeployment()
            this.getLeoDeployVersion('')
          }
        })
    },
    selLeoJob () {
      this.doDeployParam.buildId = ''
      this.doDeployParam.assetId = ''
      this.deployVersionOptions = []
      this.deployDeploymentOptions = []
      if (this.doDeployParam.jobId !== '') {
        this.getLeoDeployVersion('')
        this.getLeoDeployDeployment()
      }
    },
    getLeoDeployDeployment () {
      if (this.doDeployParam.jobId === '') return
      const requestBody = {
        jobId: this.doDeployParam.jobId
      }
      QUERY_LEO_DEPLOY_DEPLOYMENT(requestBody)
        .then(res => {
          this.deployDeploymentOptions = res.body
          // 单个则默认选中
          if (this.deployDeploymentOptions.length === 1) {
            this.doDeployParam.assetId = this.deployDeploymentOptions[0].businessId
          }
        })
    },
    getLeoDeployVersion (name) {
      if (this.doDeployParam.jobId === '') return
      const requestBody = {
        queryName: name,
        jobId: this.doDeployParam.jobId,
        extend: true
      }
      QUERY_LEO_DEPLOY_VERSION(requestBody)
        .then(res => {
          this.deployVersionOptions = res.body
        })
    },
    initData (data) {
      this.activeName = 'deploy'
      this.doDeployParam = {
        jobId: '',
        buildId: '',
        assetId: '',
        deployType: 'ROLLING'
      }
      this.jobOptions = []
      this.deployVersionOptions = []
      this.deployDeploymentOptions = []
      this.application = data.application
      this.env = data.env
      this.buttons.doDeploying = false
      this.getLeoJob('')
    },
    handleClick (tab, event) {
      if (tab.name === 'build') {
        this.editing = false
      }
    },
    doDeploy () {
      this.buttons.doDeploying = true
      DO_DEPLOY(this.doDeployParam).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '执行部署任务中!'
          })
        } else {
          this.$message.error(res.msg)
        }
        this.buttons.doDeploying = false
      }).catch((res) => {
        this.buttons.doDeploying = false
        this.$message({
          type: 'error',
          message: res.msg
        })
      })
    }
  }
}
</script>

<style scoped>

.radio-desc {
  margin-top: 3px;
  width: 240px;
  font-size: 12px;
  line-height: 110%;
}

</style>
