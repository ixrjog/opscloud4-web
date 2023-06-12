<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"/>
      <el-select
        v-model="queryParam.tagId" filterable clearable remote reserve-keyword
        placeholder="请输入关键词搜索标签" :remote-method="getTag" @change="fetchData">
        <el-option v-for="item in tagOptions"
          :key="item.id"
          :label="item.tagKey"
          :value="item.id"/>
      </el-select>
      <el-checkbox label="过滤系统用户" v-model="queryParam.filterTag" style="margin-left: 5px"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新建</el-button>
      <el-button @click="handleSync">同步</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column label="用户名" width="200">
        <template v-slot="scope">
          <el-row>
            <copy-span :content="scope.row.username"/>
            <el-button type="text" style="float:right" @click="openUserDetail(scope.row.username)">
              <i style="margin-left: 5px" class="el-icon-position"/>
            </el-button>
          </el-row>
          <el-row>
            <span>{{ scope.row.displayName }}</span>
            <span v-if="showName(scope.row)" style="margin-left: 5px">&lt;{{ scope.row.name }}&gt;</span>
          </el-row>
          <el-row>
            <copy-span :content="scope.row.email"/>
          </el-row>
          <el-row>
            <el-tag :type="scope.row.mfa ? 'success': 'info'" size="mini">
              <i class="fas fa-lock" v-if="scope.row.forceMfa" style="margin-right: 5px"/>MFA
            </el-tag>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="云账户" width="300">
        <template v-slot="scope">
          <div v-for="(value,key) in scope.row.amMap" :key="key" :label="key">
            <el-divider content-position="left"><b style="color: #9d9fa3">{{ key | getAmTypeText }}</b></el-divider>
            <div v-for="item in value" :key="item.instanceUuid">
              <el-tooltip class="item" effect="light" :content="item.instanceName" placement="right">
                <span>{{ item.loginUser }}
                  <i class="fas fa-key" style="color:#67C23A;margin-left: 5px"
                     v-if="JSON.stringify(item.accessKeys) !== '[]'"></i>
                </span>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="businessPermissions" label="业务授权">
        <template v-slot="scope">
          <div v-for="(value, key) in scope.row.businessPermissions" :key="key">
            <el-divider content-position="left"><b style="color: #9d9fa3">{{ key }}</b></el-divider>
            <el-tag size="mini" :type="item.userPermission.permissionRole === 'admin' ? 'danger': '' "
                    v-for="item in value" :key="item.id" style="margin-right: 5px">{{ item.name }}
            </el-tag>
          </div>
          <div v-if="JSON.stringify(scope.row.ramUsers) !== '[]'">
            <el-divider content-position="left"><b style="color: #9d9fa3">RAM</b></el-divider>
            <el-table :data="scope.row.ramUsers">
              <el-table-column label="实例 / 账户">
                <template v-slot="scope">
                  <el-row>
                    <span>{{ scope.row.instanceName }}</span>
                  </el-row>
                  <el-row class="ramInfo">
                    <span>{{ scope.row.loginUser }}</span>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="ramPolicies" label="策略">
                <template v-slot="scope">
                  <div class="tag-group">
                    <div v-for="policy in scope.row.ramPolicies" :key="policy.assetId">
                      <el-tooltip class="item" effect="light" :content="policy.description" placement="top-start">
                        <el-tag size="mini" style="margin-left: 5px">{{ policy.name }}</el-tag>
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
        <template v-slot="scope">
          <business-tags :tags="scope.row.tags"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template v-slot="scope">
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
                @handleSizeChange="handleSizeChange"/>
    <user-editor :formStatus="formStatus.user" ref="userEditor" @close="fetchData"/>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"/>
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
import CopySpan from '@/components/opscloud/common/CopySpan'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'
import { QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api'

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
        tagId: '',
        extend: true
      },
      businessType: BusinessType.USER,
      tagOptions: []
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
    this.getTag('')
  },
  filters: {
    getAmTypeText (value) {
      switch (value) {
        case DsInstanceAssetType.ALIYUN.RAM_USER:
          return 'Aliyun RAM'
        case DsInstanceAssetType.AWS.IAM_USER:
          return 'AWS IAM'
        default:
          return value
      }
    }
  },
  components: {
    UserEditor,
    Pagination,
    BusinessTags,
    BusinessTagEditor,
    CopySpan
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
    getTag (name) {
      const requestBody = {
        tagKey: name,
        businessType: this.businessType,
        append: true,
        page: 1,
        length: 20
      }
      QUERY_TAG_PAGE(requestBody)
        .then(res => {
          this.tagOptions = res.body.data
        })
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

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 12px 0;
}
</style>
