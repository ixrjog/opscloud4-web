<!--suppress HtmlUnknownTag -->
<template>
  <el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span><i class="fas fa-list" aria-hidden="true"/></span>
      <el-tag size="mini" style="float: right" disable-transitions>Size: {{ serverSize }}</el-tag>
    </div>
    <el-row>
      <el-input v-model="queryParam.name" size="mini" placeholder="Name" style="display: inline-block; width: 180px;"
                @change="fetchData"/>
      <el-select v-model.trim="queryParam.serverGroupTypeId" size="mini" filterable clearable style="margin-left: 5px"
                 remote reserve-keyword placeholder="Namespace" :remote-method="getGroupType" :loading="loading">
        <el-option v-for="item in groupTypeOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-button @click="fetchData" size="mini" :loading="searching">Query</el-button>
    </el-row>
    <el-tree style="margin-top: 5px" :data="serverTree.tree" show-checkbox ref="myServerTree" node-key="id">
       <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
             <business-tags v-if="data.server !== null && data.server.tags !== null" :tags="data.server.tags"/>
        </span>
      </span>
    </el-tree>
  </el-card>
</template>

<script>
// API
import { QUERY_SERVER_GROUP_TYPE_PAGE } from '@/api/modules/server/server.group.type.api.js'
import { QUERY_USER_SERVER_TREE } from '@/api/modules/user/user.server.api.js'
import BusinessTags from '../common/tag/BusinessTags'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'

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
  components: {
    BusinessTags,
    SelectItem
  },
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
    /**
     * 获取选中节点
     * @param leafOnly true 只返回子节点（服务器） / false 返回所有节点
     * @returns {*}
     */
    getCheckedNodes (leafOnly) {
      return this.$refs.myServerTree.getCheckedNodes(leafOnly)
    },
    getUuid () {
      return this.serverTree.uuid
    },
    async fetchData () {
      this.searching = true
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

<style scoped>

/*.el-select {*/
/*  margin-left: 5px;*/
/*}*/

.el-button {
  margin-left: 5px;
}

.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  //-webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

</style>
