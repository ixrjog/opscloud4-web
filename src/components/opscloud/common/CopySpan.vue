<!--suppress HtmlUnknownTag -->
<template>
  <div style="display: inline-block">
    <span v-if="showIcon" class="copyClass">
      <span>{{ content }}</span>
      <span v-clipboard:copy="content" v-clipboard:success="onCopy"
            v-clipboard:error="onError">
        <i style="margin-left: 5px" class="el-icon-copy-document"></i>
      </span>
    </span>
    <span v-else>
    <el-tooltip class="item" effect="dark" content="点击复制" placement="top-end">
      <span v-clipboard:copy="content" v-clipboard:success="onCopy"
            v-clipboard:error="onError">{{ content }}
      </span>
    </el-tooltip>
  </span>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    content: {
      type: String,
      required: true,
      default: ''
    },
    showIcon: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  name: 'CopySpan',
  computed: {},
  mounted () {
  },
  methods: {
    onCopy (e) {
      this.$message.success('内容已复制到剪切板！')
    },
    onError (e) {
      this.$message.error('抱歉，复制失败！')
    }
  }
}
</script>

<style scoped lang="less">
.copyClass i {
  font-size: 12px;
}
</style>
