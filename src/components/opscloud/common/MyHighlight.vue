<template>
  <div>
    <d2-highlight :style="myStyle" :code="code" :lang="lang"></d2-highlight>
  </div>
</template>

<script>

import 'highlight.js/scss/atom-one-light.scss'
// import 'highlight.js/styles/vs2015.css'

export default {
  name: 'MyHighlight',
  props: {
    code: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      required: true
    },
    myStyle: {
      type: Object,
      required: false,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.d2-highlight {
  font-size: 10px;
  background-color: #dad8c8;
  line-height: 110%;
}
</style>
