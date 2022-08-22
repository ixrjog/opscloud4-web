<template>
  <div>
    <el-row>
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字模糊查询" class="input"/>
      <el-select v-model="queryParam.workRoleId" placeholder="选择角色" class="select" clearable @change="workRoleChange">
        <el-option
          v-for="item in workRoleOptions"
          :key="item.id"
          :label="item.workRoleName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-cascader :options="workItemOptions" :props="workItemProps" clearable
                   @change="handleChange" class="cascader" placeholder="选择类目" collapse-tags>
      </el-cascader>
      <el-select v-model="queryParam.username" filterable remote reserve-keyword placeholder="搜索用户"
                 :remote-method="getUser" class="select">
        <el-option
          v-for="user in userOptions"
          :key="user.username"
          :label="user.displayName"
          :value="user.username">
          <select-item :name="user.username" :comment="user.displayName"></select-item>
        </el-option>
      </el-select>
      <el-date-picker
        v-model="workEventTime" type="daterange" unlink-panels value-format="timestamp" class="picker" size="mini"
        start-placeholder="开始" range-separator="-" end-placeholder="结束" :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handleAdd" class="button">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column label="角色" width="150">
        <template slot-scope="props">
          <span>{{ props.row.workRole.workRoleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类目" prop="workItemTree" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="workEventTime" label="时间" width="150">
        <template slot-scope="props">
          <span style="margin-right: 2px">{{ props.row.workEventTime }}</span>
          <span style="color: #20A9D9">[{{ props.row.ago }}]</span>
        </template>
      </el-table-column>
      <el-table-column prop="workEventCnt" label="次数" width="60"></el-table-column>
      <el-table-column label="用户" width="200">
        <template slot-scope="props">
          <user-tag :user="props.row.user"></user-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="说明"></el-table-column>
      <el-table-column label="属性" width="200">
        <template slot-scope="props">
          <span v-for="item in props.row.propertyList" :key="item.id">
            <el-tag class="prop-tag" v-if="item.name === 'timeliness'" :type="timelinessColor(item.value)">
              {{ item.value }}</el-tag>
            <el-tag class="prop-tag" v-if="item.name === 'fault' && item.value === 'true'" type="danger">故障</el-tag>
            <el-tag class="prop-tag" v-if="item.name === 'intercept'" v-text="item.value === 'true'? '拦截':'未拦截'"
                    :type="item.value === 'true'? 'success':'warning'"></el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="150">
        <template slot-scope="props">
          <div class="tag-group">
              <span v-for="item in props.row.tags" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                  <el-tag size="mini" style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
                </el-tooltip>
              </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210">
        <template slot-scope="scope">
          <!--          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>-->
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <work-event-editor ref="workEventEditor" :form-status="formStatus.workEvent" @closeDialog="dataChange"
                       :work-role-options="workRoleOptions"></work-event-editor>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"></business-tag-editor>
  </div>
</template>

<script>
import {
  DELETE_WORK_EVENT,
  QUERY_WORK_EVENT_PAGE,
  QUERY_WORK_ITEM_TREE,
  QUERY_WORK_ROLE
} from '@/api/modules/report/workevent/work.event.api'
import Pagination from '@/components/opscloud/common/page/Pagination'
import UserTag from '@/components/opscloud/common/tag/UserTag'
import WorkEventEditor from '@/components/opscloud/report/workevent/WorkEventEditor'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import BusinessTagEditor from '@/components/opscloud/common/tag/BusinessTagEditor'
import SelectItem from '@/components/opscloud/common/SelectItem'
import { QUERY_USER_PAGE } from '@/api/modules/user/user.api'

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
      instance: {
        id: ''
      },
      userOptions: [],
      loading: false,
      businessType: BusinessType.WORK_EVENT,
      workRoleOptions: [],
      workItemOptions: [],
      workEventTime: [],
      workItemProps: {
        multiple: true,
        expandTrigger: 'hover',
        emitPath: false
      },
      queryParam: {
        queryName: '',
        workRoleId: '',
        username: '',
        workItemIdList: []
      },
      formStatus: {
        workEvent: {
          visible: false
        },
        businessTag: {
          visible: false,
          title: '编辑工作事件标签'
        }
      }
    }
  },
  name: 'WorkEventTable',
  mounted () {
    this.getWorkRole()
    this.getWorkItemTree()
    this.fetchData()
  },
  components: {
    UserTag,
    Pagination,
    WorkEventEditor,
    SelectItem,
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
    handleChange (value) {
      this.queryParam.workItemIdList = []
      value.map(workItemId => {
        this.queryParam.workItemIdList.push(workItemId)
      })
    },
    workRoleChange () {
      this.getWorkItemTree()
    },
    getWorkRole () {
      this.workRoleOptions = []
      QUERY_WORK_ROLE().then(({ body }) => {
        this.workRoleOptions = body
      })
    },
    getWorkItemTree () {
      this.workItemOptions = []
      this.queryParam.workItemIdList = []
      const requestBody = {
        workRoleId: this.queryParam.workRoleId === '' ? -1 : this.queryParam.workRoleId
      }
      QUERY_WORK_ITEM_TREE(requestBody).then(({ body }) => {
        this.workItemOptions = body
      })
    },
    timelinessColor (value) {
      switch (value) {
        case '24小时内':
          return ''
        case '48小时内':
          return 'success'
        default:
          return 'info'
      }
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      if (Array.isArray(this.workEventTime) && this.workEventTime.length > 0) {
        requestBody.workEventStartTime = this.workEventTime[0]
        requestBody.workEventEndTime = this.workEventTime[1]
      }
      if (requestBody.workRoleId === '') {
        requestBody.workRoleId = -1
      }
      QUERY_WORK_EVENT_PAGE(requestBody).then(({ body }) => {
        this.table.data = body.data
        this.table.loading = false
        this.table.pagination.total = body.totalNum
      })
    },
    getUser (queryName) {
      this.userOptions = []
      const requestBody = {
        queryName: queryName,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_USER_PAGE(requestBody)
        .then(res => {
          this.userOptions = res.body.data
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
    handleAdd () {
      this.formStatus.workEvent.visible = true
      this.$refs.workEventEditor.initData()
    },
    dataChange () {
      this.fetchData()
      this.$emit('refreshData')
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_WORK_EVENT({ id: row.id }).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    }
  }
}
</script>

<style scoped>

.input {
  display: inline-block;
  max-width: 200px;
}

.select, .button {
  margin-left: 5px;
}

.picker {
  margin-left: 5px;
}

.cascader {
  margin-left: 5px;
  width: 280px;
}

.el-range-editor.el-input__inner {
  padding: 0 10px;
}

.prop-tag {
  margin-left: 5px;
  margin-bottom: 5px
}

</style>
