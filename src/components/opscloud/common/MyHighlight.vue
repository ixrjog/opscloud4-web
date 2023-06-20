<!--suppress HtmlUnknownTag -->
<template>
  <pre class="my-highlight hljs" v-html="highlightHTML" :style="myStyle"></pre>
</template>

<script>
// 相关文档
// https://highlightjs.org/usage/
// http://highlightjs.readthedocs.io/en/latest/api.html#configure-options
import highlight from 'highlight.js'
import htmlFormat from '../../d2-highlight/libs/htmlFormat'
//import 'highlight.js/styles/vs2015.css'
import 'highlight.js/styles/github-gist.css'
// import '../../d2-highlight/libs/style.github.css'
// import 'highlight.js/scss/atom-one-light.scss'

export default {
  name: 'my-highlight',
  props: {
    code: {
      type: String,
      required: false,
      default: ''
    },
    formatHtml: {
      type: Boolean,
      required: false,
      default: false
    },
    lang: {
      type: String,
      required: false,
      default: ''
    },
    myStyle: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data () {
    return {
      highlightHTML: ''
    }
  },
  mounted () {
    this.highlight()
  },
  watch: {
    code () {
      this.highlight()
    }
  },
  methods: {
    highlight () {
      const code = this.formatHtml ? htmlFormat(this.code) : this.code
      this.highlightHTML = highlight.highlightAuto(code, [
        this.lang,
        'xml',
        'html',
        'javascript',
        'json',
        'css',
        'scss',
        'less'
      ]).value
    }
  }
}
</script>

<style lang="scss" scoped>

.my-highlight {
  margin: 0px;
  border-radius: 4px;
  font-size: 10px;
  background: #f3f3f3 !important;
  //background-color: #dad8c8;
  line-height: 110%;
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #383a42;
}

</style>
