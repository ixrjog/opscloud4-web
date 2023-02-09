<template>
  <el-dialog title="构建任务"
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
                       :loading="branchOptionsLoading" loading-text="正在加载选项" remote  @change="handleChange">
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
            <!--commit详情-->
            <el-alert v-show="JSON.stringify(this.branch) !== '{}'" :title="branch.commitId" type="success" style="margin-top: 2px"
                      :closable="false"
                      :description="branch.commitMessage">
            </el-alert>
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

import MyHighlight from '@/components/opscloud/common/MyHighlight'
import SelectItem from '@/components/opscloud/common/SelectItem'

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
      options: options,
      style: { height: '400px' },
      buttons: {
        doBuilding: false
      }
    }
  },
  name: 'LeoDoBuildEditor',
  props: ['formStatus'],
  components: {
    MyHighlight,
    SelectItem,
    editor: require('vue2-ace-editor')
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
