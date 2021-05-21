<template>
  <d2-container>
    <div>
      <h1>数据源配置</h1>
    </div>
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model="queryParam.queryName" placeholder="名称"/>
        <el-select v-model="queryParam.dsType" clearable placeholder="数据源类型">
          <el-option
            v-for="item in dsTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.isActive" clearable placeholder="有效">
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="handlerAdd">新增</el-button>
        <el-button @click="fetchData">查询</el-button>
      </el-row>
    </div>
    <el-table :data="table.data" style="width: 100%">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="dsType" label="数据源类型" width="150">
        <template slot-scope="scope">
          <datasource-type-tag :ds-type="scope.row.dsType"></datasource-type-tag>
        </template>
      </el-table-column>
      <el-table-column prop="kind" label="分类" width="300"></el-table-column>
      <el-table-column prop="version" label="版本" width="150"></el-table-column>
      <el-table-column prop="isRegistered" label="注册" width="150">
        <template slot-scope="scope">
          <whether-tag :whether="scope.row.isRegistered"></whether-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效" width="150">
        <template slot-scope="scope">
          <active-tag :is-active="scope.row.isActive"></active-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" :disabled="scope.row.isRegistered" @click="handlerRowRegister(scope.row)">注册</el-button>
          <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <datasource-config-editor :form-status="formStatus.config"
                              :ds-type-options="dsTypeOptions"
                              :active-options="activeOptions"
                              ref="datasourceConfigEditor"
                              @close="fetchData"></datasource-config-editor>
    <datasource-instance-register-editor :form-status="formStatus.instance"
                                         :ds-type-options="dsTypeOptions"
                                         :active-options="activeOptions"
                                         ref="datasourceInstanceRegisterEditor"
                                         @close="fetchData">
    </datasource-instance-register-editor>
  </d2-container>
</template>

<script>

import { QUERY_DATASOURCE_CONFIG_PAGE } from '@/api/modules/datasource/datasource.config.api.js'

import Pagination from '../../../components/caesar/common/page/Pagination'
import ActiveTag from '../../../components/caesar/common/tag/ActiveTag'
import DatasourceTypeTag from '../../../components/caesar/common/tag/DatasourceTypeTag'
import DatasourceConfigEditor from '../../../components/caesar/datasource/DatasourceConfigEditor'
import DatasourceInstanceRegisterEditor from '../../../components/caesar/datasource/DatasourceInstanceRegisterEditor'
import WhetherTag from '../../../components/caesar/common/tag/WhetherTag'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const dsTypeOptions = [{
  value: 1,
  label: 'LDAP'
}]

export default {
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
      activeOptions: activeOptions,
      dsTypeOptions: dsTypeOptions,
      formStatus: {
        config: {
          visible: false,
          addTitle: '新增数据源配置',
          updateTitle: '更新数据源配置',
          operationType: true
        },
        instance: {
          visible: false,
          addTitle: '注册数据源实例配置',
          updateTitle: '更新数据源实例配置',
          operationType: true
        }
      },
      queryParam: {
        queryName: '',
        dsType: '',
        isActive: ''
      },
      roleOptions: []
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    Pagination,
    DatasourceConfigEditor,
    DatasourceInstanceRegisterEditor,
    DatasourceTypeTag,
    ActiveTag,
    WhetherTag
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
    handlerAdd () {
      const dsConfig = {
        comment: null,
        credentialId: '',
        dsType: 1,
        dsUrl: '',
        id: '',
        isActive: true,
        kind: '',
        name: '',
        propsYml: '',
        sysCredential: null,
        uuid: '',
        version: '0'
      }
      this.$refs.datasourceConfigEditor.initData(dsConfig)
      this.formStatus.config.operationType = true
      this.formStatus.config.visible = true
    },
    handlerRowRegister (row) {
      const datasource = {
        config: row,
        instance: {
          id: '',
          parentId: 0,
          uuid: '',
          instanceName: '',
          isActive: true,
          instanceType: '',
          kind: '',
          configId: row.id,
          comment: ''
        }
      }
      this.$refs.datasourceInstanceRegisterEditor.initData(datasource)
      this.formStatus.instance.operationType = true
      this.formStatus.instance.visible = true
    },
    handlerRowEdit (row) {
      this.$refs.datasourceConfigEditor.initData(Object.assign({}, row))
      this.formStatus.config.operationType = false
      this.formStatus.config.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        queryName: this.queryParam.queryName,
        dsType: this.queryParam.dsType,
        isActive: this.queryParam.isActive,
        extend: true,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_DATASOURCE_CONFIG_PAGE(requestBody)
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
    margin-left: 10px;
  }

  .el-select {
    margin-left: 5px;
  }

  .el-button {
    margin-left: 5px;
  }

</style>
