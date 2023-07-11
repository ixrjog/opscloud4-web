<template>
  <div class="serCardDiv">
    <el-card v-for="ser in currentSerList" class="serCard" :style="isLastHalfHour(ser)">
      <p>包名
        <span>{{ ser.serName }}</span>
      </p>
      <p>MD5
        <span>{{ ser.serMd5 }}</span>
      </p>
      <p>大小
        <span>{{ ser.serSize }}</span>
      </p>
      <p>最后更新时间
        <span>{{ ser.lastModified }}</span>
      </p>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'SerSimpleCard',
  props: {
    currentSerList: {
      type: Array,
      required: true
    }
  },
  methods: {
    isLastHalfHour (ser) {
      if (ser.isLastHalfHour) {
        return 'border: 2px solid #e56c0d'
      }
      return ''
    }
  }
}
</script>

<style scoped lang="less">

.serCardDiv {

  .serCard {
    position: relative;
    float: left;
    max-width: 350px;
    text-align: left;
    line-height: 1.5em;
    margin-right: 5px;
    margin-bottom: 5px;

    /deep/ .el-card__body {
      padding: 8px;
    }

    p {
      font-size: 8px;
      margin: 0;
      color: #9d9fa3;
    }

    span {
      margin-left: 10px;
      float: right;
      color: #303133;
    }

  }
}
</style>
