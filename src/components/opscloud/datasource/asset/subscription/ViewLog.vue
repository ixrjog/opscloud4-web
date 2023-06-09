<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.title" :visible.sync="formStatus.visible">
    <el-tag style="margin-bottom: 10px" size="mini">{{ ago }}</el-tag>
    <my-highlight :code="log" lang="yaml"/>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

import MyHighlight from '@/components/opscloud/common/MyHighlight'

export default {
  name: 'ViewLog',
  props: ['formStatus'],
  data () {
    return {
      labelWidth: '150px',
      log: '',
      ago: ''
    }
  },
  components: {
    MyHighlight
  },
  filters: {},
  mounted () {
  },
  methods: {
    initData (log, ago) {
      this.log = log
      this.ago = ago
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
  }
}
</style>
