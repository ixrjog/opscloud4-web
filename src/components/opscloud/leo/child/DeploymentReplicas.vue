<template>
  <span>
    <span v-for="index of replicas" :key="index">
     <i class="fas fa-square" :style="replicasStyle"/>
     <span v-if="index % 5 === 0" style="margin-right: 2px"/>
    </span> x{{ replicas }}
  </span>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      replicasStyle: ''
    }
  },
  props: {
    replicas: {
      type: Number,
      required: true,
      default: 0
    }
  },
  name: 'DeploymentReplicas',
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
      this.replicasStyle = Object.assign({}, {
        color: this.value,
        marginRight: '1px'
      })
    }
  }
}
</script>

<style scoped>

</style>
