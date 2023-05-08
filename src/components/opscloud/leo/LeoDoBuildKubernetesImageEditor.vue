<template>
  <el-dialog title="KubernetesImage 构建任务"
             :visible.sync="formStatus.visible" width="50%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="构建" name="build">
        <el-form :model="leoJob">
          <el-form-item label="任务名称" :label-width="formStatus.labelWidth">
            <el-input v-model="leoJob.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="任务主键" :label-width="formStatus.labelWidth">
            <el-input v-model="leoJob.jobKey" readonly></el-input>
          </el-form-item>
          <el-form-item label="项目地址" :label-width="formStatus.labelWidth">
            <el-input v-if="JSON.stringify(leoJob) !== '{}'"
                      v-model="leoJob.configDetails.job.gitLab.project.sshUrl"
                      readonly style="width: 500px"></el-input>
            <el-checkbox v-model="getBranchOptionsParam.openTag"
                         style="margin-left: 20px" @change="getBranchOptions">查询<span
              style="margin-left: 2px">Tag</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item label="构建分支" :label-width="formStatus.labelWidth" required>
            <el-select v-model.trim="doBuildParam.branch" filterable style="width: 500px"
                       :loading="branchOptionsLoading" loading-text="正在加载选项" remote @change="handleChange">
              <el-option-group v-for="group in branchOptions" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                  <select-item :name="item.label" :comment="item.desc"></select-item>
                </el-option>
              </el-option-group>
            </el-select>
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="getBranchOptions"
                       :loading="branchOptionsLoading">
              <i class="fas fa-circle-notch" aria-hidden="true"></i>
            </el-button>
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="createBranch"
                       :loading="branchOptionsLoading">
              <i class="fab fa-hubspot" aria-hidden="true"></i>
            </el-button>
            <!--commit详情 :title="branch.commitId" :description="branch.commitMessage" -->
            <el-alert v-show="JSON.stringify(this.branch) !== '{}'"
                      style="margin-top: 5px; background-color: #e56c0d"
                      :closable="false">
              <a target="blank" :href="branch.commitWebUrl" style="color: #FFFFFF"><i class="fab fa-git-alt"
                                                                                      style="margin-right: 1px"></i><b>{{
                  branch.commitId
                }}</b></a>
              <div style="color: #d9d9d9">{{ branch.commitMessage }}</div>
            </el-alert>
          </el-form-item>
          <el-form-item label="部署选项" :label-width="formStatus.labelWidth" required>
            <el-checkbox v-model="doBuildParam.autoDeploy" @change="getLeoDeployDeployment">构建后自动部署</el-checkbox>
          </el-form-item>
          <el-form-item label="Deployment" :label-width="formStatus.labelWidth">
            <el-select v-model="doBuildParam.assetId" filterable clearable remote reserve-keyword
                       :disabled="!this.doBuildParam.autoDeploy"
                       placeholder="选择Deployment" style="width: 500px" :remote-method="getLeoDeployDeployment">
              <el-option
                v-for="item in deployDeploymentOptions"
                :key="item.businessId"
                :label="item.name"
                :value="item.businessId">
                <select-item :name="item.name" :comment="item.resourceType"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称" :label-width="formStatus.labelWidth">
            <el-input v-model="doBuildParam.versionName"></el-input>
          </el-form-item>
          <el-form-item label="版本说明" :label-width="formStatus.labelWidth">
            <el-input v-model="doBuildParam.versionDesc"></el-input>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="doBuild" icon="fa fa-play" :loading="buttons.doBuilding"
                     :disabled="buttons.building"><span style="margin-left: 2px">执行构建</span>
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
import { DO_BUILD, GET_BUILD_BRANCH_OPTIONS, CREATE_BUILD_BRANCH } from '@/api/modules/leo/leo.build.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import { QUERY_LEO_DEPLOY_DEPLOYMENT } from '@/api/modules/leo/leo.deploy.api'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  data () {
    return {
      activeName: 'build',
      leoJob: {},
      doBuildParam: {
        jobId: '',
        branch: '',
        params: {},
        assetId: '',
        autoDeploy: true,
        versionName: '',
        versionDesc: ''
      },
      getBranchOptionsParam: {
        jobId: '',
        sshUrl: '',
        openTag: true
      },
      editing: false,
      branch: {},
      branchOptions: [],
      branchOptionsLoading: false,
      deployDeploymentOptions: [],
      options: options,
      style: { height: '400px' },
      buttons: {
        doBuilding: false
      }
    }
  },
  name: 'LeoDoBuildKubernetesImageEditor',
  props: ['formStatus'],
  components: {
    SelectItem
  },
  mixins: [],
  mounted () {
  },
  methods: {
    editorInit: function () {
      // language extension prerequsite...
      require('brace/ext/language_tools')
      // language
      require('brace/mode/yaml')
      require('brace/mode/xml')
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
      require('brace/snippets/xml')
    },
    initData (leoJob) {
      this.activeName = 'build'
      this.branch = {}
      this.buttons.doBuilding = false
      this.leoJob = leoJob
      this.doBuildParam.branch = leoJob.configDetails.job.gitLab.project.branch
      this.doBuildParam.jobId = this.leoJob.id
      this.getBranchOptionsParam = {
        jobId: this.leoJob.id,
        sshUrl: this.leoJob.configDetails.job.gitLab.project.sshUrl,
        openTag: false
      }
      this.getBranchOptions()
      if (this.leoJob.envType === 4) {
        this.doBuildParam.autoDeploy = false
      } else {
        this.getLeoDeployDeployment()
      }
    },
    handleClick (tab, event) {
      if (tab.name === 'build') {
        this.editing = false
      }
    },
    handleChange () {
      if (JSON.stringify(this.branchOptions) === '[]') {
        this.branch = {}
      } else {
        for (const option of this.branchOptions) {
          const branch = option.options.find(e => (e.value === this.doBuildParam.branch))
          if (branch !== undefined) {
            this.branch = branch
            break
          }
        }
      }
    },
    getLeoDeployDeployment () {
      if (!this.doBuildParam.autoDeploy) return
      if (this.doBuildParam.jobId === '') return
      const requestBody = {
        jobId: this.doBuildParam.jobId
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
    getBranchOptions () {
      this.branchOptionsLoading = true
      GET_BUILD_BRANCH_OPTIONS(this.getBranchOptionsParam)
        .then(res => {
          this.branchOptions = res.body.options
          this.branchOptionsLoading = false
          this.handleChange()
        })
    },
    createBranch () {
      this.branchOptionsLoading = true
      const request = {
        ref: this.doBuildParam.branch,
        ...this.getBranchOptionsParam
      }
      CREATE_BUILD_BRANCH(request)
        .then(res => {
          this.branchOptions = res.body.options
          this.branchOptionsLoading = false
        })
    },
    doBuild () {
      this.buttons.doBuilding = true
      DO_BUILD(this.doBuildParam).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '执行构建任务中!'
          })
        } else {
          this.$message.error(res.msg)
        }
        this.buttons.doBuilding = false
      }).catch((res) => {
        this.buttons.doBuilding = false
        this.$message.error(res.msg)
      })
    }
  }
}
</script>
