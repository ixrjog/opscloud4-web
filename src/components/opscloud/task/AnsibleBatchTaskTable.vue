<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <!--          服务器树-->
      <server-tree class="server-tree" ref="serverTree"></server-tree>
    </el-col>
    <el-col :span="16">
      <el-card shadow="hover" style="margin-top: 5px">
        <div slot="header" class="clearfix">
          <span style="margin-left: 20px;font-size: 12px">任务配置</span>
        </div>
        <el-form :model="serverTask">
          <el-form-item label="剧本" :label-width="labelWidth" required>
            <el-select v-model.trim="playbook" filterable clearable
                       remote reserve-keyword placeholder="搜索剧本" :remote-method="getPlaybook"
                       @clear="getPlaybook('')">
              <el-option
                v-for="item in playbookOptions"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <el-button type="primary" plain size="mini" @click="handleOpenPlaybook" :disabled="playbook === ''">查看
            </el-button>
          </el-form-item>
          <el-form-item label="变量(Vars)" :label-width="labelWidth">
            <editor v-model="serverTask.tags" @init="editorInit" lang="yaml" theme="chrome"
                    height="80"
                    :options="options"></editor>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="submitServerTask">提交任务</el-button>
        </div>
      </el-card>
    </el-col>
    <ansible-playbook-editor :formStatus="formStatus.playbook" ref="playbookEditor"></ansible-playbook-editor>
  </el-row>
</template>

<script>

import ServerTree from '../tree/ServerTree'
import { QUERY_ANSIBLE_PLAYBOOK_PAGE } from '@/api/modules/task/task.playbook.api.js'
import { SUBMIT_SERVER_TASK } from '@/api/modules/task/server.task.api.js'
import AnsiblePlaybookEditor from './AnsiblePlaybookEditor'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  name: 'AnsibleBatchTaskTable',
  data () {
    return {
      activeName: 'batchTask',
      labelWidth: '100px',
      playbook: '',
      playbookOptions: [],
      options: options,
      formStatus: {
        playbook: {
          operationType: true,
          visible: false,
          addTitle: '新增剧本配置',
          updateTitle: '查看剧本配置'
        }
      },
      serverTask: {
        vars: ''
      }
    }
  },
  mounted () {
    this.getPlaybook('')
  },
  components: {
    editor: require('vue2-ace-editor'),
    ServerTree,
    AnsiblePlaybookEditor
  },
  methods: {
    editorInit: function () {
      // language extension prerequsite...
      require('brace/ext/language_tools')
      // language
      require('brace/mode/yaml')
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
    },
    handleOpenPlaybook () {
      this.$refs.playbookEditor.initData(Object.assign({}, this.playbook))
      this.formStatus.playbook.operationType = false
      this.formStatus.playbook.visible = true
    },
    getPlaybook (name) {
      const requestBody = {
        name: name,
        extend: true,
        page: 1,
        length: 10
      }
      QUERY_ANSIBLE_PLAYBOOK_PAGE(requestBody)
        .then(res => {
          this.playbookOptions = res.body.data
        })
    },
    submitServerTask () {
      if (this.playbook === '') {
        this.$message.warning('未指定剧本！')
      }
      let nodes = this.$refs.serverTree.getCheckedNodes(true)
      if (nodes === [] || nodes.length === 0) {
        this.$message.warning('未指定服务器！')
      }
      let servers = nodes.map(function (item) {
        // return item['hours']
        return item.server
      })
      let requestBody = {
        vars: this.serverTask.vars,
        ansiblePlaybookId: this.playbook.id,
        taskType: 'PLAYBOOK',
        servers: servers
      }
      // console.log(requestBody)
      SUBMIT_SERVER_TASK(requestBody)
        .then(res => {
          this.$message.success('任务提交成功！')
        })
    }
  }
}
</script>

<style scoped>

  /*.server-tree {*/
  /*  margin-top: 5px;*/
  /*}*/

</style>
