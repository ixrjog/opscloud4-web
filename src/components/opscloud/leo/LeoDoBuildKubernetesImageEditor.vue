<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog title="KubernetesImage Build Task"
             :visible.sync="formStatus.visible" width="1100px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Home" name="build">
        <el-form :model="leoJob">
          <el-form-item :label="$t('leo.build.jobName')" :label-width="formStatus.labelWidth">
            <el-input v-model="leoJob.name" size="mini" readonly/>
          </el-form-item>
          <el-form-item :label="$t('leo.build.jobKey')" :label-width="formStatus.labelWidth">
            <el-input v-model="leoJob.jobKey" size="mini" readonly/>
          </el-form-item>
          <el-form-item :label="$t('leo.build.sshUrl')" :label-width="formStatus.labelWidth">
            <el-input v-if="JSON.stringify(leoJob) !== '{}'" size="mini"
                      v-model="leoJob.configDetails.job.gitLab.project.sshUrl"
                      readonly style="width: 500px"/>
            <el-checkbox v-model="getBranchOptionsParam.openTag"
                         style="margin-left: 20px" @change="getBranchOptions">
              <span style="margin-left: 2px">{{ $t('leo.build.queryTags') }}</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('leo.build.branch')" size="mini" :label-width="formStatus.labelWidth" required>
            <el-select v-model.trim="doBuildParam.branch" filterable style="width: 500px"
                       :loading="branchOptionsLoading" loading-text="正在加载选项" remote @change="handleChange">
              <el-option-group v-for="group in branchOptions" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                  <select-item :name="item.label" :comment="item.desc"/>
                </el-option>
              </el-option-group>
            </el-select>
            <!-- 刷新分支按钮 -->
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="getBranchOptions"
                       :loading="branchOptionsLoading">
              <i class="fas fa-circle-notch" aria-hidden="true"/>
            </el-button>
            <!-- 分支比对按钮 -->
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="compareBranch"
                       :disabled="doBuildParam.branch === '' || JSON.stringify(branchOptions) === '[]'">
              <i class="fab fa-git-alt" aria-hidden="true"/>
            </el-button>
            <!-- 创建默认分支按钮 -->
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="createBranch"
                       :loading="branchOptionsLoading">
              <i class="fab fa-hubspot" aria-hidden="true"/>
            </el-button>
            <!-- Commit详情 -->
            <div style="height: 10px"/>
            <commit-details :branch="branch"/>
            <build-risk-warning v-if="JSON.stringify(compareResults) !== '{}' &&  compareResults.commits.length > 0"
                                :compareResults="compareResults"
                                @handleIgnoreAlarms="handleIgnoreAlarms"/>
          </el-form-item>
          <el-form-item :label="$t('leo.build.deployOptions')" :label-width="formStatus.labelWidth" required>
            <el-checkbox v-model="doBuildParam.autoDeploy" @change="getLeoDeployDeployment">
              {{ $t('leo.build.autoDeploy') }}
            </el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('leo.build.deployment')" size="mini" :label-width="formStatus.labelWidth" required
                        v-show="this.doBuildParam.autoDeploy">
            <el-select v-model="doBuildParam.assetId" filterable clearable remote reserve-keyword
                       :disabled="!this.doBuildParam.autoDeploy"
                       :placeholder="$t('leo.build.selectDeployment')" style="width: 500px"
                       :remote-method="getLeoDeployDeployment">
              <el-option v-for="item in deployDeploymentOptions"
                         :key="item.businessId"
                         :label="item.name"
                         :value="item.businessId">
                <select-item :name="item.name" :comment="item.resourceType"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('leo.build.versionName')" :label-width="formStatus.labelWidth">
            <el-input v-model="doBuildParam.versionName" size="mini"></el-input>
          </el-form-item>
          <el-form-item :label="$t('leo.build.versionDesc')" :label-width="formStatus.labelWidth">
            <el-input v-model="doBuildParam.versionDesc" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="doBuild" icon="fa fa-play" :loading="buttons.doBuilding"
                     :disabled="(atRisk && !this.ignoreAlarms) || buttons.building">
            <span style="margin-left: 2px">{{ $t('leo.build.doBuild') }}</span>
          </el-button>
          <br/>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">{{ $t('common.close') }}</el-button>
    </div>
    <gitLab-compare-component :form-status="gitLabCompareComponent.formStatus" ref="gitLabCompareComponent"/>
  </el-dialog>
