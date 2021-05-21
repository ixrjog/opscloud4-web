<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="datasource">
      <el-form-item label="名称" :label-width="labelWidth" required>
        <el-input v-model="datasource.instance.instanceName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="数据源类型" :label-width="labelWidth" required>
        <el-select v-model="datasource.config.dsType" placeholder="选择类型" disabled>
          <el-option
            v-for="item in dsTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实例类型" :label-width="labelWidth" required>
        <el-select v-model="datasource.instance.instanceType" placeholder="选择类型">
          <el-option
            v-for="item in instanceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效" :label-width="labelWidth" required>
        <el-select v-model="datasource.instance.isActive" placeholder="选择类型">
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实例分类" :label-width="labelWidth">
        <el-input v-model="datasource.instance.kind" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="datasource.instance.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handlerRegister">注册</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { REGISTER_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api.js'

const instanceType = {
  ldap: [
    {
      value: 'LDAP',
      label: 'LDAP'
    }
  ],
  gitlab: [],
  jenkins: [],
  aliyun: [
    {
      value: 'ECS',
      label: 'ECS'
    },
    {
      value: 'OSS',
      label: 'OSS'
    },
    {
      value: 'SLS',
      label: 'SLS'
    }
  ]
}

export default {
  name: 'DatasourceInstanceRegisterEditor',
  props: ['formStatus', 'activeOptions', 'dsTypeOptions'],
  data () {
    return {
      activeName: 'dsInfo',
      labelWidth: '150px',
      datasource: {
        config: '',
        instance: ''
      },
      instanceTypeOptions: []
    }
  },
  mixins: [],
  components: {},
  methods: {
    initData (datasource) {
      this.datasource = datasource
      switch (datasource.config.dsType) {
        case 1:
          this.instanceTypeOptions = instanceType.ldap
          this.datasource.instance.instanceType = 'LDAP'
          break
      }
    },
    handlerRegister () {
      REGISTER_DATASOURCE_INSTANCE(this.datasource.instance)
        .then(res => {
          // 返回数据
          this.$message({
            message: '注册成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>

<style scoped>

</style>
