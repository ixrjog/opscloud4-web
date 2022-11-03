<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字查询" @change="fetchData"/>
      <el-select v-model="queryParam.instanceUuid" filterable value-key="instanceName"
                 style="width: 250px;" placeholder="选择数据源实例" reserve-keyword @change="fetchData" clearable>
        <el-option
          v-for="item in dsInstanceOptions"
          :key="item.uuid"
          :label="item.instanceName"
          :value="item.uuid">
          <select-item :name="item.instanceName" :comment="item.instanceType"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" @change="fetchData">
        <el-option
          v-for="item in activeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="queryParam.tagId" filterable clearable remote reserve-keyword
        placeholder="请输入关键词搜索标签" :remote-method="getTag" @change="fetchData">
        <el-option
          v-for="item in tagOptions"
          :key="item.id"
          :label="item.tagKey"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称" width="100" sortable></el-table-column>
      <el-table-column prop="instance" label="实例" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.instance.instanceName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效" width="80">
        <template slot-scope="scope">
          <active-tag :is-active="scope.row.isActive"></active-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template slot-scope="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <leo-template-editor :formStatus="formStatus.template" ref="templateEditor" @close="fetchData"></leo-template-editor>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"></business-tag-editor>
  </div>
</template>

<script>

import { QUERY_LEO_TEMPLATE_PAGE } from '@/api/modules/leo/leo.template.api'
import { QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api.js'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'

import SelectItem from '../common/SelectItem'
import ActiveTag from '../common/tag/ActiveTag'
import BusinessTags from '../common/tag/BusinessTags'
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import Pagination from '../common/page/Pagination'
import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import LeoTemplateEditor from '@/components/opscloud/leo/LeoTemplateEditor'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  name: 'leoTemplateTable',
  data () {
    return {
      instance: {
        id: ''
      },
      instanceType: 'JENKINS',
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
          title: '编辑Leo模板标签'
        },
        template: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增模板配置',
          updateTitle: '更新模板配置'
        }
      },
      queryParam: {
        queryName: '',
        tagId: '',
        isActive: '',
        extend: true
      },
      tagOptions: [],
      businessType: BusinessType.LEO_TEMPLATE,
      dsInstanceOptions: '',
      activeOptions: activeOptions
    }
  },
  mounted () {
    this.fetchData()
    this.getDsInstance()
    this.getTag('')
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    ActiveTag,
    LeoTemplateEditor,
    BusinessTagEditor
  },
  filters: {},
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
    getDsInstance () {
      const requestBody = {
        instanceType: this.instanceType,
        isActive: true,
        extend: false
      }
      QUERY_DATASOURCE_INSTANCE(requestBody)
        .then(({ body }) => {
          if (body !== null) {
            this.dsInstanceOptions = body
          }
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
    handleRowEdit (row) {
      this.formStatus.template.visible = true
      this.formStatus.template.operationType = false
      this.$refs.templateEditor.initData(Object.assign({}, row))
    },
    handleRowDel (row) {

    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_TEMPLATE_PAGE(requestBody)
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

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>
