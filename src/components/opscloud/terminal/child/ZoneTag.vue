<!--suppress HtmlUnknownTag -->
<template>
  <el-tooltip class="item" effect="dark" :content="zone" placement="top">
    <span :class="zone | toZoneClass"><i class="fab fa-battle-net"/> {{ zone | toZoneShort }}</span>
  </el-tooltip>
</template>

<script>

// Filters
import { toZoneClass, toZoneShort } from '@/filters/kubernetes.pod'

export default {
  name: 'ZoneTag',
  props: ['zone'],
  filters: {
    toZoneClass,
    toZoneShort
  }
}
</script>

<style scoped>

.zone-a {
  color: rgb(9, 9, 9);
  background: #000000;
  background: -webkit-linear-gradient(to right, #a9f3a9, #ffffff);
  background: linear-gradient(to right, #a9f3a9, #ffffff);
  border-radius: 4px;
  padding: 0 5px 0 5px;
}

.zone-b {
  color: rgb(9, 9, 9);
  background: #000000;
  background: -webkit-linear-gradient(to right, #a0e5fa, #ffffff);
  background: linear-gradient(to right, #a0e5fa, #ffffff);
  border-radius: 4px;
  padding: 0 5px 0 5px;
}

.zone-c {
  color: rgb(9, 9, 9);
  background: #000000;
  background: -webkit-linear-gradient(to right, #7aa1f5, #ffffff);
  background: linear-gradient(to right, #7aa1f5, #ffffff);
  border-radius: 4px;
  padding: 0 5px 0 5px;
}

.zone-unknown {
  color: white;
  background: #000000;
  background: -webkit-linear-gradient(to right, #3d3d3d, #a9a7a4);
  background: linear-gradient(to right, #3d3d3d, #a9a7a4);
  border-radius: 4px;
  padding: 0 5px 0 5px;
}

</style>
