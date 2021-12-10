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
        <el-table-column label="应用" width="250px">
          <template slot-scope="props">
            <el-row>
              <el-tag disable-transitions type="primary" plain size="mini">{{ props.row.applicationKey }}</el-tag>
            </el-row>
            <el-row class="nameCopy">
              <span>{{ props.row.name }}</span>
              <span v-clipboard:copy="props.row.name" v-clipboard:success="onCopy"
                    v-clipboard:error="onError">
              <i style="margin-left: 5px" class="el-icon-copy-document"></i>
              </span>
            </el-row>
            <el-row>
              <b style="color: #9d9fa3">{{ props.row.comment }}</b>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="resourceMap" label="绑定资源">
          <template slot-scope="props">
            <div v-for="(value,key) in props.row.resourceMap" :key="key" :label="key" class="resDiv">
              <el-divider content-position="left"><b style="color: #9d9fa3">{{ key | getAppResText }}</b></el-divider>
              <span v-for="item in value" :key="item.id">
              <el-tooltip effect="dark" :content="item.comment" placement="top-start"
                          :disabled="!item.comment">
                <el-tag size="small" style="margin-left: 5px;margin-bottom: 5px"><span
                  v-if="item.instance !== null">{{ item.instance.instanceName }}/</span>{{ item.name }}</el-tag>
              </el-tooltip>
            </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="users" label="授权用户" width="450px">
          <template slot-scope="scope">
            <users-tag :users="scope.row.users"></users-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="150px">
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
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                  @handleSizeChange="handleSizeChange"></pagination>
      <application-editor ref="applicationDialog" :formStatus="formStatus.dialog"
                          @closeDialog="fetchData"></application-editor>
    </template>
  </d2-container>
</template>

<script>

import Pagination from '@/components/opscloud/common/page/Pagination'
import { DELETE_APPLICATION, QUERY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import ApplicationEditor from '@/components/opscloud/application/ApplicationEditor'
import AppDsInstanceAssetType from '@/components/opscloud/common/enums/application.ds.instance.asset.type'
import UsersTag from '../../components/opscloud/common/tag/UsersTag'

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
        application: {
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
  filters: {
    getAppResText (value) {
      switch (value) {
        case AppDsInstanceAssetType.GITLAB.GITLAB_GROUP:
          return '群组(GITLAB_GROUP)'
        case AppDsInstanceAssetType.GITLAB.GITLAB_PROJECT:
          return '项目(GITLAB_PROJECT)'
        case AppDsInstanceAssetType.KUBERNETES.KUBERNETES_DEPLOYMENT:
          return '无状态(DEPLOYMENT)'
        case 'SERVERGROUP':
          return '服务器组(SERVER_GROUP)'
        case 'SERVER':
          return '服务器(SERVER)'
        default:
          return value
      }
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    Pagination,
    ApplicationEditor,
    UsersTag
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
      this.formStatus.application.operationType = true
      const application = {
        id: '',
        name: '',
        applicationKey: '',
        applicationType: 0,
        comment: ''
      }
      this.$refs.applicationEditor.initData(application)
      this.formStatus.application.visible = true
    },
    handlerRowEdit (row) {
      this.formStatus.application.operationType = false
      this.formStatus.application.visible = true
      this.$refs.applicationEditor.initData(Object.assign({}, row))
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
    },
    onCopy (e) {
      this.$message.success('内容已复制到剪切板！')
    },
    onError (e) {
      this.$message.error('抱歉，复制失败！')
    }
  }
}
</script>

<style lang="less" scoped>

.input {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.select {
  margin-right: 5px;
}

.nameCopy i {
  display: none;
}

.nameCopy:hover i {
  display: inline;
}
</style>
