<template>
  <d2-container>
    <div>
      <div>
        <h1>{{ title }}</h1>
      </div>
      <ser-deploy-task-card/>
    </div>
  </d2-container>
</template>

<script>

import SerDeployTaskCard from '@/components/opscloud/ser/SerDeployTaskCard'

export default {
  name: 'index',
  data () {
    return {
      title: 'Ser 包发布',
      applicationId: '',
      applicationOptions: []
    }
  },
  filters: {},
  computed: {},
  mounted () {
  },
  components: {
    SerDeployTaskCard
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
