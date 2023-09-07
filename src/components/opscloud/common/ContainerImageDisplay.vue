<!--suppress HtmlUnknownTag -->
<template>
  <span>
  <el-tooltip class="item" effect="dark" :content="image | toContainerRegistry" placement="top-end">
    <span class="cr">[CR]</span>
  </el-tooltip>
    <span>{{image | toContainerRegistryPath}}</span>
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

<style scoped>

.cr {
  border-radius: 4px;
  padding: 0 5px 0 5px;
  color: white;
  background: #000000;
  background: -webkit-linear-gradient(to right, #4a984e, #6bfdb8);
  background: linear-gradient(to right, #4a984e, #6bfdb8);
}

</style>
