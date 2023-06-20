<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="serverAccount">
      <el-form-item label="用户名" :label-width="labelWidth">
        <el-input v-model="serverAccount.username" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="账户类型" :label-width="labelWidth" required>
        <el-select v-model="serverAccount.accountType" placeholder="选择账户类型" clearable>
          <el-option v-for="item in accountTypeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="协议类型" :label-width="labelWidth" required>
        <el-select v-model="serverAccount.protocol" placeholder="选择协议类型" clearable>
          <el-option v-for="item in protocolOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="凭据" :label-width="labelWidth" required>
        <el-select v-model="serverAccount.credentialId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜索凭据" :remote-method="getCredential">
          <el-option v-for="item in credentialOptions" :key="item.id" :label="item.title" :value="item.id">
            <select-item :name="item.title" :comment="item.username"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="serverAccount.comment" placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { QUERY_CREDENTIAL_PAGE } from '@/api/modules/sys/sys.credential.api.js'
import { ADD_SERVER_ACCOUNT, UPDATE_SERVER_ACCOUNT } from '@/api/modules/server/server.account.api.js'
import SelectItem from '../common/SelectItem'

export default {
  name: 'ServerAccountEditor',
  props: ['formStatus', 'accountTypeOptions', 'protocolOptions'],
  data () {
    return {
      serverAccount: '',
      labelWidth: '150px',
      credentialOptions: []
    }
  },
  components: {
    SelectItem
  },
  mounted () {
  },
  methods: {
    getCredential (name) {
      const requestBody = {
        queryName: name,
        page: 1,
        length: 10
      }
      QUERY_CREDENTIAL_PAGE(requestBody)
        .then(res => {
          this.credentialOptions = res.body.data
        })
    },
    initData (serverAccount) {
      this.serverAccount = serverAccount
      if (JSON.stringify(serverAccount.credential) === '{}') {
        this.getCredential('')
      } else {
        this.credentialOptions = []
        this.credentialOptions.push(serverAccount.credential)
      }
    },
    handlerUpdate (requestBody) {
      UPDATE_SERVER_ACCOUNT(requestBody)
        .then(res => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerAdd (requestBody) {
      ADD_SERVER_ACCOUNT(requestBody)
        .then(res => {
          this.$message.success('新增成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerSave () {
      if (this.formStatus.operationType) {
        this.handlerAdd(this.serverAccount)
      } else {
        this.handlerUpdate(this.serverAccount)
      }
    }
  }
}
</script>
