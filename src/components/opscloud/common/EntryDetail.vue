<template>
  <div>
    <span class="name">{{ name }}</span>
    <span class="value">
      <span v-if="!copy">{{ value }}</span>
      <copy-span :content="value" v-else :show-icon="false"></copy-span>
      <span v-if="unit !== undefined && unit !== null"> {{ unit }}</span>
    </span>
  </div>
</template>

<script>
import CopySpan from '@/components/opscloud/common/CopySpan'

export default {
  name: 'EntryDetail',
  props: {
    name: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: String,
      required: true,
      default: ''
    },
    unit: {
      type: String,
      required: false,
      default: ''
    },
    copy: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    CopySpan
  },
  methods: {
  }
}
</script>

<style scoped>

.name {
  float: left;
  color: #8492a6;
  font-size: 12px;
}

.value {
  float: right;
  font-size: 12px;
}
</style>
