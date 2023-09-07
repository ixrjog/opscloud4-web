<template>
  <span>
      <span :style="style">{{ cluster === '' ? '' : cluster + ':' }}{{namespace === '' ? '' : namespace + ':'}}{{ deployment }}</span>
  </span>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      style: '',
      name: ''
    }
  },
  props: {
    cluster: {
      type: String,
      required: true,
      default: ''
    },
    namespace: {
      type: String,
      required: true,
      default: ''
    },
    deployment: {
      type: String,
      required: true,
      default: ''
    }
  },
  name: 'DeploymentName',
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
      this.style = Object.assign({}, {
        color: this.value,
        marginRight: '5px'
      })
    }
  }
}
</script>

<style scoped>

</style>
