<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog title="Deploy Task" :visible.sync="formStatus.visible" width="1100px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Home" name="deploy">
        <el-form :model="application">
          <el-form-item label="Application Name" :label-width="formStatus.labelWidth">
            <el-input v-model="application.name" size="mini" readonly/>
          </el-form-item>
          <el-form-item label="Job Env" :label-width="formStatus.labelWidth">
            <el-input v-model="env.envName" size="mini" readonly style="width: 500px"/>
          </el-form-item>
          <el-form-item label="Build Job Name" :label-width="formStatus.labelWidth" required>
            <el-select v-model="doDeployParam.jobId" size="mini" filterable clearable remote reserve-keyword
                       @change="selLeoJob"
                       placeholder="搜索并选择任务" style="width: 500px" :remote-method="getLeoJob">
              <el-option v-for="item in jobOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                <select-item :name="item.name" :comment="item.jobKey"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Deployment" :label-width="formStatus.labelWidth" required>
            <el-select v-model="doDeployParam.assetId" size="mini" filterable clearable remote reserve-keyword
                       :disabled="this.doDeployParam.jobId === ''"
                       placeholder="选择Deployment" style="width: 500px" :remote-method="getLeoDeployDeployment">
              <el-option v-for="item in deployDeploymentOptions"
                         :key="item.businessId"
                         :label="item.name"
                         :value="item.businessId">
                <select-item :name="item.name" :comment="item.resourceType"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Deploy Type" :label-width="formStatus.labelWidth" required>
            <el-row>
              <el-col :span="8">
                <el-radio v-model="doDeployParam.deployType" size="mini" label="ROLLING" border>滚动 Rolling</el-radio>
                <el-alert class="radio-desc" :closable="false"
                          title="渐进式创建新版本(滚动比例25%)，然后停止老版本，自动完成整个流程"
                          type="info"/>
              </el-col>
              <el-col :span="8">
                <el-radio v-model="doDeployParam.deployType" size="mini" label="REDEPLOY" border>重启 Redeploy
                </el-radio>
                <el-alert class="radio-desc" :closable="false"
                          title="不变更版本，只滚动重启所有副本。离线的Canary环境重新上线"
                          type="info"/>
              </el-col>
              <!--            小部分流量，升级并导入新版本，手工验证完毕后，全量升级部署-->
              <el-col :span="8">
                <el-radio v-model="doDeployParam.deployType" size="mini" label="OFFLINE" border>下线 Offline</el-radio>
                <el-alert class="radio-desc" :closable="false"
                          title="允许非生产环境和canary环境下线"
                          type="info">
                </el-alert>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="Release Version" :label-width="formStatus.labelWidth" required
                        v-if="doDeployParam.deployType === 'ROLLING'">
            <el-select v-model="doDeployParam.buildId" size="mini" filterable clearable remote reserve-keyword
                       :disabled="doDeployParam.jobId === ''"
                       placeholder="搜索并选择版本" style="width: 400px" :remote-method="getLeoDeployVersion">
              <el-option v-for="item in deployVersionOptions"
                         :key="item.id"
                         :label="item.versionName"
                         :value="item.id">
                <span style="float: left">{{ item.versionName }}</span>
                <span :style="{float: 'right', color: '#8492a6', fontSize: '13px',marginLeft: '15px'}">{{ item.ago }} #{{
                    item.buildNumber
                  }}次构建
                  <span v-if="item.ticketId !== 0" style="color: #0da815">
                    [<i class="fas fa-check" v-if="item.ticketId !== 0" style="margin-right: 1px"/>工单]
                  </span>
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Project" :label-width="formStatus.labelWidth">
            <el-select v-model="doDeployParam.projectId" size="mini" filterable clearable remote reserve-keyword
                       placeholder="选择关联项目" style="width: 500px" :remote-method="getProject">
              <el-option v-for="item in projectOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                <select-item :name="item.name" :comment="item.comment"/>
              </el-option>
            </el-select>
            <el-button style="margin-left: 5px" size="mini" @click="openUrl">Jump to Create Project</el-button>
          </el-form-item>
          <el-form-item label="Deploy Desc" :label-width="formStatus.labelWidth">
            <el-input v-model="doDeployParam.comment" size="mini"/>
          </el-form-item>
        </el-form>
        <div style="width:100%; text-align:center">
          <el-button size="mini" type="primary" @click="doDeploy" icon="fa fa-play" :loading="buttons.doDeploying"
                     :disabled="buttons.doDeploying || doDeployParam.jobId === '' ||  (doDeployParam.deployType === 'ROLLING' &&  doDeployParam.buildId === '') || doDeployParam.assetId === ''">
            <span style="margin-left: 2px">Do Deploy</span>
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">Close</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { QUERY_LEO_JOB_PAGE } from '@/api/modules/leo/leo.job.api'
import { QUERY_LEO_DEPLOY_VERSION, QUERY_LEO_DEPLOY_DEPLOYMENT, DO_DEPLOY } from '@/api/modules/leo/leo.deploy.api'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'
import { QUERY_RES_PROJECT_PAGE } from '@/api/modules/project/project.api'
import BusinessType from '@/components/opscloud/common/enums/business.type'

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
        projectId: '',
        deployType: 'ROLLING'
      },
      jobOptions: [],
      // 部署版本
      deployVersionOptions: [],
      deployDeploymentOptions: [],
      businessType: BusinessType,
      projectOptions: [],
      style: { height: '400px' },
      buttons: {
        doDeploying: false
      }
    }
  },
  name: 'LeoCreateDeployEditor',
  props: ['formStatus'],
  components: {
    SelectItem
  },
  mixins: [],
  mounted () {
  },
  methods: {
    /**
     *  const data = {
     *    application: {},
     *    env: {}
     *  }
     * @param name
     */
    getLeoJob (name) {
      const requestBody = {
        queryName: name,
        applicationId: this.application.id,
        envType: this.env.envType,
        buildType: 'kubernetes-image',
        extend: false,
        isActive: true,
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
        projectId: '',
        deployType: 'ROLLING'
      }
      this.jobOptions = []
      this.deployVersionOptions = []
      this.deployDeploymentOptions = []
      this.application = data.application
      this.env = data.env
      this.buttons.doDeploying = false
      this.getLeoJob('')
      this.doDeployParam.projectId = ''
      this.getProject('')
    },
    getProject (name) {
      if (this.leoJob === {}) return
      const requestBody = {
        businessType: this.businessType.APPLICATION,
        businessId: this.application.id,
        resourceType: 'APPLICATION',
        extend: true,
        relation: false,
        queryName: name,
        page: 1,
        length: 20
      }
      QUERY_RES_PROJECT_PAGE(requestBody)
        .then(res => {
          this.projectOptions = res.body.data
          // 单个则默认选中
          if (this.projectOptions.length === 1) {
            this.doDeployParam.projectId = this.projectOptions[0].id
          }
        })
    },
    handleClick (tab, event) {
      if (tab.name === 'build') {
        this.editing = false
      }
    },
    openUrl () {
      this.formStatus.visible = false
      this.$router.push({
        path: '/project'
      })
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
  width: 280px; font-size: 11px;
  line-height: 110%;
}

</style>
