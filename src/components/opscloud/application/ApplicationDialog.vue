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
                <el-button size="mini" type="primary" @click="handlerBuildKey">
                  <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="application.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="绑定资源" name="resource" v-if="application.id !== ''">
        <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
          <el-select v-model="queryResParam.businessType" filterable placeholder="选择绑定资源业务类型"
                     @change="handlerSelectBusinessType">
            <el-option
              v-for="item in businessTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="queryResParam.dsInstance" filterable placeholder="选择资源实例" class="select"
                     v-if="queryResParam.businessType === businessType.ASSET" value-key="id"
                     @change="handlerGetAssetType">
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
          <el-select v-model="queryResParam.assetType" placeholder="选择资源类型" class="select"
                     v-if="queryResParam.businessType === businessType.ASSET" @change="clearResOptions">
            <el-option
              v-for="item in assetTypeOptions"
              :key="item.id"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model.lazy="queryResParam.resources" filterable class="select" value-key="id"
                     :disabled="queryResParam.businessType === ''"
                     remote reserve-keyword placeholder="关键字搜索资源" :remote-method="handlerGetResources">
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
          <el-button size="mini" type="primary" :disabled="JSON.stringify(queryResParam.resources) === '{}'"
                     @click="handlerBindResources">绑定
          </el-button>
        </el-row>
        <el-row :gutter="24" style="margin-bottom: 5px;margin-left: 5px">
          <div v-for="(value,key) in application.resourceMap" :key="key" :label="key" class="resDiv">
            <p>{{ key | getAssetTypeText }}</p>
            <span v-for="item in value" :key="item.id">
              <el-tag closable @close="handlerResUnbind(item.id)">{{ item.name }}</el-tag>
            </span>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import {
  ADD_APPLICATION,
  BIND_APPLICATION_RES,
  QUERY_APPLICATION_BY_ID,
  UNBIND_APPLICATION_RES,
  UPDATE_APPLICATION
} from '@/api/modules/application/application.api'
import { getAssetTypeText } from '@/filters/asset.type'
import { QUERY_SERVER_PAGE } from '@/api/modules/server/server.api'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import { GET_TAG_BUSINESS_OPTIONS } from '@/api/modules/tag/tag.api'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'
import { QUERY_ASSET_PAGE } from '@/api/modules/datasource/datasource.asset.api'

const QueryResParam = {
  resources: {},
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
    getAssetTypeText
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
        this.handlerGetBusinessType()
      }
    },
    handlerSelectBusinessType () {
      this.clearResOptions()
      switch (this.queryResParam.businessType) {
        case BusinessType.ASSET:
          this.getAssetInstance()
          break
        default:
      }
    },
    handlerGetAssetType () {
      this.clearResOptions()
      this.assetTypeOptions = []
      const obj = DsInstanceAssetType[this.queryResParam.dsInstance.instanceType]
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
    },
    handlerGetResources (queryName) {
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
    handlerBindResources () {
      const requestBody = {
        applicationId: this.application.id,
        name: this.queryResParam.resources.name,
        businessId: this.queryResParam.resources.id,
        businessType: this.queryResParam.businessType
      }
      switch (this.queryResParam.businessType) {
        case BusinessType.SERVER:
          requestBody.resourceType = 'SERVER'
          break
        case BusinessType.SERVERGROUP:
          requestBody.resourceType = 'SERVERGROUP'
          break
        case BusinessType.ASSET:
          requestBody.resourceType = this.queryResParam.resources.assetType
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
    handlerGetBusinessType () {
      GET_TAG_BUSINESS_OPTIONS()
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
      QUERY_APPLICATION_BY_ID({ applicationId: this.application.id })
        .then(({ body }) => {
          this.application.resourceMap = body.resourceMap ? body.resourceMap : {}
        })
    },
    handlerBuildKey () {
      this.application.applicationKey = this.application.name.toUpperCase()
    },
    handlerResBind () {
      BIND_APPLICATION_RES()
        .then(() => {
          this.$message.success('绑定成功')
          this.getApplicationResource()
        })
    },
    handlerResUnbind (id) {
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
    handlerSave () {
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
.resDiv {
  .el-tag {
    margin-right: 5px;
  }
}

.input {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.select {
  max-width: 200px;
  width: 200px;
  margin-left: 5px;
}

.button {
  margin-left: 5px;
}
</style>
