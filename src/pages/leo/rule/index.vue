<template>
  <d2-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="规则配置" name="rule">
        <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
          <el-select v-model="queryParam.isActive" clearable placeholder="有效" @change="fetchData">
            <el-option
              v-for="item in activeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="fetchData" class="button">查询</el-button>
          <el-button @click="handleAdd" class="button">新增</el-button>
        </el-row>
        <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName">
          <el-table-column prop="name" label="名称" sortable width="300"></el-table-column>
          <el-table-column prop="displayName" label="规则" sortable></el-table-column>
          <el-table-column prop="ruleConfig" label="规则配置">
            <template v-slot="scope">
              <my-highlight v-if="scope.row.ruleConfig !== ''" :code="scope.row.ruleConfig"
                            lang="yaml" :myStyle="style"></my-highlight>
            </template>
          </el-table-column>
          <el-table-column prop="isActive" label="有效" width="80">
            <template v-slot="scope">
              <active-tag :is-active="scope.row.isActive"></active-tag>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="说明" v-if="false"></el-table-column>
          <el-table-column label="操作" width="280">
            <template v-slot="scope">
              <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                    @handleSizeChange="handleSizeChange"></pagination>
        <leo-rule-editor :formStatus="formStatus.rule" ref="ruleEditor"
                         @close="fetchData"></leo-rule-editor>
      </el-tab-pane>
      <el-tab-pane label="帮助文档" name="docs">
        <document-zone mount-zone="LEO_MGMT"></document-zone>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import { DELETE_LEO_RULE_BY_ID, QUERY_LEO_RULE_PAGE } from '@/api/modules/leo/leo.rule.api'

import Pagination from '@/components/opscloud/common/page/Pagination.vue'
import ActiveTag from '@/components/opscloud/common/tag/ActiveTag.vue'
import MyHighlight from '@/components/opscloud/common/MyHighlight.vue'
import LeoRuleEditor from '@/components/opscloud/leo/LeoRuleEditor.vue'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  name: 'leoRuleTable',
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
      style: { height: '80px' },
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
    Pagination,
    ActiveTag,
    LeoRuleEditor,
    MyHighlight,
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

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>
