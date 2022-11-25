<template>
  <div>
    <el-card shadow="hover" body-style="padding: 2px" class="card">
      <div slot="header">
        <el-tag>{{ build.jobName }}</el-tag>
        <build-number-icon :build="build"></build-number-icon>
        <span style="margin-left: 5px"><i class="far fa-clock"></i>{{ build.ago }}</span>
        <span style="margin-left: 8px"><i class="fab fa-teamspeak"></i>{{
            build.buildDetails.build.dict.displayName
          }}</span>


        <!--                <build-number-icon :pipeline="pipeline"></build-number-icon>-->
        <!--                <ago-icon :ago="pipeline.ago"></ago-icon>-->
        <!--                <user-icon :user="pipeline.user"></user-icon>-->
        <!--                <el-tooltip class="item" effect="light" content="展开日志" placement="top-start">-->
        <!--                  <el-button class="btn" type="text" @click="handlerPipelineOutput(pipeline.id)">-->
        <!--                   <d2-icon name="television"/>-->
        <!--                  </el-button>-->
        <!--                </el-tooltip>-->
        <!--                <el-tooltip class="item" effect="light" content="登录节点(管理员专用)" placement="top-start"-->
        <!--                            v-if="pipeline.executors != null">-->
        <!--                  <el-button class="btn" type="text" @click="handlerOpenExecutor(pipeline)"-->
        <!--                             :disabled="pipeline.executors.length === 0">-->
        <!--                    <d2-icon name="terminal"/>-->
        <!--                  </el-button>-->
        <!--                </el-tooltip>-->
      </div>
      <div :style='{ height: "200px" }'>
        <el-col :span="8">
          <div><span class="label">开始时间</span> {{ build.startTime }}</div>
          <div><span class="label" v-show="build.endTime !== null && build.endTime !== ''">结束时间</span>
            {{ build.endTime }}
          </div>
          <div><span class="label">构建状态</span> {{ build.buildStatus }}</div>
          <div><span class="label">构建结果</span>
            <build-result style="margin-left: 5px" :build="build"></build-result>
          </div>
          <div><span class="label">构件版本</span> {{ build.versionName }}</div>
          <div><span class="label">项目仓库</span> {{ build.buildDetails.build.gitLab.project.sshUrl }}</div>
          <div><span class="label">构建分支</span> {{ build.buildDetails.build.dict.branch }}</div>
          <div><span class="label">COMMIT</span> {{ build.buildDetails.build.dict.commit }}</div>
          <div><span class="label">容器镜像</span> {{ build.buildDetails.build.dict.image }}</div>
          <div><span class="label">镜像标签</span> {{ build.buildDetails.build.dict.imageTag }}</div>
          <div><span class="label">环境类型</span> {{ build.buildDetails.build.dict.env }}</div>
          <div><span class="label">执行引擎</span> {{ build.buildDetails.build.jenkins.instance.name }}</div>
        </el-col>
        <el-col :span="16"></el-col>

        <!--        <pipeline-graph :onNodeClick='(nodeName,id)=> {nodeClick(nodeName,id,pipeline)}'-->
        <!--          :stages='pipeline.nodes'-->
        <!--          :layout='layout'-->
        <!--        />-->
      </div>
      <!--      <pipeline-output :buildType="buildType" :buildId="pipeline.id" :ref="`pipelines${pipeline.id}`"></pipeline-output>-->
      <!--      <pipeline-step :ref="`pipelineStep${pipeline.id}`"></pipeline-step>-->
    </el-card>
  </div>
</template>

<script>

import BuildNumberIcon from '@/components/opscloud/leo/child/BuildNumberIcon'
import BuildResult from '@/components/opscloud/leo/child/BuildResult'

const layout = {
  nodeSpacingH: 90, // 节点间距
  parallelSpacingH: 400, // 平行间距
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
      timer: null,
      layout: layout
    }
  },
  components: {
    BuildNumberIcon,
    BuildResult
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {}
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

</style>
