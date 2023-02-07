<template>
  <div>
    <el-card shadow="hover" body-style="padding: 2px" class="card">
      <div slot="header">
        <el-tag>{{ build.jobName }}</el-tag>
        <build-number-icon :build="build"></build-number-icon>
        <span style="margin-left: 5px"><i class="far fa-clock"></i>{{ build.ago }}</span>
        <span style="margin-left: 8px"><i
          class="fab fa-teamspeak"></i>{{ build.buildDetails.build.dict.displayName }}</span>
        <el-tooltip class="item" effect="light" content="停止构建" placement="top-start" v-if="!build.isFinish">
          <el-button class="btn" type="text" @click="stopBuild(build.id)" :loading="buttons.stopping">
            <i class="far fa-stop-circle"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="控制台流日志" placement="top-start">
          <el-button class="btn" type="text" style="margin-right: 10px" @click="consoleStream(build.id)"
                     :disabled="build.startTime === null || build.isDeletedBuildJob">
            <i class="fas fa-print"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="编辑构建详情" placement="top-start">
          <el-button class="btn" type="text" style="margin-right: 10px" @click="handleEdit(build)"
                     :disabled="!build.isFinish">
            <i class="fas fa-edit"></i>
          </el-button>
        </el-tooltip>
      </div>
      <el-row>
        <el-col :span="14">
          <pipeline-graph :onNodeClick='( nodeName,id ) => { nodeClick(nodeName, id, build) }'
                          :stages='build.pipeline.nodes'
                          :layout='layout'/>
        </el-col>
        <el-col :span="10">
          <el-row style="margin-left: 10px">
            <div><span class="label">执行时间</span>
              <span v-show="build.startTime !== null && build.startTime !== ''"> {{
                  build.startTime
                }} - {{ build.endTime ? build.endTime : '?' }}
              <span v-show="build.runtime !== null" style="margin-left: 2px">&lt;<b style="color: #3b97d7">{{build.runtime}}</b>&gt;</span>
              </span>
            </div>
            <div><span class="label">构建状态</span> {{ build.buildStatus }}</div>
            <div><span class="label">构建结果</span>
              <build-result style="margin-left: 5px" :build="build"></build-result>
            </div>
            <div><span class="label">构件版本</span> {{ build.versionName }}</div>
            <div><span class="label">项目仓库</span> {{ build.buildDetails.build.gitLab.project.sshUrl }}</div>
            <div><span class="label">构建分支</span> {{ build.buildDetails.build.dict.branch }}</div>
            <div><span class="label">COMMIT</span> {{ build.buildDetails.build.dict.commit }}</div>
            <div><span class="label">容器镜像</span> {{ build.buildDetails.build.dict.image }}
              <el-tag style="margin-left: 2px" :type="build.isImageExists ? 'success' : 'warning'">
                {{ build.isImageExists ? '已验证' : '未验证' }}
              </el-tag>
            </div>
            <div><span class="label">镜像标签</span> {{ build.buildDetails.build.dict.imageTag }}</div>
            <div><span class="label">环境类型</span> {{ build.buildDetails.build.dict.env }}</div>
            <div><span class="label">执行引擎</span> {{
                build.buildDetails.build.jenkins && build.buildDetails.build.jenkins.instance && build.buildDetails.build.jenkins.instance.name || ''
              }}
            </div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <terminal-with-console-stream :buildId="build.id"
                                        ref="terminalWithConsoleStream"></terminal-with-console-stream>
          <pipeline-step :ref="`pipelineStep${build.id}`"></pipeline-step>
        </el-col>
      </el-row>
    </el-card>
    <leo-build-details-editor :form-status="formStatus.build" ref="buildDetailsEditor"></leo-build-details-editor>
  </div>
</template>

<script>

import BuildNumberIcon from '@/components/opscloud/leo/child/BuildNumberIcon'
import BuildResult from '@/components/opscloud/leo/child/BuildResult'
import PipelineGraph from 'jenkins-pipeline-graph-vue'
import { GET_PIPELINE_RUN_NODE_STEPS } from '@/api/modules/leo/leo.pipeline.api'
import { STOP_BUILD } from '@/api/modules/leo/leo.build.api'
import PipelineStep from '@/components/opscloud/leo/child/PipelineStep'

import TerminalWithConsoleStream from '@/components/opscloud/leo/child/TerminalWithConsoleStream'
import LeoBuildDetailsEditor from '@/components/opscloud/leo/LeoBuildDetailsEditor'

const layout = {
  nodeSpacingH: 90, // 节点间距
  parallelSpacingH: 200, // 平行间距
  nodeRadius: 12, // 节点半径
  terminalRadius: 10, // 终端半径
  curveRadius: 5, // 跳过连接线半径
  connectorStrokeWidth: 8,
  labelOffsetV: 20, // 文字标签向上位移
  smallLabelOffsetV: 10
}

export default {
  name: 'LeoBuildDetails',
  props: ['build'],
  data () {
    return {
      title: '持续集成',
      formStatus: {
        build: {
          visible: false,
          labelWidth: '150px'
        }
      },
      timer: null,
      layout: layout,
      buttons: {
        stopping: false
      }
    }
  },
  components: {
    PipelineGraph,
    PipelineStep,
    TerminalWithConsoleStream,
    BuildNumberIcon,
    BuildResult,
    LeoBuildDetailsEditor
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    nodeClick (nodeName, nodeId, build) {
      if (build.isDeletedBuildJob) {
        this.$message.warning('构建任务失效，无法查看步骤信息!')
        return
      }
      if (nodeName === 'Queue') return
      const requestBody = {
        buildId: build.id,
        nodeId: nodeId
      }
      const _this = this
      GET_PIPELINE_RUN_NODE_STEPS(requestBody)
        .then(res => {
          _this.$refs[`pipelineStep${build.id}`].init(res.body)
        })
    },
    consoleStream (buildId) {
      this.$refs.terminalWithConsoleStream.init()
    },
    stopBuild (id) {
      this.buttons.stopping = true
      STOP_BUILD({ buildId: id })
        .then(res => {
          this.$message.info('后台执行中请稍等!')
          this.buttons.stopping = false
        })
    },
    handleEdit (build) {
      this.formStatus.build.visible = true
      this.$refs.buildDetailsEditor.initData(Object.assign({}, build))
    }
  }
}

</script>

<style scoped>

>>> .el-card__header {
  height: 40px;
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.icon {
  color: #5b5d66;
  margin-left: 10px;
}

.btn {
  float: right;
  padding: 3px 0;
  margin-left: 10px;
}

.card {
  margin-bottom: 10px
}

.label {
  color: #99a9bf;
}

</style>
