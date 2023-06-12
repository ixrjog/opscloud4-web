<!--suppress HtmlUnknownTag -->
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <!--          服务器树-->
      <server-tree class="server-tree" ref="serverTree"/>
    </el-col>
    <el-col :span="16">
      <el-card shadow="hover" style="margin-top: 5px">
        <div slot="header" class="clearfix">
          <span style="margin-left: 20px;font-size: 12px">任务配置</span>
        </div>
        <el-form :model="serverTask">
          <el-form-item label="Ansible实例" :label-width="labelWidth" required>
            <el-select v-model="dsInstance" filterable placeholder="选择Ansible实例"
                       value-key="id">
              <el-option v-for="item in dsInstanceOptions"
                         :key="item.id"
                         :label="item.instanceName"
                         :value="item">
                <select-item :name="item.instanceType" :comment="item.instanceName"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="剧本" :label-width="labelWidth" required>
            <el-select v-model.trim="playbook" filterable clearable
                       remote reserve-keyword placeholder="搜索剧本"
                       :remote-method="getPlaybook"
                       @change="handleSelPlaybook"
                       @clear="getPlaybook('')"
                       value-key="id">
              <el-option v-for="item in playbookOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item"/>
            </el-select>
            <el-button type="primary" plain size="mini" @click="handleOpenPlaybook" :disabled="playbook === ''">查看
            </el-button>
          </el-form-item>
          <el-form-item label="变量(Vars)" :label-width="labelWidth">
            <editor v-model="serverTask.vars" @init="editorInit" lang="yaml" theme="chrome"
                    height="80"
                    :options="options"/>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" :disabled="submitting" @click="submitServerTask">
            <i class="el-icon-loading" v-show="submitting"/>提交任务
          </el-button>
        </div>
      </el-card>
      <server-task-info-card v-if="serverTaskInfo !== ''" :serverTaskInfo="serverTaskInfo" @close="close"/>
    </el-col>
    <ansible-playbook-editor :formStatus="formStatus.playbook" ref="playbookEditor"/>
  </el-row>
</template>

<script>

import ServerTree from '../tree/ServerTree'
import { QUERY_ANSIBLE_PLAYBOOK_PAGE } from '@/api/modules/task/task.playbook.api.js'
import { SUBMIT_SERVER_TASK } from '@/api/modules/task/server.task.api.js'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import AnsiblePlaybookEditor from './AnsiblePlaybookEditor'
import DsInstanceType from '@/components/opscloud/common/enums/ds.instance.type.js'
import tools from '@/libs/tools.js'
import ServerTaskInfoCard from './child/ServerTaskInfoCard'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'

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
      dsInstanceType: DsInstanceType,
      playbook: '',
      playbookOptions: [],
      dsInstance: '',
      dsInstanceOptions: [],
      options: options,
      taskUuid: tools.uuid().replaceAll('-', ''),
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
      },
      submitting: false,
      serverTaskInfo: ''
    }
  },
  mounted () {
    this.getDsInstance()
    this.getPlaybook('')
  },
  components: {
    SelectItem,
    editor: require('vue2-ace-editor'),
    ServerTree,
    AnsiblePlaybookEditor,
    ServerTaskInfoCard
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
    getDsInstance () {
      const requestBody = {
        instanceType: this.dsInstanceType.ANSIBLE.name,
        isActive: true,
        extend: true
      }
      QUERY_DATASOURCE_INSTANCE(requestBody).then(({ body }) => {
        this.dsInstanceOptions = body
        if (this.dsInstanceOptions.length !== 0) {
          this.dsInstance = this.dsInstanceOptions[0]
        }
      })
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
      QUERY_ANSIBLE_PLAYBOOK_PAGE(requestBody).then(res => {
        this.playbookOptions = res.body.data
      })
    },
    handleSelPlaybook () {
      if (this.playbook.vars !== '') {
        this.serverTask.vars = this.playbook.vars
      }
    },
    close () {
      this.serverTaskInfo = ''
    },
    submitServerTask () {
      if (this.dsInstance === '') {
        this.$message.warning('未指定Ansible实例！')
        return
      }
      if (this.playbook === '') {
        this.$message.warning('未指定剧本！')
        return
      }
      const nodes = this.$refs.serverTree.getCheckedNodes(true)
      if (nodes === [] || nodes.length === 0) {
        this.$message.warning('未指定服务器！')
        return
      }
      this.submitting = true
      const requestBody = {
        vars: this.serverTask.vars,
        ansiblePlaybookId: this.playbook.id,
        instanceUuid: this.dsInstance.uuid,
        taskUuid: this.taskUuid,
        taskType: 'PLAYBOOK',
        servers: nodes.map(function (item) {
          return item.server
        })
      }
      SUBMIT_SERVER_TASK(requestBody).then(res => {
        this.$message.success('任务提交成功！')
        // 重置uuid
        this.taskUuid = tools.uuid()
        this.serverTaskInfo = requestBody
        this.submitting = false
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
