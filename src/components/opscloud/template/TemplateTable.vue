<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-input v-model="queryParam.queryName" @change="fetchData" placeholder="输入关键字模糊查询" size="mini"/>
      <el-radio-group v-model="queryParam.envType" size="mini" @change="fetchData">
        <el-radio-button v-for="env in envOptions" :label="env.envType" :key="env.envType">
          {{ env.envName }}
        </el-radio-button>
      </el-radio-group>
      <el-select v-model="queryParam.instanceType" size="mini" clearable placeholder="选择实例类型">
        <el-option v-for="item in instanceTypeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" size="mini">查询</el-button>
      <el-button @click="handleAdd" size="mini" class="button">新增</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称" width="200"/>
      <el-table-column prop="env" label="环境" width="80">
        <template v-slot="scope">
          <env-tag :env="scope.row.env"/>
        </template>
      </el-table-column>
      <el-table-column prop="bizTemplateSize" label="使用" width="80">
      </el-table-column>
      <el-table-column prop="instanceType" label="实例类型" width="120">
        <template v-slot="scope">
          <el-tag size="mini">{{ scope.row.instanceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="templateKey" label="Key" width="120">
        <template v-slot="scope">
          <el-tag size="mini">{{ scope.row.templateKey }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="模板内容">
        <template v-slot="scope">
          <my-highlight :code="scope.row.content" :lang="scope.row.templateType" :myStyle="style"/>
        </template>
      </el-table-column>
      <el-table-column prop="vars" label="自定义变量">
        <template v-slot="scope">
          <my-highlight :code="scope.row.vars" :lang="scope.row.templateType" :myStyle="style"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template v-slot="scope">
          <slot name="operation" :row="scope.row"/>
          <el-button type="primary" plain size="mini"
                     @click="handleRowEdit(scope.row)">编辑
          </el-button>
          <el-button type="danger" plain size="mini" :disabled="scope.row.bizTemplateSize > 0"
                     @click="handleRowDel(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <template-editor :formStatus="formStatus.template"
                     :instanceTypeOptions="instanceTypeOptions"
                     :envOptions="envOptions"
                     :templateTypeOptions="templateTypeOptions"
                     ref="templateEditor" @close="fetchData"/>
  </div>
</template>

<script>

import {
  QUERY_TEMPLATE_PAGE, DELETE_TEMPLATE_BY_ID
} from '@/api/modules/template/template.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import Pagination from '@/components/opscloud/common/page/Pagination'
import EnvTag from '@/components/opscloud/common/tag/EnvTag'
import TemplateEditor from '@/components/opscloud/template/TemplateEditor'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

const instanceTypeOptions = [{
  value: 'KUBERNETES',
  label: 'KUBERNETES'
}]

const templateTypeOptions = [{
  value: 'yaml',
  label: 'YAML'
}]

export default {
  name: 'TemplateTable',
  props: {},
  data () {
    return {
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      envOptions: [],
      formStatus: {
        template: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增模板配置',
          updateTitle: '更新模板配置'
        }
      },
      instanceTypeOptions: instanceTypeOptions,
      templateTypeOptions: templateTypeOptions,
      queryParam: {
        envType: 1,
        queryName: '',
        extend: true
      },
      style: { height: '200px' }
    }
  },
  computed: {},
  mounted () {
    this.getEnv()
  },
  components: {
    TemplateEditor,
    EnvTag,
    Pagination,
    MyHighlight
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
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
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_TEMPLATE_BY_ID(row.id).then(() => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleAdd () {
      const template = {
        id: '',
        name: '',
        envType: this.queryParam.envType === '' ? 1 : this.queryParam.envType,
        instanceType: this.queryParam.instanceType === '' ? '' : this.queryParam.instanceType,
        templateKey: '',
        templateType: 'yaml',
        content: '',
        vars: '',
        comment: ''
      }
      this.$refs.templateEditor.initData(template)
      this.formStatus.template.operationType = true
      this.formStatus.template.visible = true
    },
    handleRowEdit (row) {
      this.$refs.templateEditor.initData(row)
      this.formStatus.template.operationType = false
      this.formStatus.template.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_TEMPLATE_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped>

.el-input {
  display: inline-block;
  max-width: 200px;
}

.el-radio-group {
  margin-left: 5px;
}

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>
