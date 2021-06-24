<template>
  <div>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-tag style="margin-right: 5px" size="small">{{ instance.instanceType }}</el-tag>
        <span style="font-size: 14px">{{ instance.instanceName }}</span>
        <el-button type="text" icon="fa fa-cogs" @click="handlerOpen"></el-button>
        <el-button type="text" icon="fa fa-tag" @click="handlerTagEdit"></el-button>
      </div>
      <el-row>
        <el-col :span="18">
          <ds-asset-types :assetDetails="instance.assetDetails"></ds-asset-types>
        </el-col>
        <el-col :span="6">
          <business-tags :tags="instance.tags" :is-block=true></business-tags>
        </el-col>
      </el-row>
    </el-card>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType"
                         :business-id="instance.id" :form-status="formStatus.businessTag"></business-tag-editor>
  </div>
</template>

<script>
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import BusinessTags from '../common/tag/BusinessTags'
import DsAssetTypes from './common/DsAssetTypes'

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
    BusinessTags
  },
  methods: {
    handlerOpen () {
      this.$router.push({
        path: '/datasource/instance/' + this.instance.instanceType.toLocaleLowerCase() + '?id=' + this.instance.id
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

<style scoped>
.el-button {
  float: right;
  padding: 3px;
}

.el-card {
  height: 200px;
  margin-bottom: 10px;
}
</style>
