<template>
  <el-row>
    <span class="tag-group">
    <span v-for="item in tags" :key="item.id" :style="spanStyle">
      <el-tooltip class="item" effect="light" :content="item.comment === '' ? '未定义': item.comment"
                  placement="top-start">
        <el-tag style="margin-left: 3px;margin-bottom: 3px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
      </el-tooltip>
    </span>
  </span>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      spanStyle: ''
    }
  },
  name: 'BusinessTags',
  props: {
    tags: {
      type: Array,
      required: true
    },
    isBlock: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.isBlock) {
        this.spanStyle = 'display: block'
      }
    }
  }
}
</script>

<style scoped>

</style>
