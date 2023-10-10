<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import util from '@/libs/util'
import ui from '@/libs/util.ui'
export default {
  name: 'app',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
      ui.init(this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
@import '~@fortawesome/fontawesome-free/css/all.min.css';
</style>
