<!--suppress HtmlUnknownTag -->
<template>
  <span>
    <el-tag v-if="!simple && properties['env.java.opts.tag'] !== undefined" size="mini">
      <i class="fab fa-java" style="margin-right: 5px" v-if="false"/>
      <img class="javaLogo" src="@/static/logo/java-icon.svg" alt="">
      <span>{{ properties['env.java.opts.tag'] }}</span>
      <el-popover placement="right" trigger="hover">
        <i class="el-icon-info" style="color: green; margin-left: 5px" slot="reference"/>
        <b>JAVA_OPTS</b>
        <el-divider/>
        <my-highlight :code="properties['env.java.opts']" lang="bash"/>
    </el-popover>

    </el-tag>
  </span>
</template>

<script>

import MyHighlight from '@/components/opscloud/common/MyHighlight.vue'

export default {
  name: 'DeploymentEnvJavaOpts',
  components: { MyHighlight },
  props: {
    properties: {
      type: Object,
      required: true,
      default: () => ({})
    },
    simple: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      CPU: 'cpu',
      Memory: 'mem'
    }
  }
}
</script>

<style scoped>

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 12px 0;
}

.javaLogo {
  display: inline-block;
  vertical-align: middle;
  height: 17px;
  margin-top: -4px;
}

</style>
