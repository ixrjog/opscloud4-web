<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-popover placement="right" trigger="hover">
      <i class="far fa-comment-alt" slot="reference" style="color: #0da815"/>
      <my-highlight v-if="yamlContent !== ''" :code="yamlContent" lang="yaml"/>
    </el-popover>
  </div>
</template>

<script>

import MyHighlight from '@/components/opscloud/common/MyHighlight.vue'

export default {
  components: { MyHighlight },
  data () {
    return {}
  },
  props: {
    yamlContent: {
      type: String,
      required: true,
      default: ''
    }
  },
  name: 'YamlView',
  computed: {},
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">

</style>
