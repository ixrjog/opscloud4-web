<template>
  <div>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-tag style="margin-right: 5px" size="small">{{ instance.instanceType }}</el-tag>
        <span style="font-size: 14px">{{instance.instanceName}}</span>
        <el-button style="float: right; padding: 3px 0" type="text"><i class="fa fa-cogs"></i></el-button>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlerTagEdit"><i class="fa fa-tag"></i></el-button>
      </div>
      <business-tags :tags="instance.tags"></business-tags>
    </el-card>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id" :form-status="formStatus.businessTag"></business-tag-editor>
  </div>
</template>

<script>
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import BusinessTags from '../common/tag/BusinessTags'

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
    BusinessTagEditor,
    BusinessTags
  },
  methods: {
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
  .el-input {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .el-select {
    margin-left: 5px;
  }

  .el-button {
    margin-left: 5px;
  }

  >>> .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

</style>
