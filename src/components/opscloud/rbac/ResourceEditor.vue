<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="resource">
      <el-form-item label="资源路径" :label-width="labelWidth" :required="true">
        <el-input v-model="resource.resourceName" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="资源组" :label-width="labelWidth" :required="true">
        <el-select v-model="resource.groupId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜索资源组" :remote-method="getGroup">
          <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.id">
            <select-item :name="item.groupName" :comment="item.comment"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="鉴权" :label-width="labelWidth" :required="true">
        <el-select v-model="resource.needAuth" placeholder="是否鉴权">
          <el-option v-for="item in authOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户界面" :label-width="labelWidth" :required="true">
        <el-select v-model="resource.ui" placeholder="用户界面">
          <el-option v-for="item in uiOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="resource.comment" placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { QUERY_GROUP_PAGE } from '@/api/modules/auth/auth.group.api.js'
import { ADD_RESOURCE, UPDATE_RESOURCE } from '@/api/modules/auth/auth.resource.api.js'
import SelectItem from '../common/SelectItem'

export default {
  name: 'ResourceEditor',
  props: ['formStatus', 'authOptions', 'uiOptions'],
  data () {
    return {
      resource: {},
      labelWidth: '150px',
      groupOptions: []
    }
  },
  components: { SelectItem },
  mounted () {
  },
  methods: {
    initData (resource) {
      this.resource = resource
      if (this.resource.group === null) {
        this.getGroup('')
      } else {
        this.groupOptions = []
        this.groupOptions.push(this.resource.group)
      }
    },
    getGroup (groupName) {
      const requestBody = {
        groupName: groupName,
        page: 1,
        length: 10
      }
      QUERY_GROUP_PAGE(requestBody)
        .then(res => {
          this.groupOptions = res.body.data
        })
    },
    handleUpdate (requestBody) {
      UPDATE_RESOURCE(requestBody)
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
      ADD_RESOURCE(requestBody)
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
      const requestBody = Object.assign({}, this.resource)
      if (this.formStatus.operationType) {
        this.handleAdd(requestBody)
      } else {
        this.handleUpdate(requestBody)
      }
    }
  }
}
</script>

<style scoped>

</style>
