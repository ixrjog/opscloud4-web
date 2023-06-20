<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover">
      <div>
        <node-stage :stages="nodeView.stages" :layout="layout" style="font-size: 12px"
                    :selectedStage="selectedNode"/>
      </div>
    </el-card>
  </div>
</template>

<script>

import NodeStage from 'jenkins-pipeline-graph-vue'

export default {
  name: 'NodeView',
  props: ['nodeView'],
  components: {
    NodeStage
  },
  data () {
    return {
      layout: {
        nodeSpacingH: 150, // 节点间距
        parallelSpacingH: 300, // 平行间距
        nodeRadius: 12, // 节点半径
        terminalRadius: 10, // 终端半径
        curveRadius: 5, // 跳过连接线半径
        connectorStrokeWidth: 8,
        labelOffsetV: 20, // 文字标签向上位移
        smallLabelOffsetV: 10
      },
      selectedNode: {
        displayName: '自测1',
        displayDescription: null,
        durationInMillis: 2284,
        result: 'SUCCESS',
        startTime: '2020-03-11T17:29:11.972+0800',
        state: 'FINISHED',
        type: 'STAGE',
        firstParent: null,
        id: 1587,
        desc: '自测阶段，需要MergeRequest中有"自测完成"标签'
      }
    }
  }
}
</script>

<style scoped>

</style>
