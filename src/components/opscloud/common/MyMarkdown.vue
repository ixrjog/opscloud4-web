<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <markdown-it-vue class="md-body" :content="content" :options="options"/>
  </div>
</template>

<script>

import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import 'markdown-it-vue/dist/markdown-it-vue.css'
// import 'highlight.js/scss/default.scss'
// import 'highlight.js/styles/vs2015.css'
// import 'highlight.js/styles/github-gist.css'
import 'highlight.js/styles/gradient-dark.css'


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

<style scoped>

.md-body >>> pre {
  /*控制代码不换行*/
  white-space: pre;
  word-wrap: normal;
  background: #090909 !important;
  border-radius: 4px;
  font-size: 9px;
}

>>> .markdown-body {
  font-size: 10px;
  line-height: 110%;
  padding: 0.6em;
}

</style>
