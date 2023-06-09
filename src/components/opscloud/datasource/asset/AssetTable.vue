<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0">
      <el-input v-model="queryParam.queryName" @change="fetchData" placeholder="输入关键字模糊查询"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handlePull">拉取</el-button>
      <el-button @click="handleScan">扫描</el-button>
      <el-button @click="handleDelete">删除</el-button>
      <slot name="button">
        <!--扩展字段-->
      </slot>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="assetId" :label="tableLayout.assetId.alias"
                       v-if="tableLayout.assetId.show !== undefined ? tableLayout.assetId.show : true"
                       show-overflow-tooltip/>
      <el-table-column prop="name" :label="tableLayout.name.alias"
                       show-overflow-tooltip/>
      <el-table-column prop="assetKey" :label="tableLayout.assetKey.alias"
                       v-if="tableLayout.assetKey.show" show-overflow-tooltip/>
      <el-table-column prop="assetKey2" :label="tableLayout.assetKey2.alias"
                       v-if="tableLayout.assetKey2.show" show-overflow-tooltip/>
      <el-table-column prop="zone" :label="tableLayout.zone.alias" v-if="tableLayout.zone.show"/>
      <slot name="extend">
        <!--扩展字段-->
      </slot>
      <el-table-column prop="isActive" label="有效" v-if="enableActive" width="70">
        <template v-slot="scope">
          <i class="fas fa-circle" :style="{ color: scope.row.isActive? '#0ca80c' : '#ce3f13' }"/>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签">
        <template v-slot="scope">
          <business-tags :tags="scope.row.tags"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template v-slot="scope">
          <slot name="operation" :row="scope.row"></slot>
          <el-button type="primary" plain size="mini"
                     v-if="scope.row.convertBusinessTypes != null && JSON.stringify(scope.row.convertBusinessTypes) !== '{}'"
                     @click="handleImport(scope.row.convertBusinessTypes)">导入
          </el-button>
          <el-button v-show="enableActive" :type="scope.row.isActive ? 'danger' : 'success'" plain size="mini"
                     @click="handleSetActive(scope.row)">{{ scope.row.isActive ? '无效' : '有效' }}
          </el-button>
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签
          </el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <business-tag-editor ref="businessTagEditor" :businessType="businessType" :businessId="businessId"
                         :formStatus="formStatus.businessTag" @close="fetchData"/>
    <server-editor :formStatus="formStatus.server" ref="serverEditor" @close="fetchData"/>
    <user-editor :formStatus="formStatus.user" ref="userEditor" @close="fetchData"/>
    <user-group-editor :formStatus="formStatus.userGroup" ref="userGroupEditor" @close="fetchData"/>
  </div>
</template>

<script>

import {
  QUERY_ASSET_PAGE,
  PULL_ASSET,
  SCAN_ASSET_BUSINESS,
  SET_ASSET_ACTIVE,
  DELETE_ASSET_BY_ID, DELETE_ASSET_BY_TYPE
} from '@/api/modules/datasource/datasource.asset.api.js'
import Pagination from '../../common/page/Pagination'
import BusinessTagEditor from '../../common/tag/BusinessTagEditor'
import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import BusinessTags from '../../common/tag/BusinessTags'
import ServerEditor from '../../server/ServerEditor'
import UserEditor from '../../user/UserEditor'
import UserGroupEditor from '../../user/UserGroupEditor'

const tableLayout = {
  assetId: {
    alias: 'id',
    show: true
  },
  name: {
    alias: '名称'
  },
  assetKey: {
    alias: 'assetKey',
    show: true
  },
  assetKey2: {
    alias: 'assetKey2',
    show: true
  },
  zone: {
    alias: '区',
    show: true
  }
}

export default {
  name: 'AssetTable',
  props: {
    instanceId: {
      type: String,
      required: true
    },
    assetType: {
      type: String,
      required: true
    },
    tableLayout: {
      type: Object,
      required: false,
      default: () => tableLayout
    },
    enableActive: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
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
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑数据源实例资产标签'
        },
        server: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增服务器配置',
          updateTitle: '更新服务器配置'
        },
        user: {
          visible: false,
          operationType: true,
          addTitle: '新增用户信息',
          updateTitle: '更新用户信息'
        },
        userGroup: {
          visible: false,
          operationType: true,
          addTitle: '新增用户组信息',
          updateTitle: '更新用户组信息'
        }
      },
      businessId: '',
      businessType: BusinessType.ASSET,
      queryParam: {
        queryName: '',
        assetType: this.assetType,
        isActive: null,
        relation: true,
        extend: true
      }
    }
  },
  computed: {},
  mounted () {
  },
  components: {
    BusinessTagEditor,
    BusinessTags,
    Pagination,
    ServerEditor,
    UserEditor,
    UserGroupEditor
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
    handlePull () {
      PULL_ASSET({
        instanceId: this.instanceId,
        assetType: this.assetType
      }).then(() => {
        this.$message.success('后台任务执行中！')
      })
    },
    handleScan () {
      SCAN_ASSET_BUSINESS({
        instanceId: this.instanceId,
        assetType: this.assetType
      }).then(() => {
        this.$message.success('后台任务执行中！')
      })
    },
    handleDelete () {
      this.$confirm('此操作将删除当前页面所有资产?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_ASSET_BY_TYPE({
          instanceId: this.instanceId,
          assetType: this.assetType
        }).then(() => {
          this.$message.success('后台任务执行中！')
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleRowTagEdit (row) {
      this.businessId = row.id
      const businessTags = {
        tagIds: row.tags !== null ? row.tags.map(e => e.id) : []
      }
      this.$refs.businessTagEditor.initData(businessTags)
      this.formStatus.businessTag.visible = true
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_ASSET_BY_ID(row.id).then(() => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleSetActive (row) {
      SET_ASSET_ACTIVE({ assetId: row.id })
        .then(res => {
          this.$message.success('设置成功!')
          this.fetchData()
        })
    },
    handleImport (convertBusinessTypes) {
      if (convertBusinessTypes.SERVER !== undefined) {
        this.$refs.serverEditor.initData(convertBusinessTypes.SERVER)
        this.formStatus.server.operationType = true
        this.formStatus.server.visible = true
        return
      }
      if (convertBusinessTypes.USER !== undefined) {
        const newUser = Object.assign({}, convertBusinessTypes.USER)
        newUser.needInitializeDefaultConfiguration = true
        this.$refs.userEditor.initData(newUser)
        this.formStatus.user.operationType = true
        this.formStatus.user.visible = true
        return
      }
      if (convertBusinessTypes.USERGROUP !== undefined) {
        this.$refs.userGroupEditor.initData(convertBusinessTypes.USERGROUP)
        this.formStatus.userGroup.operationType = true
        this.formStatus.userGroup.visible = true
      }
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        instanceId: this.instanceId,
        assetType: this.assetType,
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_ASSET_PAGE(requestBody)
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

.el-button {
  margin-left: 5px;
}
</style>
