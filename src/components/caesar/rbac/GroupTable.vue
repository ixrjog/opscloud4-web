<template>
  <div>
      <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px">
        <el-input v-model="queryParam.groupCode" placeholder="资源组名称" style="display: inline-block; max-width:200px"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button @click="addItem" style="margin-left: 5px">新增</el-button>
      </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="groupCode" label="资源组名称"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="warning" plain size="mini" @click="updateItem(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <ResourceGroupDialog :formStatus="formResourceGroupStatus" :formData="resourceGroup"
                         @closeResourceGroupDialog="fetchData"></ResourceGroupDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import ResourceGroupDialog from '@/components/opscloud/dialog/ResourceGroupDialog'
  // API
  import { queryGroupPage, deleteGroupById } from '@api/auth/auth.group.js'

  export default {
    name: 'AuthGroupTable',
    data () {
      return {
        tableData: [],
        resourceGroup: {},
        formResourceGroupStatus: {
          visible: false,
          addTitle: '新增资源组配置',
          updateTitle: '更新资源组配置',
          labelWidth: '100px',
          operationType: true
        },
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          groupCode: ''
        }
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    components: {
      ResourceGroupDialog
    },
    methods: {
      ...mapActions({
        setPageSize: 'd2admin/user/set'
      }),
      handleSizeChange (size) {
        this.pagination.pageSize = size
        this.info.pageSize = size
        this.setPageSize(this.info)
        this.fetchData()
      },
      initPageSize () {
        if (typeof (this.info.pageSize) !== 'undefined') {
          this.pagination.pageSize = this.info.pageSize
        }
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGroupById(row.id).then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addItem () {
        this.formResourceGroupStatus.operationType = true
        this.formResourceGroupStatus.visible = true
        this.resourceGroup = {
          id: '',
          groupCode: '',
          comment: ''
        }
      },
      updateItem (row) {
        this.resourceGroup = Object.assign({}, row)
        this.formResourceGroupStatus.operationType = false
        this.formResourceGroupStatus.visible = true
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryGroupPage(
          this.queryParam.groupCode, this.pagination.currentPage, this.pagination.pageSize)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
