<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="role">
      <el-form-item label="角色名称" :label-width="labelWidth">
        <el-input v-model="role.roleName" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
    <el-form :model="role">
      <el-form-item label="访问级别" :label-width="labelWidth">
        <el-input v-model="role.accessLevel" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
    <el-form :model="role">
      <el-form-item label="工单申请" :label-width="labelWidth">
        <el-select v-model="role.allowOrder" size="mini" placeholder="选择类型">
          <el-option v-for="item in allowOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="role">
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="role.comment" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { ADD_ROLE, UPDATE_ROLE } from '@/api/modules/auth/auth.role.api.js'

const allowOptions = [{
  value: false,
  label: '禁止'
}, {
  value: true,
  label: '允许'
}]

export default {
  data () {
    return {
      labelWidth: '150px',
      role: {},
      allowOptions: allowOptions
    }
  },
  name: 'RoleEditor',
  props: ['formStatus'],
  mixins: [],
  mounted () {
  },
  methods: {
    initData (role) {
      this.role = role
    },
    handleUpdate (requestBody) {
      UPDATE_ROLE(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd (requestBody) {
      ADD_ROLE(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleSave () {
      const requestBody = Object.assign({}, this.role)
      if (this.formStatus.operationType) {
        this.handleAdd(requestBody)
      } else {
        this.handleUpdate(requestBody)
      }
    }
  }
}
</script>
