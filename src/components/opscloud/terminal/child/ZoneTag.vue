<!--suppress HtmlUnknownTag -->
<template>
  <el-tag size="mini" :class="zone | toZoneClass">{{ zone }}</el-tag>
</template>

<script>

// Filters
import { toZoneClass } from '@/filters/kubernetes.pod'

export default {
  name: 'ZoneTag',
  props: ['zone'],
  filters: {
    toZoneClass
  }
}
</script>

<style scoped>

.zone-a {
  color: white;
  background: #000000;
  background: -webkit-linear-gradient(to right, #0f9b0f, #0ad97c);
  background: linear-gradient(to right, #0f9b0f, #0ad97c);
}

.zone-b {
  color: white;
  background: #000046;
  background: -webkit-linear-gradient(to right, #1CB5E0, #62cee7);
  background: linear-gradient(to right, #1CB5E0, #62cee7);
}

.zone-c {
  color: white;
  background: #EB5757;
  background: -webkit-linear-gradient(to right, #EB5757, #f69fa3);
  background: linear-gradient(to right, #EB5757, #f69fa3);
}

.zone-unknown {
  color: white;
  background: #000000;
  background: -webkit-linear-gradient(to right, #3d3d3d, #a9a7a4);
  background: linear-gradient(to right, #3d3d3d, #a9a7a4);
}

</style>
