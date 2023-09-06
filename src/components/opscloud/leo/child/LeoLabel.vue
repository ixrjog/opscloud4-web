<!--suppress HtmlUnknownTag -->
<template>
  <div calss="label">
    <slot>{{ value === undefined ? '-' : value }}</slot>
    <span class="name">{{ name }}</span>
  </div>
</template>

<script>

export default {
  name: 'LeoLabel',
  props: ['name', 'value']
}
</script>

<style scoped>

.name {
  line-height: 1;
  color: #99a9bf;
  display: inline-block;
  float: right;
  right: 2px;
}

</style>
