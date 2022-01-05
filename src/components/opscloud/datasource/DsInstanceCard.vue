<template>
  <div>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-tag style="margin-right: 5px" size="small">{{ instance.instanceType }}</el-tag>
        <my-span :content="instance.instanceName" style="font-size: 14px"></my-span>
        <el-button type="text" @click="handlerOpen">
          <i class="fas fa-paper-plane"></i>
        </el-button>
        <el-button type="text" @click="handlerTagEdit">
          <i class="fas fa-tags"></i>
        </el-button>
        <el-button type="text" v-if="needSetDSConfig(instance.instanceType)" @click="handlerSetConfig">
          <i class="fas fa-file-import"></i>
        </el-button>
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
  </div>
</template>

<script>
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import BusinessTags from '../common/tag/BusinessTags'
import DsAssetTypes from './common/DsAssetTypes'
import { SET_CONFIG } from '@/api/modules/datasource/datasource.asset.api'
import DsInstanceIcon from '@/components/opscloud/datasource/common/DsInstanceIcon'
import MySpan from '@/components/opscloud/common/mySpan'

export default {
  name: 'DatasourceInstanceCard',
  props: ['instance'],
  data () {
    return {
      businessType: 16,
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑数据源实例标签'
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
    MySpan
  },
  methods: {
    handlerOpen () {
      this.$router.push({
        path: '/datasource/instance/' + this.instance.instanceType.toLocaleLowerCase() + '?id=' + this.instance.id + '&uuid=' + this.instance.uuid
      })
    },
    needSetDSConfig (instanceType) {
      if (instanceType === 'KUBERNETES') {
        return true
      }
      if (instanceType === 'ANSIBLE') {
        return true
      }
      return false
    },
    handlerSetConfig () {
      SET_CONFIG({
        instanceId: this.instance.id,
        instanceType: this.instance.instanceType
      }).then(() => {
        this.$message.success('推送完成')
      })
    },
    handlerTagEdit () {
      const businessTags = {
        tagIds: this.instance.tags !== null ? this.instance.tags.map(e => e.id) : []
      }
      this.$refs.businessTagEditor.initData(businessTags)
      this.formStatus.businessTag.visible = true
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
