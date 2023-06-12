<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <div>
      <h1 v-show="false">{{ title }}</h1>
    </div>
    <announcement-carousel :kind="2"/>
    <el-row style="margin-bottom: 5px">
      <el-input v-model="queryParam.queryName" @change="fetchData" placeholder="输入关键字模糊查询"/>
      <el-radio-group v-model="queryParam.projectType" size="mini" @change="fetchData" style="margin-left: 5px"
                      v-if="false">
        <el-radio-button label="">所有</el-radio-button>
        <el-radio-button label="DAILY">日常</el-radio-button>
        <el-radio-button label="PROJECT">项目</el-radio-button>
        <el-radio-button label="URGENT">紧急</el-radio-button>
      </el-radio-group>
      <el-select v-model="queryParam.projectType" clearable placeholder="项目类型" @change="fetchData">
        <el-option v-for="item in projectTypeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-radio-group v-model="queryParam.projectStatus" size="mini" @change="fetchData" style="margin-left: 5px"
                      v-if="false">
        <el-radio-button label="">所有</el-radio-button>
        <el-radio-button label="PENDING">未开始</el-radio-button>
        <el-radio-button label="PROGRESS">进行中</el-radio-button>
        <el-radio-button label="PAUSE">暂停</el-radio-button>
        <el-radio-button label="CANCEL">取消</el-radio-button>
        <el-radio-button label="DELIVERED">已发布</el-radio-button>
      </el-radio-group>
      <el-select v-model="queryParam.projectStatus" clearable placeholder="项目状态" @change="fetchData">
        <el-option v-for="item in projectStatusOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-select v-model="queryParam.tagId" filterable clearable remote reserve-keyword
                 placeholder="请输入关键词搜索标签" :remote-method="getTag" @change="fetchData">
        <el-option v-for="item in tagOptions"
                   :key="item.id"
                   :label="item.tagKey"
                   :value="item.id"/>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button style="margin-left: 5px" @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column label="项目名称" width="200px">
        <template v-slot="scope">
          <el-row>
            <span>{{ scope.row.name }}</span>
            <el-button type="text" v-if="scope.row.document !== null" style="margin-left: 10px"
                       @click="handleDocRead(scope.row)"><i class="fab fa-creative-commons-share"/>
            </el-button>
            <el-button type="text" style="margin-left: 10px"
                       @click="jumpUrl(scope.row)"><i class="fas fa-external-link-alt"/>
            </el-button>
          </el-row>
          <el-row v-if="false">
            <el-tag disable-transitions type="primary" plain size="mini">{{ scope.row.projectKey }}</el-tag>
          </el-row>
          <el-row>
            <b style="color: #9d9fa3">{{ scope.row.comment }}</b>
          </el-row>
          <!--Tags-->
          <business-tags :tags="scope.row.tags"/>
        </template>
      </el-table-column>
      <el-table-column prop="resourceMap" label="项目资源" width="400px">
        <template v-slot="scope">
          <div v-for="(value,key) in scope.row.resourceMap" :key="key" :label="key" class="resDiv">
            <el-divider content-position="left"><b style="color: #9d9fa3">{{ key | getProjectResText }}</b>
            </el-divider>
            <span v-for="item in value" :key="item.id">
                <el-tooltip effect="dark" :content="item.comment" placement="top-start"
                            :disabled="!item.comment">
                  <el-tag size="mini" style="margin-left: 5px;margin-bottom: 5px">
                    {{ item.name }}
                  </el-tag>
                </el-tooltip>
              </span>
          </div>
          <div v-if="JSON.stringify(scope.row.applicationList) !== '[]'">
            <el-divider content-position="left"><b style="color: #9d9fa3">应用</b></el-divider>
            <div v-for="item in scope.row.applicationList" :key="item.id">
              <el-tooltip effect="dark" :content="item.comment" placement="top-start" :disabled="!item.comment">
                <el-tag size="mini" style="margin-left: 5px;margin-bottom: 5px">{{ item.name }}</el-tag>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="users" label="项目成员" width="150">
        <template v-slot="scope">
          <users-tag :users="scope.row.users"></users-tag>
        </template>
      </el-table-column>
      <el-table-column prop="projectType" label="项目类型" width="80">
        <template v-slot="scope">
          <el-tag :style="scope.row.projectType | getProjectTypeStyle">
            {{ scope.row.projectType | getProjectTypeText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="projectStatus" label="项目状态" width="80">
        <template v-slot="scope">
          <el-tag :style="scope.row.projectStatus | getProjectStatusStyle">
            <i class="el-icon-loading" v-show="scope.row.projectStatus === 'PROGRESS'"/>
            {{ scope.row.projectStatus | getProjectStatusText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deployCount" label="生产部署" width="80">
        <template v-slot="scope">{{ scope.row.envDeployCount.prod }}</template>
      </el-table-column>
      <el-table-column prop="deployCount" label="部署总数" width="80"/>
      <el-table-column prop="startTime" label="开始时间" width="80"/>
      <el-table-column prop="endTime" label="结束时间" width="80"/>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <project-editor ref="projectEditor" :formStatus="formStatus.project"
                    @close="fetchData"/>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"/>
    <business-doc-reader :form-status="formStatus.businessDoc" ref="businessDocReader"/>
  </d2-container>
</template>

<script>

import Pagination from '@/components/opscloud/common/page/Pagination'
import ProjectDsInstanceAssetType from '@/components/opscloud/common/enums/project.ds.instance.asset.type'
import UsersTag from '../../components/opscloud/common/tag/UsersTag'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import BusinessTagEditor from '@/components/opscloud/common/tag/BusinessTagEditor'
import BusinessDocReader from '@/components/opscloud/business/BusinessDocReader'
import { QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import ProjectEditor from '@/components/opscloud/project/ProjectEditor'
import { DELETE_PROJECT, QUERY_PROJECT_PAGE } from '@/api/modules/project/project.api'
import { getProjectStatusStyle, getProjectStatusText, getProjectTypeStyle, getProjectTypeText } from '@/filters/project'
import tools from '@/libs/tools'
import AnnouncementCarousel from '@/components/opscloud/sys/AnnouncementCarousel.vue'
import util from '@/libs/util'

const projectTypeOptions = [{
  value: 'DAILY',
  label: '日常'
}, {
  value: 'PROJECT',
  label: '项目'
}, {
  value: 'URGENT',
  label: '紧急'
}]

const projectStatusOptions = [{
  value: 'PENDING',
  label: '未开始'
}, {
  value: 'PROGRESS',
  label: '进行中'
}, {
  value: 'PAUSE',
  label: '暂停'
}, {
  value: 'CANCEL',
  label: '取消'
}, {
  value: 'DELIVERED',
  label: '已发布'
}]

export default {
  name: 'ProjectTable',
  data () {
    return {
      title: '项目管理',
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
      options: {
        stripe: true
      },
      businessType: BusinessType.PROJECT,
      queryParam: {
        queryName: '',
        projectType: '',
        projectStatus: '',
        tagId: ''
      },
      formStatus: {
        project: {
          visible: false,
          operationType: true,
          addTitle: '新增项目配置',
          updateTitle: '更新项目配置'
        },
        businessTag: {
          visible: false,
          title: '编辑项目标签'
        },
        businessDoc: {
          visible: false,
          title: '项目文档'
        }
      },
      tagOptions: [],
      projectTypeOptions: projectTypeOptions,
      projectStatusOptions: projectStatusOptions
    }
  },
  filters: {
    getProjectResText (value) {
      switch (value) {
        case ProjectDsInstanceAssetType.ALIYUN_DEVOPS.ALIYUN_DEVOPS_SPRINT:
          return '迭代'
        case ProjectDsInstanceAssetType.ALIYUN_DEVOPS.ALIYUN_DEVOPS_WORKITEM:
          return '需求'
        default:
          return value
      }
    },
    getProjectTypeText,
    getProjectTypeStyle,
    getProjectStatusText,
    getProjectStatusStyle
  },
  computed: {},
  mounted () {
    this.getTag('')
    this.fetchData()
  },
  components: {
    AnnouncementCarousel,
    Pagination,
    ProjectEditor,
    UsersTag,
    BusinessTagEditor,
    BusinessDocReader,
    BusinessTags
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
    handleDocRead (row) {
      this.$refs.businessDocReader.initData(Object.assign({}, row.document))
      this.formStatus.businessDoc.visible = true
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
    handleAdd () {
      this.formStatus.project.operationType = true
      const project = {
        id: '',
        name: '',
        projectKey: '',
        projectType: 'DAILY',
        projectStatus: 'PENDING',
        // yyyy-MM-dd
        startTime: tools.dateFormatter(new Date),
        endTime: '',
        isActive: true,
        comment: ''
      }
      this.$refs.projectEditor.initData(project)
      this.formStatus.project.visible = true
    },
    jumpUrl (row) {
      util.open('https://ms.chuanyinet.com/#/coverage/project-report?ocId=' + row.id)
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
      this.formStatus.project.operationType = false
      this.formStatus.project.visible = true
      this.$refs.projectEditor.initData(Object.assign({}, row))
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_PROJECT({ id: row.id })
          .then(res => {
            this.fetchData()
            this.$message.success('删除成功!')
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        extend: 1,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_PROJECT_PAGE(requestBody)
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

.nameCopy i {
  display: none;
}

.nameCopy:hover i {
  display: inline;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 12px 0;
}
</style>
