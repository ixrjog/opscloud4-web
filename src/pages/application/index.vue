<template>
  <d2-container>
    <template>
      <div>
        <h1>{{ title }}</h1>
      </div>
      <el-row style="margin-bottom: 5px" :gutter="24">
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button style="margin-left: 5px" @click="handlerAdd">新增</el-button>
      </el-row>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
        <el-table-column prop="name" label="应用名称"></el-table-column>
        <el-table-column prop="applicationKey" label="key">
          <template slot-scope="props">
            <el-tag disable-transitions type="primary" plain size="mini">{{ props.row.applicationKey }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column prop="tags" label="标签" width="300">
          <template slot-scope="props">
            <div class="tag-group">
              <span v-for="item in props.row.tags" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                  <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <!--            <el-button type="primary" plain size="mini" @click="handlerRowPermissionEdit(scope.row)">权限</el-button>-->
            <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                  @handleSizeChange="handleSizeChange"></pagination>
      <ApplicationDialog ref="applicationDialog" :formStatus="formStatus.dialog"
                         @closeDialog="fetchData"></ApplicationDialog>
    </template>
  </d2-container>
</template>

<script>

import Pagination from '@/components/opscloud/common/page/Pagination'
import { DELETE_APPLICATION, QUERY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import ApplicationDialog from '@/components/opscloud/application/ApplicationDialog'

export default {
  name: 'ApplicationTable',
  data () {
    return {
      title: '应用管理',
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      options: {
        stripe: true
      },
      queryParam: {
        queryName: ''
      },
      formStatus: {
        dialog: {
          visible: false,
          operationType: true,
          addTitle: '新增应用配置',
          updateTitle: '更新应用配置'
        }
      },
      formPermissionStatus: {
        visible: false
      }
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    Pagination,
    ApplicationDialog
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
      this.formStatus.dialog.operationType = true
      const application = {
        id: '',
        name: '',
        applicationKey: '',
        applicationType: 0,
        comment: ''
      }
      this.$refs.applicationDialog.initData(application)
      this.formStatus.dialog.visible = true
    },
    handlerRowEdit (row) {
      this.formStatus.dialog.operationType = false
      this.formStatus.dialog.visible = true
      this.$refs.applicationDialog.initData(Object.assign({}, row))
    },
    handlerRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_APPLICATION({ id: row.id })
          .then(res => {
            this.fetchData()
            this.$message.success('删除成功!')
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // handlerRowPermissionEdit (row) {
    //   this.formPermissionStatus.visible = true
    //   this.$refs.applicationPermissionDialog.initData(Object.assign({}, row))
    // },
    fetchData () {
      this.loading = true
      const requestBody = {
        queryName: this.queryParam.queryName,
        extend: 1,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style>

.input {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.select {
  margin-right: 5px;
}
</style>