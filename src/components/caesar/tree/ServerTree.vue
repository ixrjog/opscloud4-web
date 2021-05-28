<template>
    <el-card style="margin-top: 5px" class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span><i class="fa fa-list" aria-hidden="true"></i></span>
        <el-tag style="float: right" disable-transitions>Size: {{ serverSize }}</el-tag>
      </div>
      <el-row>
        <el-input v-model="queryParam.name" placeholder="名称" style="display: inline-block; maxWidth: 200px;"/>
        <el-select v-model.trim="queryParam.serverGroupTypeId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getGroupType" :loading="loading">
          <el-option
            v-for="item in groupTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="fetchData" :loading="searching">查询</el-button>
      </el-row>
      <el-tree style="margin-top: 5px" :data="serverTree.tree" show-checkbox ref="myServerTree" node-key="id"></el-tree>
    </el-card>
</template>

<script>
// API
import { QUERY_SERVER_GROUP_TYPE_PAGE } from '@/api/modules/server/server.group.type.api.js'
import { QUERY_USER_SERVER_TREE } from '@/api/modules/user/user.server.api.js'

export default {
  data () {
    return {
      serverSize: 0,
      loading: false,
      groupTypeOptions: [],
      searching: false,
      queryParam: {
        name: '',
        serverGroupTypeId: ''
      },
      serverTree: {}
    }
  },
  name: 'ServerTree',
  props: [],
  mixins: [],
  mounted () {
    this.getGroupType('')
  },
  methods: {
    getGroupType (name) {
      const requestBody = {
        name: name,
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_TYPE_PAGE(requestBody)
        .then(res => {
          this.groupTypeOptions = res.body.data
        })
    },
    getCheckedNodes (leafOnly) {
      return this.$refs.myServerTree.getCheckedNodes(leafOnly)
    },
    getCheckedKeys (leafOnly) {
      return this.$refs.myServerTree.getCheckedKeys(leafOnly)
    },
    getUuid () {
      return this.serverTree.uuid
    },
    fetchData () {
      this.searching = true
      this.uuid = ''
      const requestBody = {
        ...this.queryParam
      }
      QUERY_USER_SERVER_TREE(requestBody)
        .then(res => {
          this.serverTree = res.body
          this.serverSize = res.body.size || 0
          this.uuid = res.body.uuid
          this.searching = false
        })
    }
  }
}
</script>

<style scope>

  .el-select {
    margin-left: 5px;
  }

  .el-button {
    margin-left: 5px;
  }

  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
