<template>
  <span>
    <span v-for="index of replicas" :key="index">
         <i class="fab fa-unity replicas"/>
     <span v-if="index % 5 === 0" style="margin-right: 3px"/>
    </span> x{{ replicas }}
  </span>
</template>

<script>

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
  name: 'DeploymentReplicas'
}
</script>

<style scoped>

.replicas {
  color: #0da815;
  margin-right: -2px
}

</style>
