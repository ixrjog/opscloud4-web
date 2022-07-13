<template>
    <el-tag size="mini" style="float: right;margin-right: 5px" class="position"
            :type="pod.properties.status === 'true' && pod.properties.phase === 'Running' ? 'success': 'warning'">{{ pod.properties.phase }}
      <el-popover placement="right" trigger="hover">
        <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
        <entry-detail name="Initialized" :value="pod.properties.initialized"></entry-detail>
        <br/>
        <entry-detail name="Ready" :value="pod.properties.ready"></entry-detail>
        <br/>
        <entry-detail name="ContainersReady" :value="pod.properties.containersReady"></entry-detail>
        <br/>
        <entry-detail name="PodScheduled" :value="pod.properties.podScheduled"></entry-detail>
      </el-popover>
    </el-tag>
</template>

<script>
import EntryDetail from '@/components/opscloud/common/EntryDetail'

export default {
  name: 'PodPhaseTag',
  props: ['pod'],
  components: {
    EntryDetail
  }
}
</script>

<style scoped>

</style>
