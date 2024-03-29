<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
<!--        <el-tag style="margin-right: 5px" size="mini" v-if="false">{{ instance.instanceType }}</el-tag>-->
        <my-span :content="instance.instanceName" style="font-size: 14px"/>
        <el-tag class="versionTag" size="mini"  v-if="instance.version !== null && instance.version !== ''">{{ instance.version }}</el-tag>
        <el-tag v-if="instance.isActive" class="activeTag"><i class="fab fa-apple"/></el-tag>
        <el-tag v-if="!instance.isActive" class="inactiveTag"><i class="fas fa-ban"/></el-tag>
        <el-tag v-if="instance.jobSize > 0" class="jobTag"><i class="fas fa-recycle"/>{{ instance.jobSize }}</el-tag>
        <span class="btn-group">
          <el-tooltip class="item" effect="dark" content="实例任务" placement="top-start">
          <el-button type="text" @click="handleSchedule">
            <i class="fas fa-play"/>
          </el-button>
        </el-tooltip>
          <el-tooltip class="item" effect="dark" content="实例配置" placement="top-start">
          <el-button type="text" @click="handleRegistered">
            <i class="fas fa-edit"/>
          </el-button>
        </el-tooltip>
          <el-tooltip class="item" effect="dark" content="实例配置文件" placement="top-start">
          <el-button type="text" @click="handleEditor">
            <i class="fab fa-instalod"/>
          </el-button>
        </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下发配置文件" placement="top-start">
          <el-button type="text" v-if="needSetDSConfig(instance.instanceType)" @click="handleSetConfig">
            <i class="fas fa-file-export"/>
          </el-button>
        </el-tooltip>
          <el-tooltip class="item" effect="dark" content="实例标签" placement="top-start">
          <el-button type="text" @click="handleTagEdit">
            <i class="fas fa-tag"/>
          </el-button>
        </el-tooltip>
          <el-tooltip class="item" effect="dark" content="实例资产详情" placement="top-start">
          <el-button type="text" @click="handleOpen">
            <i class="fas fa-list-ul"/>
          </el-button>
        </el-tooltip>
        </span>
      </div>
      <el-row v-if="JSON.stringify(instance.tags) !== '[]'">
        <el-col :span="18">
          <ds-asset-types :assetDetails="instance.assetDetails"/>
        </el-col>
        <el-col :span="6">
          <business-tags :tags="instance.tags" :is-block=true />
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col>
          <ds-asset-types :assetDetails="instance.assetDetails"/>
        </el-col>
      </el-row>
      <ds-instance-icon :is-active="instance.isActive" :instance-type="instance.instanceType"
                        class="position"/>
    </el-card>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType"
                         :business-id="instance.id" :form-status="formStatus.businessTag"/>
    <ds-config-editor :form-status="formStatus.config"
                      :ds-type-options="dsTypeOptions"
                      :active-options="activeOptions"
                      ref="dsConfigEditor"/>
    <ds-instance-register-editor :form-status="formStatus.instance"
                                 :ds-type-options="dsTypeOptions"
                                 :active-options="activeOptions"
                                 ref="dsInstanceRegisterEditor"/>
    <ds-instance-schedule-editor :form-status="formStatus.schedule"
                                 ref="dsInstanceScheduleEditor"/>
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
import DsInstanceScheduleEditor from '@/components/opscloud/datasource/DsInstanceScheduleEditor'

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
        },
        schedule: {
          visible: false
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
    MySpan,
    DsInstanceScheduleEditor
  },
  methods: {
    handleOpen () {
      let basePath
      if (this.instance.instanceType === 'ALIYUN_DEVOPS') {
        basePath = 'devops'
      } else if (this.instance.instanceType === 'METER_SPHERE') {
        basePath = 'metersphere'
      } else if (this.instance.instanceType === 'ALIYUN_EVENTBRIDGE') {
          basePath = 'eventbridge'
      } else if (this.instance.instanceType === 'ALIYUN_ARMS') {
        basePath = 'arms'
      } else {
        basePath = this.instance.instanceType.toLocaleLowerCase()
      }
      this.$router.push({
        path: '/datasource/instance/' + basePath + '?id=' + this.instance.id + '&uuid=' + this.instance.uuid
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
    },
    handleSchedule () {
      this.$refs.dsInstanceScheduleEditor.initData(this.instance)
      this.formStatus.schedule.visible = true
    }
  }
}
</script>

<style lang="less" scoped>

.versionTag {
  margin-left: 5px;
  color: white;
  background-color: #00a2d4;
}

.activeTag {
  margin-left: 5px;
  color: white;
  background-color: #09a104;
}

.inactiveTag {
  margin-left: 5px;
  color: white;
  background-color: #ee4061;
}

.jobTag {
  margin-left: 5px;
  color: white;
  background-color: #00a2d4;
}

.btn-group {
  float: right;
  margin-left: 5px;
}

.el- {
  &card {
    margin-bottom: 10px;
    position: relative;

    /deep/ .el-card__body {
      padding: 10px;
    }

    .position {
      position: absolute;
      bottom: 5%;
      right: 3%;
      opacity: 0.8;
    }
  }
}
</style>
