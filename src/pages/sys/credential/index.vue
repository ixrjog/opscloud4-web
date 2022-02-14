<template>
  <d2-container>
    <div>
      <h1>{{ title }}</h1>
    </div>
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model="queryParam.queryName" placeholder="名称"/>
        <el-select v-model="queryParam.kind" clearable placeholder="凭据分类">
          <el-option
            v-for="item in kindOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="fetchData">查询</el-button>
        <el-button @click="handlerAdd">新增</el-button>
      </el-row>
    </div>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="title" label="凭据标题" width="250"></el-table-column>
      <el-table-column prop="quantityUsed" label="使用数量" width="80"></el-table-column>
      <el-table-column prop="username" label="凭据账户" width="250"></el-table-column>
      <el-table-column prop="kind" label="凭据分类" width="150">
        <template slot-scope="scope">
          <credential-kind-tag :kinds="kindOptions" :kind="scope.row.kind"></credential-kind-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fingerprint" label="指纹" width="250"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除该配置吗？" @confirm="handleRowDel(scope.row)">
            <el-button slot="reference" type="danger" plain size="mini" style="margin-left: 5px"
                       :disabled="scope.row.quantityUsed !== 0">删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <credential-editor ref="credentialEditor" :formStatus="formStatus.credential" :kind-options="kindOptions"
                       @close="fetchData"></credential-editor>
  </d2-container>
</template>

<script>

import {
  GET_CREDENTIAL_KIND_OPTIONS,
  DELETE_CREDENTIAL_BY_ID,
  QUERY_CREDENTIAL_PAGE
} from '@/api/modules/sys/sys.credential.api.js'

import Pagination from '../../../components/opscloud/common/page/Pagination'
import CredentialKindTag from '../../../components/opscloud/common/tag/CredentialKindTag'
import CredentialEditor from '../../../components/opscloud/sys/CredentialEditor'

export default {
  data () {
    return {
      title: '系统凭据配置',
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      kindOptions: [],
      formStatus: {
        credential: {
          visible: false,
          addTitle: '新增凭据配置',
          updateTitle: '更新凭据配置',
          operationType: true
        }
      },
      queryParam: {
        queryName: '',
        kind: ''
      }
    }
  },
  computed: {},
  mounted () {
    this.getKindOptions()
    this.fetchData()
  },
  components: {
    CredentialEditor,
    Pagination,
    CredentialKindTag
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
    getKindOptions () {
      GET_CREDENTIAL_KIND_OPTIONS()
        .then(res => {
          this.kindOptions = res.body.options
        })
    },
    handlerAdd () {
      const credential = {
        title: '',
        kind: 1,
        username: '',
        credential: '',
        credential2: '',
        passphrase: '',
        fingerprint: '',
        comment: ''
      }
      this.$refs.credentialEditor.initData(credential)
      this.formStatus.credential.operationType = true
      this.formStatus.credential.visible = true
    },
    handleRowEdit (row) {
      this.$refs.credentialEditor.initData(Object.assign({}, row))
      this.formStatus.credential.operationType = false
      this.formStatus.credential.visible = true
    },
    handleRowDel (row) {
      DELETE_CREDENTIAL_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_CREDENTIAL_PAGE(requestBody)
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
