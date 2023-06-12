<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <document-zone mount-zone="SSH-SERVER"/>
  </d2-container>
</template>

<script>

import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  name: 'ssh-server',
  data () {
    return {
    }
  },
  components: {
    DocumentZone
  },
  mounted () {

  },
  methods: {
  }
}
</script>

<style scoped>

</style>
