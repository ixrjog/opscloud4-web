<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字模糊查询"/>
      <el-checkbox label="过滤系统用户" v-model="queryParam.filterTag" style="margin-left: 5px"></el-checkbox>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新建</el-button>
      <el-button @click="handleSync">同步</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column label="用户名" width="150">
        <template slot-scope="scope">
          <el-row class="copyClass">
            <span>{{ scope.row.username }}</span>
            <span v-clipboard:copy="scope.row.username" v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
                <i style="margin-left: 5px" class="el-icon-copy-document"></i>
              </span>
            <el-button type="text" style="float:right" @click="openUserDetail(scope.row.username)">
              <i style="margin-left: 5px" class="el-icon-position"></i>
            </el-button>
          </el-row>
          <el-row>
            <span>{{ scope.row.displayName }}</span>
            <span v-if="showName(scope.row)" style="margin-left: 5px">&lt;{{ scope.row.name }}&gt;</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250">
        <template slot-scope="scope">
          <span class="copyClass">
            <span>{{ scope.row.email }}</span>
            <span v-clipboard:copy="scope.row.email" v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
              <i style="margin-left: 5px" class="el-icon-copy-document"></i>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="businessPermissions" label="业务授权">
        <template slot-scope="scope">
          <div v-for="(value, key) in scope.row.businessPermissions" :key="key">
            <el-divider content-position="left"><b style="color: #9d9fa3">{{ key }}</b></el-divider>
            <el-tag v-for="item in value" :key="item.id" style="margin-right: 5px">{{ item.name }}</el-tag>
          </div>
          <div v-if="JSON.stringify(scope.row.ramUsers) !== '[]'">
            <el-divider content-position="left"><b style="color: #9d9fa3">RAM</b></el-divider>
            <el-table :data="scope.row.ramUsers">
              <el-table-column label="实例 / 账户">
                <template slot-scope="props">
                  <el-row>
                    <span>{{ props.row.instanceName }}</span>
                  </el-row>
                  <el-row class="ramInfo">
                    <span>{{ props.row.loginUser }}</span>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="ramPolicies" label="策略">
                <template slot-scope="props">
                  <div class="tag-group">
                    <div v-for="policy in props.row.ramPolicies" :key="policy.assetId">
                      <el-tooltip class="item" effect="light" :content="policy.description" placement="top-start">
                        <el-tag style="margin-left: 5px">{{ policy.name }}</el-tag>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template slot-scope="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button :type="scope.row.isActive ? 'danger' : 'success'" plain size="mini"
                     @click="handleSetActive(scope.row)">{{ scope.row.isActive ? '无效' : '有效' }}
          </el-button>
          <el-button type="danger" plain size="mini" v-show="!scope.row.isActive" @click="handleRowDel(scope.row)">删除
          </el-button>
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <user-editor :formStatus="formStatus.user" ref="userEditor" @close="fetchData"></user-editor>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"></business-tag-editor>
  </div>
</template>

<script>

import { QUERY_USER_PAGE, SET_USER_ACTIVE, DELETE_USER_BY_ID, SYNC_USER } from '@/api/modules/user/user.api.js'
import Pagination from '../common/page/Pagination'
import UserEditor from './UserEditor'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags'
import BusinessTagEditor from '@/components/opscloud/common/tag/BusinessTagEditor'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import util from '@/libs/util'

export default {
  name: 'UserTable',
  data () {
    return {
      instance: {
        id: ''
      },
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑用户标签'
        },
        user: {
          visible: false,
          operationType: true,
          addTitle: '新增用户信息',
          updateTitle: '更新用户信息'
        },
        group: {
          visible: false,
          title: '用户授权'
        }
      },
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      queryParam: {
        queryName: '',
        filterTag: true,
        isActive: true,
        extend: true
      },
      businessType: BusinessType.USER
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    UserEditor,
    Pagination,
    BusinessTags,
    BusinessTagEditor
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
    handleRowTagEdit (row) {
      this.instance.id = row.id
      const businessTags = {
        tagIds: row.tags !== null ? row.tags.map(e => e.id) : []
      }
      this.$refs.businessTagEditor.initData(businessTags)
      this.formStatus.businessTag.visible = true
    },
    handleRowDel (row) {
      DELETE_USER_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
    },
    handleSetActive (row) {
      SET_USER_ACTIVE({ username: row.username })
        .then(res => {
          this.$message.success('设置成功!')
          this.fetchData()
        })
    },
    handleRowUpdate (row) {
      this.formStatus.user.operationType = false
      this.formStatus.user.visible = true
      const user = Object.assign({}, row)
      this.$refs.userEditor.initData(user)
    },
    handleAdd () {
      this.formStatus.user.visible = true
      this.formStatus.user.operationType = true
      const user = {
        id: '',
        username: '',
        password: '',
        name: '',
        displayName: '',
        isActive: true,
        wechat: '',
        email: '',
        phone: '',
        comment: ''
      }
      this.$refs.userEditor.initData(user)
    },
    handleSync () {
      SYNC_USER()
        .then(res => {
          this.$message.success('后台同步中!')
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_USER_PAGE(requestBody)
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
    },
    openUserDetail (username) {
      const host = window.location.host
      const httpProtocol = window.location.href.split('://')[0]
      const buildDetailsUrl = httpProtocol + '://' + host + '/#/user/info?username=' + username
      util.open(buildDetailsUrl)
    },
    showName (row) {
      return !(row.name === null || row.name === '' || row.name === row.displayName)
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  display: inline-block;
  max-width: 200px;
}

.el-button {
  margin-left: 5px;
}

.copyClass i {
  display: none;
}

.copyClass:hover i {
  display: inline;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 12px 0;
}
</style>
