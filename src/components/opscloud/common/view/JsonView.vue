<!--suppress HtmlUnknownTag -->
<template>
 <div>
   <el-popover placement="right" trigger="hover">
     <i class="far fa-comment-alt" slot="reference" style="color: #0da815"/>
     <my-highlight v-if="jsonContent !== ''" :code="JSON.stringify(JSON.parse(jsonContent),null,'    ')" lang="json"/>
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
    jsonContent: {
      type: String,
      required: true,
      default: '{}'
    }
  },
  name: 'JsonView',
  computed: {},
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">

</style>
