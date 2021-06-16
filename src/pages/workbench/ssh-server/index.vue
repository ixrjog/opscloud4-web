<template>
  <d2-container>
    <d2-markdown v-if="doc !== null" :source="doc.content" highlight/>
  </d2-container>
</template>

<script>

// import doc from '@/static/md/ssh-server.md'
import Highlight from '@/components/d2-highlight'

import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const documentKey = 'SSH_SERVER_README'

export default {
  name: 'index',
  data () {
    return {
      doc: null,
      documentKey: documentKey,
      dict: {
        sshServerHost: window.location.hostname
      }
    }
  },
  components: {
    Highlight
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const requestBody = {
        dict: this.dict,
        documentKey: this.documentKey
      }
      PREVIEW_DOCUMENT(requestBody)
        .then(res => {
          this.doc = res.body
        })
    }
  }
}
</script>

<style scoped>

</style>
