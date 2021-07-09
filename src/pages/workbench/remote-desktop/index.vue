<template>
  <d2-container>
    <el-col :span="16">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>服务器列表</span>
        </div>
        <remote-server-selector>
        </remote-server-selector>
      </el-card>
    </el-col>
  </d2-container>
</template>

<script>


import RemoteServerSelector from '../../../components/opscloud/server/RemoteServerSelector'

export default {
  name: 'RemoteDesktop',
  data () {
    return {
      doc: null
    }
  },
  components: {
    RemoteServerSelector
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
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
