<template>
  <div>
    <span class="name">{{ name }}</span>
    <span class="value">
      <span v-if="!copy">{{ value }}</span>
      <span v-else v-clipboard:copy="value" v-clipboard:success="onCopy"
            v-clipboard:error="onError">{{ value }}</span>
      <span v-if="unit !== undefined && unit !== null"> {{ unit }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'EntryDetail',
  props: {
    name: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: String,
      required: true,
      default: ''
    },
    unit: {
      type: String,
      required: false,
      default: ''
    },
    copy: {
      type: Boolean,
      required: false,
      default: false
    }
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

<style scoped>

.name {
  float: left;
  color: #8492a6;
  font-size: 12px;
}

.value {
  float: right;
  font-size: 12px;
}
</style>
