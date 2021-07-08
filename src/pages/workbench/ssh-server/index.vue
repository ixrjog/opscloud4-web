<template>
  <d2-container>
    <markdown-it-vue v-if="doc !== null" :content="doc.content" :options="options"></markdown-it-vue>
  </d2-container>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
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
      },
      options: {
        markdownIt: {
          html: true,
          linkify: true
        }
      }
    }
  },
  components: {
    MarkdownItVue
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
@import "~markdown-it-vue/dist/markdown-it-vue.css";
@import '~@fortawesome/fontawesome-free/css/all.min.css';
</style>
