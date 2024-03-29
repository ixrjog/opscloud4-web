<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="规则配置" name="rule">
        <el-row>
          <el-select v-model="queryParam.isActive" size="mini" clearable placeholder="有效" @change="fetchData">
            <el-option v-for="item in activeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"/>
          </el-select>
          <el-button @click="fetchData" size="mini" class="button">查询</el-button>
          <el-button @click="handleAdd" size="mini" class="button">新增</el-button>
        </el-row>
        <div style="height: 5px"/>
        <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName">
          <el-table-column prop="name" label="名称" sortable/>
          <el-table-column prop="displayName" label="规则" sortable/>
          <el-table-column prop="ruleConfig" label="规则配置">
            <template v-slot="scope">
              <yaml-view :yaml-content="scope.row.ruleConfig"/>
            </template>
          </el-table-column>
          <el-table-column prop="isActive" label="有效">
            <template v-slot="scope">
              <active-tag :is-active="scope.row.isActive"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template v-slot="scope">
              <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                    @handleSizeChange="handleSizeChange"/>
        <leo-rule-editor :formStatus="formStatus.rule" ref="ruleEditor" @close="fetchData"/>
      </el-tab-pane>
      <el-tab-pane label="帮助文档" name="docs">
        <document-zone mount-zone="LEO_MGMT"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import { DELETE_LEO_RULE_BY_ID, QUERY_LEO_RULE_PAGE } from '@/api/modules/leo/leo.rule.api'

import Pagination from '@/components/opscloud/common/page/Pagination.vue'
import ActiveTag from '@/components/opscloud/common/tag/ActiveTag.vue'
import LeoRuleEditor from '@/components/opscloud/leo/LeoRuleEditor.vue'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'
import YamlView from '@/components/opscloud/common/view/YamlView.vue'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  name: 'LeoRuleTable',
  data () {
    return {
      activeName: 'rule',
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
        rule: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增规则配置',
          updateTitle: '更新规则配置'
        }
      },
      queryParam: {
        queryName: '',
        isActive: '',
        extend: true
      },
      activeOptions: activeOptions
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {
    YamlView,
    Pagination,
    ActiveTag,
    LeoRuleEditor,
    DocumentZone
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
    tableRowClassName ({ row, rowIndex }) {
      if (row.isActive) {
        return 'warning-row'
      } else {
        return ''
      }
    },
    handleAdd () {
      this.formStatus.rule.visible = true
      this.formStatus.rule.operationType = true
      const rule = {
        id: '',
        ruleConfig: '',
        hide: false,
        isActive: true,
        comment: ''
      }
      this.$refs.ruleEditor.initData(rule)
    },
    handleRowEdit (row) {
      this.formStatus.rule.visible = true
      this.formStatus.rule.operationType = false
      this.$refs.ruleEditor.initData(Object.assign({}, row))
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_LEO_RULE_BY_ID({ ruleId: row.id }).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_RULE_PAGE(requestBody)
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

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style scoped>

.el-input {
  display: inline-block;
  max-width: 200px;
}

.el-button {
  margin-left: 5px;
}

</style>
