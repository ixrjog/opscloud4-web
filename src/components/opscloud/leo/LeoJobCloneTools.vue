<!--suppress HtmlUnknownTag -->
<template>
  <el-tabs type="border-card">
    <el-tab-pane label="全环境复制">
      <el-row>
        <el-select v-model.trim="queryParam.srcApplicationId" size="mini" filterable clearable
                   remote reserve-keyword placeholder="选择源应用" :remote-method="getSrcApplication">
          <el-option v-for="item in srcApplicationOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
            <select-item :name="item.name" :comment="item.comment"/>
          </el-option>
        </el-select>
        <el-select v-model.trim="queryParam.destApplicationId" size="mini" filterable clearable @change="fetchData"
                   remote reserve-keyword placeholder="选择目标应用" :remote-method="getDestApplication">
          <el-option v-for="item in destApplicationOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
            <select-item :name="item.name" :comment="item.comment"/>
          </el-option>
        </el-select>
        <el-button @click="fetchData" size="mini" :disabled="queryParam.destApplicationId === ''" plain class="button">
          查询
        </el-button>
        <el-button @click="handleClone" size="mini" type="primary" plain
                   :disabled="queryParam.srcApplicationId === '' || queryParam.destApplicationId === ''" class="button">
          复制
        </el-button>
      </el-row>
      <div style="height: 5px"/>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
        <el-table-column prop="name" label="名称" sortable/>
        <el-table-column prop="application" label="应用">
          <template v-slot="scope">
            <el-tooltip class="item" effect="light"
                        :content="scope.row.application.comment === '' ? '未定义': scope.row.application.comment"
                        placement="top-start">
              <el-tag size="mini">{{ scope.row.application.name }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="branch" label="首选分支" sortable>
          <template v-slot="scope">
            <i class="fa fa-code-fork" style="margin-right: 2px"></i>
            <span>{{ scope.row.branch }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="template" label="模板">
          <template v-slot="scope">
            <el-tooltip class="item" effect="light"
                        :content="scope.row.template.comment === '' ? '未定义': scope.row.template.comment"
                        placement="top-start">
              <span>{{ scope.row.template.name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="template" label="模板版本">
          <template v-slot="scope">
            <el-tag size="mini" :type="scope.row.verifyTemplateVersion.type">
              {{ scope.row.verifyTemplateVersion.displayVersion }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="env" label="环境" width="80">
          <template v-slot="scope">
            <env-tag :env="scope.row.env"/>
          </template>
        </el-table-column>
        <el-table-column prop="buildSize" label="构建次数" width="80">
        </el-table-column>
        <el-table-column prop="isActive" label="有效" width="80">
          <template v-slot="scope">
            <active-tag :is-active="scope.row.isActive"/>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="200">
          <template v-slot="scope">
            <business-tags :tags="scope.row.tags"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template v-slot="scope">
            <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
            <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
            <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)"
                       :disabled="scope.row.buildSize !==0">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                           :form-status="formStatus.businessTag" @close="fetchData"/>
      <leo-job-editor :formStatus="formStatus.job" ref="jobEditor" @close="fetchData"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import BusinessType from '@/components/opscloud/common/enums/business.type'
import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import { CLONE_LEO_JOB, DELETE_LEO_JOB_BY_ID, QUERY_LEO_JOB_PAGE } from '@/api/modules/leo/leo.job.api'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'
import EnvTag from '@/components/opscloud/common/tag/EnvTag.vue'
import BusinessTagEditor from '@/components/opscloud/common/tag/BusinessTagEditor.vue'
import LeoJobEditor from '@/components/opscloud/leo/LeoJobEditor.vue'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import ActiveTag from '@/components/opscloud/common/tag/ActiveTag.vue'

export default {
  name: 'LeoJobCloneTools',
  data () {
    return {
      instance: {
        id: ''
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
        srcApplicationId: '',
        destApplicationId: '',
        cloneTag: true
      },
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑Leo任务标签'
        },
        job: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增任务配置',
          updateTitle: '更新任务配置'
        }
      },
      tagOptions: [],
      businessType: BusinessType.LEO_JOB,
      srcApplicationOptions: [],
      destApplicationOptions: []
    }
  },
  components: {
    SelectItem,
    EnvTag,
    BusinessTags,
    ActiveTag,
    BusinessTagEditor,
    LeoJobEditor
  },
  mounted () {
    this.getSrcApplication('')
    this.getDestApplication('')
  },
  methods: {
    getSrcApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_MY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.srcApplicationOptions = res.body.data
        })
    },
    getDestApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_MY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.destApplicationOptions = res.body.data
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
      this.formStatus.job.visible = true
      this.formStatus.job.operationType = false
      this.$refs.jobEditor.initData(Object.assign({}, row))
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_LEO_JOB_BY_ID({ jobId: row.id }).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleClone () {
      const requestBody = {
        ...this.queryParam
      }
      CLONE_LEO_JOB(requestBody)
        .then(res => {
          this.$message.success('复制成功!')
          this.fetchData()
        })
    },
    fetchData () {
      if (this.queryParam.destApplicationId === '') return
      this.table.loading = true
      const requestBody = {
        queryName: '',
        applicationId: this.queryParam.destApplicationId,
        templateId: '',
        envType: '',
        tagId: '',
        isActive: '',
        extend: true,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_JOB_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
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
  margin-right: 5px;
}

</style>
