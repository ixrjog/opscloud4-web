<template>
  <div>
    <span v-for="item in buildInfos" :key="item.buildNumber">
      <el-popover placement="top-start" trigger="hover">
        <span slot="reference">
            <el-tag :style="{ backgroundColor: item.color, color: '#FFFFFF',width: '50px' }">
              <i class="el-icon-loading" v-if="item.running"></i>{{ item.buildNumber }}</el-tag>
        </span>
      </el-popover>
    </span>
  </div>
</template>

<script>

export default {
  name: 'latest-build-info',
  props: ['buildInfos'],
  methods: {}
}

</script>

<style scoped>

.number {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

</style>
