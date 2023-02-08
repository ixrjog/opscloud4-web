<template>
  <d2-container>
    <h1>运维文档</h1>
    <document-zone mount-zone="OPS_DOCS"></document-zone>
  </d2-container>
</template>

<script>

import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  data () {
    return {
      activeName: ''
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
