<template>
  <div>
    <el-card shadow="hover">
      <div style="height: 100px">
        <node-stage :stages="nodeView.stages" :layout="layout" style="font-size: 12px"
                    :selectedStage="selectedNode"/>
      </div>
      <!--    :onNodeClick='nodeClick'-->
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
      stagesX: [{
        'name': '流程1',
        'children': [],
        'state': 'SUCCESS',
        'completePercent': 50,
        'id': 1587,
        'type': 'STAGE',
        'popInfo': {
          title: '< 通知 >',
          msg: ['重要内容', '经党委会研究决定，现任命王铁柱为中共河北省省委书记'],
          width: '101',
          height: '120',
        }
      }, {
        'name': '流程2',
        'children': [{
          'name': '子流程2-1',
          'children': [],
          'state': 'SUCCESS',
          'completePercent': 50,
          'id': 1589,
          'type': 'PARALLEL',
        }, {
          'name': '子流程2-2',
          'children': [],
          'state': 'SUCCESS',
          'completePercent': 50,
          'id': 1590,
          'type': 'PARALLEL',
          // 'popInfo': {
          //     title: '< 通知 >',
          //     msg: [ '已解决：1个', '未解决：4个' ],
          //     width: "101",
          //     height: "120",
          // }
        }],
        'state': 'SUCCESS',
        'completePercent': 50,
        'id': 1588,
        'type': 'STAGE'
      }, {
        'name': '流程3',
        'children': [],
        'state': 'PAUSED',
        'completePercent': 50,
        'id': 1595,
        'type': 'STAGE'
      }, {
        'name': '流程4',
        'children': [],
        'state': 'not_built',
        'completePercent': 50,
        'id': 1596,
        'type': 'STAGE'
      }, {
        'name': '流程5',
        'children': [{
          'name': '子流程5-1',
          'children': [],
          'state': 'not_built',
          'completePercent': 50,
          'id': 1598,
          'type': 'PARALLEL',
          'popInfo': {
            title: '< 公告 >',
            msg: ['已解决：12个', '经党委会研究决定，现任命王铁柱为中共河北省省委书记'],
            width: '101',
            height: '120',
          }
        }, {
          'name': '子流程5-2',
          'children': [],
          'state': 'not_built',
          'completePercent': 50,
          'id': 1599,
          'type': 'PARALLEL'
        }],
        'state': 'not_built',
        'completePercent': 50,
        'id': 1597,
        'type': 'STAGE'
      }, {
        'name': '流程6',
        'children': [],
        'state': 'not_built',
        'completePercent': 50,
        'id': 1600,
        'type': 'STAGE'
      }],
      selectedNode: {
        'displayName': '自测1',
        'displayDescription': null,
        'durationInMillis': 2284,
        'result': 'SUCCESS',
        'startTime': '2020-03-11T17:29:11.972+0800',
        'state': 'FINISHED',
        'type': 'STAGE',
        'firstParent': null,
        'id': 1587,
        'desc': '自测阶段，需要MergeRequest中有"自测完成"标签'
      }
    }
  }
}
</script>

<style scoped>

</style>
