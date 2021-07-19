<template>
  <d2-container>
    <el-row :gutter="20" v-show="!layout.status">
      <el-col :span="18">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>应用列表</span>
          </div>
          <application-kubernetes-selector></application-kubernetes-selector>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import util from '@/libs/util'
import ApplicationKubernetesSelector
  from '../../../components/opscloud/terminal/kubernetes/ApplicationKubernetesSelector'

export default {
  name: 'RemoteDesktop',
  data () {
    return {
      layout: {
        status: false // true开启远程
      }
    }
  },
  components: {
    ApplicationKubernetesSelector
  },
  mounted () {
  },
  methods: {
    handleLogout () {
      this.$nextTick(() => {

      })
    }
  }
}
</script>

<style>
.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
