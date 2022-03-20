<template>
  <span :style="mySpanStyle">{{ content }}</span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      mySpanStyle: ''
    }
  },
  props: {
    content: {
      type: String,
      required: true,
      default: ''
    }
  },
  name: 'MySpan',
  computed: {
    ...mapState('d2admin/color', [
      'value'
    ])
  },
  mounted () {
    this.initStyle()
  },
  watch: {
    value () {
      this.initStyle()
    }
  },
  methods: {
    initStyle () {
      this.mySpanStyle = Object.assign({}, {
        color: this.value
      })
    }
  }
}
</script>

<style scoped>

</style>
