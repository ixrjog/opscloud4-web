<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="handleClose">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="项目配置" name="config">
        <el-form :model="project" label-width="150px">
          <el-form-item label="项目名称" required>
            <el-input v-model="project.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="项目Key" :required="true" v-if="false">
            <el-input v-model="project.projectKey" placeholder="请输入内容">
              <template slot="append">
                <el-button size="mini" type="primary" @click="handleBuildKey">
                  <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="项目类型" required>
            <el-radio-group v-model="project.projectType" size="mini">
              <el-radio-button label="DAILY">日常</el-radio-button>
              <el-radio-button label="PROJECT">项目</el-radio-button>
              <el-radio-button label="URGENT">紧急</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目状态" required>
            <el-radio-group v-model="project.projectStatus" size="mini">
              <el-radio-button label="PENDING">未开始</el-radio-button>
              <el-radio-button label="PROGRESS">进行中</el-radio-button>
              <el-radio-button label="PAUSE">暂停</el-radio-button>
              <el-radio-button label="CANCEL">取消</el-radio-button>
              <el-radio-button label="DELIVERED">已发布</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="有效" required>
            <el-select v-model="project.isActive" placeholder="选择" style="width: 220px;">
              <el-option
                v-for="item in activeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" required>
            <div class="block">
              <el-date-picker v-model="project.startTime" type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="结束时间">
            <div class="block">
              <el-date-picker v-model="project.endTime" type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="project.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
            <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="项目资源" name="resource" v-if="project.id !== ''" class="resTabPane">
        <el-col :span="10">
          <el-form :model="queryParam" label-width="80px">
            <el-form-item label="业务类型">
              <el-select v-model="queryParam.businessType" filterable placeholder="选择绑定资源业务类型"
                         @change="handleSelectBusinessType">
                <el-option
                  v-for="item in businessTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="queryParam.businessType === businessType.ASSET" label="资源实例">
              <el-select v-model="queryParam.dsInstance" filterable placeholder="选择资源实例"
                         value-key="id" @change="getAssetType">
                <el-option
                  v-for="item in dsInstanceOptions"
                  :key="item.id"
                  :label="item.instanceName"
                  :value="item">
                  <span style="float: left">{{ item.instanceType }}</span>
                  <span style="float: right; color: #8492a6; font-size: 10px;margin-left: 20px">
                {{ item.instanceName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择项目">
              <el-select v-model="queryParam.resourceParentId" filterable :disabled="queryParam.businessType === ''"
                         clearable
                         remote reserve-keyword placeholder="关键字搜索资源" :remote-method="getDevOpsProjectResource"
                         @change="getResource('')">
                <el-option
                  v-for="item in parentResOptions"
                  :key="item.businessId"
                  :label="item.name"
                  :value="item.businessId">
                  <span style="float: left">{{ item.name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 10px;margin-left: 20px">{{ item.comment }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源类型">
              <el-select v-model="queryParam.assetType" :disabled="queryParam.resourceParentId === ''" clearable
                         @change="getResource('')" placeholder="选择资源类型">
                <el-option
                  v-for="item in assetTypeOptions"
                  :key="item.id"
                  :label="item.value | getProjectResAssetText"
                  :value="item.value">
                  <span>{{ item.value | getProjectResAssetText }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="绑定资源">
              <el-select v-model="queryParam.resource" filterable clearable value-key="businessId"
                         :disabled="queryParam.assetType === ''"
                         remote reserve-keyword placeholder="关键字搜索资源" :remote-method="getResource">
                <el-option
                  v-for="item in resOptions"
                  :key="item.businessId"
                  :label="item.name"
                  :value="item">
                  <span style="float: left">{{ item.name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 10px;margin-left: 20px">{{ item.comment }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="handleBindResources"
                         :disabled="queryParam.resource === '' || JSON.stringify(queryParam.resource) === '{}'">添加
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <div v-for="(value,key) in project.resourceMap" :key="key" :label="key">
            <el-divider content-position="left"><b style="color: #9d9fa3">{{ key | getProjectResText }}</b></el-divider>
            <span v-for="item in value" :key="item.id">
              <el-tooltip effect="dark" :content="item.comment" placement="top-start"
                          :disabled="!item.comment">
                <el-tag size="mini" closable @close="handleResUnbind(item.id)" style="margin: 0 5px 5px 0">
                  {{ item.name }}
                </el-tag>
              </el-tooltip>
            </span>
          </div>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="项目应用" name="application" v-if="project.id !== ''&& project.id !== 0">
        <el-col :span="10">
          <el-form :model="bindAppParam">
            <el-form-item label="应用">
              <el-select v-model="bindAppParam.application" filterable value-key="id"
                         remote reserve-keyword placeholder="选择要绑定的应用" :remote-method="getApplication">
                <el-option
                  v-for="item in applicationOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                  <select-item :name="item.name" :comment="item.comment"></select-item>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="handleBindAppResources"
                         :disabled="JSON.stringify(bindAppParam.application) === '{}'">添加
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <div>
            <el-divider content-position="left"><b style="color: #9d9fa3">应用</b></el-divider>
            <span v-for="item in project.applicationList" :key="item.id">
              <el-tooltip effect="dark" :content="item.comment" placement="top-start"
                          :disabled="!item.comment">
                <el-tag size="mini" closable @close="handleResUnbind(item.id)" style="margin: 0 5px 5px  0">
                  {{ item.name }}
                </el-tag>
              </el-tooltip>
            </span>
          </div>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="项目成员" name="permissionUser" v-if="project.id !== ''&& project.id !== 0">
        <permission-user-tab :businessType="businessType.PROJECT" :businessId="project.id"
                             ref="permissionUserTab"></permission-user-tab>
      </el-tab-pane>
      <el-tab-pane label="业务文档" name="document" :disabled="project.id === '' || project.id === 0">
        <business-doc-editor v-if="project.id !== ''&& project.id !== 0"
                             :business-type="project.businessType" :business-id="project.businessId"
                             ref="businessDocEditor"></business-doc-editor>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
// API
import BusinessType from '@/components/opscloud/common/enums/business.type'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import PermissionUserTab from '../user/child/BusinessPermissionUserTab'
import BusinessDocEditor from '@/components/opscloud/business/BusinessDocEditor'
import {
  ADD_PROJECT,
  BIND_PROJECT_RES, GET_PROJECT_BUSINESS_OPTIONS,
  GET_PROJECT_BY_ID,
  PREVIEW_PROJECT_RES_PAGE,
  UNBIND_PROJECT_RES, UPDATE_PROJECT
} from '@/api/modules/project/project.api'
import ProjectDsInstanceAssetType from '@/components/opscloud/common/enums/project.ds.instance.asset.type'
import { QUERY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import { getProjectResAssetText } from '@/filters/project'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  data () {
    return {
      activeName: 'config',
      project: {},
      businessTypeOptions: [],
      businessType: BusinessType,
      queryParam: {
        resource: '',
        dsInstance: {},
        assetType: '',
        businessType: BusinessType.ASSET,
        resourceParentId: ''
      },
      bindAppParam: {
        application: {}
      },
      ProjectDsInstanceAssetType: ProjectDsInstanceAssetType,
      applicationOptions: [],
      resOptions: [],
      parentResOptions: [],
      dsInstanceOptions: [],
      assetTypeOptions: [],
      activeOptions: activeOptions
    }
  },
  name: 'ProjectDialog',
  props: ['formStatus'],
  components: {
    BusinessDocEditor,
    PermissionUserTab,
    SelectItem
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
    getProjectResAssetText
  },
  mounted () {
  },
  methods: {
    initData (project) {
      this.project = project
      this.activeName = 'config'
      this.bindAppParam.application = {}
      this.handleSelectBusinessType()
    },
    handleClick (tab, event) {
      if (tab.name === 'resource') {
        this.getProjectResource()
        this.getBusinessType()
      }
      if (tab.name === 'permissionUser') {
        this.$refs.permissionUserTab.init()
      }
      if (tab.name === 'document') {
        this.$refs.businessDocEditor.open(this.project.document)
      }
    },
    handleSelectBusinessType () {
      this.clearResOptions()
      switch (this.queryParam.businessType) {
        case this.businessType.ASSET:
          this.getAssetInstance()
          break
        default:
          this.getResource('')
      }
    },
    getAssetType () {
      this.clearResOptions()
      this.queryParam.assetType = ''
      this.parentResOptions = []
      this.assetTypeOptions = []
      this.getDevOpsProjectResource('')
      const obj = this.ProjectDsInstanceAssetType[this.queryParam.dsInstance.instanceType]
      if (obj) {
        for (const item in obj) {
          this.assetTypeOptions.push({
            value: item
          })
        }
      }
    },
    clearResOptions () {
      this.resOptions = []
      this.parentResOptions = []
      this.queryParam.resource = ''
    },
    getDevOpsProjectResource (queryName) {
      this.clearResOptions()
      const requestBody = {
        queryName: queryName,
        instanceId: this.queryParam.dsInstance !== {} ? this.queryParam.dsInstance.id : '',
        instanceUuid: this.queryParam.dsInstance !== {} ? this.queryParam.dsInstance.uuid : '',
        projectId: this.project.id,
        businessType: this.queryParam.businessType,
        projectResType: 'ALIYUN_DEVOPS_PROJECT',
        page: 1,
        length: 20
      }
      PREVIEW_PROJECT_RES_PAGE(requestBody)
        .then(({ body }) => {
          this.parentResOptions = body.data
        })
    },
    getResource (queryName) {
      this.clearResOptions()
      if (this.queryParam.assetType === '') {
        return
      }
      const requestBody = {
        queryName: queryName,
        instanceId: this.queryParam.dsInstance !== {} ? this.queryParam.dsInstance.id : '',
        instanceUuid: this.queryParam.dsInstance !== {} ? this.queryParam.dsInstance.uuid : '',
        projectId: this.project.id,
        businessType: this.businessType.ASSET,
        projectResType: this.queryParam.assetType,
        parentId: this.queryParam.resourceParentId,
        page: 1,
        length: 20
      }
      PREVIEW_PROJECT_RES_PAGE(requestBody)
        .then(({ body }) => {
          this.resOptions = body.data
        })
    },
    handleBindResources () {
      if (this.queryParam.businessType === '') {
        this.$message.warning('请选择业务类型产')
        return
      }
      BIND_PROJECT_RES(this.queryParam.resource)
        .then(() => {
          this.getProjectResource()
          this.$message.success('添加成功')
        })
    },
    handleBindAppResources () {
      if (JSON.stringify(this.bindAppParam.application) === '{}') {
        this.$message.warning('请选择应用')
        return
      }
      const requestBody = {
        name: this.bindAppParam.application.name,
        businessId: this.bindAppParam.application.id,
        businessType: BusinessType.APPLICATION,
        resourceType: 'APPLICATION',
        projectId: this.project.id
      }
      BIND_PROJECT_RES(requestBody)
        .then(() => {
          this.getProjectResource()
          this.$message.success('添加成功')
        })
    },
    getBusinessType () {
      GET_PROJECT_BUSINESS_OPTIONS()
        .then(({ body }) => {
          this.businessTypeOptions = body.options
        })
    },
    getAssetInstance () {
      const requestBody = {
        instanceType: 'ALIYUN_DEVOPS',
        isActive: true,
        extend: false
      }
      QUERY_DATASOURCE_INSTANCE(requestBody)
        .then(({ body }) => {
          this.dsInstanceOptions = body
          this.queryParam.dsInstance = body[0]
          this.getAssetType()
        })
    },
    getProjectResource () {
      GET_PROJECT_BY_ID({ id: this.project.id })
        .then(({ body }) => {
          this.project.resourceMap = body.resourceMap ? body.resourceMap : {}
          this.project.applicationList = body.resourceMap ? body.applicationList : []
        })
    },
    handleBuildKey () {
      this.project.projectKey = this.project.name.toUpperCase()
    },
    handleResBind () {
      BIND_PROJECT_RES()
        .then(() => {
          this.$message.success('添加成功')
          this.getProjectResource()
        })
    },
    handleResUnbind (id) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UNBIND_PROJECT_RES({ id: id })
          .then(() => {
            this.$message.success('解除绑定成功')
            this.getProjectResource()
          })
      }).catch(() => {
        this.$message.info('已取消解除绑定')
      })
    },
    handleSave () {
      const requestBody = Object.assign({}, this.project)
      requestBody.startTime = new Date(this.project.startTime).getTime()
      if (this.project.endTime) {
        requestBody.endTime = new Date(this.project.endTime).getTime()
      }
      if (this.formStatus.operationType) {
        ADD_PROJECT(requestBody)
          .then(() => {
            this.$message.success('成功')
            this.formStatus.visible = false
            this.$emit('close')
          })
      } else {
        UPDATE_PROJECT(requestBody)
          .then(() => {
            this.$message.success('成功')
            this.formStatus.visible = false
            this.$emit('close')
          })
      }
    },
    handleClose () {
      this.project = {}
      this.formStatus.visible = false
      this.$emit('close')
    },
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: 0,
        page: 1,
        length: 10
      }
      QUERY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
        })
    }
  }
}
</script>

<style scoped lang="less">

.resTabPane {
  & .el-select {
    max-width: 80%;
    width: 80%;
  }

  .el-col {
    p {
      margin: 0px;
      color: #B7B6B6;
      font-size: 20px;
      font-weight: bolder;
    }

    & .el-tag {
      margin: 5px 5px 5px 0px;
    }

    /*& .el-divider {*/
    /*  margin: 5px 0px;*/
    /*}*/
  }
}
</style>
