<template>
    <div>
        <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
            <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字查询"/>
            <el-button @click="fetchData" class="button">查询</el-button>
        </el-row>
        <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
            <el-table-column prop="name" label="应用名称" width="200"></el-table-column>
            <el-table-column prop="resources" label="无状态">
                <template slot-scope="scope" v-if="scope.row.resources !== null && scope.row.resources.length > 0">
          <span v-for="resource in scope.row.resources" :key="resource.id">
            <el-card shadow="never">
               <div style="margin-top: -10px">
                 <el-tag style="margin-right: 5px">Deployment</el-tag>
                  <span v-if="resource.instance !== null">{{ resource.instance.instanceName}}/</span>{{ resource.name}}
                  <el-button style="float: right; padding: 3px 0" type="text"
                             @click="handleLog(resource)">Log
                      <!--                    <i class="far fa-file-alt"></i>-->
                  </el-button>
                  <el-button style="float: right; padding: 3px 0" type="text"
                             @click="handleTerminal(resource)">Terminal
                      <!--                    <i class="fas fa-terminal"></i>-->
                  </el-button>
               </div>
               <el-divider/>
                <!--Pod-->
               <div v-for="pod in resource.assetContainers" :key="pod.asset.name">
                 <el-tooltip :content="pod.properties.image" placement="bottom" effect="light">
                   <el-tag style="margin-left: 10px;vertical-align:top;">
                     <i class="fab fa-artstation"></i>{{ pod.asset.name }}
                     <span style="margin-left: 5px;color: #67C23A">[{{ pod.properties.phase }}]</span>
                     <span style="margin-left: 5px">[ 启动时间: {{pod.properties.startTime}} / 重启次数: {{pod.properties.restartCount }} ]</span>
                   </el-tag>
                 </el-tooltip>
                   <!--容器-->
                 <span style="margin-left: 5px;display: inline-block" v-for="container in pod.children"
                       :key="container.asset.name">
                           <el-tag><i style="margin-right: 2px" class="fab fa-docker"></i>{{ container.asset.name}}<el-checkbox
                                   style="margin-left: 5px" v-model="container.checked"></el-checkbox></el-tag>
                 </span>
               </div>
            </el-card>
          </span>
                </template>
            </el-table-column>
            <!--      <el-table-column prop="env" label="环境" width="80">-->
            <!--        <template slot-scope="scope">-->
            <!--          <env-tag :env="scope.row.env"></env-tag>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
        </el-table>
    </div>
</template>

<script>

import { QUERY_APPLICATION_KUBERNETES_PAGE } from '@/api/modules/application/application.api.js'

export default {
  name: 'ApplicationKubernetesSelector',
  data () {
    return {
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      queryParam: {
        queryName: '',
        extend: true
      }
      // businessType: BusinessType.SERVER
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {},
  filters: {},
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    handleRemote (remoteServer) {
      this.$emit('handleRemote', remoteServer)
    },
    handleByType (resource, type) {
      let pods = []
      for (let item of resource.assetContainers) {
        const containers = item.children.filter(e => e.checked)
        if (containers.length > 0) {
          const pod = {
            name: item.asset.name,
            namespace: item.asset.assetKey2,
            podIp: item.asset.assetKey, // nodeIP     hostIp: item.properties.hostIp
            containers: containers.map(e => {
              return {
                name: e.asset.name,
                instanceId: e.asset.assetKey + '#' + e.asset.name
              }
            })
          }
          pods.push(pod)
        }
      }
      const loginParam = {
        state: 'LOGIN',
        sessionType: type,
        data: {
          applicationId: resource.applicationId,
          businessId: resource.businessId,
          businessType: resource.businessType,
          resourceType: resource.resourceType,
          lines: 100,
          pods: pods,
        }
      }
      this.$emit('handleOpen', loginParam)
    },
    handleLog (resource) {
      this.handleByType(resource, 'CONTAINER_LOG')
    },
    handleTerminal (resource) {
      this.handleByType(resource, 'CONTAINER_TERMINAL')
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_APPLICATION_KUBERNETES_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped>

    .el-divider--horizontal {
        display: block;
        height: 1px;
        width: 100%;
        margin: 1px 0;
        margin-bottom: 8px;
    }

    .el-input {
        display: inline-block;
        max-width: 200px;
    }

    .el-select {
        margin-left: 5px;
    }

    .el-button {
        margin-left: 5px;
    }

</style>
