<template>
  <div>
    <span class="name">{{ name }}</span>
    <span class="value">
      {{ value }}
      <span v-if="unit !== null || unit !== undefined"> {{ unit }}</span>
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
  fontSize: 12px;
  marginLeft: 15px;
}

.value {
  float: right;
  fontSize: 12px;
}


</style>
