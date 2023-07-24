<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="handleClose">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="应用配置" name="config">
        <el-form :model="application" label-width="150px">
          <el-form-item label="应用名称" required>
            <el-input v-model="application.name" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="应用Key" :required="true">
            <el-input v-model="application.applicationKey" placeholder="请输入内容" size="mini">
              <template v-slot:append>
                <el-button size="mini" type="primary" @click="handleBuildKey">
                  <i class="fa fa-arrow-up" aria-hidden="true"/>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="有效" required>
            <el-select v-model="application.isActive" size="mini" placeholder="选择">
              <el-option v-for="item in activeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="application.comment" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
            <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="绑定资源" name="resource" v-if="application.id !== ''" class="resTabPane">
        <el-col :span="10">
          <el-form :model="queryParam" label-width="80px">
            <el-form-item label="业务类型">
              <el-select v-model="queryParam.businessType" filterable placeholder="选择绑定资源业务类型"
                         @change="handleSelectBusinessType">
                <el-option v-for="item in businessTypeOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="queryParam.businessType === businessType.ASSET" label="资源实例">
              <el-select v-model="queryParam.dsInstance" filterable placeholder="选择资源实例"
                         value-key="id" @change="getAssetType">
                <el-option v-for="item in dsInstanceOptions"
                           :key="item.id"
                           :label="item.instanceName"
                           :value="item">
                  <span style="float: left">{{ item.instanceType }}</span>
                  <span style="float: right; color: #8492a6; font-size: 10px;margin-left: 20px">{{
                      item.instanceName
                    }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="queryParam.businessType === businessType.ASSET" label="资源类型">
              <el-select v-model="queryParam.assetType" placeholder="选择资源类型"
                         @change="getResource('')">
                <el-option v-for="item in assetTypeOptions"
                           :key="item.id"
                           :label="item.value"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="绑定资源">
              <el-select v-model="queryParam.resource" filterable clearable value-key="businessId"
                         :disabled="queryParam.businessType === ''"
                         remote reserve-keyword placeholder="关键字搜索资源" :remote-method="getResource">
                <el-option v-for="item in resOptions"
                           :key="item.businessId"
                           :label="item.name"
                           :value="item">
                  <select-item :name="item.name" :comment="item.comment"/>
                  <!--                  <span style="float: left">{{ item.name }}</span><span-->
                  <!--                  style="float: right; color: #8492a6; font-size: 10px;margin-left: 20px">{{ item.comment }}</span>-->
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="handleBindResources"
                         :disabled="queryParam.resource === '' || JSON.stringify(queryParam.resource) === '{}'">绑定
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <div v-for="(value,key) in application.resourceMap" :key="key" :label="key" class="resDiv">
            <el-divider content-position="left"><b style="color: #9d9fa3">{{ key | getAppResText }}</b></el-divider>
            <span v-for="item in value" :key="item.id">
              <el-tooltip effect="dark" :content="item.comment" placement="top-start"
                          :disabled="!item.comment">
                <el-tag size="mini" closable @close="handleResUnbind(item.id)">
                  <span v-if="item.instance !== null">{{ item.instance.instanceName }}/</span>{{ item.name }}
                </el-tag>
              </el-tooltip>
            </span>
          </div>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="用户授权" name="permissionUser" v-if="application.id !== ''&& application.id !== 0">
        <permission-user-tab :businessType="businessType.APPLICATION" :businessId="application.id"
                             ref="permissionUserTab"/>
      </el-tab-pane>
      <el-tab-pane label="业务文档" name="document" :disabled="application.id === '' || application.id === 0">
        <business-doc-editor v-if="application.id !== ''&& application.id !== 0"
                             :business-type="application.businessType" :business-id="application.businessId"
                             ref="businessDocEditor"/>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
// API
import {
  ADD_APPLICATION,
  PREVIEW_APPLICATION_RES_PAGE,
  BIND_APPLICATION_RES,
  GET_APP_BUSINESS_OPTIONS,
  GET_APPLICATION_BY_ID,
  UNBIND_APPLICATION_RES,
  UPDATE_APPLICATION
} from '@/api/modules/application/application.api'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import AppDsInstanceAssetType from '@/components/opscloud/common/enums/application.ds.instance.asset.type'
import PermissionUserTab from '../user/child/BusinessPermissionUserTab'
import BusinessDocEditor from '@/components/opscloud/business/BusinessDocEditor'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'

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
      application: {},
      businessTypeOptions: [],
      businessType: BusinessType,
      queryParam: {
        resource: '',
        dsInstance: {},
        assetType: '',
        businessType: ''
      },
      appDsInstanceAssetType: AppDsInstanceAssetType,
      resOptions: [],
      dsInstanceOptions: [],
      assetTypeOptions: [],
      activeOptions: activeOptions
    }
  },
  name: 'ApplicationDialog',
  props: ['formStatus'],
  components: {
    SelectItem,
    BusinessDocEditor,
    PermissionUserTab
  },
  filters: {
    getAppResText (value) {
      switch (value) {
        case AppDsInstanceAssetType.GITLAB.GITLAB_GROUP:
          return 'GitLab group'
        case AppDsInstanceAssetType.GITLAB.GITLAB_PROJECT:
          return 'GitLab project'
        case AppDsInstanceAssetType.KUBERNETES.KUBERNETES_DEPLOYMENT:
          return 'Kubernetes deployment'
        case 'DATASOURCE_INSTANCE':
          return 'Datasource instance'
        case 'SERVERGROUP':
          return 'Server group'
        case 'SERVER':
          return 'Server'
        default:
          return value
      }
    }
  },
  mounted () {
  },
  methods: {
    initData (application) {
      this.application = application
      this.activeName = 'config'
    },
    handleClick (tab, event) {
      if (tab.name === 'resource') {
        this.getApplicationResource()
        this.getBusinessType()
      }
      if (tab.name === 'permissionUser') {
        this.$refs.permissionUserTab.init()
      }
      if (tab.name === 'document') {
        this.$refs.businessDocEditor.open(this.application.document)
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
      this.assetTypeOptions = []
      const obj = this.appDsInstanceAssetType[this.queryParam.dsInstance.instanceType]
      if (obj) {
        for (const item in obj) {
          this.assetTypeOptions.push({
            value: item
          })
        }
        return
      }
      this.assetTypeOptions = []
    },
    clearResOptions () {
      this.resOptions = []
      this.queryParam.resource = ''
    },
    getResource (queryName) {
      this.clearResOptions()
      let appResType
      switch (this.queryParam.businessType) {
        case this.businessType.SERVER:
          appResType = 'SERVER'
          break
        case this.businessType.SERVERGROUP:
          appResType = 'SERVERGROUP'
          break
        case this.businessType.DATASOURCE_INSTANCE:
          appResType = 'DATASOURCE_INSTANCE'
          break
        case this.businessType.ASSET:
          appResType = this.queryParam.assetType
          break
        default:
          this.$message.warning('暂不支持绑定该类型')
      }
      const requestBody = {
        queryName: queryName,
        instanceId: this.queryParam.dsInstance !== {} ? this.queryParam.dsInstance.id : '',
        instanceUuid: this.queryParam.dsInstance !== {} ? this.queryParam.dsInstance.uuid : '',
        applicationId: this.application.id,
        businessType: this.queryParam.businessType,
        appResType: appResType,
        page: 1,
        length: 20
      }
      PREVIEW_APPLICATION_RES_PAGE(requestBody)
        .then(({ body }) => {
          this.resOptions = body.data
        })
    },
    handleBindResources () {
      if (this.queryParam.businessType === '') {
        this.$message.warning('请选择业务类型产')
        return
      }
      BIND_APPLICATION_RES(this.queryParam.resource)
        .then(() => {
          this.getApplicationResource()
          this.$message.success('绑定成功')
        })
    },
    getBusinessType () {
      GET_APP_BUSINESS_OPTIONS()
        .then(({ body }) => {
          this.businessTypeOptions = body.options
        })
    },
    getAssetInstance () {
      const requestBody = {
        isActive: true,
        extend: false
      }
      QUERY_DATASOURCE_INSTANCE(requestBody)
        .then(({ body }) => {
          this.dsInstanceOptions = body
        })
    },
    getApplicationResource () {
      GET_APPLICATION_BY_ID({ id: this.application.id })
        .then(({ body }) => {
          this.application.resourceMap = body.resourceMap ? body.resourceMap : {}
        })
    },
    handleBuildKey () {
      this.application.applicationKey = this.application.name.toUpperCase()
    },
    handleResBind () {
      BIND_APPLICATION_RES()
        .then(() => {
          this.$message.success('绑定成功')
          this.getApplicationResource()
        })
    },
    handleResUnbind (id) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UNBIND_APPLICATION_RES({ id: id })
          .then(() => {
            this.$message.success('解除绑定成功')
            this.getApplicationResource()
          })
      }).catch(() => {
        this.$message.info('已取消解除绑定')
      })
    },
    handleSave () {
      const requestBody = Object.assign({}, this.application)
      if (this.formStatus.operationType) {
        ADD_APPLICATION(requestBody)
          .then(() => {
            this.$message.success('成功')
            this.formStatus.visible = false
            this.$emit('close')
          })
      } else {
        UPDATE_APPLICATION(requestBody)
          .then(() => {
            this.$message.success('成功')
            this.formStatus.visible = false
            this.$emit('close')
          })
      }
    },
    handleClose () {
      this.application = {}
      this.formStatus.visible = false
      this.$emit('close')
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
