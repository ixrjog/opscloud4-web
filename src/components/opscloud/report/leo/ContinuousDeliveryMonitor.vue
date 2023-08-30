<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-checkbox v-model="queryParam.onlyLookRunningTasks" @click="fetchData">
        Only look at running tasks
      </el-checkbox>
    </el-row>
    <div style="height: 5px"/>
    <el-row>
      <el-card class="box-card" shadow="hover">
        <div>
          <b>Latest {{ queryParam.buildSize }} build task details</b>
        </div>
        <el-table :data="table.build.data" style="width: 100%">
          <el-table-column prop="buildNumber" label="#" width="80"/>
          <el-table-column prop="jobName" label="名称"/>
          <el-table-column prop="username" label="操作用户" width="120"/>
          <el-table-column prop="buildDetails" label="环境类型" width="80">
            <template v-slot="scope">
              <span>{{ scope.row.buildDetails.build.dict.env }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buildDetails" label="项目仓库">
            <template v-slot="scope">
              <span>{{ scope.row.buildDetails.build.gitLab.project.sshUrl }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buildDetails" label="构建分支" width="250">
            <template v-slot="scope">
              <span>{{ scope.row.buildDetails.build.dict.branch }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ago" label="执行时间" width="80">
          </el-table-column>
          <el-table-column prop="buildResult" label="构建结果" width="120">
            <template v-slot="scope">
              <build-result :build="scope.row"/>
            </template>
          </el-table-column>
          <el-table-column prop="ocInstance" label="执行实例" width="100"/>
          <el-table-column prop="isLive" label="心跳" width="80">
            <template v-slot="scope">
              <i class="fas fa-heartbeat" v-if="scope.row.isLive" style="color: #c9171f"/>
              <i class="fas fa-heart-broken" v-if="!scope.row.isLive" style="color: #99a9bf"/>
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="250">
            <template v-slot="scope">
              <business-tags :tags="scope.row.tags"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="scope">
              <el-button type="primary" plain size="mini" @click="closeBuild(scope.row)">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <div style="height: 10px"/>
    <el-row>
      <el-card class="box-card" shadow="hover">
        <div><b>Latest {{ queryParam.deploySize }} deploy task details</b></div>
        <el-table :data="table.deploy.data" style="width: 100%">
          <el-table-column prop="deployNumber" label="#" width="80"/>
          <el-table-column prop="jobName" label="名称"/>
          <el-table-column prop="username" label="操作用户" width="120"/>
          <el-table-column prop="deployDetails" label="环境类型" width="80">
            <template v-slot="scope">
              <span>{{ scope.row.deployDetails.deploy.dict.env }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deployDetails" label="部署类型" width="120">
            <template v-slot="scope">
              <span>{{ scope.row.deployDetails.deploy.deployType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deployDetails" label="环境分组">
            <template v-slot="scope">
              <deployment-name
                :deployment="scope.row.deployDetails.deploy.kubernetes.deployment !== null ? scope.row.deployDetails.deploy.kubernetes.deployment.name : 'n/a'"
                :namespace="scope.row.deployDetails.deploy.kubernetes.deployment !== null ? scope.row.deployDetails.deploy.kubernetes.deployment.namespace : 'n/a'"
                :cluster="scope.row.deployDetails.deploy.kubernetes.instance.name !== null ? scope.row.deployDetails.deploy.kubernetes.instance.name : 'n/a'"/>
            </template>
          </el-table-column>
          <el-table-column prop="versionName" label="部署版本"/>
          <el-table-column prop="ago" label="执行时间" width="80"/>
          <el-table-column prop="deployResult" label="部署结果" width="120">
            <template v-slot="scope">
              <deploy-result :deploy="scope.row"/>
            </template>
          </el-table-column>
          <el-table-column prop="ocInstance" label="执行实例" width="100"/>
          <el-table-column prop="isLive" label="心跳" width="80">
            <template v-slot="scope">
              <i class="fas fa-heartbeat" v-if="scope.row.isLive" style="color: #c9171f"/>
              <i class="fas fa-heart-broken" v-if="!scope.row.isLive" style="color: #99a9bf"/>
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="250">
            <template v-slot="scope">
              <business-tags :tags="scope.row.tags"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="scope">
              <el-button type="primary" plain size="mini" @click="closeDeploy(scope.row)">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script>

import { GET_LATEST_LEO_BUILD, GET_LATEST_LEO_DEPLOY } from '@/api/modules/report/report.api'
import BuildResult from '@/components/opscloud/leo/child/BuildResult.vue'
import DeployResult from '@/components/opscloud/leo/child/DeployResult.vue'
import DeploymentName from '@/components/opscloud/leo/child/DeploymentName.vue'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import { CLOSE_BUILD } from '@/api/modules/leo/leo.build.api'
import { CLOSE_DEPLOY } from '@/api/modules/leo/leo.deploy.api'

export default {
  name: 'ContinuousDeliveryMonitor',
  data () {
    return {
      timers: {
        fetchDataTimer: null
      },
      queryParam: {
        onlyLookRunningTasks: true,
        buildSize: 8,
        deploySize: 12
      },
      table: {
        build: {
          data: []
        },
        deploy: {
          data: []
        }
      }
    }
  },
  components: {
    BuildResult,
    DeployResult,
    DeploymentName,
    BusinessTags
  },
  computed: {},
  destroyed () {
    this.exit()
  },
  mounted () {
  },
  methods: {
    exit () {
      // 销毁定时器
      clearInterval(this.timers.fetchDataTimer)
    },
    setTimers () {
      if (this.timers.fetchDataTimer === null) {
        this.timers.fetchDataTimer = setInterval(this.fetchData, 10000)
      }
    },
    closeBuild (row) {
      this.$confirm('此操作将关闭当前任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CLOSE_BUILD({ buildId: row.id }).then(res => {
          this.$message.success('关闭成功!')
          this.getLatestBuild()
        })
      }).catch(() => {
        this.$message.info('已取消!')
      })
    },
    closeDeploy (row) {
      this.$confirm('此操作将关闭当前任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CLOSE_DEPLOY({ deployId: row.id }).then(res => {
          this.$message.success('关闭成功!')
          this.getLatestDeploy()
        })
      }).catch(() => {
        this.$message.info('已取消!')
      })
    },
    getLatestBuild () {
      GET_LATEST_LEO_BUILD({
        size: this.queryParam.buildSize,
        isFinish: this.queryParam.onlyLookRunningTasks ? false : null
      })
        .then(res => {
          this.table.build.data = res.body
        })
    },
    getLatestDeploy () {
      GET_LATEST_LEO_DEPLOY({
        size: this.queryParam.deploySize,
        isFinish: this.queryParam.onlyLookRunningTasks ? false : null
      })
        .then(res => {
          this.table.deploy.data = res.body
        })
    },
    start () {
      this.fetchData()
      this.setTimers()
    },
    fetchData () {
      this.getLatestBuild()
      this.getLatestDeploy()
    }
  }
}
</script>

<style scoped>

</style>
