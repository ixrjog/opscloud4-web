<template>
  <d2-container>
    <markdown-it-vue v-if="doc !== null" :content="doc.content" :options="options"></markdown-it-vue>
  </d2-container>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import 'highlight.js/scss/default.scss'
import 'highlight.js/styles/vs2015.css'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const documentKey = 'SSH_SERVER_README'

const options = {
  markdownIt: {
    html: true,
    linkify: true
  },
  linkAttributes: {
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  },
  katex: {
    throwOnError: false,
    errorColor: '#cc0000'
  },
  icons: 'font-awesome',
  githubToc: {
    tocFirstLevel: 2,
    tocLastLevel: 3,
    tocClassName: 'toc',
    anchorLinkSymbol: '',
    anchorLinkSpace: false,
    anchorClassName: 'anchor',
    anchorLinkSymbolClassName: 'octicon octicon-link'
  },
  mermaid: {
    theme: 'default'
  },
  image: {
    hAlign: 'left',
    viewer: true
  }
}

export default {
  name: 'index',
  data () {
    return {
      doc: null,
      documentKey: documentKey,
      dict: {
        sshServerHost: window.location.hostname
      },
      options: options
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

<style>

pre {
  /*控制代码不换行*/
  white-space: pre;
  word-wrap: normal;
  background: #535353 !important;
  border-radius: 4px;
  font-size: 8px;
}

.markdown-body {
  font-size: 10px;
}

</style>
