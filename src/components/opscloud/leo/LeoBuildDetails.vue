<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover" body-style="padding: 2px" class="card">
      <div slot="header">
        <el-tag size="mini">{{ build.jobName }}</el-tag>
        <build-number-icon :build="build"/>
        <span style="margin-right: 5px"/>
        <i class="far fa-clock"/>{{ i18nAgo(build.ago) }}
        <span style="margin-right: 8px"/>
        <i class="fab fa-teamspeak"/>{{ build.buildDetails.build.dict.displayName }}
        <span style="margin-right: 5px"/>
        <business-tags :tags="build.tags"/>
        <el-tooltip class="item" effect="light" :content="$t('leo.build.stopBuilding')" placement="top-start"
                    v-if="!build.isFinish">
          <el-button class="btn" type="text" @click="stopBuild(build.id)" :loading="buttons.stopping">
            <i class="far fa-stop-circle"/>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="$t('leo.build.consoleLog')" placement="top-start">
          <el-button class="btn" type="text" style="margin-right: 10px" @click="consoleStream(build.id)"
                     :disabled="build.startTime === null || build.isDeletedBuildJob">
            <i class="fas fa-print"/>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="$t('leo.build.editBuildDetails')" placement="top-start">
          <el-button class="btn" type="text" style="margin-right: 10px" @click="handleEdit(build)"
                     :disabled="!build.isFinish">
            <i class="fas fa-edit"/>
          </el-button>
        </el-tooltip>
      </div>
      <el-row>
        <el-col :span="15">
          <pipeline-graph :onNodeClick='( nodeName,id ) => { nodeClick(nodeName, id, build) }'
                          :stages='build.pipeline.nodes'
                          :layout='layout'/>
        </el-col>
        <el-col :span="9">
          <el-row style="margin-left: 10px">
            <leo-label :name="$t('leo.build.details.startTime')">
               <span v-show="build.startTime !== null && build.startTime !== ''">
                 {{ build.startTime }} - {{ build.endTime ? build.endTime : '?' }}
                 <span v-show="build.runtime !== null" style="margin-left: 2px">
                   <span style="color: #3b97d7">{{ build.runtime }}</span>
                 </span>
              </span>
            </leo-label>
            <leo-label :name="$t('leo.build.details.buildResult')">
              <build-result :build="build"/>
            </leo-label>
            <leo-label :name="$t('leo.build.details.versionName')" :value="build.versionName"/>
            <leo-label :name="$t('leo.build.details.sshUrl')" :value="build.buildDetails.build.gitLab.project.sshUrl"/>
            <leo-label :name="$t('leo.build.details.branch')" :value="build.buildDetails.build.dict.branch"/>
            <leo-label :name="$t('leo.build.details.commit')">
              {{ build.buildDetails.build.dict.commit }}
              <span v-if="build.buildDetails.build !== null &&
                    build.buildDetails.build.gitLab !== null &&
                    build.buildDetails.build.gitLab.project !== null &&
                    build.buildDetails.build.gitLab.project.commit !== null &&
                    build.buildDetails.build.gitLab.project.commit.webUrl !== null">
                <a target="blank" :href="build.buildDetails.build.gitLab.project.commit.webUrl" style="color: #179bb9">
                  <i class="fab fa-git-alt" style="margin-right: 1px"/>
                </a>
              </span>
            </leo-label>
            <leo-label :name="$t('leo.build.details.env')" :value="build.buildDetails.build.dict.env"/>
            <leo-label :name="$t('leo.build.details.jenkins')">
              {{ build.buildDetails.build.jenkins && build.buildDetails.build.jenkins.instance && build.buildDetails.build.jenkins.instance.name || '' }}
            </leo-label>
            <!--kubernetes-image-->
            <template v-if="build.buildDetails.build.type=== 'kubernetes-image'">
              <leo-label :name="$t('leo.build.details.image')">
                {{ build.buildDetails.build.dict.image }}
                <span style="margin-left: 2px" :class="build.isImageExists ? 'image-verified-verified' : 'image-verified-not-verified'">
                  {{ build.isImageExists ? $t('leo.build.details.verified') : $t('leo.build.details.notVerified') }}
                </span>
              </leo-label>
              <leo-label :name="$t('leo.build.details.imageTag')" :value="build.buildDetails.build.dict.imageTag"/>
            </template>
            <!--maven-publish-->
            <template v-if="build.buildDetails.build.type=== 'maven-publish'">
              <leo-label name="构件仓库">
                {{ build.buildDetails.build.nexus.instance.name }}/{{ build.buildDetails.build.nexus.repository }}
              </leo-label>
              <leo-label name="完整名称">
                {{ build.buildDetails.build.nexus.component.group }}:{{
                  build.buildDetails.build.nexus.component.name
                }}:{{ build.versionName }}
              </leo-label>
            </template>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <terminal-with-console-stream :buildId="build.id" ref="terminalWithConsoleStream"/>
          <pipeline-step :ref="`pipelineStep${build.id}`"/>
        </el-col>
      </el-row>
    </el-card>
    <leo-build-details-editor :form-status="formStatus.build" ref="buildDetailsEditor"/>
  </div>
</template>

<script>

import BuildNumberIcon from '@/components/opscloud/leo/child/BuildNumberIcon'
import BuildResult from '@/components/opscloud/leo/child/BuildResult'
import PipelineGraph from 'jenkins-pipeline-graph-vue'
import { GET_PIPELINE_RUN_NODE_STEPS } from '@/api/modules/leo/leo.pipeline.api'
import { STOP_BUILD } from '@/api/modules/leo/leo.build.api'
import PipelineStep from '@/components/opscloud/leo/child/PipelineStep'
import tools from '@/libs/tools.js'
import TerminalWithConsoleStream from '@/components/opscloud/leo/child/TerminalWithConsoleStream'
import LeoBuildDetailsEditor from '@/components/opscloud/leo/LeoBuildDetailsEditor'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import LeoLabel from '@/components/opscloud/leo/child/LeoLabel.vue'

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
    LeoLabel,
    PipelineGraph,
    PipelineStep,
    TerminalWithConsoleStream,
    BuildNumberIcon,
    BuildResult,
    LeoBuildDetailsEditor,
    BusinessTags
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
    i18nAgo (ago) {
      return this.$i18n.locale === 'zh-chs' ? ago : tools.i18nAgo(ago)
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
  box-sizing: border-box;
}

/*>>>.PWGx-PipelineGraph-container .PWGx-PipelineGraph {*/
/*  height: 200px;*/
/*}*/

>>> .PWGx-PipelineGraph-container {
  height: 160px;
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

.image-verified-verified {
  color: #03a25b;
}

.image-verified-not-verified {
  color: #e56c0d;
}

</style>
