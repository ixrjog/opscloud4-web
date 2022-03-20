<template>
  <markdown-it-vue :content="content"></markdown-it-vue>
</template>

<script>

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

import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import 'highlight.js/scss/default.scss'
import 'highlight.js/styles/vs2015.css'

export default {
  name: 'MyMarkdown',
  props: ['content'],
  data () {
    return {
      options: options
    }
  },
  components: {
    MarkdownItVue
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