</template>

<script>

// API
import {
  DO_BUILD,
  GET_BUILD_BRANCH_OPTIONS,
  CREATE_BUILD_BRANCH,
  BRANCH_COMPARE
} from '@/api/modules/leo/leo.build.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import { QUERY_LEO_DEPLOY_DEPLOYMENT } from '@/api/modules/leo/leo.deploy.api'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import CommitDetails from '@/components/opscloud/leo/child/CommitDetails.vue'
import GitLabCompareComponent from '@/components/opscloud/leo/child/GitLabCompareComponent.vue'
import BuildRiskWarning from '@/components/opscloud/leo/child/BuildRiskWarning.vue'

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
      gitLabCompareComponent: {
        formStatus: {
          visible: false
        }
      },
      editing: false,
      branch: {},
      branchOptions: [],
      branchOptionsLoading: false,
      deployDeploymentOptions: [],
      businessType: BusinessType,
      options: options,
      style: { height: '400px' },
      buttons: {
        doBuilding: false
      },
      compareResults: {},
      // 有风险
      atRisk: false,
      // 忽律风险
      ignoreAlarms: false
    }
  },
  name: 'LeoDoBuildKubernetesImageEditor',
  props: ['formStatus'],
  components: {
    BuildRiskWarning,
    CommitDetails,
    GitLabCompareComponent,
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
      this.compareResults = {}
      this.activeName = 'build'
      this.branch = {}
      this.leoJob = leoJob
      // 初始化风险提示
      this.atRisk = this.leoJob.env.envName === 'prod' && this.branch === 'master'
      this.buttons.doBuilding = false
      this.doBuildParam.branch = leoJob.configDetails.job.gitLab.project.branch
      this.doBuildParam.jobId = this.leoJob.id
      this.getBranchOptionsParam = {
        jobId: this.leoJob.id,
        sshUrl: this.leoJob.configDetails.job.gitLab.project.sshUrl,
        openTag: false
      }
      this.getBranchOptions()
      this.doBuildParam.assetId = ''
      this.ignoreAlarms = false
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
        this.ignoreAlarms = false
        // 非PROD环境, 分支风险提示
        this.compareResults = {}
        if (this.leoJob.env.envName === 'prod' && this.branch !== 'master') {
          this.atRisk = true
          this.compare()
        }
      }
    },
    compare () {
      const requestBody = {
        from: this.branch.value,
        to: 'master',
        jobId: this.getBranchOptionsParam.jobId,
        sshUrl: this.getBranchOptionsParam.sshUrl
      }
      this.buttons.doCompare = true
      BRANCH_COMPARE(requestBody).then(res => {
        this.compareResults = res.body
        this.atRisk = JSON.stringify(this.compareResults) !== '{}' && this.compareResults.commits.length > 0
      }).catch((res) => {
        this.atRisk = false
        this.$message.error(res.msg)
      })
    },
    handleIgnoreAlarms (ignore) {
      this.ignoreAlarms = ignore
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
            this.doBuildParam.assetId = this.deployDeploymentOptions[0].businessId
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
    compareBranch () {
      this.gitLabCompareComponent.formStatus.visible = true
      this.$refs.gitLabCompareComponent.initData(this.doBuildParam.branch, Object.assign({}, this.branchOptions), this.getBranchOptionsParam)
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

<style>

</style>
