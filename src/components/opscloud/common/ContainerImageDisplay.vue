<!--suppress HtmlUnknownTag -->
<template>
  <span>
  <el-tooltip class="item" effect="dark" :content="image | toContainerRegistry" placement="top-end">
    <el-tag size="mini">CR</el-tag>
  </el-tooltip>
    <span style="margin-left: 1px">{{image | toContainerRegistryPath}}</span>
  </span>
</template>

<script>

import { toContainerRegistryPath, toContainerRegistry } from '@/filters/container.registry'

export default {
  data () {
    return {}
  },
  props: {
    image: {
      type: String,
      required: true,
      default: 'Null'
    }
  },
  name: 'ContainerImageDisplay',
  computed: {},
  mounted () {
  },
  filters: {
    toContainerRegistry, toContainerRegistryPath
  },
  methods: {
    toContainerRegistry (image) {
      this.$message.success('内容已复制到剪切板！')
    }
  }
}
</script>

<style scoped lang="less">

</style>
