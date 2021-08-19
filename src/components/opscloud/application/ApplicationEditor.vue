<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="应用配置" name="config">
        <el-form :model="application" label-width="150px">
          <el-form-item label="应用名称" required>
            <el-input v-model.trim="application.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="应用key" :required="true">
            <el-input v-model.trim="application.applicationKey" placeholder="请输入内容"
                      :disabled="!formStatus.operationType">
              <template slot="append">
                <el-button size="mini" type="primary" @click="handleBuildKey">
                  <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="application.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
            <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="绑定资源" name="resource" v-if="application.id !== ''" class="resTabPane">
        <el-col :span="10">
          <el-form :model="queryResParam" label-width="80px">
            <el-form-item label="业务类型">
              <el-select v-model="queryResParam.businessType" filterable placeholder="选择绑定资源业务类型"
                         @change="handleSelectBusinessType">
                <el-option
                  v-for="item in businessTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="queryResParam.businessType === businessType.ASSET" label="资源实例">
              <el-select v-model="queryResParam.dsInstance" filterable placeholder="选择资源实例"
                         value-key="id" @change="handleGetAssetType">
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
            <el-form-item v-if="queryResParam.businessType === businessType.ASSET" label="资源类型">
              <el-select v-model="queryResParam.assetType" placeholder="选择资源类型"
                         @change="handleGetResources('')">
                <el-option
                  v-for="item in assetTypeOptions"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="绑定资源">
              <el-select v-model.lazy="queryResParam.resources" filterable value-key="id"
                         :disabled="queryResParam.businessType === ''"
                         remote reserve-keyword placeholder="关键字搜索资源" :remote-method="handleGetResources">
                <el-option
                  v-for="item in resOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                  <span style="float: left">{{ resFilter(item) }}</span>
                  <span style="float: right; color: #8492a6; font-size: 10px;margin-left: 20px">
                    {{ resFilterPLus(item) }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" :disabled="JSON.stringify(queryResParam.resources) === '{}'"
                         @click="handleBindResources">绑定
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
                <el-tag size="small" closable @close="handleResUnbind(item.id)">{{ item.name }}</el-tag>
              </el-tooltip>
            </span>
          </div>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
// API
import {
  ADD_APPLICATION,
  BIND_APPLICATION_RES,
  GET_APP_BUSINESS_OPTIONS,
  GET_APPLICATION_BY_ID,
  UNBIND_APPLICATION_RES,
  UPDATE_APPLICATION
} from '@/api/modules/application/application.api'
import { QUERY_SERVER_PAGE } from '@/api/modules/server/server.api'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import { QUERY_ASSET_PAGE } from '@/api/modules/datasource/datasource.asset.api'
import AppDsInstanceAssetType from '@/components/opscloud/common/enums/application.ds.instance.asset.type'

const QueryResParam = {
  resources: '',
  dsInstance: {},
  assetType: '',
  businessType: ''
}

export default {
  data () {
    return {
      activeName: 'config',
      application: {},
      businessTypeOptions: [],
      businessType: BusinessType,
      queryResParam: QueryResParam,
      resOptions: [],
      dsInstanceOptions: [],
      assetTypeOptions: []
    }
  },
  name: 'ApplicationDialog',
  props: ['formStatus'],
  components: {},
  filters: {
    getAppResText (value) {
      switch (value) {
        case AppDsInstanceAssetType.GITLAB.GITLAB_GROUP:
          return '群组(GITLAB_GROUP)'
        case AppDsInstanceAssetType.GITLAB.GITLAB_PROJECT:
          return '项目(GITLAB_PROJECT)'
        case AppDsInstanceAssetType.KUBERNETES.KUBERNETES_DEPLOYMENT:
          return '无状态(DEPLOYMENT)'
        case 'SERVERGROUP':
          return '服务器组(SERVER_GROUP)'
        case 'SERVER':
          return '服务器(SERVER)'
        default:
          return value
      }
    }
  },
  mounted () {
  },
  methods: {
    initData (application) {
      this.application = Object.assign({}, application)
      this.activeName = 'config'
      this.queryResParam = Object.assign({}, QueryResParam)
    },
    handleClick (tab, event) {
      if (tab.name === 'resource') {
        this.getApplicationResource()
        this.handleGetBusinessType()
      }
    },
    handleSelectBusinessType () {
      this.clearResOptions()
      switch (this.queryResParam.businessType) {
        case BusinessType.ASSET:
          this.getAssetInstance()
          break
        default:
          this.handleGetResources('')
      }
    },
    handleGetAssetType () {
      this.clearResOptions()
      this.queryResParam.assetType = ''
      this.assetTypeOptions = []
      const obj = AppDsInstanceAssetType[this.queryResParam.dsInstance.instanceType]
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
      this.queryResParam.resources = ''
    },
    handleGetResources (queryName) {
      this.clearResOptions()
      switch (this.queryResParam.businessType) {
        case BusinessType.SERVER:
          this.getServer(queryName)
          break
        case BusinessType.SERVERGROUP:
          this.getServerGroup(queryName)
          break
        case BusinessType.ASSET:
          if (!this.queryResParam.dsInstance) {
            this.$message.warning('请先选择资产实例')
            return
          }
          if (!this.queryResParam.assetType) {
            this.$message.warning('请先选择资产类型')
            return
          }
          this.getAsset(queryName)
          break
        default:
          this.$message.warning('暂不支持绑定该类型')
      }
    },
    handleBindResources () {
      const requestBody = {
        applicationId: this.application.id,
        name: this.queryResParam.resources.name,
        businessId: this.queryResParam.resources.id,
        businessType: this.queryResParam.businessType,
        virtualResource: false
      }
      switch (this.queryResParam.businessType) {
        case BusinessType.SERVER:
          requestBody.resourceType = 'SERVER'
          requestBody.name = this.queryResParam.resources.displayName
          requestBody.comment = this.queryResParam.resources.privateIp
          break
        case BusinessType.SERVERGROUP:
          requestBody.resourceType = 'SERVERGROUP'
          requestBody.comment = this.queryResParam.resources.comment
          break
        case BusinessType.ASSET:
          requestBody.resourceType = this.queryResParam.resources.assetType
          requestBody.comment = this.queryResParam.resources.description
          break
        default:
          requestBody.resourceType = ''
      }
      BIND_APPLICATION_RES(requestBody)
        .then(() => {
          this.getApplicationResource()
          this.$message.success('绑定成功')
        })
    },
    resFilter (res) {
      switch (this.queryResParam.businessType) {
        case BusinessType.SERVER:
          return res.displayName
        case BusinessType.SERVERGROUP:
        case BusinessType.ASSET:
          return res.name
        default:
          return ''
      }
    },
    resFilterPLus (res) {
      switch (this.queryResParam.businessType) {
        case BusinessType.SERVER:
          return res.privateIp
        case BusinessType.SERVERGROUP:
          return res.comment
        case BusinessType.ASSET:
          return res.assetKey
        default:
          return ''
      }
    },
    handleGetBusinessType () {
      GET_APP_BUSINESS_OPTIONS()
        .then(({ body }) => {
          this.businessTypeOptions = body.options
        })
    },
    getServer (queryName) {
      const requestBody = {
        queryName: queryName,
        page: 1,
        length: 20
      }
      QUERY_SERVER_PAGE(requestBody)
        .then(({ body }) => {
          this.resOptions = body.data
        })
    },
    getServerGroup (queryName) {
      const requestBody = {
        name: queryName,
        serverGroupTypeId: '',
        page: 1,
        length: 20
      }
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(({ body }) => {
          this.resOptions = body.data
        })
    },
    getAssetInstance () {
      const requestBody = {
        isActive: true,
        extend: true
      }
      QUERY_DATASOURCE_INSTANCE(requestBody)
        .then(({ body }) => {
          this.dsInstanceOptions = body
        })
    },
    getAsset (queryName) {
      const requestBody = {
        instanceId: this.queryResParam.dsInstance.id,
        assetType: this.queryResParam.assetType,
        queryName: queryName,
        page: 1,
        length: 20
      }
      QUERY_ASSET_PAGE(requestBody)
        .then(({ body }) => {
          this.resOptions = body.data
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
            this.$emit('closeDialog')
          })
      } else {
        UPDATE_APPLICATION(requestBody)
          .then(() => {
            this.$message.success('成功')
            this.formStatus.visible = false
            this.$emit('closeDialog')
          })
      }
    }
  }
}
</script>

<style scoped lang="less">
/*.resDiv {*/
/*  .el-tag {*/
/*    margin-right: 5px;*/
/*  }*/
/*}*/

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
