<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="1000px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="server">
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model="server.name" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="服务器类型" :label-width="labelWidth" required>
            <el-select v-model="server.serverType" size="mini" placeholder="选择类型">
              <el-option v-for="item in serverTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="服务器组" :label-width="labelWidth" required>
            <el-select v-model="server.serverGroupId" size="mini" filterable clearable
                       remote reserve-keyword placeholder="搜索服务器组" :remote-method="getGroup"
                       @clear="getGroup('')">
              <el-option v-for="item in serverGroupOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" required>
            <el-radio-group v-model="server.envType" size="mini">
              <el-radio-button v-for="env in envOptions" :label="env.envType" :key="env.envType">
                {{ env.envName }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="系统类型" :label-width="labelWidth" required>
            <el-select v-model="server.osType" size="mini" placeholder="选择类型">
              <el-option v-for="item in osTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="有效" :label-width="labelWidth" required>
            <el-select v-model="server.isActive" size="mini" placeholder="选择">
              <el-option v-for="item in activeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="区" :label-width="labelWidth">
            <el-input v-model="server.area" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="公网IP" :label-width="labelWidth">
            <el-input v-model="server.publicIp" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="私网IP" :label-width="labelWidth" required>
            <el-input v-model="server.privateIp" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="序号" :label-width="labelWidth" required>
            <el-input v-model.number="server.serialNumber" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="server.comment" placeholder="请输入内容" size="mini"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="属性配置" name="property" :disabled="server.id === '' || server.id === 0">
        <business-property-editor :business-type="server.businessType"
                                  :business-id="server.businessId"
                                  ref="businessPropertyEditor"/>
      </el-tab-pane>
      <el-tab-pane label="账户配置" name="account" :disabled="server.id === '' || server.id === 0">
        <server-account-transfer :serverId="server.id" ref="serverAccountTransfer"/>
      </el-tab-pane>
      <el-tab-pane label="业务文档" name="document" :disabled="server.id === '' || server.id === 0">
        <business-doc-editor v-if="server.id !== ''&& server.id !== 0" :business-type="server.businessType"
                             :business-id="server.businessId"
                             ref="businessDocEditor"/>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { ADD_SERVER, UPDATE_SERVER } from '@/api/modules/server/server.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api.js'
import ServerAccountTransfer from './child/ServerAccountTransfer'
import BusinessPropertyEditor from '../business/BusinessPropertyEditor'
import BusinessDocEditor from '@/components/opscloud/business/BusinessDocEditor'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const serverTypeOptions = [{
  value: 0,
  label: '虚拟服务器'
}, {
  value: 1,
  label: '物理服务器'
}]

const osTypeOptions = [{
  value: 'linux',
  label: 'Linux'
}, {
  value: 'windows',
  label: 'Windows'
}, {
  value: 'macOS',
  label: 'MacOS'
}]

export default {
  data () {
    return {
      activeName: 'base',
      serverTypeOptions: serverTypeOptions,
      activeOptions: activeOptions,
      labelWidth: '150px',
      envOptions: [],
      serverGroupOptions: [],
      server: '',
      osTypeOptions: osTypeOptions
    }
  },
  name: 'ServerEditor',
  props: ['formStatus'],
  components: {
    BusinessPropertyEditor,
    BusinessDocEditor,
    ServerAccountTransfer
  },
  mixins: [],
  mounted () {
  },
  methods: {
    getEnv (name) {
      const requestBody = {
        envName: name,
        isActive: true,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    getGroup (name, autoSel) {
      const requestBody = {
        name: name,
        serverGroupTypeId: '',
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(res => {
          this.serverGroupOptions = res.body.data
          if (autoSel) {
            if (this.serverGroupOptions.length === 1) {
              this.server.serverGroupId = this.serverGroupOptions[0].id
            }
          }
        })
    },
    initData (server) {
      this.server = server
      this.activeName = 'base'
      this.getEnv()
      // 尝试选择匹配服务器组
      // TODO 此处需要优化 删除服务器中环境标签
      if (this.server.serverGroup === null || this.server.serverGroup === undefined || JSON.stringify(this.server.serverGroup) === '{}') {
        const queryName = this.server.name.replace(new RegExp('-[0-9]+$'), '')
        this.getGroup(queryName, true)
      } else {
        this.getGroup(this.server.serverGroup.name, false)
      }
      this.$nextTick(() => {
        const accountIds = this.server.accounts !== null ? this.server.accounts.map(e => e.id) : []
        this.$refs.serverAccountTransfer.init(accountIds)
        // 业务对象属性
        this.$refs.businessPropertyEditor.initData(this.server.businessProperty)
      })
    },
    handleClick (tab, event) {
      if (tab.name === 'document') {
        this.$refs.businessDocEditor.open(this.server.document)
      }
    },
    handleUpdate (requestBody) {
      UPDATE_SERVER(requestBody)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd (requestBody) {
      ADD_SERVER(requestBody)
        .then(({ body }) => {
          this.$message.success('新增成功!')
          this.initData(body)
          this.formStatus.operationType = false
        })
    },
    handleSave () {
      if (this.formStatus.operationType) {
        this.handleAdd(this.server)
      } else {
        this.handleUpdate(this.server)
        this.$refs.serverAccountTransfer.save()
      }
    }
  }
}
</script>
