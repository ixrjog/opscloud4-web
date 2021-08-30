<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="handleClose">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本配置" name="config" v-if="assetSubscription.id === ''">
        <el-form :model="assetSubscription" label-width="150px">
          <el-form-item label="数据源类型" :label-width="labelWidth" required>
            <el-select v-model="instanceQueryParam.instanceType" placeholder="选择类型">
              <el-option
                v-for="item in dsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源实例" :label-width="labelWidth" required>
            <el-select v-model.trim="instance" filterable clearable :disabled="instanceQueryParam.instanceType === ''"
                       @change="getAsset('')"
                       remote reserve-keyword placeholder="搜索实例" :remote-method="getInstance" @clear="getInstance('')">
              <el-option
                v-for="item in dsInstanceOptions"
                :key="item.uuid"
                :label="item.instanceName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订阅资产" :label-width="labelWidth" required>
            <el-select v-model.trim="asset" filterable clearable :disabled="instance === ''"
                       remote reserve-keyword placeholder="搜索资产" :remote-method="getAsset" @clear="getAsset('')">
              <el-option
                v-for="item in dsAssetOptions"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="assetSubscription.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="剧本(Playbook)" name="playbook" :disabled="assetSubscription.id === ''">
        <el-form :model="assetSubscription">
          <el-form-item label="PLAYBOOK(YML)" label-position="top">
            <br/>
            <d2-highlight v-if="!editing" :code="assetSubscription.playbook" lang="yaml"></d2-highlight>
            <editor v-if="editing" v-model="assetSubscription.playbook" @init="editorInit" lang="yaml" theme="chrome"
                    height="250"
                    :options="options" ref="editor"></editor>
          </el-form-item>
          <el-form-item label="VARS" label-position="top">
            <br/>
            <d2-highlight v-if="!editing" :code="assetSubscription.vars" lang="yaml"></d2-highlight>
            <editor v-if="editing" v-model="assetSubscription.vars" @init="editorInit" lang="yaml" theme="chrome"
                    height="80"
                    :options="options" ref="editor"></editor>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑属性</el-button>
          <el-button size="mini" type="primary" @click="handleUpdate" v-show="editing">保存属性</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">关闭</el-button>
      <el-button size="mini" type="primary" v-if="assetSubscription.id === ''" @click="handleAdd">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import BusinessType from '@/components/opscloud/common/enums/business.type'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import { QUERY_ASSET_PAGE } from '@/api/modules/datasource/datasource.asset.api'
import {
  ADD_ASSET_SUBSCRIPTION, UPDATE_ASSET_SUBSCRIPTION
} from '@/api/modules/datasource/datasource.asset.subscription.api.js'


const dsTypeOptions = [{
  value: 'ANSIBLE',
  label: 'ANSIBLE'
}]

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  data () {
    return {
      activeName: 'config',
      labelWidth: '150px',
      dsTypeOptions: dsTypeOptions,
      assetSubscription: {},
      businessTypeOptions: [],
      businessType: BusinessType,
      queryParam: {
        resources: '',
        dsInstance: {},
        assetType: '',
        businessType: ''
      },
      instanceQueryParam: {
        instanceType: 'ANSIBLE',
        isActive: true,
        extend: true
      },
      assetQueryParam: {
        instanceId: '',
        assetType: '',
        isActive: true,
        extend: true
      },
      instance: '',
      dsInstanceOptions: [],
      asset: '',
      dsAssetOptions: [],
      options: options,
      editing: false
    }
  },
  name: 'AssetSubscriptionEditor',
  props: ['formStatus'],
  components: {
    editor: require('vue2-ace-editor')
  },
  filters: {},
  mounted () {
  },
  methods: {
    editorInit: function () {
      // language extension prerequsite...
      require('brace/ext/language_tools')
      // language
      require('brace/mode/yaml')
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
    },
    initData (assetSubscription) {
      this.assetSubscription = assetSubscription
      if (this.assetSubscription.id === '') {
        this.activeName = 'config'
        this.instance = ''
        this.dsInstanceOptions = []
        this.asset = ''
        this.dsAssetOptions = []
        this.getInstance('')
      } else {
        this.editing = false
        this.activeName = 'playbook'
      }
    },
    handleClick (tab, event) {
    },
    getInstance () {
      QUERY_DATASOURCE_INSTANCE(this.instanceQueryParam)
        .then(({ body }) => {
          this.dsInstanceOptions = body
        })
    },
    getAsset (queryName) {
      if (this.instance === '') return
      const requestBody = {
        instanceId: this.instance.id,
        assetType: 'ANSIBLE_HOSTS',
        queryName: queryName,
        isActive: true,
        extend: true,
        page: 1,
        length: 20
      }
      QUERY_ASSET_PAGE(requestBody)
        .then(({ body }) => {
          this.dsAssetOptions = body.data
        })
    },
    handleEditing () {
      this.editing = true
    },
    handleClose () {
      this.formStatus.visible = false
      this.$emit('close')
    },
    handleAdd () {
      let requestBody = Object.assign({}, this.assetSubscription)
      requestBody.instanceUuid = this.instance.uuid
      requestBody.datasourceInstanceAssetId = this.asset.id
      ADD_ASSET_SUBSCRIPTION(requestBody)
        .then(() => {
          this.$message.success('成功')
          this.handleClose()
        })
    },
    handleUpdate () {
      let requestBody = Object.assign({}, this.assetSubscription)
      UPDATE_ASSET_SUBSCRIPTION(requestBody)
        .then(() => {
          this.$message.success('成功')
          this.editing = false
        })

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
  .d2-highlight {
    margin-top: 5px;
    font-size: 10px;
    background-color: #dad8c8;
    line-height: 150%;
  }

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
