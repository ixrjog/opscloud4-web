<template>
  <div>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-tag style="margin-right: 5px" size="mini">{{ instance.instanceType }}</el-tag>
        <my-span :content="instance.instanceName" style="font-size: 14px"></my-span>
        <el-tooltip class="item" effect="dark" content="实例资产详情" placement="top-start">
          <el-button type="text" @click="handleOpen">
            <i class="far fa-paper-plane"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="实例标签" placement="top-start">
          <el-button type="text" @click="handleTagEdit">
            <i class="far fa-bookmark"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下发配置文件" placement="top-start">
          <el-button type="text" v-if="needSetDSConfig(instance.instanceType)" @click="handleSetConfig">
            <i class="far fa-clipboard"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="实例配置文件" placement="top-start">
          <el-button type="text" @click="handleEditor">
            <i class="far fa-sun"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="实例配置" placement="top-start">
          <el-button type="text" @click="handleRegistered">
            <i class="far fa-id-card"></i>
          </el-button>
        </el-tooltip>
      </div>
      <el-row v-if="JSON.stringify(instance.tags) !== '[]'">
        <el-col :span="18">
          <ds-asset-types :assetDetails="instance.assetDetails"></ds-asset-types>
        </el-col>
        <el-col :span="6">
          <business-tags :tags="instance.tags" :is-block=true></business-tags>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col>
          <ds-asset-types :assetDetails="instance.assetDetails"></ds-asset-types>
        </el-col>
      </el-row>
      <ds-instance-icon :is-active="instance.isActive" :instance-type="instance.instanceType"
                        class="position"></ds-instance-icon>
    </el-card>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType"
                         :business-id="instance.id" :form-status="formStatus.businessTag"></business-tag-editor>
    <ds-config-editor :form-status="formStatus.config"
                      :ds-type-options="dsTypeOptions"
                      :active-options="activeOptions"
                      ref="dsConfigEditor"></ds-config-editor>
    <ds-instance-register-editor :form-status="formStatus.instance"
                                 :ds-type-options="dsTypeOptions"
                                 :active-options="activeOptions"
                                 ref="dsInstanceRegisterEditor"></ds-instance-register-editor>
  </div>
</template>

<script>
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import BusinessTags from '../common/tag/BusinessTags'
import DsAssetTypes from './common/DsAssetTypes'
import { SET_CONFIG } from '@/api/modules/datasource/datasource.asset.api'
import DsInstanceIcon from '@/components/opscloud/datasource/common/DsInstanceIcon'
import MySpan from '@/components/opscloud/common/MySpan'
import DsConfigEditor from '@/components/opscloud/datasource/DsConfigEditor'
import {
  GET_DATASOURCE_CONFIG_TYPE_OPTIONS,
  QUERY_DATASOURCE_BY_ID
} from '@/api/modules/datasource/datasource.config.api'
import DsInstanceRegisterEditor from '@/components/opscloud/datasource/DsInstanceRegisterEditor'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  name: 'DatasourceInstanceCard',
  props: ['instance'],
  data () {
    return {
      businessType: 16,
      dsTypeOptions: [],
      activeOptions: activeOptions,
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑数据源实例标签'
        },
        config: {
          visible: false,
          updateTitle: '更新数据源配置',
          operationType: true
        },
        instance: {
          visible: false,
          updateTitle: '更新数据源实例配置',
          operationType: true
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  components: {
    DsAssetTypes,
    BusinessTagEditor,
    BusinessTags,
    DsInstanceIcon,
    DsConfigEditor,
    DsInstanceRegisterEditor,
    MySpan
  },
  methods: {
    handleOpen () {
      this.$router.push({
        path: '/datasource/instance/' + this.instance.instanceType.toLocaleLowerCase() + '?id=' + this.instance.id + '&uuid=' + this.instance.uuid
      })
    },
    needSetDSConfig (instanceType) {
      switch (instanceType) {
        case 'KUBERNETES':
          return true
        case 'ANSIBLE':
          return true
        default:
          return false
      }
    },
    handleSetConfig () {
      SET_CONFIG({
        instanceId: this.instance.id,
        instanceType: this.instance.instanceType
      }).then(() => {
        this.$message.success('推送完成')
      })
    },
    handleTagEdit () {
      const businessTags = {
        tagIds: this.instance.tags !== null ? this.instance.tags.map(e => e.id) : []
      }
      this.$refs.businessTagEditor.initData(businessTags)
      this.formStatus.businessTag.visible = true
    },
    getDsTypeOptions () {
      GET_DATASOURCE_CONFIG_TYPE_OPTIONS()
        .then(res => {
          this.dsTypeOptions = res.body.options
        })
    },
    handleEditor () {
      this.getDsTypeOptions()
      QUERY_DATASOURCE_BY_ID({ configId: this.instance.configId })
        .then(({ body }) => {
          this.$refs.dsConfigEditor.initData(Object.assign({}, body))
          this.formStatus.config.operationType = false
          this.formStatus.config.visible = true
        })
    },
    handleRegistered () {
      this.getDsTypeOptions()
      QUERY_DATASOURCE_BY_ID({ configId: this.instance.configId })
        .then(({ body }) => {
          const datasource = {
            config: body,
            instance: this.instance
          }
          this.$refs.dsInstanceRegisterEditor.initData(datasource)
          this.formStatus.instance.operationType = false
          this.formStatus.instance.visible = true
        })

    }
  }
}
</script>

<style lang="less" scoped>
.el- {
  &button {
    float: right;
    margin-left: 5px;
  }

  &card {
    margin-bottom: 10px;
    position: relative;

    /deep/ .el-card__body {
      padding: 10px;
    }

    .position {
      position: absolute;
      right: 0;
      bottom: 10%;
      left: 0;
      margin: auto;
      opacity: 0.3;
    }
  }
}
</style>
