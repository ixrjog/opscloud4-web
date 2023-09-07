<!--suppress HtmlUnknownTag -->
<template>
  <div>
      <span class="name">
        {{ name }}
      </span>
      <span class="value">
        <slot>{{ value === undefined ? '-' : value }}</slot>
      </span>
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
  color: #99a9bf;
  display: inline-block;
  width: 120px;
  font-size: 10px;
}

.value {
  display: inline-block;
  float: right;
  font-size: 10px;
}

</style>
