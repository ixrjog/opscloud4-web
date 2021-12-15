<template>
  <div>
    <span class="name">{{ name }}</span>
    <span class="value">
      {{ value }}
      <span v-if="unit !== undefined && unit !== null"> {{ unit }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'EntryDetail',
  props: ['name', 'value', 'unit']
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
