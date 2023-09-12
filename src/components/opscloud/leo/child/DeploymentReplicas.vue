<template>
  <span>
    <span v-for="index of replicas" :key="index">
<!--      <i class="fab fa-codepen" :style="replicasStyle"/>-->
         <i class="fab fa-unity replicas"/>
     <span v-if="index % 5 === 0" style="margin-right: 3px"/>
    </span> x{{ replicas }}
  </span>
</template>

<script>

//import { mapState } from 'vuex'

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
    // ...mapState('d2admin/color', [
    //   'value'
    // ])
  },
  mounted () {
   // this.initStyle()
  },
  watch: {
    // value () {
    //   this.initStyle()
    // }
  },
  methods: {
    // initStyle () {
    //   this.replicasStyle = Object.assign({}, {
    //     color: this.value,
    //     marginRight: '-2px'
    //   })
    // }
  }
}
</script>

<style scoped>

.replicas {
  color: #0da815;
  margin-right: -2px
}

</style>
