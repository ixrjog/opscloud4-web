<template>
  <el-dialog :title="formStatus.title"
             :visible.sync="formStatus.visible">
    <el-tag style="margin-bottom: 10px">{{ ago }}</el-tag>
    <d2-highlight :code="log" lang="yaml"></d2-highlight>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

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
  components: {},
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
